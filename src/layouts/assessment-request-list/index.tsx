import { useEffect, useState } from 'react';
import { useLazyGetUserInvoicesQuery } from '@/src/app/services/invoice';
import AssessmentRequestTable from './table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { TableLoadingSkeleton } from '@/src/components/loading-screens';
import { handleErrors } from '@/src/utils/handleErrors';

function AssessmentRequestListLayout() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear.toString());
  const [fetchGetUserInvoices, { data, isLoading, isError, error }] = useLazyGetUserInvoicesQuery();

  const years = Array.from({ length: currentYear - 2023 + 1 }, (_, index) => 2023 + index);

  useEffect(() => {
    fetchGetUserInvoices(year);
  }, [year]);

  const onSelectYear = (value: string) => {
    setYear(value);
  };

  if (isError) {
    handleErrors(error);
  }
  return (
    <div>
      <div className="mb-10">
        <Select onValueChange={onSelectYear} defaultValue={year}>
          <SelectTrigger className="w-[180px]" value={year}>
            <SelectValue placeholder="年を選択" />
          </SelectTrigger>
          <SelectContent>
            {years.map((yr) => (
              <SelectItem key={yr} value={String(yr)}>
                {yr}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {isLoading  ? (
        <>
          <TableLoadingSkeleton />
        </>
      ) : (
        <AssessmentRequestTable data={data ? data : []} />
      )}
    </div>
  );
}

export default AssessmentRequestListLayout;
