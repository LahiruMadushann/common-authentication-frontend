import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Table } from '@/src/components';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

function MatchingStoreTable(props: any) {
  const { data } = props;
  const navigate = useNavigate();

  const onClickBilling = (shopId: number) => {
    navigate(`/user/${shopId}`, {
      state: { previousPage: '/user' }
    });
  };

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: 'shopId',
        header: 'ショップID',
        footer: (props) => props.column.id
      },
      {
        accessorKey: 'companyName',
        header: 'ショップ名',
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id
      },
      {
        accessorKey: 'carType',
        header: '車種',
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id
      },
      {
        accessorKey: 'carMaker',
        header: '自動車製造',
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id
      },
      {
        accessorKey: 'carModelYear',
        header: '年式',
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id
      },
      {
        accessorKey: 'Action',
        id: 'Action',
        header: '表示',
        cell: ({ row }) => (
          <div className="flex">
            <div className="flex-1">
              <Button
                className="bg-ctn_secondary_color"
                onClick={() => onClickBilling(row.original.shopId)}>
                ショップを見る
              </Button>
            </div>
          </div>
        ),
        footer: (props) => props.column.id
      }
    ],
    []
  );

  return <Table columns={columns} data={data} />;
}

export default MatchingStoreTable;
