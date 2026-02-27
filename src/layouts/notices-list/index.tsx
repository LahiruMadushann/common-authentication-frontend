import { useLazyGetNoticeByIdQuery, useLazyGetNoticesQuery } from '@/src/app/services/notices';
import { useEffect, useState } from 'react';
import NoticesTable from './table';
import { TableLoadingSkeleton } from '@/src/components/loading-screens';
import NoticeDetail from './detail';
import useBodyClass from '@/src/hooks/useBodyClass';
import { NoticeType } from '@/src/types/notice.type';

const NoticesLayout = () => {
  const [fetchNotices, { data: noticesData, isLoading: isLoadingNotices }] = useLazyGetNoticesQuery();
  const [
    fetchNoticeById,
    { data: noticeDetailData, isLoading: isLoadingNoticeDetail },
  ] = useLazyGetNoticeByIdQuery();
  const [selectedNoticeId, setSelectedNoticeId] = useState<number | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false); 

  useBodyClass('gray_page');

  useEffect(() => {
    fetchNotices({
      page: 0,
      size: 100,
      category: 'SELLER',
    });
  }, [fetchNotices]);

  const handleNoticeClick = (noticeId: number) => {
    if (noticeId !== selectedNoticeId) {
      setSelectedNoticeId(noticeId); 
      setIsDetailLoading(true); 
      fetchNoticeById({ id: noticeId } as NoticeType).finally(() => {
        setIsDetailLoading(false);
      });
    }
  };

  const handleBackToList = () => {
    setSelectedNoticeId(null);
  };

  if (isLoadingNotices && !noticesData) {
    return (
      <div className="w-full min-h-[400px] mb-10">
        <TableLoadingSkeleton rows={7} columns={2} />
      </div>
    );
  }

  return (
    <div>
      {selectedNoticeId ? (
        isDetailLoading || isLoadingNoticeDetail ? (
          <div className="w-full min-h-[200px] mb-20">
            <TableLoadingSkeleton rows={5} />
          </div>
        ) : (
          <NoticeDetail
            notice={noticeDetailData}
            onBack={handleBackToList}
            isLoading={isLoadingNoticeDetail}
          />
        )
      ) : (
        <NoticesTable
          data={noticesData ? noticesData.content : []}
          onDetailClick={handleNoticeClick}
        />
      )}
    </div>
  );
};

export default NoticesLayout;