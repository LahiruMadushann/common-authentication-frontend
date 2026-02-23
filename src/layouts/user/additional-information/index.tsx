import React, { useState, useCallback, useEffect } from 'react';
import {
  useGetPresignedUrlMutation,
  useUpdateAppraisalPhotosMutation,
  useUploadFileMutation
} from '@/src/app/services/fileUpload';
import { Button } from '@/components/ui/button';
import Alert from '@/src/components/alert';
import { useLazyGetAppraisalQuery } from '@/src/app/services/appraisal';
import beforeImage from '../../../assets/additional-images/before.jpg';
import afterImage from '../../../assets/additional-images/after.jpg';
import { handleErrors } from '@/src/utils/handleErrors';
import certificateImage from '../../../assets/additional-images/certificate.jpg';

type ImageKey = 'before' | 'after' | 'certificate';

const AdditionalInformationLayout = ({ userId }: any) => {
  const appraisalId = localStorage.getItem('appraisalid');
  const [getPresignedUrl] = useGetPresignedUrlMutation();
  const [getAppraisal, { isError: isGetError, error: getError }] = useLazyGetAppraisalQuery();
  const [updateAppraisal] = useUpdateAppraisalPhotosMutation();
  const [uploadFile] = useUploadFileMutation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const [photos, setPhotos] = useState({
    photoBefore: '',
    photoAfter: '',
    inspectionCertPhoto: ''
  });

  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    before: null,
    after: null,
    certificate: null
  });
  const [previews, setPreviews] = useState<{ [key: string]: string | null }>({
    before: null,
    after: null,
    certificate: null
  });
  const [alert, setAlert] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'normal';
  }>({
    show: false,
    message: '',
    type: 'success'
  });

  const imageMap: { [key in ImageKey]: string } = {
    before: beforeImage,
    after: afterImage,
    certificate: certificateImage
  };

  const fetchAppraisalData = useCallback(() => {
    setIsLoading(true);
    getAppraisal(Number(userId))
      .unwrap()
      .then((data: any) => {
        setPhotos({
          photoBefore: data.photoBefore || '',
          photoAfter: data.photoAfter || '',
          inspectionCertPhoto: data.inspectionCertPhoto || ''
        });
      })
      .catch((error) => {
        handleErrors(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [getAppraisal, userId]);

  useEffect(() => {
    fetchAppraisalData();
  }, []);

  useEffect(() => {
    if (photos.photoBefore && photos.photoBefore.trim() !== '') {
      setPreviews((prev) => ({ ...prev, before: photos.photoBefore }));
    }
    if (photos.photoAfter && photos.photoAfter.trim() !== '') {
      setPreviews((prev) => ({ ...prev, after: photos.photoAfter }));
    }
    if (photos.inspectionCertPhoto && photos.inspectionCertPhoto.trim() !== '') {
      setPreviews((prev) => ({ ...prev, certificate: photos.inspectionCertPhoto }));
    }
  }, [photos]);

  if (isGetError) {
    handleErrors(getError);
  }

  const handleUpload = async () => {
    const uploadedFiles: { [key: string]: string } = {};

    for (const key in files) {
      const file = files[key];
      if (file) {
        try {
          const fileName = `appraisal-photos/${file.name}`;
          const fileData = { bucketName: 'ctn-uploads', keyName: fileName };

          const presignedUrlResponse = await getPresignedUrl(fileData).unwrap();
          const imgURL = `https://ctn-uploads.s3.ap-northeast-1.amazonaws.com/${fileName}`;

          await uploadFile({ url: presignedUrlResponse.url, file }).unwrap();

          uploadedFiles[key] = imgURL;
        } catch (error) {
          if (error instanceof Error) {
            console.error(`Error uploading ${key}:`, error.message);
            setAlert({ show: true, message: `更新失敗: ${error.message}`, type: 'error' });
          } else {
            console.error('Unexpected error:', error);
            setAlert({
              show: true,
              message: '不明なエラーでアップデートに失敗しました',
              type: 'error'
            });
          }
          return;
        }
      }
    }

    try {
      await updateAppraisal({
        id: Number(appraisalId),
        photoBefore: uploadedFiles.before || photos.photoBefore,
        photoAfter: uploadedFiles.after || photos.photoAfter,
        inspectionCertPhoto: uploadedFiles.certificate || photos.inspectionCertPhoto
      }).unwrap();
      setAlert({ show: true, message: '更新が完了しました', type: 'normal' });
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error updating appraisal:', error.message);
        setAlert({ show: true, message: `更新失敗: ${error.message}`, type: 'error' });
      } else {
        console.error('Unexpected error:', error);
        setAlert({
          show: true,
          message: '不明なエラーでアップデートに失敗しました。',
          type: 'error'
        });
      }
    }
  };

  const handleCloseAlert = () => {
    setAlert({ show: false, message: '', type: 'success' });
  };

  const handleFileSelect = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setAlert({
          show: true,
          message: 'ファイルサイズは5MB以下にしてください。',
          type: 'error'
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews((prev) => ({ ...prev, [key]: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
      setFiles((prev) => ({ ...prev, [key]: file }));
    }
  };

  const handleRemoveImage = (key: string) => {
    setFiles((prev) => ({ ...prev, [key]: null }));
    setPreviews((prev) => ({ ...prev, [key]: null }));

    // Update the relevant field in the `photos` state
    if (key === 'before') {
      setPhotos((prev) => ({ ...prev, photoBefore: '' }));
    } else if (key === 'after') {
      setPhotos((prev) => ({ ...prev, photoAfter: '' }));
    } else if (key === 'certificate') {
      setPhotos((prev) => ({ ...prev, inspectionCertPhoto: '' }));
    }
  };

  const imageTitles: { [key in ImageKey]: string } = {
    before: '車両前写真',
    after: '車両後写真',
    certificate: '車検証写真'
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-center mt-8">
        {alert.show && (
          <Alert message={alert.message} type={alert.type} onClose={handleCloseAlert} />
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {(['before', 'after', 'certificate'] as const).map((key) => (
          <div key={key} className="space-y-4">
            <h3 className="text-lg font-bold text-left">写真情報（サンプル）</h3>
            <div className="w-full h-48 rounded-sm flex items-center justify-center shadow-md">
              <img
                src={imageMap[key]}
                alt={`${key}`}
                className="object-cover w-full h-full rounded-sm"
              />
            </div>
            <h3 className="text-lg font-bold text-left">写真情報</h3>
            <div
              className={`w-full h-48 rounded-sm relative shadow-md p-4 flex items-center justify-center ${
                !previews[key] ? 'border-2 border-dashed' : ''
              }`}>
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={handleFileSelect(key)}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                {previews[key] ? (
                  <div className="relative w-full h-full">
                    <img
                      src={previews[key] as string}
                      alt={`${key} preview`}
                      className="object-cover w-full h-full rounded-sm"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(key)}
                      className="absolute top-2 right-2 px-2 p-0 bg-white text-primary hover:bg-gray-100 rounded-full p-1 shadow-md transition-colors duration-200 z-20">
                      X
                    </button>
                  </div>
                ) : (
                  <div className="text-center flex flex-col items-center">
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full">
                      <span className="text-2xl text-gray-400">+</span>{' '}
                      {/* + Icon inside a circle */}
                    </div>
                    <p className="text-center text-gray-400 text-sm mt-2">{imageTitles[key]}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-8">
        {alert.show && (
          <Alert message={alert.message} type={alert.type} onClose={handleCloseAlert} />
        )}
        <Button onClick={handleUpload} className="btn btn-primary mb-2">
          保存する
        </Button>
      </div>
    </div>
  );
};

export default AdditionalInformationLayout;
