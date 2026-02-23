import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import TextArea from 'antd/es/input/TextArea';
import { Modal } from 'antd';
import { useCreateImprovementRequestMutation, useGetImprovementRequestByIdQuery } from '@/src/app/services/improvementRequest';
import { improvementRequestPostModel } from '@/src/types/improvementRequestPostModel';
import { useTypedSelector } from '@/src/app/store';
import { formatPhoneNumber } from '@/src/utils/formatPhoneNumber';

const SystemImprovementLayout = () => {
  const [createImprovementRequest, { isLoading }] = useCreateImprovementRequestMutation();
  const userId = useTypedSelector((state) => state.auth.userId);
  const { data: existingRequest } = useGetImprovementRequestByIdQuery(
    userId as number,
    { skip: !userId }
  );
  const [emailValid, setEmailValid] = useState(false);
  const [phoneValid, setPhoneValid] = useState(false);
  const [alertState, setAlertState] = useState({
    visible: false,
    type: 'success',
    message: ''
  });

  const [validationErrors, setValidationErrors] = useState({
    emailAddress: '',
    phoneNumber: ''
  });

  const [formData, setFormData] = useState<improvementRequestPostModel>({
    userId: userId,
    companyName: '',
    personInCharge: '',
    emailAddress: '',
    phoneNumber: '',
    improvementRequest: ''
  });

  useEffect(() => {
    if (existingRequest) {
      setFormData({
        userId: userId,
        companyName: existingRequest.companyName || '',
        personInCharge: existingRequest.personInCharge || '',
        emailAddress: existingRequest.emailAddress || '',
        phoneNumber: existingRequest.phoneNumber || '',
        improvementRequest: existingRequest.improvementRequest || ''
      });
    }
  }, [existingRequest, userId]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setValidationErrors((prev) => ({
        ...prev,
        emailAddress: 'メールアドレスの形式が正しくありません'
      }));
      return false;
    }
    setValidationErrors((prev) => ({ ...prev, emailAddress: '' }));
    setEmailValid(true);
    return true;
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$|^0\d{1,4}-\d{1,4}-\d{4}$/;
    if (!phoneRegex.test(phone)) {
      setValidationErrors((prev) => ({
        ...prev,
        phoneNumber: '有効な電話番号を入力してください。例: +819012345678 または 090-1234-5678'
      }));
      return false;
    }
    setValidationErrors((prev) => ({ ...prev, phoneNumber: '' }));
    setPhoneValid(true);
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'emailAddress' && value) validateEmail(value);
    if (name === 'phoneNumber' && value) validatePhone(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isEmailValid = validateEmail(formData.emailAddress);
    const isPhoneValid = validatePhone(formData.phoneNumber);

    if (!isEmailValid || !isPhoneValid) {
      setAlertState({
        visible: true,
        type: 'error',
        message: '入力内容を確認してください。'
      });
      return;
    }

    try {
      const response = await createImprovementRequest(formData);
      if (response) {
        setAlertState({
          visible: true,
          type: 'success',
          message: '送信が完了しました'
        });
      
        setValidationErrors({
          emailAddress: '',
          phoneNumber: ''
        });
      } else {
        throw new Error('Unexpected response');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setAlertState({
        visible: true,
        type: 'error',
        message: 'モーションの送信に失敗しました'
      });
    }
  };

  const closeModal = () => {
    setAlertState((prev) => ({ ...prev, visible: false }));
  };

  const inputClassName =
    'w-full bg-gray-50 border-gray-200 rounded-sm h-12 focus:ring-2 focus:ring-orange-200 focus:border-[#F15A24] focus:outline-none shadow-[inset_0_8px_4px_-4px_rgba(0,0,0,0.1)]';
  const textAreaClassName =
    'w-full bg-gray-50 border-gray-200 rounded-sm resize-none focus:ring-2 focus:ring-orange-200 focus:border-[#F15A24] shadow-[inset_0_8px_4px_-4px_rgba(0,0,0,0.1)]';

  return (
    <div className="w-full max-w-2xl mx-auto p-4 bg-white">
      <div className="pb-4 px-6">
        <Modal
          visible={alertState.visible}
          closeIcon={null}
          onCancel={closeModal}
          wrapClassName="notranslate"
          footer={[
            <Button
              key="ok"
              onClick={closeModal}
              className="bg-[#F15A24] text-white hover:bg-[#d94d1f]">
              OK
            </Button>
          ]}
          centered
          className={alertState.type === 'success' ? 'ant-modal-success' : 'ant-modal-error'}>
          <p className="text-lg text-center my-auto">{alertState.message}</p>
        </Modal>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm text-gray-600">貴社名</label>
            <Input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className={inputClassName}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-600">担当者名</label>
            <Input
              type="text"
              name="personInCharge"
              value={formData.personInCharge}
              onChange={handleChange}
              className={inputClassName}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-600">メールアドレス</label>
            <Input
              type="email"
              name="emailAddress"
              value={formData.emailAddress}
              onChange={handleChange}
              className={`${inputClassName} ${validationErrors.emailAddress ? 'border-red-500' : ''}`}
              required
            />
            {validationErrors.emailAddress && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.emailAddress}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-600">電話番号</label>
            <Input
              type="tel"
              name="phoneNumber"
              value={formData?.phoneNumber ? formatPhoneNumber(formData?.phoneNumber) : ''}
              onChange={handleChange}
              className={`${inputClassName} ${validationErrors.phoneNumber ? 'border-red-500' : ''}`}
              required
            />
            {validationErrors.phoneNumber && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.phoneNumber}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-600">改善要望詳細</label>
            <TextArea
              name="improvementRequest"
              value={formData.improvementRequest}
              onChange={handleChange}
              className={textAreaClassName}
              required
              rows={10}
              style={{ height: '140px', minHeight: '140px' }}
            />
          </div>

          <Button
            type="submit"
            className={`w-full bg-[#F15A24] hover:bg-[#d94d1f] text-white font-normal h-12 rounded-none transition-all duration-200
              ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg'}`}
            disabled={isLoading || !(emailValid && phoneValid) && (formData?.emailAddress.length === 0 || formData?.phoneNumber.length === 0)}>
            送信
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SystemImprovementLayout;
