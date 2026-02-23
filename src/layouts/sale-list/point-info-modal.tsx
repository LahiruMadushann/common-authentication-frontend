import { ModalComponent } from '@/src/components/modal';
import { X } from 'lucide-react';

interface PointInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const PointInfoModal = ({ isOpen, onClose }: PointInfoModalProps) => {
    return (
        <ModalComponent isOpen={isOpen} onClose={onClose} title="">
            <div className="relative p-2 md:p-6 bg-white overflow-hidden">
                {/* Custom Close Button for exact match */}
                <button
                    onClick={onClose}
                    className="absolute top-0 right-0 md:-top-4 md:-right-4 p-2 text-white bg-transparent hover:opacity-80 transition-opacity z-[60]"
                >
                    <X size={28} className="md:size-32" strokeWidth={3} />
                </button>

                <div className="space-y-6 md:space-y-8">
                    {/* Title */}
                    <div className="border-b border-gray-100 pb-2">
                        <h2 className="text-[20px] md:text-[24px] font-bold text-[#333333]">
                            <span className="text-[#F26621]">ポイント還元</span>について
                        </h2>
                    </div>

                    <p className="text-[13px] md:text-[15px] leading-relaxed text-gray-700">
                        temotokuでは、中古車の売買がスムーズに成立した際、<br className="hidden md:block" />
                        お支払い総額に応じて<span className="text-[#F26621] font-bold">temotokuポイント</span>を自動還元しています。
                    </p>

                    {/* Section 1 */}
                    <div className="space-y-4">
                        <h3 className="bg-[#F8F9FA] px-4 py-2 border-l-4 border-gray-200 text-[14px] md:text-[16px] font-bold text-[#333333]">
                            還元内容
                        </h3>
                        <div className="space-y-3 px-1">
                            <p className="text-[13px] md:text-[14px] font-bold text-[#333333]">
                                一括買取査定の同時利用さらに還元
                            </p>
                            <ul className="list-disc list-inside text-[12px] md:text-[13px] text-gray-600 space-y-1 ml-1">
                                <li>中古車販売のお申し込みと同時に、一括買取査定を利用すると、追加で<span className="text-[#F26621] font-bold">5,000円OFF</span>になります。</li>
                            </ul>
                        </div>
                    </div>

                    {/* Section 2 */}
                    <div className="space-y-4">
                        <h3 className="bg-[#F8F9FA] px-4 py-2 border-l-4 border-gray-200 text-[14px] md:text-[16px] font-bold text-[#333333]">
                            還元（ポイント適用）のタイミング
                        </h3>
                        <div className="space-y-3 px-1">
                            <p className="text-[13px] md:text-[14px] leading-relaxed">
                                販売店とお客機それぞれの取引画面で<br className="md:hidden" />
                                <span className="text-[#F26621] font-bold">「成約」ボタンが双方クリックされ、成約が確定した時点で自動的にポイント還元が適用</span>されます。
                            </p>
                            <ul className="list-disc list-inside text-[12px] md:text-[13px] text-gray-600 space-y-1 ml-1">
                                <li>特別な手続きは不要。</li>
                                <li>成約後の支払い金額に自動反映されます。</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </ModalComponent>
    );
};
