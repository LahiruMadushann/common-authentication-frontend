import { useCallback, useEffect, useMemo, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Table } from '@/src/components';
import { AppraisalType } from '@/src/types/invoice.type';
import moment from 'moment'
import { Button } from '@/components/ui/button';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useGetSellerQuery } from '@/src/app/services/message';
import { skipToken } from '@reduxjs/toolkit/query';
import { useTypedSelector } from '@/src/app/store';
import { formatPostalCode } from '@/src/utils/formatPostalcode';
import { formatPhoneNumber } from '@/src/utils/formatPhoneNumber';

type BillingDetailsTablePropsType = {
  data: AppraisalType[];
};

function BillingDetailsTable(props: BillingDetailsTablePropsType) {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = useTypedSelector(state => state.auth.userId);
  const billId = useParams();
 
  const [appraisalId, setAppraisalId] = useState<number | null>(null);
  

  const { data: sellerId, isLoading, isError, error } = useGetSellerQuery(appraisalId ?? skipToken, {
    skip: appraisalId === null,
  });

  const onClickMessage = useCallback((newAppraisalId: number) => {
    setAppraisalId(newAppraisalId);
  }, []);

  const formatCarTraveledDistance = (value: string) => {
    if (value === "～900000000km") {
      return "210,000Km以上";
    }
    return value;
  };

  useEffect(() => {
    if (sellerId !== undefined && !isLoading && !isError) {
      navigate(`/message/${userId}/${sellerId}`, {
        state: { previousPage: `/billing/${billId?.shopId}` }
      });
    }
  }, [sellerId, isLoading, isError, navigate, userId]);

  const columns = useMemo<ColumnDef<AppraisalType>[]>(
    () => [
      {
        accessorKey: 'billingYearMonth',
        header: '紹介日',
        cell: ({ row } : {row : any}) => (
          <span>
            {row.original?.assessed?.emailSendTime
              ? moment(row.original?.assessed?.emailSendTime).format('L')
              : '_'}
          </span>
        )
      },
      {
        accessorKey: 'name',
        header: '氏名',
        cell: ({ row } : {row : any}) => (
          <span>{row.original?.customer?.name ? row.original?.customer?.name : '_'}</span>
        )
      },
      {
        accessorKey: 'address',
        header: '住所',
        cell: ({ row } : {row : any}) => (
          <span>
          {row.original.customer?.postalCode ? `〒${formatPostalCode(row.original.customer?.postalCode)} ` : ''}
          {row.original.customer?.prefecture ? ` ${row.original.customer?.prefecture}` : ''}
          {row.original.customer?.municipalities ? ` ${row.original.customer?.municipalities}` : ''}
          {row.original.customer?.address ? ` ${row.original.customer?.address}` : ''}
        </span>
        )
      },
      {
        accessorKey: 'phoneNumber',
        header: '電話番号',
        cell: ({ row } : {row : any}) => (
          <span>
            {row.original.customer?.phone?.content ? formatPhoneNumber(row.original.customer?.phone?.content) : '_'}
          </span>
        )
      },
      {
        accessorKey: 'email',
        header: 'メールアドレス',
        cell: ({ row } : {row : any}) => (
          <span>
            {row.original.customer?.email?.content ? row.original.customer?.email?.content : '_'}
          </span>
        )
      },
      {
        accessorKey: 'carModel',
        header: '車種',
        cell: ({ row } : {row : any}) => (
          <span>{row.original.car?.car_type ? row.original.car?.car_type : '_'}</span>
        )
      },
      {
        accessorKey: 'carGrade',
        header: 'グレード',
        cell: ({ row } : {row : any}) => <span>{row.original.car?.grade ? row.original.car?.grade : '_'}</span>
      },
      {
        accessorKey: 'year',
        header: '年式',
        cell: ({ row } : {row : any}) => (
          <span>{row.original.car?.car_model_year ? row.original.car?.car_model_year : '_'}</span>
        )
      },
      {
        accessorKey: 'distance',
        header: '距離',
        cell: ({ row } : {row : any}) => (
          <span>
            {row.original.car?.car_traveled_distance ? formatCarTraveledDistance(row.original.car?.car_traveled_distance) : '_'}
          </span>
        )
      },
      {
        accessorKey: 'body_color',
        header: 'ボディカラー',
         cell: ({ row } : {row : any}) => (
          <span>{row.original.car?.body_color ? row.original.car?.body_color : '_'}</span>
        )
      },
      {
        accessorKey: 'desire_date',
        header: '売却時期',
         cell: ({ row } : {row : any}) => (
          <span>{row.original.car?.desire_date ? row.original.car?.desire_date : '_'}</span>
        )
      },
      {
        accessorKey: 'loan',
        header: 'ローン残債',
        cell: ({ row } : {row : any}) => <span>{row.original.car?.loan ? row.original.car?.loan : '_'}</span>
      },
      {
        accessorKey: 'appraisalDate',
        header: '査定候補日',
        cell: ({ row } : {row : any}) => (
          <span>
            {row.original?.aDates[0]
              ?  moment(row.original?.aDates[0]).format('YYYY/MM/DD')
              : '要調整'}
          </span>
        )
      },
      // {
      //   accessorKey: 'Action',
      //   id: 'Action',
      //   header: '売り手へのメッセージ',
      //   cell: ({ row } : {row : any}) => (
    
      //         <Button
      //           className="bg-ctn_secondary_color"
      //           onClick={() =>
      //             onClickMessage(row.original.appraisalid.content)
      //           }>
      //           売り手へのメッセージ
      //         </Button>
            
      //   ),
      //   footer: (props : any) => props.column.id
      // },
    ],
    []
  );

  return (
    <>
      <Table columns={columns} data={props.data} isPagination={false}/>
    </>
  );
}

export default BillingDetailsTable;
