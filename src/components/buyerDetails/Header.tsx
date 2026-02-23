import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useGetInvoicesByYearAndMonthQuery } from '@/src/app/services/shops';

const Header = ({ merchantId }: { merchantId: number | null | undefined }) => {
  const [selectedYear, setSelectedYear] = useState(moment().year());
  const [selectedMonth, setSelectedMonth] = useState(moment().month() + 1);

  const years = Array.from({ length: 6 }, (_, index) => moment().year() - index);
  const months = moment.months();

  const isValidMerchantId = typeof merchantId === 'number' && merchantId > 0;

  const { data, isLoading, error, isFetching } = useGetInvoicesByYearAndMonthQuery(
    { id: isValidMerchantId ? merchantId : 0, year: selectedYear, month: selectedMonth },
    {
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
      refetchOnFocus: true,
      skip: !isValidMerchantId
    }
  );

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(e.target.value);
    setSelectedYear(newYear);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = parseInt(e.target.value);
    setSelectedMonth(newMonth);
  };

  const extractedAmount = data && data.length > 0 ? data[0].amount : 0;

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
        <h2 className="text-xl font-bold mb-2 sm:mb-0">プロフィール</h2>
        {/* <div className="flex items-center space-x-2">
          <select
            className="border border-gray-300 rounded-md p-1"
            value={selectedYear}
            onChange={handleYearChange}>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}年
              </option>
            ))}
          </select>
          <select
            className="border border-gray-300 rounded-md p-1"
            value={selectedMonth}
            onChange={handleMonthChange}>
            {months.map((month, index) => (
              <option key={month} value={index + 1}>
                {index + 1}月
              </option>
            ))}
          </select>
          <span className="text-sm whitespace-nowrap">
            総買取金額合計：
            {!isValidMerchantId ? (
              <span className="font-bold text-xl">...</span>
            ) : isLoading || isFetching ? (
              <span className="font-bold text-xl">...</span>
            ) : error ? (
              <span className="font-bold text-xl text-red-500">
                エラー: {(error as any)?.message || 'Unknown error'}
              </span>
            ) : (
              <span className="font-bold text-xl">{extractedAmount.toLocaleString()}</span>
            )}
            万円4
          </span>
        </div> */}
      </div>
      <div className="border-t border-gray-700 shadow-sm w-full mb-6"></div>
    </>
  );
};

export default Header;
