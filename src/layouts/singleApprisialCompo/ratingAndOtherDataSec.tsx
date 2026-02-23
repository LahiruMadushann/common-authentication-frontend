import { useGetAssessedQuery, useUpdateAssessedMutation } from '@/src/app/services/assessed';
import { DatePicker, Input, Modal, Select, ConfigProvider } from 'antd';
import { Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { BuyerRejection } from './buyerRejection';
import { useUpdateBuyerStatusMutation } from '@/src/app/services/buyerStatus';
import ShopReviewRatings from '@/src/components/common/reviewStars';
import dayjs, { Dayjs } from 'dayjs';
import jaJP from 'antd/locale/ja_JP';
import 'dayjs/locale/ja';
import { validateAndFormatPrice, formatWithCommas, removeCommas } from '@/src/utils/priceValidation';

const STATUS_OPTIONS = [
  { value: 'unconnected', label: '未接続' },
  { value: 'no_connected_assessments', label: '接続済み査定無し' },
  { value: 'assessment_reservation', label: '査定予約' },
  { value: 'assessed', label: '査定済み' },
  { value: 'unexecuted', label: '未成約' },
  { value: 'contracted', label: '成約済み' },
  { value: 'user_complaint', label: 'ユーザークレーム' },
  { value: 'duplication_of_media', label: '媒体重複' },
  { value: 'sale_of_other_companies', label: '他社売却' },
  { value: 'cancelled', label: 'キャンセル済み' },
  { value: 'scheduled', label: 'メール送信予約済み' }
];

type userTypes = {
  name: string;
  phone: {
    content: string;
  };
  email: {
    content: string;
  };
  post_number: string;
  prefecture: string;
  municipalities: string;
};
type RatingAndOtherDataSecProps = {
  user: userTypes;
  appraisalId: string;
  userId: string;
  assessedDate: string;
};

export const RatingAndOtherDataSec: React.FC<RatingAndOtherDataSecProps> = ({
  user,
  appraisalId,
  userId,
  assessedDate
}) => {
  const [value, setValue] = useState<string>('');
  const [supplementary, setSupplementary] = useState<string>('');
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState<boolean>(false);
  const [isFailureModalVisible, setIsFailureModalVisible] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [originalValue, setOriginalValue] = useState<string>('');
  const [reasonForEditPriceBuyer, setReasonForEditPriceBuyer] = useState<string>('');
  const [showReasonError, setShowReasonError] = useState<boolean>(false);
  const [storePurchaseDateTime, setStorePurchaseDateTime] = useState<Dayjs | null>(null);
  const [valueError, setValueError] = useState<string>('');

  const {
    data: assessedData,
    isLoading,
    refetch
  } = useGetAssessedQuery({ appraisalId: Number(appraisalId), userId: Number(userId) });
  const [updateAssessed] = useUpdateAssessedMutation();
  const [updateBuyerStatus] = useUpdateBuyerStatusMutation();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };
  
  useEffect(() => {
    dayjs.locale('ja');
    
    if (assessedData) {
      const valueStr = assessedData.value?.toString() || '';
      const formattedValue = valueStr ? formatWithCommas(valueStr) : '';
      setValue(formattedValue);
      setOriginalValue(formattedValue);
      setSupplementary(assessedData.supplementary || '');
      setReasonForEditPriceBuyer(assessedData.reasonForEditPriceBuyer || '');
      
      if (assessedData.storePurchaseDateTime) {
        setStorePurchaseDateTime(dayjs(assessedData.storePurchaseDateTime));
      }
      
      if (
        assessedData.status &&
        STATUS_OPTIONS.some((option) => option.value === assessedData.status)
      ) {
        setStatus(assessedData.status);
      } else {
        setStatus('');
      }
    }
  }, [assessedData]);

  const showSuccessModal = (message: string) => {
    setModalMessage(message);
    setIsSuccessModalVisible(true);
  };

  const showFailureModal = (message: string) => {
    setModalMessage(message);
    setIsFailureModalVisible(true);
  };

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      const result = await updateBuyerStatus({
        userId: Number(userId),
        appraisalId: Number(appraisalId),
        status: newStatus
      }).unwrap();

      if (result.status === 'success') {
        showSuccessModal('更新が完了しました');
        setStatus(newStatus);
        refetch();
      } else {
        showFailureModal('ステータスの更新に失敗');
      }
    } catch (error) {
      showFailureModal('ステータスの更新に失敗');
    }
  };

  const isEditingValue = () => {
    return originalValue !== '' && value !== originalValue;
  };

  const handleValueUpdate = async () => {
    // Validate the value before updating
    const validation = validateAndFormatPrice(value);
    
    if (!validation.isValid) {
      setValueError(validation.errorMessage);
      showFailureModal(validation.errorMessage);
      return;
    }

    if (isEditingValue() && !reasonForEditPriceBuyer.trim()) {
      setShowReasonError(true);
      showFailureModal('編集理由を入力してください');
      return;
    }

    try {
      const updatePayload: any = {
        appraisalId: Number(appraisalId),
        userId: Number(userId),
        value: validation.numericValue
      };

      if (isEditingValue()) {
        updatePayload.reasonForEditPriceBuyer = reasonForEditPriceBuyer;
      }

      if (storePurchaseDateTime) {
        updatePayload.storePurchaseDateTime = storePurchaseDateTime.format('YYYY-MM-DDTHH:mm:ss');
      }

      const result = await updateAssessed(updatePayload).unwrap();
      
      if (result) {
        showSuccessModal('更新が完了しました');
        setOriginalValue(validation.formattedValue);
        setShowReasonError(false);
        setValueError('');
        refetch();
      } else {
        showFailureModal(' 値の更新に失敗');
      }
    } catch (error) {
      showFailureModal(' 値の更新に失敗');
    }
  };

  const handleSupplementaryUpdate = async () => {
    try {
      const result = await updateAssessed({
        appraisalId: Number(appraisalId),
        userId: Number(userId),
        supplementary
      }).unwrap();
      if (result) {
        showSuccessModal('更新が完了しました');
        refetch();
      } else {
        showFailureModal('補足テキストの更新に失敗');
      }
    } catch (error) {
      showFailureModal('補足テキストの更新に失敗');
    }
  };

  const reviewData = (shops: any) => ({
    starValue: shops?.starValue,
    starSupport: shops?.starSupport,
    starRecommendation: shops?.starRecommendation
  });

  const formatDate = (dateString: any) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  const handleInputChange = (e: any) => {
    const inputValue = e.target.value;
    const validation = validateAndFormatPrice(inputValue);
    
    setValue(validation.formattedValue);
    setValueError(validation.errorMessage);
    setShowReasonError(false);
  };

  const handleDateTimeChange = (date: Dayjs | null) => {
    setStorePurchaseDateTime(date);
  };

  const filteredOptions = STATUS_OPTIONS.filter(option => {
    if (status === 'cancelled') {
      return option.value === 'cancelled';
    } else if (status === 'scheduled') {
      return option.value === 'scheduled';
    } else {
      return option.value !== 'cancelled' && option.value !== 'scheduled';
    }
  });

  if (isLoading) {
    return <div>読み込み中...</div>;
  }

  return (
    <ConfigProvider locale={jaJP}>
    <div className=" mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">{user?.name}</h2>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className=" md:col-span-1">
          <Select
            className="w-full mb-2"
            value={status || undefined}
            onChange={handleStatusUpdate}
            disabled={status === 'cancelled' || status === 'scheduled'}
            placeholder="ステータス選択">
            {filteredOptions.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
          <p className="text-sm mb-4 text-center md:text-left">
            紹介日:{formatDate(assessedDate)}
          </p>
        </div>
        <div className="col-span-2">
          <h3 className="w-full p-2 mb-2 border-b border-gray-300">{user?.phone?.content}</h3>
          <h3 className="w-full p-2 mb-2 border-b border-gray-300">{user?.email?.content}</h3>
          <h3 className="w-full p-2 mb-2 border-b border-gray-300">{user?.post_number}</h3>
          <h3 className="w-full p-2 mb-2 border-b border-gray-300">
            {user.prefecture}  {user.municipalities}
          </h3>
          <h3 className="w-full p-2 mb-2 border-b border-gray-300">{formatDate(assessedDate)}</h3>
        </div>

        <div className=" col-span-1 md:col-span-2 flex items-start justify-end">
          <div className="  w-full md:max-w-2/3   ">
            <div className="flex flex-col justify-between items-end mb-4 p-4 gap-4 border-2 border-gray-300">
              <div className="w-full">
                <Input
                  type="text"
                  placeholder="実際の買取金額"
                  className={`w-full p-2 border-2 rounded bg-yellow-100 focus:bg-yellow-100 hover:bg-yellow-100 ${
                    valueError 
                      ? 'border-red-500 focus:border-red-500 hover:border-red-500' 
                      : 'focus:border-orange-500 hover:border-orange-500'
                  }`}
                  value={value}
                  onChange={handleInputChange}
                />
                {valueError && (
                  <p className="text-red-500 text-sm mt-1">{valueError}</p>
                )}
              </div>
              
              {/* Date-Time Picker */}
              <DatePicker
                format="YYYY/MM/DD HH:mm"
                placeholder="買取日時"
                className="w-full p-2 border-2 rounded bg-yellow-100 focus:border-orange-500 focus:bg-yellow-100 hover:border-orange-500 hover:bg-yellow-100"
                value={storePurchaseDateTime}
                onChange={handleDateTimeChange}
                showToday={false}
                showTime={false}
                renderExtraFooter={() => (
                  <div className="flex items-center gap-2 p-2 border-t">
                    <Select
                      value={storePurchaseDateTime ? storePurchaseDateTime.hour() : 0}
                      onChange={(hour) => {
                        const newDateTime = storePurchaseDateTime 
                          ? storePurchaseDateTime.hour(hour)
                          : dayjs().hour(hour).minute(0);
                        setStorePurchaseDateTime(newDateTime);
                      }}
                      style={{ width: 70 }}
                      options={Array.from({ length: 24 }, (_, i) => ({
                        value: i,
                        label: String(i).padStart(2, '0')
                      }))}
                    />
                    <span>:</span>
                    <Select
                      value={storePurchaseDateTime ? storePurchaseDateTime.minute() : 0}
                      onChange={(minute) => {
                        const newDateTime = storePurchaseDateTime 
                          ? storePurchaseDateTime.minute(minute)
                          : dayjs().hour(0).minute(minute);
                        setStorePurchaseDateTime(newDateTime);
                      }}
                      style={{ width: 70 }}
                      options={Array.from({ length: 60 }, (_, i) => ({
                        value: i * 1,
                        label: String(i * 1).padStart(2, '0')
                      }))}
                    />
                  </div>
                )}
              />
              
              {isEditingValue() && (
                <div className="w-full">
                  <Input.TextArea
                    placeholder="編集理由を入力してください(必須)"
                    className={`w-full p-2 border-2 rounded ${
                      showReasonError && !reasonForEditPriceBuyer.trim() 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-gray-300'
                    }`}
                    value={reasonForEditPriceBuyer}
                    onChange={(e) => {
                      setReasonForEditPriceBuyer(e.target.value);
                      setShowReasonError(false);
                    }}
                    rows={3}
                  />
                  {showReasonError && !reasonForEditPriceBuyer.trim() && (
                    <p className="text-red-500 text-sm mt-1">編集理由は必須です</p>
                  )}
                </div>
              )}
              <button
                className="bg-orange-500 text-white px-4 py-2 rounded max-w-[80px] w-full"
                onClick={handleValueUpdate}>
                保存
              </button>
            </div>
          </div>
        </div>
      </div>
      <BuyerRejection isOpen={isPopupOpen} togglePopup={togglePopup} appraisalId={appraisalId} />

      <div className="mt-4 w-full">
        <h3 className="font-bold mb-2">査定補足テキスト入力</h3>
        <Input.TextArea
          className="w-full border rounded-md p-4 shadow-inner border-gray-300"
          value={supplementary}
          onChange={(e) => setSupplementary(e.target.value)}
          style={{
            boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1), inset 0 -2px 8px rgba(0, 0, 0, 0.06)'
          }}
        />
        <div className="text-right mt-2">
          <button
            className="bg-orange-500 text-white px-4 py-2 rounded w-full md:max-w-[150px]"
            onClick={handleSupplementaryUpdate}>
            保存
          </button>
        </div>
      </div>
      <Modal
        title="成功"
        visible={isSuccessModalVisible}
        onOk={() => setIsSuccessModalVisible(false)}
        onCancel={() => setIsSuccessModalVisible(false)}
        wrapClassName="notranslate"
        okText="確認"
        cancelText="キャンセル">
        <p>{modalMessage}</p>
      </Modal>

      <Modal
        title="エラー"
        visible={isFailureModalVisible}
        onOk={() => setIsFailureModalVisible(false)}
        onCancel={() => setIsFailureModalVisible(false)}
        wrapClassName="notranslate"
        okText="確認"
        cancelText="キャンセル">
        <p>{modalMessage}</p>
      </Modal>
    </div>
    </ConfigProvider>
  );
};