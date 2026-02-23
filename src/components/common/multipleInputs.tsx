import React, { useState, useEffect, useRef } from 'react';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { Input, Button } from 'antd';
import { setCustomErrorToast } from '@/src/utils/notification';
import { useMatchingConditionsStore } from '@/src/stores/matchingCondtions.store';

export const MultipleInputList = () => {
  const { setEmailList, emailList } = useMatchingConditionsStore();
  const [inputs, setInputs] = useState<any[]>([{ key: '', value: '' }]);
  const isUserInteracting = useRef(false); // Tracks if the user is typing or adding inputs

  // Sync inputs with emailList when emailList changes externally
  useEffect(() => {
    if (!isUserInteracting.current) {
      // Synchronize only if the user is not interacting
      if (emailList && emailList?.length > 0) {
        setInputs(emailList?.map((email: any) => ({ key: '', value: email?.email })));
      } else {
        setInputs([{ key: '', value: '' }]); // Reset to a single blank input if emailList is empty
      }
    }
  }, [emailList]);

  // Sync emailList with the store whenever inputs change
  const syncEmailList = (newInputs: any[]) => {
    const validEmails = newInputs
      .filter((input) => input?.value && validateEmail(input?.value))
      .map((input, i) => ({
        order: i + 1,
        email: input.value
      }));
    setEmailList(validEmails);
  };

  const handleAddInput = () => {
    isUserInteracting.current = true; // Mark as user interaction
    const newInputs = [...inputs, { key: '', value: '' }];
    setInputs(newInputs);
    syncEmailList(newInputs); // Sync immediately
  };

  const handleInputChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    isUserInteracting.current = true; // Mark as user interaction
    const newInputs = inputs.map((input, i) =>
      i === index ? { ...input, value: event.target.value } : input
    );
    setInputs(newInputs);
    syncEmailList(newInputs); // Sync immediately
  };

  const handleRemoveInput = (index: number) => {
    isUserInteracting.current = true; // Mark as user interaction
    const newInputs = inputs.filter((_, i) => i !== index);
    setInputs(newInputs.length > 0 ? newInputs : [{ key: '', value: '' }]);
    syncEmailList(newInputs); // Sync immediately
  };

  const validateEmail = (email: string) => {
    const re =  /^(?=[^\s@]+@[^\s@]+\.[^\s@]+$)(?=[\w\-._%+]+@[\w\-._]+\.[A-Za-z]{2,})[\w\-._%+]+@[A-Za-z0-9\-]+(?:\.[A-Za-z]{2,})+$/;
    return re.test(email.toLowerCase());
  };

// combine this two regex  /^[^\s@]+@[^\s@]+\.[^\s@]+$/; and [\\w\\-._%+]+@[\\w\\-._]+\\.[A-Za-z]{2,}

  return (
    <div className="w-full h-full">
      {inputs?.map((input, index) => (
        <div key={index} className="flex items-center gap-4">
          <Input
            value={input.value}
            onChange={(e) => handleInputChange(index, e)}
            className="w-full bg-[#fff9c5] py-2 my-2"
            required
          />
          <Button icon={<MinusOutlined />} onClick={() => handleRemoveInput(index)} />
          {index === inputs.length - 1 && (
            <Button
              icon={<PlusOutlined />}
              onClick={handleAddInput}
              disabled={!validateEmail(input.value)}
            />
          )}
        </div>
      ))}
      {inputs?.map(
        (input, index) =>
          input.value &&
          input.value.length > 0 &&
          !validateEmail(input.value) && (
            <h1 key={`error-${index}`} className="text-red-500">
              無効なメールアドレスです
            </h1>
          )
      )}
    </div>
  );
};
