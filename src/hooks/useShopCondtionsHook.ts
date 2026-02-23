import { useEffect, useState } from 'react';
import { useAppStore } from '../stores/app.store';
import { getShopConditionById } from '../services/shop.service';
import { setCustomErrorToast } from '../utils/notification';

export const useFetchShopConditonsByIdHook = (id: any, type: any, allowToFetch: any) => {
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [shopCondtions, setShopConditions] = useState<any>();
  const { editRegisterId } = useAppStore();

  const fetchShopCondtionById = async () => {
    try {
      setLoading(true);
      const response = await getShopConditionById(editRegisterId || id, type || '');
      setShopConditions(response);
      setLoading(false);
    } catch (error: any) {
      console.log(error);
      setCustomErrorToast('問題が発生しました');
      setError(error);
      setLoading(true);
    }
  };
  useEffect(() => {
    if ((editRegisterId || id) && allowToFetch) {
      fetchShopCondtionById();
    }
  }, [editRegisterId, id, type, allowToFetch]);

  return { shopCondtions, error, loading };
};
