import { useState } from 'react';
import { ChevronRight, HelpCircle } from 'lucide-react';
import { PointInfoModal } from './point-info-modal';
import { ReviewModal } from './review-modal';

const SaleCard = () => {
  const [isPointModalOpen, setIsPointModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const togglePointModal = () => setIsPointModalOpen(!isPointModalOpen);
  const toggleReviewModal = () => setIsReviewModalOpen(!isReviewModalOpen);
  return (
    <div className="bg-white border border-gray-100 rounded shadow-sm mb-4 overflow-hidden">
      <h3 className="text-[#333333] font-bold text-sm md:text-[15px] mb-1 pt-5 px-5 md:pt-8 md:px-8 ">
        ネクステージ 香里園セダン・スポーツ専門店
      </h3>
      <div className="flex flex-col md:flex-row p-5 md:p-8 gap-6 md:gap-10">
        {/* Left Column: Image & Info Button */}
        <div className="w-full md:w-[240px] flex flex-col gap-3">
          <div className="relative rounded overflow-hidden border border-gray-200 shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=400"
              alt="Car"
              className="w-full h-auto"
            />
          </div>
          <button className="flex items-center justify-between w-full border border-gray-300 py-2.5 px-4 rounded-md text-[12px] font-bold hover:bg-gray-50 transition-colors shadow-sm text-gray-700 mt-2">
            車両情報ページを見る
            <ChevronRight size={14} className="text-gray-400" />
          </button>
        </div>

        {/* Middle Column: Details & Price Table */}
        <div className="flex-1 flex flex-col">
          <div className="space-y-1 mt-4 md:mt-8">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">トヨタ</p>
            <h2 className="text-[18px] md:text-[20px] font-bold text-[#333333] leading-tight mb-6">
              RAV4 - Adventure “OFFROAD package II ”
            </h2>
          </div>

          <div className="space-y-1 mt-auto">
            <div className="flex justify-between items-center border-b border-gray-100 py-1.5">
              <span className="text-[13px] text-gray-600 font-bold">車両価格</span>
              <div className="flex items-baseline gap-1">
                <span className="text-[22px] font-bold text-[#333333]">122.5</span>
                <span className="text-[13px] font-bold text-[#333333]">万円</span>
              </div>
            </div>
            <div className="flex justify-between items-center border-b border-gray-100 py-1.5">
              <span className="text-[13px] text-gray-600 font-bold">支払総額</span>
              <div className="flex items-baseline gap-1">
                <span className="text-[22px] font-bold text-[#333333]">12.4</span>
                <span className="text-[13px] font-bold text-[#333333]">万円</span>
              </div>
            </div>
            <div className="flex justify-between items-center border-b border-gray-100 py-1.5">
              <div className="flex items-center gap-2">
                <span className="bg-[#F26621] text-white text-[10px] px-2 py-0.5 rounded-sm font-bold shadow-sm">
                  temotokuポイント
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-[22px] font-bold text-[#F26621]">-1</span>
                <span className="text-[13px] font-bold text-[#F26621]">万円</span>
              </div>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-[13px] text-gray-700 font-bold">実質合計</span>
              <div className="flex items-baseline gap-1">
                <span className="text-[32px] font-bold text-[#F26621] leading-none">133.9</span>
                <span className="text-[13px] font-bold text-[#F26621]">万円</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Actions */}
        <div className="w-full md:w-[280px] flex flex-col gap-6">
          <div className="bg-[#FDFDFD] border border-gray-50 p-4 rounded-md space-y-4 mt-6">
            <p className="text-[11px] text-[#F26621] font-bold text-center">
              現在の車両を買取依頼すると更にポイント還元！
            </p>
            <button className="w-full bg-[#F26621] text-white py-3.5 px-4 rounded-md font-bold text-[15px] flex items-center justify-center gap-2 hover:bg-[#d95a1d] transition-colors relative shadow-[0_4px_0_0_#b74916] active:shadow-none active:translate-y-[1px]">
              一括査定依頼 <span className="text-[11px] font-normal italic">はこちら</span>
              <ChevronRight size={18} className="absolute right-4" />
            </button>
          </div>

          <div className="space-y-5 pt-2">
            <div className="space-y-4">
              <p className="text-[11px] text-[#F26621] font-bold text-center">
                ※ポイント還元には成約報告が必須となります。
              </p>
              <button className="w-full border-2 border-[#F26621] text-[#F26621] py-3.5 px-4 rounded-md font-bold text-[17px] flex items-center justify-center relative hover:bg-orange-50 transition-colors shadow-sm">
                成約報告する
                <ChevronRight size={20} className="absolute right-4" />
              </button>
              <button
                onClick={togglePointModal}
                className="w-full border border-gray-300 text-gray-500 py-2.5 px-4 rounded-md font-bold text-[11px] flex items-center justify-center gap-1.5 hover:bg-gray-50 transition-colors shadow-sm">
                <HelpCircle size={15} className="text-[#F26621]" />
                ポイント還元について
              </button>
            </div>

            <div className="border-t border-gray-100 pt-5">
              <button
                onClick={toggleReviewModal}
                className="w-full border border-gray-300 text-gray-700 py-4 px-4 rounded-md font-bold text-[15px] flex items-center justify-center relative hover:bg-gray-50 transition-colors shadow-sm">
                口コミを書く
                <ChevronRight size={18} className="absolute right-4 text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <PointInfoModal isOpen={isPointModalOpen} onClose={togglePointModal} />

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={toggleReviewModal}
        shopName="ネクステージ 香里園セダン・スポーツ専門店"
      />
    </div>
  );
};

export default SaleCard;
