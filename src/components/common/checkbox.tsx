import AntCheckbox from 'antd/es/checkbox';
import { CheckboxProps as AntCheckboxProps, CheckboxChangeEvent } from 'antd/es/checkbox';
import React from 'react';

// Define the types for Checkbox component props
interface CheckboxProps extends Omit<AntCheckboxProps, 'onChange'> {
  type?: 'single' | 'group';
  label?: string;
  value?: any
  onChange: (checked: any) => void;
  typeCheck?: boolean;
  options?: { label: string; value: string | number }[];
  defaultValue?: (string | number)[];
}

export const Checkbox: React.FC<CheckboxProps> = ({ type = 'single', value, ...props }) => {
  if (type === 'group') {
    const groupProps = props as CheckboxProps;
    return (
      <AntCheckbox.Group
        defaultValue={groupProps.defaultValue}
        options={groupProps.options}
        onChange={groupProps.onChange}
        value={groupProps.value}
      />
    );
  }

  const { label, onChange, typeCheck = true, ...restProps } = props;

  // The correct onChange handler for single checkboxes
  const handleCheckboxChange = (e: CheckboxChangeEvent) => {
    const checked = e.target.checked;
    onChange(checked);
  };

  return typeCheck ? (
    <AntCheckbox
      onChange={handleCheckboxChange} 
      value={value}
      className="text-[13px] sm:!text-[15px]"
      {...restProps}>
      {label}
    </AntCheckbox>
  ) : (
    <AntCheckbox
      onChange={handleCheckboxChange}
      value={value}
      className="text-[13px] sm:!text-[15px]"
      checked={value} 
      {...restProps}>
      {label}
    </AntCheckbox>
  );
};
