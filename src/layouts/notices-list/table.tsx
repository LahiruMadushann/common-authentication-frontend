import moment from 'moment';
import { NoticeType } from '@/src/types/notice.type';

type NoticesTablePropsType = {
  data: NoticeType[];
  onDetailClick: (noticeId: number) => void;
};

const formatToJapaneseDate = (dateString: string) => {
  if (!dateString) {
    return '--';
  }

  const date = moment(dateString, 'YYYY-MM-DD HH:mm').toDate();

  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

function NoticesTable(props: NoticesTablePropsType) {
  const maxLength = 50;

  const truncateText = (text: string, length: number) => {
    return text.length > length ? text.slice(0, length) + '...' : text;
  };

  return (
    <div className="relative shadow-sm sm:rounded-lg md:mt-10 border border-gray-200">
      <div className="rounded-xs shadow-sm">
        {/* Notice Container */}
        <div className="bg-white w-full mx-auto min-h-[400px] p-6 rounded-xs shadow-md sm:px-16 px-4">
          <h2 className="text-center text-xl font-semibold mb-6">お知らせ</h2>
          {props.data.length === 0 ? (
            <p className="text-left text-gray-700 font-bold text-2xl">お知らせがありません</p>
          ) : (
            props.data.map((notice, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row items-center sm:justify-between py-3 border-b border-gray-200 hover:bg-gray-50">
                {/* Date and News Badge */}
                <div className="w-full sm:w-1/6 text-sm text-gray-600 whitespace-nowrap text-center sm:text-left mb-2 sm:mb-0">
                  {notice.created ? formatToJapaneseDate(notice.created) : '--'}
                </div>

                <div className="flex-1 flex flex-col sm:flex-row items-center justify-center sm:justify-start mb-2 sm:mb-0 self-center">
                  <span className="bg-[#FE5B02] text-white px-3 py-1 text-xs font-semibold sm:mr-3 rounded-sm sm:mb-2 self-center">
                    NEWS
                  </span>
                  <span className="truncate text-gray-700 text-sm sm:text-base text-center sm:text-left">
                    {truncateText(notice.title || 'お知らせ', maxLength)}
                  </span>
                </div>

                {/* Detail Button - Adjusted width */}
                <div className="w-full sm:w-3/6 text-center sm:text-right">
                  <button
                    onClick={() => props.onDetailClick(notice.id)}
                    className="w-[140px] px-2 py-1 text-xs sm:text-sm text-gray-700 border border-gray-300 bg-white rounded-sm hover:bg-gray-100 transition-all duration-150"
                  >
                    詳細
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default NoticesTable;