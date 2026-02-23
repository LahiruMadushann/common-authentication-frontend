import React from 'react';
import AntInput, { InputProps as AntInputProps } from 'antd/es/input';

interface CustomInputProps extends AntInputProps {
  label?: string;
  labelStyle?: string;
  id?: string;
}

export const Input: React.FC<CustomInputProps> = (props) => {
  return (
    <div className="w-full flex items-center gap-2">
      {props.label && (
        <label
          htmlFor={props.id}
          className={`text-sm block font-semibold py-4 px-2 !bg-[#587c94] border-b-[1px] border-white text-white min-w-[7rem] ${props.labelStyle}`}>
          {props.label}
        </label>
      )}
      <AntInput
        name={props.name}
        className={props.className}
        size={props.size}
        defaultValue={props.defaultValue}
        disabled={props.disabled}
        allowClear={props.allowClear}
        id={props.id}
        value={props.value}
        placeholder={props.placeholder}
        onChange={props.onChange}
        onPressEnter={props.onPressEnter}
        required={props.required}
      />
    </div>
  );
};
