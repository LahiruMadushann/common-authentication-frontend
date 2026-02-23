import { Radio as AntRadio, ConfigProvider } from 'antd';
import { RadioProps as AntRadioProps } from 'antd/es/radio';

interface CustomRadioProps extends Omit<AntRadioProps, 'options'> {
  optionType?: 'default' | 'button';
  options?: Array<{ label: string; value: string | number }>;
  buttonStyle?: any;
  size?: any;
}

export const Radio: React.FC<CustomRadioProps> = ({
  optionType = 'default',
  options,
  buttonStyle,
  size,
  onChange,
  ...props
}) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#3f51b5'
        },
        components: {
          Radio: {
            buttonCheckedBg: '#3f51b5',
            buttonBg: '#3f51b5',
            buttonColor: '#fff'
          }
        }
      }}>
      <div className="mb-4">
        <AntRadio.Group
          options={options}
          optionType={optionType}
          buttonStyle={buttonStyle}
          size={size}
          onChange={onChange}
          {...props}
        />
      </div>
    </ConfigProvider>
  );
};
