import {
  useGetUserShopInvoicesQuery,
  useLazyGetUserShopInvoicesQuery
} from '@/src/app/services/invoice';
import BillingDetailsTable from './table';
import { TableLoadingSkeleton } from '@/src/components/loading-screens';
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { handleErrors } from '@/src/utils/handleErrors';

function BillingDetailsListLayout() {
  const { shopId } = useParams();
  const { state } = useLocation();
  const [fetchUserShopInvoices, { data, isLoading, isError, error }] =
    useLazyGetUserShopInvoicesQuery();

  const [year, setYear] = useState(() => state?.year || localStorage.getItem('year') || '');
  const [month, setMonth] = useState(() => state?.month || localStorage.getItem('month') || '');
  const [japaneseMonth, setJapaneseMonth] = useState(
    () => state?.japaneeseMonth || localStorage.getItem('japaneeseMonth') || ''
  );

  useEffect(() => {
    if (state?.year && state?.month) {
      localStorage.setItem('year', state.year);
      localStorage.setItem('month', state.month);
      localStorage.setItem('japaneeseMonth', state.japaneeseMonth || '');
    }
  }, [state, year, month]);

  useEffect(() => {
    if (shopId && year && month) {
      const requestData = {
        year,
        month,
        shopId
      };
      fetchUserShopInvoices(requestData);
    }
  }, [shopId, year, month, fetchUserShopInvoices]);

  if (isError) {
    handleErrors(error);
  }

  return (
    <div className={data && data?.length > 5 ? ' ' : 'md:min-h-[400px] lg:min-h-[300px]'}>
      <div className="mb-10">{japaneseMonth && japaneseMonth} ご紹介査定一覧</div>
      {!isLoading && data ? (
        <BillingDetailsTable data={data ? data : []} />
      ) : (
        <TableLoadingSkeleton />
      )}
    </div>
  );
}

export default BillingDetailsListLayout;
