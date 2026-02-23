import { useEffect } from 'react';
import { NoticeType } from '@/src/types/notice.type';
import { Spin } from 'antd'; // For better loading spinner

type NoticeDetailPropsType = {
  notice?: NoticeType;
  onBack?: () => void;
  isLoading?: boolean;
};

const NoticeDetail = ({ notice, onBack, isLoading }: NoticeDetailPropsType) => {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({
      top: 0
    });
  }, [notice]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:min-h-[400px] lg:min-h-[300px] bg-gray-100 shadow-lg rounded-md">
      <div className="mb-4 flex justify-end">
        <button
          onClick={onBack}
          className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-white bg-gray-700 border border-gray-700 rounded-lg hover:bg-gray-800 transition-all">
          戻る
        </button>
      </div>
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">{notice?.title}</h1>
      <div className="flex justify-center mb-6">
        <div className="h-[2px] w-[25%] sm:w-[30%] bg-gray-700"></div>
        <div className="h-[2px] w-[75%] sm:w-[70%] bg-gray-300"></div>
      </div>
      <div className="text-gray-700 text-sm sm:text-base leading-relaxed">
        {notice?.content ? (
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: notice.content }} />
        ) : (
          <p className="text-center">記録は見つかりませんでした</p>
        )}
      </div>
    </div>
  );
};

export default NoticeDetail;
