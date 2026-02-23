import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button, Alert } from 'antd';
import { useGetPresignedUrlMutation, useUploadFileMutation } from '@/src/app/services/fileUpload';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/pages/login/store';
import { AppraisalStatus } from '@/src/types/appraisalStatus';
import { useUpdateRejectAssessedStatusMutation } from '@/src/app/services/reject';
import { useGetRejectAssessedStatusQuery } from '@/src/app/services/reject';
import { AssessedModel } from '@/src/types/assessedModel';

type PopupComponentProps = {
  isOpen: boolean;
  togglePopup: () => void;
  appraisalId: any;
  onRejectionComplete: any;
};

export const BuyerRejection = ({
  isOpen,
  togglePopup,
  appraisalId,
  onRejectionComplete,
}: PopupComponentProps) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [getPresignedUrl] = useGetPresignedUrlMutation();
  const [uploadFile] = useUploadFileMutation();
  const [updateRejectAssessedStatus] = useUpdateRejectAssessedStatusMutation();
  const id = useSelector((state: RootState) => state.auth?.userId ?? null);
  const userId = Number(id);
  const [alertStatus, setAlertStatus] = useState<'success' | 'error' | 'warning' | null>(null);
  const [alertMessage, setAlertMessage] = useState<string>('');

  const {
    data: existingData,
    isLoading,
    refetch
  } = useGetRejectAssessedStatusQuery({ appraisalId, userId }, { skip: !isOpen });

  useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen, refetch]);

  useEffect(() => {
    if (existingData && existingData.length > 0) {
      const assessment = existingData[0] as AssessedModel;
      setImageUrl(assessment.evidenceImage || '');
      setReason(assessment.reasonForRejection || '');
    }
  }, [existingData]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size
      if (file.size > 5 * 1024 * 1024) {
        setAlertStatus('warning');
        setAlertMessage('画像サイズが5MBを超えています。5MB以下の画像を選択してください。');
        setTimeout(() => setAlertStatus(null), 5000);
        return;
      }

      // Validate file type
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const allowedTypes = ['jpeg', 'jpg', 'png'];
      if (!fileExtension || !allowedTypes.includes(fileExtension)) {
        setAlertStatus('warning');
        setAlertMessage('ファイル形式はJPEGまたはPNGのみ許可されています。');
        setTimeout(() => setAlertStatus(null), 5000);
        return;
      }

      setSelectedImage(file);
      try {
        const url = await handleUpload(file);
        setImageUrl(url);
      } catch (error) {
        console.error('Error uploading image:', error);
        setAlertStatus('error');
        setAlertMessage('画像のアップロード中にエラーが発生しました。');
        setTimeout(() => setAlertStatus(null), 5000);
      }
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImageUrl('');
  };

  const handleSubmit = async () => {
    if (!userId || (!reason && !imageUrl)) {
      setAlertStatus('warning');
      setAlertMessage('画像または理由を入力してください。');
      setTimeout(() => setAlertStatus(null), 5000);
      return;
    }
    const status = AppraisalStatus.SUBMIT_AN_APPLICATION;
    const userRejectBody = {
      imageUrl,
      reason
    };
    try {
      const result = await updateRejectAssessedStatus({
        userRejectBody,
        appraisalId,
        userId,
        status
      }).unwrap();
      console.log('Submission successful:', result);
      setAlertStatus('success');
      setAlertMessage('更新が完了しました');
      setTimeout(() => {
        setAlertStatus(null);
        togglePopup();
        onRejectionComplete();
      }, 3000);
    } catch (error) {
      console.error('Error submitting rejection:', error);
      setAlertStatus('error');
      if((error as any)?.status === 401){
        setAlertMessage('セッションの有効期限が切れました。お手数ですが、再度ログインしてください。');
        setTimeout(() => setAlertStatus(null), 5000);
      }else{
        setAlertMessage('モーションの送信に失敗しました');
        setTimeout(() => setAlertStatus(null), 5000);
      }
      
    }
  };

  const handleUpload = async (file: File): Promise<string> => {
    try {
      // Generate a safe filename for S3 key (avoid Japanese characters in S3 key)
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const safeFileName = `rejection-evidence-${timestamp}.${fileExtension}`;

      const fileData = { bucketName: 'ctn-uploads', keyName: safeFileName };

      const presignedUrlResponse = await getPresignedUrl(fileData).unwrap();
      const imgURL = `https://ctn-uploads.s3.ap-northeast-1.amazonaws.com/${safeFileName}`;

      await uploadFile({ url: presignedUrlResponse.url, file }).unwrap();

      return imgURL;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Unexpected error occurred during file upload.'
      );
    }
  };

  const handleRejectionConfirm = () => {

    onRejectionComplete();
    togglePopup();
  };

  if (!isOpen) return null;

  if (isLoading) {
    return <div></div>;
  }

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="relative bg-white rounded-lg shadow-lg p-6 w-[90%] h-auto my-4 max-w-5xl py-10 px-16">
        <button
          className="absolute top-2 left-2 text-gray-600 hover:text-gray-900"
          onClick={togglePopup}>
          <X size={24} />
        </button>
        {alertStatus && (
          <Alert
            message={alertMessage}
            type={alertStatus}
            showIcon
            closable
            className="mb-4"
          />
        )}
        <div className="mb-4">
          <div className="w-full xl:h-96 lg:h-80 h-[90%] md:h-[30vh] bg-gray-200 flex items-center justify-center mb-4 relative">
            {imageUrl ? (
              <>
                <img src={imageUrl} alt="Uploaded" className="h-full object-contain" />
                <button className="absolute top-2 right-2 text-red-500" onClick={handleRemoveImage}>
                  <X size={24} />
                </button>
              </>
            ) : (
              <span className="font-semibold text-gray-900">エビデンス画像</span>
            )}
          </div>

          <input
            id="file-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
          <div className="flex justify-end mb-9">
            <Button
              type="default"
              style={{ backgroundColor: '#f5f5f5', borderColor: '#d9d9d9', color: 'black' }}
              onClick={() => document.getElementById('file-upload')?.click()}>
              <span className="font-semibold text-gray-900">ファイル選択</span>
            </Button>
          </div>
        </div>
        <div className="mb-4">
          <div className='mb-2'>
            <span className="font-semibold text-gray-900">却下したい理由</span>
          </div>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full p-2 border rounded h-32 shadow-lg-inner focus:border-2 focus:border-gray-400 focus:outline-none focus:ring-0 transition-all duration-200"></textarea>
        </div>
        <div className="flex justify-end">
          <Button
            type="primary"
            className="bg-orange-500 hover:bg-orange-600"
            onClick={handleSubmit}>
            送信する
          </Button>
        </div>
      </div>
    </div>
  );
};