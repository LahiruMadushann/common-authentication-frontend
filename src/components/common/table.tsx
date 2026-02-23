import { ConfigProvider } from 'antd';
import AntdTable from 'antd/es/table';

export const Table = (props: any) => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            borderColor: '#597b94',
            headerBg: '#597b94', // Header background color
            headerColor: '#ffffff', // Header border color
            headerBorderRadius: 0 // Row border color,
          }
        }
      }}>
      <AntdTable
        dataSource={props.dataSource}
        columns={props.columns}
        pagination={false}
        className={props.className}
      />
    </ConfigProvider>
  );
};
