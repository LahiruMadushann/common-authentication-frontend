import { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Tabs } from 'antd';
import { useLazyGetShopsQuery } from '@/src/app/services/shops';
import { useLazyGetAppraisalQuery } from '@/src/app/services/appraisal';
import { MainWrapperLayout } from '@/src/layouts';
import AdditionalInformationLayout from '@/src/layouts/user/additional-information';
import AssessmentRequestInformationLayout from '@/src/layouts/user/assestment-request';
import MatchingStoreLayout from '@/src/layouts/user/maching-store';
import NoticesLayout from '@/src/layouts/notices-list';
import { AppraisalRequestInformation } from '@/src/types/appraisal';
import { handleErrors } from '@/src/utils/handleErrors';
import { RootState } from '../../login/store';
import TabButtons from '@/src/components/tab/TabButtons ';
import MobileButtons from '@/src/components/tab/MobileButtons';
import { Loader } from '@/src/components/loader/loader';
import { formatPostalCode } from '@/src/utils/formatPostalcode';
import SaleLayout from '@/src/layouts/sale-list';

const UserDashboardPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [activeTopTab, setActiveTopTab] = useState('1');
  const [getShops, { isError: isGetError, error: getError }] = useLazyGetShopsQuery();
  const [getAppraisal, { isError: isGetError2, error: getError2 }] = useLazyGetAppraisalQuery();
  const [shopsData, setShopsData] = useState<AppraisalRequestInformation | null>(null);
  const [data, setData] = useState<AppraisalRequestInformation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const userId = useSelector((state: RootState) => state.auth?.userId ?? null);
  const [shopListData, setShopListData] = useState<any[]>([]);

  const formatPhoneNumber = (phone: any) => {
    if (!phone) return '---';
    // Assuming the phone number format is 09044085403 and needs to be formatted to 090-4408-5403
    return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  };

  // useEffect(() => {
  //   // Scroll to top whenever active tab or active top tab changes
  //   window.scrollTo({
  //     top: 0,
  //   });
  // }, [activeTab, activeTopTab]);

  useEffect(() => {
    if (activeTopTab === '1') {
      setIsLoading(true);
      getShops(Number(userId))
        .unwrap()
        .then((data: AppraisalRequestInformation[]) => {
          if (data && data?.length > 0) {
            const uniqueData = Array.from(new Set(data.map((item) => item.shopId))).map(
              (shopId) => data.find((item) => item.shopId === shopId)!
            );
            setShopListData(uniqueData);
            setData(uniqueData);
            const firstItem = uniqueData[0];
            if (firstItem?.appraisalId) {
              localStorage.setItem('appraisalid', String(firstItem.appraisalId));
            }
            setShopsData({
              customerName: firstItem?.customerName || '',
              companyName: firstItem?.companyName || '',
              customerEmail: firstItem?.customerEmail || '',
              customerPostNumber: firstItem?.customerPostNumber || '',
              customerPrefecture: firstItem?.customerPrefecture || '',
              customerMunicipalities: firstItem?.customerMunicipalities || '',
              customerPhone: firstItem?.customerPhone || '',
              appraisalId: firstItem?.appraisalId
            });
          } else {
            fetchAppraisalData();
          }
        })
        .catch((error) => {
          handleErrors(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [userId, getShops]);

  const fetchAppraisalData = useCallback(() => {
    setIsLoading(true);
    getAppraisal(Number(userId))
      .unwrap()
      .then((data: any) => {
        if (data?.appraisalId) {
          localStorage.setItem('appraisalid', String(data?.appraisalId));
        }
        setShopsData({
          customerName: data?.customerName || '',
          companyName: data?.companyName || '',
          customerEmail: data?.customerEmail || '',
          customerPostNumber: data?.customerPostNumber || '',
          customerPrefecture: data?.customerPrefecture || '',
          customerMunicipalities: data?.customerMunicipalities || '',
          customerPhone: data?.customerPhone || '',
          appraisalId: data?.appraisalId
        });
      })
      .catch((error) => {
        handleErrors(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [getAppraisal, userId]);

  if (isGetError) {
    handleErrors(getError);
  }

  if (isGetError2) {
    handleErrors(getError2);
  }

  const renderMyPageContent = () => (
    <>
      <div className="bg-white  p-4 sm:p-6 rounded-xs shadow-md w-full max-w-[694px] font-bold text-[#333333] border border-gray-300 my-4">
        {isLoading ? (
          <div className="skeleton p-4 mb-2 rounded-md bg-gray-200" />
        ) : (
          <div className="divide-y divide-gray-200">
            <div className="grid grid-cols-3 py-3">
              <span className="text-[12px] sm:text-base">お名前</span>
              <span className="col-span-2 text-left text-[12px] sm:text-base">
                {shopsData?.customerName || '---'}
              </span>
            </div>
            <div className="grid grid-cols-3 py-3">
              <span className="text-[12px] sm:text-base">電話番号</span>
              <span className="col-span-2 text-left text-[12px] sm:text-base">
                {formatPhoneNumber(shopsData?.customerPhone)}
              </span>
            </div>
            <div className="grid grid-cols-3 py-3">
              <span className="text-[12px] sm:text-base">メールアドレス</span>
              <span className="col-span-2 text-left text-[12px] sm:text-base truncate hover:text-clip">
                {shopsData?.customerEmail || '---'}
              </span>
            </div>
            <div className="grid grid-cols-3 py-3">
              <span className="text-[12px] sm:text-base">郵便番号</span>
              <span className="col-span-2 text-left text-[12px] sm:text-base">
                 {`〒${formatPostalCode(shopsData?.customerPostNumber)}`}
              </span>
            </div>
            <div className="grid grid-cols-3 py-3">
              <span className="text-[12px] sm:text-base">都道府県</span>
              <span className="col-span-2 text-left text-[12px] sm:text-base">
                {shopsData?.customerPrefecture || '---'}
              </span>
            </div>
            <div className="grid grid-cols-3 py-3">
              <span className="text-[12px] sm:text-base">市区町村</span>
              <span className="col-span-2 text-left text-[12px] sm:text-base">
                {shopsData?.customerMunicipalities || '---'}
              </span>
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-center mt-[50px] mb-[30px]">
        <h1 className="text-xl lg:text-2xl font-semibold text-[#597C95]">
          査定結果・車両の追加情報
        </h1>
      </div>

      <div className="md:mt-10">
        <div className="hidden md:block">
          <TabButtons activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <div className="block md:hidden">
          <MobileButtons activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>


        <div className="bg-base-100 border-base-300 ">
          <div role="tabpanel" className={`tab-content ${activeTab === 0 ? 'block' : 'hidden'}`}>
            {isLoading ? <Loader /> : <MatchingStoreLayout data={shopListData} />}
          </div>
          <div role="tabpanel" className={`tab-content ${activeTab === 1 ? 'block' : 'hidden'}`}>
            <AssessmentRequestInformationLayout />
          </div>
          <div role="tabpanel" className={`tab-content ${activeTab === 2 ? 'block' : 'hidden'}`}>
            <AdditionalInformationLayout userId={userId} />
          </div>
        </div>
      </div>
    </>
  );

  const topTabItems = [
    {
      key: '1',
      label: 'マイページ',
      children: renderMyPageContent()
    },
    {
      key: '2',
      label: '販売',
      children: <SaleLayout />
    },
    {
      key: '3',
      label: 'お知らせ',
      children: <NoticesLayout />
    }
  ];

  return (
    <MainWrapperLayout background="!pb-10">
      <Tabs activeKey={activeTopTab} onChange={setActiveTopTab} items={topTabItems} />
    </MainWrapperLayout>
  );
};

export default UserDashboardPage;
