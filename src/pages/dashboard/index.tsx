import { Button, Tabs } from 'antd';
import { MainWrapperLayout } from '@/src/layouts';
import { AssessmentRequestListLayout } from '@/src/layouts';
import NoticesLayout from '@/src/layouts/notices-list';
import useBodyClass from '@/src/hooks/useBodyClass';
import AppraisalsLayout from '@/src/layouts/appraisals-list/AppraisalsLayout';
import SingleApprisial from './apprisials';
import { useTabStore } from '@/src/stores/tabStore';
import { MatchingConditions } from '@/src/layouts/matchingConditions/matchingConditions';
import { BuyerRegisterForm } from '../buyerRegister/buyerRegisterForm';
import StoreInfoLayout from '@/src/layouts/buyer-details.tsx';
import { useNavigate } from 'react-router-dom';
import { useGetAllStores } from '@/src/hooks/useGetStores';
import { useEffect, useRef, useState } from 'react';
import { useAppStore } from '@/src/stores/app.store';
import SystemImprovementLayout from '@/src/layouts/system-improvement';
import SystemImprovementPage from '../system-improvement';
import ParseJwt from '../login/ParseJwt';

interface TabItem {
  key: string;
  label: string;
  children: JSX.Element;
  hidden?: boolean;
}

const getTabItems = (shopType: string): TabItem[] => [
  {
    key: '1',
    label: '査定依頼一覧',
    children: <AppraisalsLayout />
  },
  // {
  //   key: '6',
  //   label: 'マッチング条件',
  //   children: <MatchingConditions />
  // },
  {
    key: '5',
    label: '買取店情報',
    children: <StoreInfoLayout />
  },
  {
    key: '2',
    label: 'お知らせ',
    children: <NoticesLayout />
  },
  ...(shopType !== 'SUB_BRANCH'
    ? [
        {
          key: '3',
          label: '請求一覧',
          children: <AssessmentRequestListLayout />
        }
      ]
    : []),
  {
    key: '8',
    label: 'システム改普要望',
    children: <SystemImprovementPage />
  },
  {
    key: '4',
    label: '',
    children: <SingleApprisial />,
    hidden: true
  },
  {
    key: '7',
    label: '',
    children: <BuyerRegisterForm />,
    hidden: true
  }
];

const DashboardPage = () => {
  useBodyClass('white_page');
  const { tabKey, setTabKeyAction } = useTabStore();
  const navigate = useNavigate();
  const [shouldFetch, setShouldFecth] = useState(false);
  const { setEditRegisterId, setFetchShopType } = useAppStore();
  const historyStack = useRef<string[]>(['1']);
  const token = localStorage.getItem('token');
  const decodedToken = ParseJwt(token);
  const shoType = decodedToken?.shopType;

  const tabItems = getTabItems(shoType);
  const visibleItems = tabItems.filter(item => !item.hidden);

  const currentTabContent = tabItems.find(item => item.key === tabKey)?.children;

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state?.tabKey) {
        setTabKeyAction(event.state.tabKey);
        const newStack = [...historyStack.current];
        const index = newStack.indexOf(event.state.tabKey);
        if (index !== -1) {
          newStack.splice(index + 1);
        }
        historyStack.current = newStack;
      }
    };

    window.addEventListener('popstate', handlePopState);

    if (!window.history.state) {
      window.history.replaceState({ tabKey: '1' }, '');
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [setTabKeyAction]);

  useEffect(() => {
    const currentStack = historyStack.current;
    const lastTab = currentStack[currentStack.length - 1];

    if (tabKey !== lastTab) {
      historyStack.current = [...currentStack, tabKey];
      window.history.pushState({ tabKey }, '');
    }
  }, [tabKey]);

  const handleTabKey = (activeKey: string): void => {
    const targetTab = tabItems.find(item => item.key === activeKey);
    if (targetTab?.hidden) {
      return;
    }
    
    setTabKeyAction(activeKey);
    if (activeKey === '6') {
      handleMatchingCard();
    }
  };

  const { shopId } = useGetAllStores(shouldFetch);

  const handleMatchingCard = async () => {
    setShouldFecth(true);
    if (shopId === undefined) {
      await new Promise((resolve) => setTimeout(resolve, 400));

      if (shopId === undefined) {
        console.error('Merchant ID is still undefined');
        return;
      }
    }
    setEditRegisterId(String(shopId));
    setFetchShopType('');
  };

  const handleDashboard = () => {
    navigate('/');
  };

  const isHiddenTab = tabItems.find(item => item.key === tabKey)?.hidden;

  return (
    <MainWrapperLayout background="!pb-10  ">
      <div className=" w-full relative">
        <Tabs
          activeKey={tabKey}
          onTabClick={handleTabKey}
          defaultActiveKey={'1'}
          items={visibleItems}
        />
        
        {currentTabContent && (
          <div style={{ display: isHiddenTab ? 'block' : 'none' }}>
            {currentTabContent}
          </div>
        )}
        
        <div className=" absolute sm:top-0 top-[-65px] right-0 flex items-center justify-end">
          {/* <Button
            type="text"
            onClick={() => handleDashboard()}
            className=" text-[10px] md:text-sm mt-2 hover:!bg-transparent">
            ダッシュボード
          </Button> */}
        </div>
      </div>
    </MainWrapperLayout>
  );
};

export default DashboardPage;
