import React, { ReactNode } from 'react';
import AntRow, { RowProps as AntRowProps } from 'antd/es/row';
import AntCol, { ColProps as AntColProps } from 'antd/es/col';

interface CustomRowProps extends AntRowProps {
  gutter?: [number, number] | number | any;
  wrap?: boolean;
  children: ReactNode;
}

interface CustomColProps extends AntColProps {
  span?: number;
  children: ReactNode;
}

export const Row: React.FC<CustomRowProps> = ({
  gutter = [16, 16],
  wrap = true,
  children,
  ...props
}) => {
  return (
    <AntRow gutter={gutter} wrap={wrap} {...props}>
      {children}
    </AntRow>
  );
};

export const Col: React.FC<CustomColProps> = ({ span, children, ...props }) => {
  return (
    <AntCol span={span} {...props}>
      {children}
    </AntCol>
  );
};
