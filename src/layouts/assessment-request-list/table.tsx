import { useMemo, useRef, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Table } from '@/src/components';
import { Button } from '@/components/ui/button';
import { ModalComponent } from '@/src/components/modal';
import { useNavigate } from 'react-router-dom';

import 'jspdf-autotable';
import { InvoiceType } from '@/src/types/invoice.type';
import PdfGeneration from './pdf-generation';
import { Skeleton } from 'antd';

type AssessmentRequestTablePropsType = {
  data: InvoiceType[];
};

function AssessmentRequestTable(props: AssessmentRequestTablePropsType) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const selectedYear = useRef('');
  const selectedMonth = useRef('');
  const selectedShopId = useRef('');

  const isTableReady = useMemo(() => {
    return props?.data && props.data[0]?.paymentMethod !== undefined;
  }, [props.data]);

  const paymentDeadlineHeader = useMemo(() => {
    if (isTableReady) {
      return props.data[0].paymentMethod === 'BILLING' ? 'お支払い期限' : '引き落とし日';
    }
    return '';
  }, [isTableReady, props.data]);

  const openModal = () => {
    setIsOpen(true);
  };
  const onClose = () => {
    setIsOpen(false);
  };

  const onClickBilling = (id: number, year: number, month: number, japaneeseMonth: string) => {
    navigate(`/billing/${id}`, {
      state: { previousPage: '/', year, month, japaneeseMonth }
    });
  };

  // const onClickBuyerDetail = (id: number, year: number, month: number, japaneeseMonth: string) => {
  //   navigate(`/buyer/${id}`, {
  //     state: { previousPage: '/', year, month, japaneeseMonth}
  //   });
  // };

  const columns = useMemo<ColumnDef<InvoiceType>[]>(
    () => [
      {
        accessorKey: 'japaneeseMonth',
        cell: (info) => info.getValue(),
        header: '請求年月',
        footer: (props) => props.column.id
      },
      {
        accessorKey: 'totalNumberOfGuest',
        header: '当月紹介数',
        footer: (props) => props.column.id
      },
      {
        accessorKey: 'totalNumberRejectionInLastMonth',
        header: '前月却下件数',
        footer: (props) => props.column.id
      },
      {
        accessorKey: 'amount',
        header: 'ご請求金額',
        footer: (props) => props.column.id
      },
      {
        accessorKey: 'paymentDeadline',
        header: paymentDeadlineHeader,
        footer: (props) => props.column.id,
        cell: ({ row }) => <span>{row.original.deadLine ? row.original.deadLine : '_'}</span>
      },
      {
        accessorKey: 'Action',
        id: 'Action',
        header: '請求書',
        cell: ({ row }) => (
          <div className="flex">
            <div className="flex-1">
              <Button
                className="bg-ctn_secondary_color"
                onClick={() =>
                  onClickBilling(
                    row.original.id,
                    row.original.year,
                    row.original.month,
                    row.original.japaneeseMonth
                  )
                }
                
                disabled={row?.original?.billingStatus === 'BILLED' ? false : true}>
                請求詳細
              </Button>
            </div>
            <div className="flex-1 ml-2">
              <Button
                className="bg-ctn_secondary_color"
                onClick={() => {
                  selectedMonth.current = row.original.month.toString();
                  selectedYear.current = row.original.year.toString();
                  selectedShopId.current = row.original.id.toString();
                  openModal();
                }}
                disabled={row?.original?.billingStatus === 'BILLED' ? false : true}>
                請求書レビュー
              </Button>
            </div>
          </div>
        ),
        footer: (props) => props.column.id
      }
    ],
    [paymentDeadlineHeader]
  );



  return (
    <>
      <Table columns={columns} data={props.data}   noDataMessage="記録は見つかりませんでした"  />
      <ModalComponent title="" isOpen={isOpen} onClose={onClose} >
        <div className="invoice-modal">
          <PdfGeneration
            year={selectedYear.current}
            month={selectedMonth.current}
            shopId={selectedShopId.current}
          />
        </div>
      </ModalComponent>
    </>
  );
}

export default AssessmentRequestTable;
