import React, { useEffect, useState } from 'react';
import { useLazyGetShopDetailsQuery, useLazyGetStoreDetailsQuery } from '../app/services/shops';
import { AppraisalRequestInformation } from '../types/appraisal';
import ParseJwt from '../pages/login/ParseJwt';

export const useGetAllStores = (shouldFetch?: boolean) => {
  const [getStores] = useLazyGetStoreDetailsQuery();
  const [getMerchant] = useLazyGetShopDetailsQuery();
  const [shopId, setshopId] = useState<any>();
  const [merchnatData, setMerchnatData] = useState<any[]>([]);
  const [headBranchId, setHeadBranchId] = useState<number | undefined>();
  const [shopsData, setShopsData] = useState<AppraisalRequestInformation | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [storeData, setStoreData] = useState<any[]>([]);
  const [hasFetchedMerchantData, setHasFetchedMerchantData] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [shopListData, setShopListData] = useState<any[]>([]);
  const [merchnatId, setMerchnatId] = useState<number>();

  const token = localStorage.getItem('token');
  const decodedToken = ParseJwt(token);
  const userRole = decodedToken?.role;

  useEffect(() => {
    if (userRole === 'ROLE_USER' || userRole === 'USER') {
      getStores({ search: '', page: currentPage, size: pageSize })
        .unwrap()
        .then((data: any) => {
          // const headBranchStore = data?.content.find(
          //   (store: any) => store.shopTypeEnum === 'HEAD_BRANCH'
          // );
          // const subBranchStore = data?.content.find(
          //   (store: any) => store.shopTypeEnum === 'SUB_BRANCH'
          // );
          // if (headBranchStore) {
          //   setshopId(headBranchStore?.id);
          // } else if (subBranchStore) {
          //   setshopId(subBranchStore?.id);
          // }
          setStoreData(data);
          setCurrentPage(data.number);
          setPageSize(data.size);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => { });
    }
  }, [getStores]);

  useEffect(() => {
    const fetchMerchantData = async () => {
      if (headBranchId) {
        setIsLoading(true);
        try {
          const data: any = await getMerchant(headBranchId).unwrap();
          setShopListData(data);
          setMerchnatData(data);
          setHasFetchedMerchantData(true);
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchMerchantData();
  }, [headBranchId]);

  return { merchnatId, shopId };
};
