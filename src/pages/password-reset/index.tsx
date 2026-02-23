import React, { useState } from 'react';
import { Form, Input, Alert } from 'antd';
import { Button } from '@/components/ui/button';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useResetPasswordMutation } from '../../app/services/password';
import logo from '@/src/assets/logo-top.png';
import useBodyClass from '@/src/hooks/useBodyClass';

const PasswordResetView: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get('token');
  const userIdFromUrl = searchParams.get('userId');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | undefined>(undefined);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setMessage('');
    setMessageType(undefined);

    if (formData.password !== formData.confirmPassword) {
      setMessage('パスワードが一致しません。!');
      setMessageType('error');
      return;
    }

    const requestData = {
      token: tokenFromUrl || '',
      userId: userIdFromUrl || '',
      password: formData.password
    };

    try {
      await resetPassword(requestData).unwrap();
      setMessage('パスワードのリセットに成功しました。');
      setMessageType('success');
      navigate('/login', { state: { showMessage: true } });
    } catch (error: any) {
      if (error.status === 401) {
        setMessage('無効なトークンです。');
        setMessageType('error');
      } else {
        setMessage('エラーが発生しました。もう一度お試しください。');
        setMessageType('error');
      }
    }
  };
  
  return (
    <div className="login-page flex justify-center items-center h-screen bg-white">
      <div className="w-[350px] shadow-lg rounded-lg p-6">
        <div className="mb-6 ">
          <img src={logo} alt="CTN Logo" className="w-24 h-12" />
        </div>
        <h2 className="text-lg font-bold text-center mb-4">パスワード設定</h2>
        <Form layout="vertical" onFinish={handleSubmit} initialValues={formData}>
          <Form.Item
            label="新しいパスワード"
            name="password"
            rules={[{ required: true, message: '新しいパスワードを入力してください' }]}>
            <Input.Password
              placeholder="新しいパスワード"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="border-gray-300 rounded-md p-2 focus:border-blue-500 focus:outline-none transition-all"
            />
          </Form.Item>
          <Form.Item
            label="パスワードを再入力"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('2つのパスワードが一致しません!'));
                }
              })
            ]}>
            <Input.Password
              placeholder="パスワードを再入力"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="border-gray-300 rounded-md p-2 focus:border-blue-500 focus:outline-none transition-all"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white p-2 rounded-lg font-bold">
              {isLoading ? 'リセットしています...' : 'パスワードを設定する'}
            </Button>
          </Form.Item>
        </Form>

        {message && <Alert message={message} type={messageType} showIcon className="mt-4" />}

        <div className="text-center mt-2">
          <a href="/login" className="text-blue-500 text-xs hover:underline">
            ログインページに戻る
          </a>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetView;
