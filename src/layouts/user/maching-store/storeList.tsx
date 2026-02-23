import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLazyGetShopDetailsQuery } from '@/src/app/services/shops';
import { ShopDataType } from '@/src/types/shop.type';
import { handleErrors } from '@/src/utils/handleErrors';
import moment from 'moment';
import { useTypedSelector } from '@/src/app/store';
import { useGetBuyerQuery } from '@/src/app/services/message';
import { skipToken } from '@reduxjs/toolkit/query';
import { Button } from '@/components/ui/button';
import { Loader } from '@/src/components/loader/loader';
import { formatPostalCode } from '@/src/utils/formatPostalcode';
import { FormatToYen } from '@/src/utils/formatToYen';
import ShopReviewRatings from '@/src/components/common/reviewStars';
import { formatPhoneNumber } from '@/src/utils/formatPhoneNumber';

type StoreListType = {
  shopList: any[];
};
const StoreList = (props: StoreListType) => {
  const { shopList = [] } = props;
  const [getShopDetails, { isError: isGetError, error: getError }] = useLazyGetShopDetailsQuery();
  const [data, setData] = useState<ShopDataType | any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const userId = useTypedSelector((state) => state.auth.userId);
  const [shopIdNumber, setShopIdNumber] = useState<number>(0);
  const [buyerId, setBuyerId] = useState<number | null>(null);

  const { data: shopid } = useGetBuyerQuery(buyerId ?? skipToken, {
    skip: buyerId === null
  });

  const handleMessageButtonClick = useCallback((shopIdNumber: number) => {
    setShopIdNumber(shopIdNumber);
    setBuyerId(shopIdNumber);
  }, []);

  // Scroll to top when the component mounts or when the shopIdNumber changes
  useEffect(() => {
    window.scrollTo({
      top: 0
    });
  }, [shopIdNumber]); // Trigger when shopIdNumber changes or component re-mounts

  useEffect(() => {
    if (shopid !== undefined && !isLoading) {
      navigate(`/message/${userId}/${shopid}`, {
        state: { previousPage: `/user` }
      });
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

  const onClickReview = (id: number, store: string, area: string, district: string, shop: any) => {
    navigate(`/user/review/${id}`, {
      state: {
        previousPage: `/user/${id}`,
        store,
        area,
        district,
        shop
      }
    });
  };

  const formatToJapaneseDate = (dateString: string) => {
    if (!dateString) {
      return '--';
    }
    const date = moment(dateString, 'YYYY-MM-DD').toDate();
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  interface Holiday {
    week: string | number | null;
    day: keyof typeof dayNames | null;
  }

  const dayNames: { [key: string]: string } = {
    SUNDAY: '日曜日',
    MONDAY: '月曜日',
    TUESDAY: '火曜日',
    WEDNESDAY: '水曜日',
    THURSDAY: '木曜日',
    FRIDAY: '金曜日',
    SATURDAY: '土曜日'
  };

  const formatShopHolidays = (shops: any): string => {
    if (!shops?.shopHolidays || shops?.shopHolidays.length === 0) {
      return '--';
    }
    return shops.shopHolidays
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

  const formatShopVacations = (shops: any) => {
    if (!shops?.shopVacations || shops?.shopVacations?.length === 0) {
      return '--';
    }
    const vacation = shops?.shopVacations[0];
    if (!vacation || !vacation.start || !vacation.end) {
      return '--';
    }
    const startDate = vacation?.start ? formatToJapaneseDate(vacation.start) : '--';
    const endDate = vacation?.end ? formatToJapaneseDate(vacation.end) : '--';
    return `${startDate} ~ ${endDate}`;
  };
  const reviewData = (shops: any) => ({
    starValue: shops?.starValue,
    starSupport: shops?.starSupport,
    starRecommendation: shops?.starRecommendation
  });

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className=" text-sm xl:text-[20px]"
          style={{ color: i <= rating ? '#e5c33d' : 'gray' }}>
          ★
        </span>
      );
    }
    return stars;
  };

  if (isGetError) {
    handleErrors(getError);
  }

  return (
    <>
      {shopList?.map((shop) => (
        <div key={shop?.id} className="container mx-auto px-4 pb-2  lg:px-[50px] ">
          {isLoading ? (
            <Loader />
          ) : (
            <>
              {shopList?.length === 0 && (
                <h1 className=" text-center w-full bg-white py-10 ">関連データなし</h1>
              )}
              <div className="border-b-[1px] border-[#9d9d9d] border-dashed  py-[30px]">
                <div className="">
                  <div className="flex items-center gap-[20px] mb-[30px] border-b-[1px] border-[#333333]">
                    <h1 className="text-[#333333] text-[18px] font-bold ">店舗名</h1>
                    <h1 className="text-[#333333] text-[18px] font-medium">{shop?.name ?? '--'}</h1>
                  </div>
                    <p className=" text-[1.2rem] font-bold text-[#333333]">
                    {shop?.appealStatement ?? '--'}
                    </p>
                </div>
                <div className="pt-[20px] pb-[15px] flex flex-col md:flex-row justify-between gap-x-[20px] ">
                  {/* Store Image Section */}
                  <div className=" w-full h-full  max-w-[300px] md:max-h-[200px] overflow-hidden">
                    <img
                      src={
                        shop?.shopImageUrl
                          ? shop?.shopImageUrl
                          : 'https://ctn-uploads.s3.ap-northeast-1.amazonaws.com/buyerportal-assets/placeholder-ctn-car-image.png'
                      }
                      alt="Shop Image"
                      className="w-full h-full object-cover md:h-[200px] "
                    />
                  </div>
                  <div className="w-full md:w-1/2 lg:w-1/2">
                    <div className="mt-2 w-full text-sm md:text-[15px]">
                      {[
                        {
                          label: '住所',
                          value:
                            `${shop?.postalCode ? `〒${formatPostalCode(shop.postalCode)}` : ''}` +
                            `${shop?.prefectures ? ` ${shop.prefectures}` : ''}` +
                            `${shop?.municipalities ? `${shop.municipalities}` : ''}` +
                            `${shop?.address ? ` ${shop.address}` : ''}`.replace(/^, /, '') // Removes leading comma if it exists
                        },
                        { label: '電話番号', value: formatPhoneNumber(shop?.phoneNumber ?? '--') },
                        { label: '営業時間', value: shop?.businessHours ?? '--' },
                        { label: '定休日', value: formatShopHolidays(shop) ?? '--' },
                        // {
                        //   label: 'バケーション',
                        //   value: formatShopVacations(shop) ?? '--'
                        // },
                        { label: '会社名', value: shop?.companyName ?? '--' }
                      ]?.map((item, index) => (
                        <div key={index} className=" flex  items-center gap-1 ">
                          <h3 className="  text-sm  md:text-[15px] text-[#333333] font-medium">
                            {`${item?.label} : ${item?.value}`}
                          </h3>
                        </div>
                      ))}
                    </div>
                  </div>
                  <ShopReviewRatings reviews={reviewData(shop)} isBuyer = {false} />
                  {/* <div className=" w-full md:w-1/3 lg:w-1/4 md:max-w-[240px] flex flex-col items-end !mt-6 md:!mt-0">
                    <div className="  w-full flex flex-col items-start p-[10px] justify-center  border border-[#B5B5B5]   h-full max-h-[134px] xl:max-h-[140px] overflow-hidden ">
                      <h3 className="text-md font-bold mb-2 xl:mt-[11px]">口コミ評価</h3> */}
                  {/* <div className="flex items-center mb-2">
                    <span className="text-white bg-red-500 rounded px-2 py-1 text-xs">
                      総合評価
                    </span>
                    <div className="ml-2">
                      <span className="text-red-500">{renderStars(shop.rating.overall)}</span>
                    </div>
                    <span className="ml-2 text-gray-700">(100件)</span>
                  </div> */}
                  {/* <ul className=" text-sm xl:text-[16px] w-full  xl:pb-2">
                        <li className="flex items-center justify-between">
                          <span className="">査定価格</span>
                          <span className="text-red-500 ">
                            {renderStars(shop?.rating?.priceEvaluation)}
                          </span>
                        </li>
                        <li className="flex items-center justify-between">
                          <span className="">連絡・対応</span>
                          <span className="text-red-500 ">
                            {renderStars(shop?.rating?.communication)}
                          </span>
                        </li>
                        <li className="flex items-center justify-between">
                          <span className="">おすすめ度</span>
                          <span className="text-red-500 ">
                            {renderStars(shop?.rating?.recommendation)}
                          </span>
                        </li>
                      </ul>
                    </div>
                    <h3 className=" text-[13px] text-[#0268CC] mt-[10px] hover:underline underline-offset-[5px] duration-150 cursor-pointer ease-linear font-normal">
                      口コミを見る <span className=" text-[20px]">&#8250;</span>
                    </h3>
                  </div> */}
                </div>

                <div className=" w-full flex items-end justify-center md:justify-normal md:max-w-[250px] border-b-[1px] border-b-black ">
                  <p className="  flex items-end  justify-between gap-x-[36px] text-[16px] font-bold ">
                    査定額
                    <span className="  text-[26px] font-bold  ">
                      {FormatToYen(shop?.finalOffer ?? '0', false)}
                      <span className=" text-sm"> 円</span>{' '}
                    </span>
                  </p>
                </div>

                <div className=" mt-4 flex flex-col md:flex-row gap-[7px] w-full  md:w-1/2 lg:w-1/3">
                  <Button
                    variant="outline"
                    size="default"
                    className="w-full max-h-[30px] md:!max-w-[150px]  text-sm md:text-base lg:text-[14px]  bg-[#F6F6F6] border border-[#707070] disabled:!cursor-not-allowed"
                    onClick={() => onClickReview(shop?.shopId, 'Store', 'Area', 'District', shop)}>
                    レビューの投稿
                  </Button>
                  <Button
                    variant="outline"
                    size="default"
                    className="w-full max-h-[30px] md:!max-w-[150px]  !px-4  text-sm md:text-[14px]  bg-[#F6F6F6] border border-[#707070]"
                    onClick={() => {
                      handleMessageButtonClick(shop?.shopId);
                    }}>
                    メッセージの送受信
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      ))}
    </>
  );
};

export default StoreList;
