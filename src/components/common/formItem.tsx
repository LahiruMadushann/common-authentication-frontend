import React, { ReactNode } from 'react';
import { Form, FormItemProps as AntFormItemProps } from 'antd';

const { Item } = Form;

interface CustomFormItemProps extends AntFormItemProps {
  colon?: boolean;
  fullWidth?: boolean;
  className?: string;
  children?: ReactNode;
}

export const FormItem: React.FC<CustomFormItemProps> = ({
  colon = false,
  fullWidth = false,
  className,
  children,
  ...props
}) => {
  return (
    <Item
      className={`${fullWidth ? 'flex-1 p-0 m-0' : ''} ${className || ''}`}
      colon={colon}
      {...props}>
      {children}
    </Item>
  );
};
