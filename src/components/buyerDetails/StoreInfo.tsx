import React from 'react';
import { AppraisalRequestInformation } from '@/src/types/appraisal';
import { formatPostalCode } from '@/src/utils/formatPostalcode';
import { formatPhoneNumber } from '@/src/utils/formatPhoneNumber';

interface StoreInfoProps {
  data: any; 
  formatShopHolidays: (shops: any) => string;
}

const StoreInfo: React.FC<StoreInfoProps> = ({ data, formatShopHolidays }) => (
  <>
  <div className="flex flex-col lg:flex-row mb-6 space-y-4 lg:space-y-0 lg:space-x-8">
    <div className="w-full h-full max-w-[300px] md:max-h-[200px] overflow-hidden">
      <img
        src={data?.shopImageUrl || 'https://ctn-uploads.s3.ap-northeast-1.amazonaws.com/buyerportal-assets/placeholder-ctn-car-image.png'}
        alt="Shop Image"
        className="w-full h-full object-cover md:h-[200px]"
      />
    </div>

    <div className="flex-1 space-y-2">
      <h3 className="text-xl font-bold">{data?.name ?? '--'}</h3>
      <p>{data?.appealStatement ?? '--'}</p>
      <p>住所: {`${data?.postalCode ? `〒${formatPostalCode(data.postalCode)}` : ''}`
                              + `${data?.prefectures ? ` ${data.prefectures}` : ''}`
                              + `${data?.manicipalities ? `${data.manicipalities}` : ''}`
                              + (data?.address ? ` ${data.address}` : '')}</p>
      <p>電話番号: {formatPhoneNumber(data?.phoneNumber ?? '--')}</p>
      <p>営業時間: {data?.businessHours ?? '--'}</p>
      <p>定休日: {formatShopHolidays(data)}</p>
      <p>運営: {data?.companyName ?? '--'}</p>
    </div>

    {/* <div className="border border-orange-400 rounded-lg p-4 space-y-2 w-full lg:w-1/4">
      <h4 className="font-bold text-orange-500">口コミ評価</h4>
      <div className="flex items-center justify-between">
        <span>総合評価</span>
        <div className="text-yellow-500">★★★★★</div>
      </div>
      <div className="flex justify-between">
        <span>査定価格</span>
        <div className="text-yellow-500">★★★★★</div>
      </div>
      <div className="flex justify-between">
        <span>連絡対応</span>
        <div className="text-yellow-500">★★★★★</div>
      </div>
      <div className="flex justify-between">
        <span>おすすめ</span>
        <div className="text-yellow-500">★★★★★</div>
      </div>
      <p className="text-right text-sm">(100件)</p>
    </div> */}
  </div>
  <div className="border-t border-gray-700 shadow-sm w-full mb-6"></div>
  </>
);

export default StoreInfo;
