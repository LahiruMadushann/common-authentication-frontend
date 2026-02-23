import { Button } from '@/components/ui/button';
import { useLazyGetShopDetailsQuery } from '@/src/app/services/shops';
import { ShopDataType } from '@/src/types/shop.type';
import { handleErrors } from '@/src/utils/handleErrors';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ShopLayoutSkeleton from './skeleton';
import moment from 'moment';
import { useTypedSelector } from '@/src/app/store';
import { useGetBuyerQuery } from '@/src/app/services/message';
import { skipToken } from '@reduxjs/toolkit/query';
import { formatPostalCode } from '@/src/utils/formatPostalcode'
import { formatPhoneNumber } from '@/src/utils/formatPhoneNumber';

interface RouteParams {
  shopId: string;
  [key: string]: string | undefined;
}

const ShopLayout: React.FC = () => {
  const [getShopDetails, { isError: isGetError, error: getError }] = useLazyGetShopDetailsQuery();
  const [data, setData] = useState<ShopDataType | any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [shopUserId, setShopUserId] = useState<Number>(0);
  const navigate = useNavigate();
  const { shopId } = useParams<RouteParams>();
  const shopIdNumber = Number(shopId);
  const userId = useTypedSelector(state => state.auth.userId);

  const [buyerId, setBuyerId] = useState<number | null>(null);

  const { data: shopid } = useGetBuyerQuery(buyerId ?? skipToken, {
    skip: buyerId === null,
  });

  const handleMessageButtonClick = useCallback(() => {
    setBuyerId(shopIdNumber);
  }, []);

  useEffect(() => {
    if (shopid !== undefined && !isLoading) {
      navigate(`/message/${userId}/${shopid}`);
    }
  }, [shopid, isLoading, navigate, userId]);

  useEffect(() => {
    if (!shopIdNumber) return;
    setIsLoading(true);
    getShopDetails(shopIdNumber)
      .unwrap()
      .then((shopData) => setData(shopData))
      .catch(handleErrors)
      .finally(() => setIsLoading(false));
  }, [shopIdNumber, getShopDetails]);

  useEffect(() => {
    if (!data) return;
    setShopUserId(data.shopuserid);
  }, [data]);

  const onClickReview = (id: number, store: string, area: string, district: string) => {
    navigate(`/user/review/${id}`, {
      state: { previousPage: `/user/${id}`, store, area, district }
    });
  };

  const formatToJapaneseDate = (dateString: string) => {
    if (!dateString) {
      return "--";
    }
    const date = moment(dateString, 'YYYY-MM-DD').toDate();
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  interface Holiday {
    week: string | number | null;
    day: keyof typeof dayNames | null;
  }

  interface Data {
    shopHolidays: Holiday[] | null;
  }

  const dayNames: { [key: string]: string } = {
    SUNDAY: "日曜日",
    MONDAY: "月曜日",
    TUESDAY: "火曜日",
    WEDNESDAY: "水曜日",
    THURSDAY: "木曜日",
    FRIDAY: "金曜日",
    SATURDAY: "土曜日"
  };

  const formatShopHolidays = (): string => {
    if (!data?.shopHolidays || data?.shopHolidays.length === 0) {
      return "--";
    }
    return data.shopHolidays
      .map((holiday: Holiday) => {
        const week = holiday?.week ?? "--";
        const dayName = holiday?.day ? dayNames[holiday.day] : "--";

        if (!week || !dayName) {
          return "-";
        }
        return `第${week}${dayName}`;
      })
      .join(", ");
  };

  const formatShopVacations = () => {
    if (!data?.shopVacations || data?.shopVacations?.length === 0) {
      return "--";
    }
    const vacation = data?.shopVacations[0];
    if (!vacation || !vacation.start || !vacation.end) {
      return "--";
    }
    const startDate = vacation?.start ? formatToJapaneseDate(vacation.start) : '--';
    const endDate = vacation?.end ? formatToJapaneseDate(vacation.end) : '--';
    return `${startDate} ~ ${endDate}`;
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} style={{ color: i <= rating ? 'orange' : 'gray' }}>★</span>
      );
    }
    return stars;
  };

  if (isGetError) {
    handleErrors(getError);
  }

  return (
    <div className="container mx-auto mt-4 p-4">
      {isLoading ? (
        <ShopLayoutSkeleton />
      ) : (
        <>
          <div>
            <p className="text-2xl md:text-3xl lg:text-3xl font-bold">{data?.name ?? '--'}</p>
            <p className="mt-2 text-sm md:text-base lg:text-lg">{data?.appealStatement ?? '--'}</p>
          </div>
          <div className="mt-4 flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-4">
            {/* Store Image Section */}
            <div className="avatar w-full md:w-1/3 rounded overflow-hidden">
              <img
                src={data?.shopImageUrl ? data.shopImageUrl : 'https://ctn-uploads.s3.ap-northeast-1.amazonaws.com/buyerportal-assets/placeholder-ctn-car-image.png'}
                alt="Shop Image"
                className="w-full h-full object-cover"
                style={{ height: '300px', width: '300px' }}
              />
            </div>

            {/* Store Data Section */}
            <div className="w-full md:w-1/2 lg:w-1/2">
              <h3 className="text-lg md:text-xl font-bold">店舗データ</h3>
              <table className="mt-2 w-full text-sm md:text-base lg:text-lg">
                <tbody>
                  <tr>
                    <td className="pr-4">住所</td>
                    <td>
                      {`${data?.postalCode ? `〒${formatPostalCode(data.postalCode)}` : ''}`
                        + `${data?.prefectures ? ` ${data.prefectures}` : ''}`
                        + `${data?.municipalities ? `${data.municipalities}` : ''}`
                        + (data?.address ? ` ${data.address}` : '')}
                    </td>
                  </tr>
                  <tr>
                    <td>電話番号</td>
                    <td>{formatPhoneNumber(data?.phoneNumber) ?? '--'}</td>
                  </tr>
                  <tr>
                    <td>営業時間</td>
                    <td>{data?.businessHours ?? '--'}</td>
                  </tr>
                  <tr>
                    <td>定休日</td>
                    <td>{formatShopHolidays() ?? '--'}</td>
                  </tr>
                  <tr>
                    <td>バケーション</td>
                    <td>{formatShopVacations() ?? '--'}</td>
                  </tr>
                  <tr>
                    <td>運営</td>
                    <td>{data?.companyName ?? '--'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Word of Mouth Evaluation */}
            <div className="w-full md:w-1/3 lg:w-1/4 p-3 border border-red-500 bg-yellow-100 rounded h-[160px] overflow-hidden pb-2">
              <h3 className="text-md font-bold mb-2">口コミ評価</h3>
              <div className="flex items-center mb-2">
                <span className="text-white bg-red-500 rounded px-2 py-1 text-xs">総合評価</span>
                <div className="ml-2">
                  <span className="text-red-500">{renderStars(4)}</span>
                </div>
                <span className="ml-2 text-gray-700">(100件)</span>
              </div>
              <ul className="text-sm space-y-1">
                <li className="flex items-center">
                  <span className="w-24">査定価格</span>
                  <span className="text-red-500">{renderStars(3)}</span>
                </li>
                <li className="flex items-center">
                  <span className="w-24">連絡対応</span>
                  <span className="text-red-500">{renderStars(4)}</span>
                </li>
                <li className="flex items-center">
                  <span className="w-24">おすすめ</span>
                  <span className="text-red-500">{renderStars(5)}</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Assessed Value */}
          <div className="mt-4">
            <p>査定額: ⚪⚪ 万円</p>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <Button
              variant="default"
              size="default"
              className="w-full md:w-1/2 lg:w-1/3 text-sm md:text-base lg:text-lg"
              onClick={() => onClickReview(shopIdNumber, 'Store', 'Area', 'District')}
              disabled>
              レビューの投稿
            </Button>
            <Button
              variant="default"
              size="default"
              className="w-full md:w-1/2 lg:w-1/3 text-sm md:text-base lg:text-lg"
              onClick={handleMessageButtonClick}
            >
              メッセージの送受信
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ShopLayout;
