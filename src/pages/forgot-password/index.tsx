import React, { useState, ChangeEvent } from 'react';
import { Form, Input, Alert } from 'antd';
import { useForgetPasswordMutation } from '../../app/services/password';
import logo from '@/src/assets/logo-top.png';
import { Button } from '@/components/ui/button';
import useBodyClass from '@/src/hooks/useBodyClass';

interface FormData {
  email: string;
}

const ForgetPasswordView: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ email: '' });
  const [forgetPassword, { isLoading }] = useForgetPasswordMutation();
  const [message, setMessage] = useState<React.ReactNode>('');
  const [messageType, setMessageType] = useState<'success' | 'error' | undefined>(undefined);
  const [butonDisable, setButonDisable] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setMessage('');
    setMessageType(undefined);

    const requestData = { email: formData.email };

    try {
      const result = await forgetPassword(requestData).unwrap();
      setButonDisable(true);
      setMessage('パスワードリセットリンクが送信されました。メールを確認してください。');
      setMessageType('success');
    } catch (error: any) {
      setButonDisable(false);
      if (error.data.message === 'Email does not exist') {
        setMessage(
          <>
            このメールアドレスは登録されていません。
            <br />
            現在この画面のログインに使用している
            <br />
            メールアドレスを入力してください。
          </>
        );
      } else {
        setMessage('エラーが発生しました。もう一度お試しください。');
      }
      setMessageType('error');
    }
  };

  return (
    <div className="login-page flex justify-center items-center h-screen bg-white">
      <div className="w-[350px] shadow-lg rounded-lg p-6">
        <div className="mb-6">
          <img src={logo} alt="CTN Logo" className="w-24 h-12" />
        </div>
        <h2 className="text-lg font-bold text-center mb-4">パスワードリセット</h2>
        <Form layout="vertical" onFinish={handleSubmit} initialValues={formData}>
          <Form.Item
            label="メールアドレス"
            name="email"
            rules={[{ required: true, message: 'メールアドレスを入力してください' }]}>
            <Input
              placeholder="メールアドレス"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border-gray-300 rounded-md p-2 focus:border-blue-500 focus:outline-none transition-all"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white p-2 rounded-lg font-bold"
              disabled={butonDisable}>
              {isLoading ? '送信しています...' : 'パスワードを設定する'}
            </Button>
          </Form.Item>
        </Form>

        {message && (
          <Alert message={message} type={messageType} showIcon className="mt-4 text-[12px] text-left" />
        )}

        <div className="text-center mt-2">
          <a href="/login" className="text-blue-500 text-xs hover:underline">
            ログインページに戻る
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgetPasswordView;
