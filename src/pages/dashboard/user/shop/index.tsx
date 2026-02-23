import { MainWrapperLayout } from '@/src/layouts';
import ShopLayout from '@/src/layouts/user/maching-store/shop';
import { useState } from 'react';
import AdditionalInformationLayout from '@/src/layouts/user/additional-information';
import AssessmentRequestInformationLayout from '@/src/layouts/user/assestment-request';
import TabButtons from '@/src/components/tab/TabButtons ';
import MobileButtons from '@/src/components/tab/MobileButtons';

const ShopPage = () => {
  const [activeTab, setActiveTab] = useState(0);


  return (
    <MainWrapperLayout>
      <div>
        <div className="hidden md:block">
          <TabButtons activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <div className="block md:hidden">
          <MobileButtons activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        <div className="bg-base-100 border-base-300 rounded-box p-6 ">
          <div role="tabpanel" className={`tab-content  ${activeTab === 0 ? 'block' : 'hidden'}`}>
            <ShopLayout />
          </div>
          <div role="tabpanel" className={`tab-content ${activeTab === 1 ? 'block' : 'hidden'}`}>
            <AssessmentRequestInformationLayout />
          </div>
          <div role="tabpanel" className={`tab-content ${activeTab === 2 ? 'block' : 'hidden'}`}>
            <AdditionalInformationLayout />
          </div>
        </div>
      </div>
    </MainWrapperLayout>
  );
};

export default ShopPage;
