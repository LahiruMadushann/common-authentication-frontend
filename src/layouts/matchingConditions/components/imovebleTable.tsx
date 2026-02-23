import { useEffect } from 'react';
import { Switch } from '@/src/components/common/switch';
import { Table } from '@/src/components/common/table';

const initialData = [
  { accident: 'なし', permision: '走行可', key: '1' },
  { accident: 'なし', permision: '走行不可', key: '2' },
  { accident: 'あり(修復済)', permision: '走行可', key: '3' },
  { accident: 'あり(修復済)', permision: '走行不可', key: '4' },
  { accident: 'あり(未修理)', permision: '走行可', key: '5' },
  { accident: 'あり(未修理)', permision: '走行不可', key: '6' },
  { accident: '不明', permision: '走行可', key: '7' },
  { accident: '不明', permision: '走行不可', key: '8' }
];

export const AccidentDamageTable = (props: any) => {
  const { immovableOkPattern, setImmovableOkPattern, initialState } = props;

  useEffect(() => {
    setImmovableOkPattern(initialState);
  }, [initialState]);

  const handleSwitchChange = (checked: any, record: any) => {
    const newPattern = checked
      ? [...immovableOkPattern, { accidentHistory: record?.accident, runnable: record?.permision }]
      : immovableOkPattern?.filter(
          (item: any) =>
            item?.accidentHistory !== record?.accident || item?.runnable !== record?.permision
        );

    setImmovableOkPattern(newPattern);
  };

  const columns = [
    { title: '事故歴・修復歴', dataIndex: 'accident', key: 'accident', width: 200 },
    { title: '走行可否', dataIndex: 'permision', key: 'permision', width: 200 },
    {
      title: 'マッチング有無',
      dataIndex: 'include',
      width: 150,
      key: 'include',
      render: (_: any, record: any) => (
        <div className=" w-full flex items-center justify-center">
          <Switch
            checked={immovableOkPattern?.some(
              (item: any) =>
                item?.accidentHistory === record?.accident && item?.runnable === record?.permision
            )}
            onChange={(checked: any) => handleSwitchChange(checked, record)}
          />
        </div>
      )
    }
  ];

  return (
    <Table
      className="custom-table w-full md:!w-3/4 !font-light border border-[#597b94]"
      dataSource={initialData}
      columns={columns}
      pagination={false}
    />
  );
};
