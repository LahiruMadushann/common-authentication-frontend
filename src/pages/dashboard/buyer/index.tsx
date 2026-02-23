import { Link, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useTabStore } from '@/src/stores/tabStore';
import { MainWrapperLayout } from '@/src/layouts';
import AssessmentDetails from './AssessmentDetails';
import { useBuyerStore } from '@/src/stores/buyer.store';
import { useLazyGetShopDetailsQuery } from '@/src/app/services/shops';
import { useGetAllStores } from '@/src/hooks/useGetStores';
import { useState } from 'react';
import { useAppStore } from '@/src/stores/app.store';

const BuyerDashboardPage = () => {
  const { setTabKeyAction } = useTabStore();
  const { setFirstRegister } = useBuyerStore();
  const [shouldFetch, setShouldFecth] = useState(false);
  const { setEditRegisterId, setFetchShopType } = useAppStore();
  const navigate = useNavigate();

  const dashboardItems = [
    {
      title: '査定依頼一覧',
      tabKey: '1'
    },
    {
      title: '買取店情報',
      tabKey: '5'
    },
    // {
    //   title: 'マッチング条件',
    //   tabKey: '6'
    // },
    {
      title: '請求一覧',
      tabKey: '3'
    },
    {
      title: 'お知らせ一覧',
      tabKey: '2'
    },
    {
      title: 'システム改普要望',
      tabKey: '8'
    },
    
  ];

  const handleCardClick = (tabKey: string) => {
    setTabKeyAction(tabKey);
    navigate('/dashboard');
    setFirstRegister(false);
  };
  const { shopId } = useGetAllStores(shouldFetch);

  const handleMatchingCard = async () => {
    setShouldFecth(true);
    if (shopId === undefined) {
      console.log(shopId, 'merchat id');
      await new Promise((resolve) => setTimeout(resolve, 400));

      if (shopId === undefined) {
        console.error('Merchant ID is still undefined');
        return;
      }
    }
    setEditRegisterId(String(shopId));
    setTabKeyAction(dashboardItems[2].tabKey);
    setFetchShopType('');
    navigate('/dashboard');
    setFirstRegister(false);
  };

  const navigateToMyPage = () => {
    navigate('/dashboard');
  };

  return (
    <div className="bg-white">
      <MainWrapperLayout>
        <div className="px-4 py-8">
          <div className="flex justify-between mt-[-4vh] mb-[6vh] mx-2">
            <a href="/" className="text-gray-600">
              ダッシュボード
            </a>
            <p onClick={() => navigateToMyPage()} className="text-gray-600 cursor-pointer">
              マイページ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-[1200px] mx-auto">
            <Card
              className="bg-[#F15A24] hover:bg-[#d94e1f] transition-colors cursor-pointer py-12"
              onClick={() => handleCardClick(dashboardItems[0].tabKey)}>
              <div className="p-4">
                <h3 className="text-white text-xl font-medium text-center">
                  {dashboardItems[0].title}
                </h3>
              </div>
            </Card>
            <Card
              className="bg-[#F15A24] hover:bg-[#d94e1f] transition-colors cursor-pointer py-12"
              onClick={() => handleCardClick(dashboardItems[1].tabKey)}>
              <div className="p-4">
                <h3 className="text-white text-xl font-medium text-center">
                  {dashboardItems[1].title}
                </h3>
              </div>
            </Card>
            <Card
              className="bg-[#F15A24] hover:bg-[#d94e1f] transition-colors cursor-pointer py-12"
              onClick={handleMatchingCard}>
              <div className="p-4">
                <h3 className="text-white text-xl font-medium text-center">
                  {dashboardItems[2].title}
                </h3>
              </div>
            </Card>
            <div className="md:col-span-3 flex justify-center gap-6">
              <Card
                className="bg-[#F15A24] hover:bg-[#d94e1f] transition-colors cursor-pointer py-12 w-full md:w-1/3"
                onClick={() => handleCardClick(dashboardItems[3].tabKey)}>
                <div className="p-4">
                  <h3 className="text-white text-xl font-medium text-center">
                    {dashboardItems[3].title}
                  </h3>
                </div>
              </Card>
              <Card
                className="bg-[#F15A24] hover:bg-[#d94e1f] transition-colors cursor-pointer py-12 w-full md:w-1/3"
                onClick={() => handleCardClick(dashboardItems[4].tabKey)}>
                <div className="p-4">
                  <h3 className="text-white text-xl font-medium text-center">
                    {dashboardItems[4].title}
                  </h3>
                </div>
              </Card>
              <Card
                className="bg-[#F15A24] hover:bg-[#d94e1f] transition-colors cursor-pointer py-12 w-full md:w-1/3"
                onClick={() => handleCardClick(dashboardItems[5].tabKey)}>
                <div className="p-4">
                  <h3 className="text-white text-xl font-medium text-center">
                    {dashboardItems[5].title}
                  </h3>
                </div>
              </Card>
            </div>
          </div>
        </div>
        {/* <AssessmentDetails /> */}
      </MainWrapperLayout>
    </div>
  );
};

export default BuyerDashboardPage;
