import { useLazyGetAppraisalQuery } from '@/src/app/services/appraisal';
import {
  useLazyGetShopDetailsQuery,
  useLazyGetShopsQuery,
  useLazyGetStoreDetailsQuery,
  useUploadCsvMutation
} from '@/src/app/services/shops';
import Header from '@/src/components/buyerDetails/Header';
import ShopListControls from '@/src/components/buyerDetails/ShopListControls';
import StoreInfo from '@/src/components/buyerDetails/StoreInfo';
import StoreTable from '@/src/components/buyerDetails/StoreTable';
import { useScrollToTopOnNavigate } from '@/src/hooks/useScrollTop';
import { RootState } from '@/src/pages/login/store';
import { useAppStore } from '@/src/stores/app.store';
import { AppraisalRequestInformation } from '@/src/types/appraisal';
import { handleErrors } from '@/src/utils/handleErrors';
import { TablePaginationConfig } from 'antd';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

const StoreInfoLayout = () => {
  const [getStores, { isError: isGetError3, error: getError3 }] = useLazyGetStoreDetailsQuery();
  const [getMerchant, { isError: isGetError4, error: getError4 }] = useLazyGetShopDetailsQuery();
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadCsv] = useUploadCsvMutation();
  const [shopsData, setShopsData] = useState<AppraisalRequestInformation | null>(null);
  const [data, setData] = useState<AppraisalRequestInformation>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const userId = useSelector((state: RootState) => state.auth?.userId ?? null);
  const [shopListData, setShopListData] = useState<any[]>([]);
  const [storeData, setStoreData] = useState<any[]>([]);
  const [headBranchId, setHeadBranchId] = useState<number | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [merchnatData, setMerchnatData] = useState<any[]>([]);
  const [merchnatId, setMerchnatId] = useState<number>();
  const [tableReload, setTableReload] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { checkFetch } = useAppStore();
  const [shopId, setshopId] = useState<any>();
  const isFirstRender = useRef(true);
  const [hasFetchedMerchantData, setHasFetchedMerchantData] = useState(false);
  useScrollToTopOnNavigate();

  const handleCsvTemplateDownload = () => {
    const csvUrl =
      'https://ctn-uploads.s3.ap-northeast-1.amazonaws.com/csv-templates/merchant_data_import.csv';

    fetch(csvUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'merchant_data_import.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => console.error('Error downloading CSV template:', error));
  };

  const fetchStoreData = useCallback((search = '', page = currentPage, size = pageSize, id = headBranchId) => {
    setIsLoading(true);
    getStores({ 
      search, 
      page, 
      size,
      shopId: id 
    })
      .unwrap()
      .then((data: any) => {
        setStoreData(data);
        setCurrentPage(data.number);
        setPageSize(data.size);
        
        if (!headBranchId && data?.content && data.content.length > 0) {
          const headBranch = data.content.find(
            (store: any) => store.shopTypeEnum === 'HEAD_BRANCH'
          );
          if (headBranch) {
            setHeadBranchId(headBranch.id);
            setshopId(headBranch.id);
          } else {
          const firstStore = data.content[0];
          setHeadBranchId(firstStore.id);
          setshopId(firstStore.id);
        }
        }
      })
      .catch(handleErrors)
      .finally(() => setIsLoading(false));
  }, [getStores]); 

  const handleSearch = useCallback(
    (term: string, page: number = 0, size: number = pageSize) => {
      setSearchTerm(term);
      fetchStoreData(term, page, size);
    },
    [fetchStoreData] 
  );

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      fetchStoreData('', 0, pageSize);
    } else if (tableReload || checkFetch) {
      fetchStoreData(searchTerm);
    }
  }, [fetchStoreData, tableReload, checkFetch]);

  const handleCsvUpload = async () => {
    if (
      fileInputRef.current &&
      fileInputRef.current.files &&
      fileInputRef.current.files.length > 0
    ) {
      const file = fileInputRef.current.files[0];
      const formData = new FormData();
      formData.append('shopId', shopId);
      formData.append('file', file);
      formData.append('threads', '10');
      formData.append('maxRecords', '50');

      try {
        const response = await uploadCsv(formData).unwrap();
        setTableReload(prev => !prev); 
        return { success: true, statusCode: 200, data: response };
      } catch (error: any) {
        if (error.status === 400) {
          const errorMessage = error.data?.message || 'Bad Request';
          return { success: false, statusCode: 400, message: errorMessage };
        } else if (error.status === 403) {
          return {
            success: false,
            statusCode: 403,
            message: 'You are not authorized to upload to this shop'
          };
        } else {
          return {
            success: false,
            statusCode: error.status || 500,
            message: error.data?.message || 'An error occurred'
          };
        }
      }
    } else {
      return { success: false, statusCode: 400, message: 'No file selected' };
    }
  };

  useEffect(() => {
    const fetchMerchantData = async () => {
      if (shopId) {
        setIsLoading(true);
        try {
          const data: any = await getMerchant(shopId).unwrap();
          setShopListData(data);
          setMerchnatId(data?.id);
          setData(data);

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

          setMerchnatData(data);
          setHasFetchedMerchantData(true);
        } catch (error) {
          handleErrors(error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchMerchantData();
  }, [shopId, getMerchant,tableReload, checkFetch]);
  
  useEffect(() => {
  if (tableReload) {
    setHasFetchedMerchantData(false);
  }
}, [tableReload]);

  const isMerchantFetching = isLoading || !hasFetchedMerchantData;

  if (isGetError3) {
    handleErrors(getError3);
  }

  if (isGetError4) {
    handleErrors(getError4);
  }

  const dayNames: { [key: string]: string } = {
    SUNDAY: '日曜日',
    MONDAY: '月曜日',
    TUESDAY: '火曜日',
    WEDNESDAY: '水曜日',
    THURSDAY: '木曜日',
    FRIDAY: '金曜日',
    SATURDAY: '土曜日'
  };

  interface Holiday {
    week: string | number | null;
    day: keyof typeof dayNames | null;
  }

  const formatShopHolidays = (shops: any): string => {
    if (!shops?.shopHolidays || shops?.shopHolidays.length === 0) {
      return '--';
    }
    return shops?.shopHolidays
      .map((holiday: Holiday) => {
        const week = holiday?.week ?? '--';
        const dayName = holiday?.day ? dayNames[holiday.day] : '--';

        if (!week || !dayName) {
          return '-';
        }
        return `第${week}${dayName}`;
      })
      .join(', ');
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    const { current, pageSize } = pagination;
    handleSearch(searchTerm, (current || 1) - 1, pageSize);
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <Header merchantId={merchnatId} />
      <StoreInfo data={data} formatShopHolidays={formatShopHolidays} isLoading={isMerchantFetching} />
      <ShopListControls
        handleCsvTemplateDownload={handleCsvTemplateDownload}
        handleCsvUpload={handleCsvUpload}
        fileInputRef={fileInputRef}
        uploadStatus={uploadStatus}
        setUploadStatus={setUploadStatus}
        onSearch={handleSearch}
        storeData={storeData}
        merchnatData={merchnatData}
      />
      <div className="sm:w-[75%] w-[100%]">
        <StoreTable
          isLoading={isLoading}
          storeData={storeData}
          merchnatData={merchnatData}
          onTableChange={handleTableChange}
        />
      </div>
    </div>
  );
};

export default StoreInfoLayout;