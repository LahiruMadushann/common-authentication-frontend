import React from 'react';
import { Select as AntSelect, SelectProps as AntSelectProps, ConfigProvider } from 'antd';

interface CustomSelectProps extends AntSelectProps {
  label?: string;
  error?: string | boolean;
  fullWidth?: boolean;
  type?: 'outlined' | 'filled';
  disable?: boolean;
}

export const Select: React.FC<CustomSelectProps> = ({
  allowClear = false,
  autoClearSearchValue = true,
  listHeight = 256,
  placement = 'bottomLeft',
  type = 'outlined',
  fullWidth = true,
  options,
  disable,
  label,
  error,
  className,
  ...props
}) => {
  const filterOption: AntSelectProps['filterOption'] = (input, option) =>
    (option?.label?.toString() ?? '').toLowerCase().includes(input.toLowerCase());

  return (
    <ConfigProvider
      theme={{
        components: {
          Select: {
            optionSelectedBg: 'var(--color-primary-light)',
            colorBgContainer: '#fff9c5'
          }
        }
      }}>
      <div className="w-full flex items-center gap-2">
        {label && (
          <label
            htmlFor={props.id}
            className="text-sm block font-semibold py-4 px-2 m-0 !bg-[#587c94] border-b-[1px] border-white text-white min-w-[7rem]">
            {label}
          </label>
        )}
        <AntSelect
          allowClear={allowClear}
          options={options}
          autoClearSearchValue={autoClearSearchValue}
          filterOption={filterOption}
          listHeight={listHeight}
          placement={placement}
          className={`${fullWidth ? 'w-full' : ''} no-outline disabled:!text-black ${className}`}
          {...props}
          disabled={disable}
        />
      </div>
      {error && (
        <h3 className="pl-28 text-red-600">
          {typeof error === 'string' ? error : 'Cannot be empty'}
        </h3>
      )}
    </ConfigProvider>
  );
};
