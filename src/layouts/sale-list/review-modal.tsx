import { useState } from 'react';
import { ModalComponent } from '@/src/components/modal';
import { X, ChevronRight, Star } from 'lucide-react';

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    shopName: string;
}

const RatingItem = ({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) => {
    return (
        <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 border-dotted">
            <div className="flex items-center gap-1">
                <span className="text-[14px] font-bold text-[#333333]">{label}</span>
                <span className="text-[#F26621] text-[12px]">*</span>
            </div>
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={24}
                        className={`cursor-pointer transition-colors ${star <= value ? 'fill-[#FBBF24] text-[#FBBF24]' : 'fill-[#E5E7EB] text-[#E5E7EB]'
                            }`}
                        onClick={() => onChange(star)}
                    />
                ))}
            </div>
        </div>
    );
};

export const ReviewModal = ({ isOpen, onClose, shopName }: ReviewModalProps) => {
    const [ratings, setRatings] = useState({
        service: 0,
        atmosphere: 0,
        afterSupport: 0,
        quality: 0,
    });
    const [content, setContent] = useState('');

    const averageRating = Object.values(ratings).filter(v => v > 0).length > 0
        ? (Object.values(ratings).reduce((a, b) => a + b, 0) / Object.values(ratings).filter(v => v > 0).length).toFixed(1)
        : 0;

    return (
        <ModalComponent isOpen={isOpen} onClose={onClose} title="">
            <div className="relative p-4 md:p-8 bg-white max-w-[600px] mx-auto">
                {/* Custom Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-0 right-0 p-2 text-white bg-transparent hover:opacity-80 transition-opacity z-[70]"
                >
                    <X size={28} strokeWidth={3} />
                </button>

                <div className="space-y-6">
                    <div className="space-y-4">
                        <h2 className="text-[20px] md:text-[24px] font-bold text-[#333333]">口コミを書く</h2>
                        <div className="space-y-1">
                            <p className="text-[11px] font-bold text-gray-500">店舗名</p>
                            <p className="text-[14px] md:text-[16px] font-bold text-[#333333]">{shopName}</p>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-6">
                        <div className="space-y-1">
                            <RatingItem label="1. 接客" value={ratings.service} onChange={(v) => setRatings(prev => ({ ...prev, service: v }))} />
                            <RatingItem label="2. 雰囲気" value={ratings.atmosphere} onChange={(v) => setRatings(prev => ({ ...prev, atmosphere: v }))} />
                            <RatingItem label="3. アフターフォロー" value={ratings.afterSupport} onChange={(v) => setRatings(prev => ({ ...prev, afterSupport: v }))} />
                            <RatingItem label="4. 品質" value={ratings.quality} onChange={(v) => setRatings(prev => ({ ...prev, quality: v }))} />
                        </div>

                        <div className="bg-[#F8F9FA] p-3 rounded-md flex items-center justify-between mt-4">
                            <span className="text-[12px] md:text-[13px] font-bold text-gray-700">1〜4の総合評価</span>
                            <div className="flex items-center gap-2">
                                <div className="flex gap-0.5">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            size={18}
                                            className={`${star <= Math.round(Number(averageRating)) ? 'fill-[#FBBF24] text-[#FBBF24]' : 'fill-[#E5E7EB] text-[#E5E7EB]'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 pt-2">
                        <div className="flex items-center gap-1">
                            <label className="text-[14px] font-bold text-[#333333]">本文</label>
                            <span className="text-[#F26621] text-[12px]">*</span>
                        </div>
                        <div className="relative">
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full h-32 border border-gray-200 rounded-md p-3 text-[14px] focus:outline-none focus:border-[#F26621] transition-colors resize-none"
                                placeholder=""
                            />
                            <span className="absolute bottom-2 right-3 text-[10px] text-gray-400">20文字以上ご記入ください</span>
                        </div>
                        <p className="text-[10px] text-gray-500">※氏名・メールアドレスなどの個人情報は記載しないでください。</p>
                    </div>

                    <div className="pt-6 border-t border-gray-100">
                        <div className="flex items-baseline justify-between mb-8">
                            <div className="flex flex-col gap-1">
                                <span className="text-[12px] text-gray-500">投稿者名</span>
                                <span className="text-[14px] font-bold text-[#333333]">むぽむぽ さん</span>
                            </div>
                            <button className="text-[11px] text-[#F26621] font-bold flex items-center hover:underline">
                                ※投稿者名はプロフィールページで変更できます。 <span className="underline ml-1">変更する</span> <ChevronRight size={12} />
                            </button>
                        </div>

                        <button className="w-full bg-white border-2 border-[#F26621] text-[#F26621] py-3.5 px-4 rounded-md font-bold text-[17px] flex items-center justify-center relative hover:bg-orange-50 transition-colors shadow-lg active:shadow-md active:translate-y-[1px]">
                            投稿する
                            <ChevronRight size={20} className="absolute right-4" />
                        </button>
                    </div>
                </div>
            </div>
        </ModalComponent>
    );
};
