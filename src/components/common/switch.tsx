import { ConfigProvider } from "antd";
import AntdSwitch from "antd/es/switch"

export const Switch = (props : any) => {
  return (
    <ConfigProvider
      theme={{
        token: {
            colorPrimary: "#2acc42"
        },
      }}
    >
      <AntdSwitch  checked={props.checked} onChange={props.onChange} /> 
    </ConfigProvider>
  );
};
