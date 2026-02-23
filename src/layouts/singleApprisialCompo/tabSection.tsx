import { useState } from 'react';
import { DeskotpTabButtons, MobileTabButtons } from './tabButtons';
import AssessmentRequestDetailsLayout from '../assessment-request-details';
import { useApprisialStore } from '@/src/stores/apprisials.store';
import { PhotoSection } from './photoSection';
import { MessageSection } from './messageSection';
import { useTypedSelector } from '@/src/app/store';
import { skipToken } from '@reduxjs/toolkit/query';
import { useGetSellerQuery } from '@/src/app/services/message';
import MemoInputBox from './memoInputBox';

export const TabSection = (props:any) => {
  const [activeTab, setActiveTab] = useState(0);
  const { singleAprisial } = useApprisialStore();
  // const userId = useTypedSelector((state) => state.auth.userId);
  const { data: sellerId } = useGetSellerQuery(singleAprisial?.appraisalid?.content ?? skipToken, {
    skip: singleAprisial?.appraisalid?.content === null
  });

  const userId = singleAprisial?.shops?.shops[0]?.userId;
  return (
    <div className="md:mt-10 bg-[#F3F3F3] w-full  h-full">
      <div className="hidden md:block">
        <DeskotpTabButtons activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      <div className="block md:hidden">
        <MobileTabButtons activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <div className="bg-white border-base-300 ">
        <div role="tabpanel" className={`tab-content ${activeTab === 0 ? 'block' : 'hidden'}`}>
          <AssessmentRequestDetailsLayout 
            key={singleAprisial?.appraisalid?.content}
            data={singleAprisial} 
          />

          <MemoInputBox appraisalId={singleAprisial?.appraisalid?.content} userId={userId}/>
          {/* <div className=" flex flex-col items-start w-full md:px-20">
            <h3 className="font-bold mb-2">査定補足テキスト入力</h3>
            <div className=" flex flex-col md:flex-row items-end justify-between w-full gap-4 ">
              <textarea className="w-full p-2 border rounded h-24"></textarea>
              <button className="bg-orange-500 text-white  px-4 py-2 rounded w-full md:max-w-[150px]">
                入力
              </button>
            </div>
          </div> */}
        </div>
        <div role="tabpanel" className={`tab-content ${activeTab === 1 ? 'block' : 'hidden'}`}>
          <PhotoSection singleAprisial={singleAprisial} userId={userId} />
        </div>
        <div role="tabpanel" className={`tab-content ${activeTab === 2 ? 'block' : 'hidden'}`}>
          <MessageSection senderId={userId} receiverId={sellerId} />
        </div>
      </div>
    </div>
  );
};
