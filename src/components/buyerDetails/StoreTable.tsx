import React, { useState } from 'react';
import { Table, Button, Space } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { useTabStore } from '@/src/stores/tabStore';
import { useAppStore } from '@/src/stores/app.store';
import { useBuyerStore } from '@/src/stores/buyer.store';
import { deleteShop } from '@/src/services/shop.service';
import { setCustomErrorToast, setSuccessToast } from '@/src/utils/notification';

interface Store {
  id: number;
  companyName: string;
  name: string;
  shopTypeEnum: string;
}

interface StoreDataResponse {
  content: Store[];
  pageable: {
    page: number;
    size: number;
    sort: {
      orders: any[];
    };
  };
  total: number;
}

interface StoreTableProps {
  isLoading: boolean;
  storeData: StoreDataResponse | null | undefined | any;
  merchnatData: any;
  onTableChange: (pagination: TablePaginationConfig) => void;
}

const StoreTable: React.FC<StoreTableProps> = ({
  isLoading,
  storeData,
  merchnatData,
  onTableChange
}) => {
  const { setTabKeyAction } = useTabStore();
  const {
    setEditRegisterId,
    setEditRegisterFormStatus,
    setEditExistingFile,
    setFetchShopType,
    checkFetch,
    setCheckFetch
  } = useAppStore();
  const { setStroeTypeDisbale, setHeadBranchId } = useBuyerStore();
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const urlParams = new URLSearchParams(window.location.search);
  const tableData = storeData?.content?.filter(
    (item: Store) => item.shopTypeEnum !== 'HEAD_BRANCH'
  );
  const columns: ColumnsType<Store> = [
    {
      title: '店舗ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '会社名',
      dataIndex: 'companyName',
      key: 'companyName',
      render: (text) => text || 'N/A'
    },
    {
      title: '店名',
      dataIndex: 'name',
      key: 'name',
      render: (text) => text || 'N/A'
    },
    {
      title: '組織区分',
      dataIndex: 'shopTypeEnum',
      key: 'shopTypeEnum',
      render: (text) => {
        switch (text) {
          case 'HEAD_BRANCH':
            return '本社';
          case 'SUB_BRANCH':
            return '支店';
          default:
            return text || 'N/A';
        }
      }
    },
    {
      title: '',
      key: 'action',
      render: (_, record) => (
        <Space size="small" direction="horizontal" className="flex justify-center items-center w-full">
          <Button
            className="bg-gray-200 border border-gray-400 text-gray-900 px-4 py-2 rounded-md"
            onClick={() => {
              setTabKeyAction('7');
              setEditRegisterId(record?.id?.toString());
              setEditRegisterFormStatus(true);
              setEditExistingFile(false);
              setStroeTypeDisbale(true);
              setHeadBranchId(record?.id?.toString());
            }}>
            編集
          </Button>
          <Button
            onClick={() => {
              setIsOpenDelete(true);
              setDeleteId(record?.id?.toString());
            }}
            className="bg-gray-600 border border-gray-800 text-white px-4 py-2 rounded-md">
            削除
          </Button>
          {/* <Button
            className="border  border-blue-700 text-blue-800 rounded-md px-4 py-2"
            onClick={() => {
              setTabKeyAction('6');
              setEditRegisterId(record?.id.toString());
              setFetchShopType('');
            }}>
            マッチング条件
          </Button> */}
        </Space>
      )
    }
  ];

  const handleShopDelete = async (id: string) => {
    try {
      const response = await deleteShop(id);
      setSuccessToast('削除が完了しました');
      setIsOpenDelete(false);
      setCheckFetch(!checkFetch);
    } catch (error: any) {
      setCustomErrorToast(error?.message);
      setIsOpenDelete(false);
    }
  };

  return (
    <>
      {merchnatData && merchnatData.shopTypeEnum === 'HEAD_BRANCH' ? (
        <div className="w-full overflow-x-auto">
          <Table
            columns={columns}
            dataSource={tableData}
            rowKey="id"
            loading={isLoading}
            pagination={{
              current: (storeData?.pageable.page || 0) + 1,
              pageSize: storeData?.pageable.size || 10,
              total:storeData?.pageable.page==0 ? storeData?.total : storeData?.total - 1,
              showSizeChanger: false,
              showQuickJumper: false,
              showTotal: (total, range) => `${range[0]}-${range[1]} の ${total} アイテム`
            }}
            onChange={onTableChange}
            locale={{
              emptyText: 'No data available'
            }}
            scroll={{ x: true }} // Enables horizontal scroll
            className="custom-table w-full"
          />
        </div>
      ) : null}
      {isOpenDelete && (
        <div className=" w-screen h-screen fixed bg-trnasparent backdrop-blur-sm top-0 left-0 z-[80]">
          <div className=" w-full h-full flex items-center justify-center ">
            <div className=" bg-white flex flex-col items-center justify-center gap-4 w-4/12 h-[20vh] p-4 shadow-sm shadow-[#002b5c] border-[#002b5c] ">
              <h1>本当に削除しますか？ </h1>
              <div className=" flex items-center gap-4">
                <Button
                  onClick={() => {
                    setIsOpenDelete(false);
                  }}>
                  いいえ
                </Button>
                <Button
                  onClick={() => {
                    handleShopDelete(deleteId);
                  }}>
                  はい
                </Button>
              </div>
            </div>

            <div></div>
          </div>
        </div>
      )}
    </>
  );
};
export default StoreTable;
