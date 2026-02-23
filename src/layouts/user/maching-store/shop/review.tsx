import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  useGetAssessedByUserQuery,
  useUpdateReviewAssessedMutation
} from '@/src/app/services/assessed';
import { formatPostalCode } from '@/src/utils/formatPostalcode';
import { Loader } from '@/src/components/loader/loader';
import { formatPhoneNumber } from '@/src/utils/formatPhoneNumber';
import { DatePicker, ConfigProvider } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import jaJP from 'antd/locale/ja_JP';
import 'dayjs/locale/ja';
import { validateAndFormatPrice, formatWithCommas, removeCommas } from '@/src/utils/priceValidation';

const ReviewSubmission = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const shopData = (location.state as any)?.shop;
  const [updateAssessed] = useUpdateReviewAssessedMutation();

  const dayNames: { [key: string]: string } = {
    SUNDAY: '日曜日',
    MONDAY: '月曜日',
    TUESDAY: '火曜日',
    WEDNESDAY: '水曜日',
    THURSDAY: '木曜日',
    FRIDAY: '金曜日',
    SATURDAY: '土曜日'
  };

  interface Holiday {
    week: string | number | null;
    day: keyof typeof dayNames | null;
  }

  const [formData, setFormData] = useState({
    assessedValue: 0,
    contactSupport: 0,
    recommendation: 0,
    finalOffer: '',
    soldToStore: true,
    reviewText: ''
  });

  const [originalFinalOffer, setOriginalFinalOffer] = useState<string>('');
  const [reasonForEditPriceSeller, setReasonForEditPriceSeller] = useState<string>('');
  const [showReasonError, setShowReasonError] = useState<boolean>(false);
  const [userPurchaseDateTime, setUserPurchaseDateTime] = useState<Dayjs | null>(null);
  const [finalOfferError, setFinalOfferError] = useState<string>('');

  const {
    data: previousReviewData,
    error,
    isLoading,
    refetch
  } = useGetAssessedByUserQuery({ appraisalId: shopData?.appraisalId, shopId: shopData?.shopId });

  useEffect(() => {
    dayjs.locale('ja');
    
    if (previousReviewData) {
      const finalOfferStr = previousReviewData?.finalOffer?.toString() || '';
      const formattedFinalOffer = finalOfferStr ? formatWithCommas(finalOfferStr) : '';
      setFormData({
        assessedValue: previousReviewData?.starValue || 0,
        contactSupport: previousReviewData?.starSupport || 0,
        recommendation: previousReviewData?.starRecommendation || 0,
        finalOffer: formattedFinalOffer,
        soldToStore: previousReviewData?.soldToBuyer ?? true,
        reviewText: previousReviewData?.review || ''
      });
      setOriginalFinalOffer(formattedFinalOffer);
      setReasonForEditPriceSeller(previousReviewData?.reasonForEditPriceSeller || '');
      
      if (previousReviewData?.userPurchaseDateTime) {
        setUserPurchaseDateTime(dayjs(previousReviewData.userPurchaseDateTime));
      }
    }
  }, [previousReviewData]);

  const handleRatingChange = (
    category: 'assessedValue' | 'contactSupport' | 'recommendation',
    value: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [category]: value
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'finalOffer') {
      const validation = validateAndFormatPrice(value);
      setFormData((prev) => ({
        ...prev,
        finalOffer: validation.formattedValue
      }));
      setFinalOfferError(validation.errorMessage);
      setShowReasonError(false);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      }));
    }
  };

  const handleDateTimeChange = (date: Dayjs | null) => {
    setUserPurchaseDateTime(date);
  };

  const formatShopHolidays = (): string => {
    if (!shopData?.shopHolidays || shopData?.shopHolidays.length === 0) {
      return '--';
    }
    return shopData.shopHolidays
      .map((holiday: Holiday) => {
        const week = holiday?.week ?? '--';
        const dayName = holiday?.day ? dayNames[holiday.day] : '--';

        if (!week || !dayName) {
          return '-';
        }
        return `第${week}${dayName}`;
      })
      .join(', ');
  };

  const isEditingFinalOffer = () => {
    if (!originalFinalOffer || originalFinalOffer === '') {
      return false;
    }
    if (!formData.finalOffer || formData.finalOffer === '') {
      return false;
    }
    
    const originalNumeric = removeCommas(originalFinalOffer);
    const currentNumeric = removeCommas(formData.finalOffer);
    
    const originalValue = parseFloat(originalNumeric);
    const currentValue = parseFloat(currentNumeric);
    
    if (isNaN(originalValue) || isNaN(currentValue)) {
      return false;
    }
    
    return originalValue !== currentValue;
  };

  const submitReview = async () => {
    // Validate final offer before submission
    const validation = validateAndFormatPrice(formData.finalOffer);
    
    if (!validation.isValid) {
      setFinalOfferError(validation.errorMessage);
      alert(validation.errorMessage);
      return;
    }

    if (isEditingFinalOffer() && !reasonForEditPriceSeller.trim()) {
      setShowReasonError(true);
      alert('編集理由を入力してください');
      return;
    }

    try {
      const finalOfferNumeric = formData?.finalOffer ? parseFloat(removeCommas(formData.finalOffer)) : undefined;

      const patchData: any = {
        starValue: formData?.assessedValue || 5,
        starSupport: formData?.contactSupport || 5,
        starRecommendation: formData?.recommendation || 5,
        finalOffer: finalOfferNumeric,
        soldToBuyer: formData?.soldToStore,
        review: formData?.reviewText || ''
      };

      if (isEditingFinalOffer()) {
        patchData.reasonForEditPriceSeller = reasonForEditPriceSeller;
      }

      // Add userPurchaseDateTime if it exists
      if (userPurchaseDateTime) {
        patchData.userPurchaseDateTime = userPurchaseDateTime.format('YYYY-MM-DDTHH:mm:ss');
      }

      await updateAssessed({
        appraisalId: shopData?.appraisalId,
        shopId: shopData?.shopId,
        patch: patchData
      }).unwrap();

      setOriginalFinalOffer(formData.finalOffer);
      setShowReasonError(false);
      setFinalOfferError('');
      refetch();
      navigate('/user');
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const StarRating = ({
    name,
    value,
    onChange
  }: {
    name: 'assessedValue' | 'contactSupport' | 'recommendation';
    value: number;
    onChange: (value: number) => void;
  }) => (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <input
          key={star}
          type="radio"
          name={name}
          className="mask mask-star-2 bg-orange-400 border border-gray-400 shadow-inner"
          checked={value === star}
          onChange={() => onChange(star)}
        />
      ))}
    </div>
  );

  if (isLoading) {
    return <div><Loader  /></div>;
  }

  if (error) {
    return <div>前回のレビューデータの読み込みエラー</div>;
  }

  return (
    
    <div className="bg-white">
      <div>
        <h2 className="text-lg font-bold">{shopData?.name ?? '--'}</h2>
      </div>

      <div>
        <div className="mt-4 w-full flex justify-between space-x-4">
          <div className="avatar w-1/2 rounded">
            <img src={shopData?.shopImageUrl || 'https://ctn-uploads.s3.ap-northeast-1.amazonaws.com/buyerportal-assets/placeholder-ctn-car-image.png'} alt="Shop Image" className="rounded" />
          </div>
          <div className="text-left w-1/2 text-lg">
            <h3 className="font-bold text-lg">店舗データ</h3>
            <div>
              <table>
                <tbody>
                  <tr>
                    <td className="pr-14 py-2 whitespace-nowrap">
                      <div className="my-2">住所</div>
                    </td>
                    <td className="py-2">
                      <div className="my-2">
                        {`${shopData?.postalCode ? `〒${formatPostalCode(shopData.postalCode)} ` : ''}` +
                          `${shopData?.prefectures ? ` ${shopData.prefectures}` : ''}` +
                          `${shopData?.municipalities ? `${shopData.municipalities} ` : ''}` +
                          (shopData?.address ? ` ${shopData.address}` : '')}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 whitespace-nowrap">
                      <div className="my-2">電話番号</div>
                    </td>
                    <td className="py-2">
                      <div className="my-2">{formatPhoneNumber(shopData?.customerPhone ?? '--')}</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 whitespace-nowrap">
                      <div className="my-2">営業時間</div>
                    </td>
                    <td className="py-2 whitespace-nowrap">
                      <div className="my-2">{shopData?.businessHours ?? '--'}</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 whitespace-nowrap">
                      <div className="my-2">定休日</div>
                    </td>
                    <td className="py-2">
                      <div className="my-2">{formatShopHolidays() ?? '--'}</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 whitespace-nowrap">
                      <div className="my-2">運営</div>
                    </td>
                    <td className="py-2">
                      <div className="my-2">{shopData?.companyName ?? '--'}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="rating">
          <table>
            <tbody>
              <tr>
                <td>
                  <div className="my-2">査定価格</div>
                </td>
                <td>
                  <div className="my-2 ml-4">
                    <StarRating
                      name="assessedValue"
                      value={formData.assessedValue}
                      onChange={(value) => handleRatingChange('assessedValue', value)}
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="my-2">連絡・対応</div>
                </td>
                <td>
                  <div className="my-2 ml-4">
                    <StarRating
                      name="contactSupport"
                      value={formData.contactSupport}
                      onChange={(value) => handleRatingChange('contactSupport', value)}
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="my-2">おすすめ度</div>
                </td>
                <td>
                  <div className="my-2 ml-4">
                    <StarRating
                      name="recommendation"
                      value={formData.recommendation}
                      onChange={(value) => handleRatingChange('recommendation', value)}
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 w-full">
          <div className="flex space-x-4">
            <p className="my-2">最終提示額</p>
            <div className="flex-1">
              <input
                type="text"
                name="finalOffer"
                value={formData.finalOffer}
                onChange={handleInputChange}
                className={`input input-bordered input-md w-full max-w-xs shadow-inner ring-2 ${
                  finalOfferError 
                    ? 'border-red-500 ring-red-300' 
                    : 'border-gray-400 ring-gray-300'
                }`}
              />
              {finalOfferError && (
                <p className="text-red-500 text-sm mt-1">{finalOfferError}</p>
              )}
            </div>
            {/* <p className="my-2 ml-8">万円</p> */}
          </div>
        </div>

        <div className="mt-4 w-full">
          <div className="flex items-center space-x-4">
            <p className="my-2">車を買い取ってもらった日時</p>
            <ConfigProvider locale={jaJP}>
            <DatePicker
              format="YYYY/MM/DD"
              placeholder="日付を選択"
              className="input input-bordered input-md border border-gray-400 shadow-inner ring-2 ring-gray-300"
              style={{ width: '200px' }}
              value={userPurchaseDateTime}
              onChange={handleDateTimeChange}
              showToday={false}
            />
            </ConfigProvider>
            <DatePicker
              picker="time"
              format="hh:mm A"
              placeholder="12:00 PM"
              className="input input-bordered input-md border border-gray-400 shadow-inner ring-2 ring-gray-300"
              style={{ width: '140px' }}
              value={userPurchaseDateTime}
              onChange={handleDateTimeChange}
              minuteStep={10}
              use12Hours
              showNow={false}
            />
          </div>
        </div>

        {(isEditingFinalOffer() || reasonForEditPriceSeller) && (
          <div className="mt-4 w-full">
            <textarea
              placeholder="編集理由を入力してください（必須）"
              className={`textarea textarea-bordered w-[90%] h-[10vh] border shadow-inner ring-2 ${
                showReasonError && !reasonForEditPriceSeller.trim()
                  ? 'border-red-500 ring-red-300'
                  : 'border-gray-400 ring-gray-300'
              }`}
              value={reasonForEditPriceSeller}
              onChange={(e) => {
                setReasonForEditPriceSeller(e.target.value);
                setShowReasonError(false);
              }}
            />
            {showReasonError && !reasonForEditPriceSeller.trim() && (
              <p className="text-red-500 text-sm mt-1">編集理由は必須です</p>
            )}
          </div>
        )}

        <div className="mt-4 w-full flex space-x-4">
          <p className="mr-8">この店舗に売却した</p>
          <input
            type="checkbox"
            name="soldToStore"
            checked={formData.soldToStore}
            onChange={handleInputChange}
            className="checkbox checkbox-md border border-gray-400 shadow-inner ring-2 ring-gray-300"
          />
        </div>

        <div className="mt-4">
          <p>レビュー</p>
          <textarea
            name="reviewText"
            value={formData.reviewText}
            onChange={handleInputChange}
            className="textarea textarea-bordered w-[90%] h-[20vh] mt-4 border border-gray-400 shadow-inner ring-2 ring-gray-300"
          />
        </div>
      </div>

      <div className="mt-4">
        <Button onClick={submitReview}>送信する</Button>
      </div>
    </div>
  );
};

export default ReviewSubmission;