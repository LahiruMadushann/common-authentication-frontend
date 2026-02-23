import React, { useState, useEffect } from 'react';
import { Button, Input, Space, message } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import {
  Memo,
  useCreateMemoMutation,
  useDeleteMemoMutation,
  useGetMemosQuery,
  useUpdateMemoMutation
} from '@/src/app/services/memo';
import { BuyerRejection } from './buyerRejection';

interface MemoInputBoxProps {
  appraisalId: number;
  userId: number;
}

const MemoInputBox: React.FC<MemoInputBoxProps> = ({ appraisalId, userId }) => {
  const [inputs, setInputs] = useState<Memo[]>([{ id: 0, memoText: '' }]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { data: assessedData, isLoading } = useGetMemosQuery({ appraisalId, userId });
  const [createMemo] = useCreateMemoMutation();
  const [updateMemo] = useUpdateMemoMutation();
  const [deleteMemo] = useDeleteMemoMutation();

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  useEffect(() => {
    if (assessedData?.memos && assessedData.memos.length > 0) {
      setInputs(assessedData?.memos);
    } else {
      setInputs([{ id: 0, memoText: '' }]);
    }
  }, [assessedData]);

  const handleAddInput = () => {
    setInputs([...inputs, { id: 0, memoText: '' }]);
  };

  const handleRemoveInput = async (index: number) => {
    const memo: any = inputs[index];
    if (memo?.id > 0) {
      try {
        await deleteMemo({
          appraisalId,
          shopId: userId,
          memoId: memo.id
        });
        message.success('メモを削除しました');

        const newInputs = [...inputs];
        newInputs.splice(index, 1);
        setInputs(newInputs.length === 0 ? [{ id: 0, memoText: '' }] : newInputs);
      } catch (error) {
        message.error('メモの削除に失敗しました');
      }
    } else {
      const newInputs = [...inputs];
      newInputs.splice(index, 1);
      setInputs(newInputs.length === 0 ? [{ id: 0, memoText: '' }] : newInputs);
    }
  };

  const handleChangeInput = (value: string, index: number) => {
    const newInputs = [...inputs];
    newInputs[index] = { ...newInputs[index], memoText: value };
    setInputs(newInputs);
  };

  const handleSubmit = async (index: number) => {
    const memo: any = inputs[index];

    if (!memo.memoText.trim()) {
      message.warning('メモ内容を入力してください');
      return;
    }

    try {
      if (memo?.id > 0) {
        await updateMemo({
          appraisalId,
          shopId: userId,
          memoId: memo.id,
          memoText: memo.memoText,
          id: memo.id
        });
        message.success('更新が完了しました');
      } else {
        const response = await createMemo({
          appraisalId,
          shopId: userId,
          memoText: memo.memoText
        }).unwrap();

        const newInputs = [...inputs];
        newInputs[index] = response;
        setInputs(newInputs);
        message.success('メモを作成しました');
      }
    } catch (error) {
      message.error('メモの保存に失敗しました');
    }
  };

  // if (isLoading) {
  //   return <div></div>;
  // }

  return (
    <div className="flex flex-col space-y-4">
      <p className="font-semibold text-gray-900">メモ</p>

      {inputs.map((input, index) => (
        <div key={input.id || `new-${index}`} className="flex items-end space-x-2">
          <Input.TextArea
            value={input.memoText}
            onChange={(e) => handleChangeInput(e.target.value, index)}
            rows={8}
            placeholder="メモ"
            className="w-full p-4 bg-white rounded-md shadow-inner border border-gray-300"
            style={{
              boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1), inset 0 -2px 8px rgba(0, 0, 0, 0.06)'
            }}
          />
          <div className="flex flex-col items-start space-y-2">
            <Button
              type="primary"
              onClick={() => handleSubmit(index)}
              className="bg-orange-500 text-white">
              保存
            </Button>
            <div className="flex justify-between">
              <Button
                type="default"
                icon={<MinusOutlined />}
                onClick={() => handleRemoveInput(index)}
                className="bg-[#476377] text-white rounded-full mr-1"
              />
              {index === inputs.length - 1 && (
                <Button
                  type="default"
                  icon={<PlusOutlined />}
                  onClick={handleAddInput}
                  className="rounded-full border-2 border-[#476377] text-[#476377]"
                />
              )}
            </div>
          </div>
        </div>
      ))}
      <div className="flex justify-end">
        <button
          onClick={togglePopup}
          className="text-gray-600 hover:text-gray-900 font-bold underline focus:outline-none">
          却下申請
        </button>
      </div>
      <BuyerRejection
        isOpen={isPopupOpen}
        togglePopup={togglePopup}
        appraisalId={appraisalId.toString()}
      />
    </div>
  );
};

export default MemoInputBox;
