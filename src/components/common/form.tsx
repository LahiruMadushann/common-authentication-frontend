import { Form as AntdForm, FormProps as AntdFormProps } from 'antd';
import { useForm, FormInstance } from 'antd/es/form/Form';
import { useEffect, ReactNode } from 'react';

interface CustomFormProps extends AntdFormProps {
  children: ReactNode;
  onFinish?: (values: any) => Promise<void> | void;
  onFinishFailed?: (errorInfo: any) => void;
  onReset?: () => void;
  initialValues?: Record<string, any>;
  className?: string;
  form?: FormInstance;
  resetForm?: boolean;
}

export const Form: React.FC<CustomFormProps> = ({
  children,
  onFinish,
  onFinishFailed,
  onReset,
  initialValues,
  className,
  form,
  resetForm = false,
  ...rest
}) => {
  const [myform] = useForm();

  useEffect(() => {
    if (initialValues) {
      myform.setFieldsValue(initialValues);
    }
  }, [initialValues, myform]);

  return (
    <AntdForm
      form={form || myform}
      onFinish={async (values) => {
        if (onFinish) {
          await onFinish(values);
        }
        if (resetForm) {
          (form || myform).resetFields();
        }
      }}
      onFinishFailed={(errorInfo) => {
        if (onFinishFailed) {
          onFinishFailed(errorInfo);
        }
        if (resetForm) {
          (form || myform).resetFields();
        }
      }}
      className={className}
      initialValues={initialValues}
      {...rest}>
      {children}
    </AntdForm>
  );
};
