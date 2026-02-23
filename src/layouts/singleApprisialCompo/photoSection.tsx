import React, { useState, useEffect, useRef } from 'react';
import { Modal } from 'antd';
import { X } from 'lucide-react';
import {
  useGetPresignedUrlMutation,
  useUploadFileMutation,
  useUploadPhotoMutation,
  useGetPhotosQuery,
  useDeletePhotoMutation
} from '@/src/app/services/assessedPhtos';
import ImageCompressionUtil from '@/src/utils/ImageCompressionUtil'; // Update this path

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_PHOTOS_PER_CATEGORY = 6;

export const PhotoSection = ({ singleAprisial, userId }: any) => {
  const categories = [
    { id: 1, name: 'ユーザーからの写真情報' },
    { id: 2, name: '外観1' },
    { id: 3, name: '外観2' },
    { id: 4, name: '外観3' },
    { id: 5, name: '車内1' },
    { id: 6, name: '車内2' },
    { id: 7, name: '車内3' },
    { id: 8, name: 'タイヤ1' },
    { id: 9, name: 'タイヤ2' },
    { id: 10, name: 'タイヤ3' }
  ];

  const [selectedCategory, setSelectedCategory] = useState<number | null>(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState<number | null>(null);
  const [localPhotos, setLocalPhotos] = useState<any[]>([]);
  
  const [previewUrls, setPreviewUrls] = useState<{ [key: string]: string }>({});
  const [isCompressing, setIsCompressing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const imageCompressionUtil = ImageCompressionUtil();

  const {
    data: photos = [],
    refetch: refetchPhotos,
    isLoading
  } = useGetPhotosQuery(
    {
      appraisalId: singleAprisial?.appraisalid?.content,
      shopId: userId,
      category: selectedCategory
        ? categories.find((cat) => cat.id === selectedCategory)?.name || ''
        : ''
    },
    {
      skip: !selectedCategory,
      refetchOnMountOrArgChange: true
    }
  );

  useEffect(() => {
    if (photos && photos.length > 0) {
      setLocalPhotos(photos);
    }
  }, [photos]);

  useEffect(() => {
    return () => {
      Object.values(previewUrls).forEach(url => {
        if (url) {
          imageCompressionUtil.revokePreviewUrl(url);
        }
      });
    };
  }, [previewUrls]);

  useEffect(() => {
    Object.values(previewUrls).forEach(url => {
      if (url) {
        imageCompressionUtil.revokePreviewUrl(url);
      }
    });
    setPreviewUrls({});
  }, [selectedCategory]);

  const [uploadPhoto] = useUploadPhotoMutation();
  const [getPresignedUrl] = useGetPresignedUrlMutation();
  const [uploadFile] = useUploadFileMutation();
  const [deletePhoto] = useDeletePhotoMutation();

  const showModal = (msg: string) => {
    setModalMessage(msg);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleDeleteClick = (photoId: number) => {
    const selectedCategoryName = categories.find((cat) => cat.id === selectedCategory)?.name;
    if (selectedCategoryName === 'ユーザーからの写真情報') {
      showModal('この写真は削除できません。');
      return;
    }

    setPhotoToDelete(photoId);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (photoToDelete) {
      try {
        await deletePhoto({ photoId: photoToDelete });
        // showModal('更新が完了しました');
        setLocalPhotos(prevPhotos => prevPhotos.filter(photo => photo.photoId !== photoToDelete));
        
        const photoKey = `temp-${photoToDelete}`;
        if (previewUrls[photoKey]) {
          imageCompressionUtil.revokePreviewUrl(previewUrls[photoKey]);
          setPreviewUrls(prev => {
            const updated = { ...prev };
            delete updated[photoKey];
            return updated;
          });
        }
        
        refetchPhotos();
      } catch (error) {
        showModal('写真の削除に失敗しました');
      }
    }
    setDeleteModalVisible(false);
    setPhotoToDelete(null);
  };

  const handleCategoryClick = (categoryId: number) => {
    if (selectedCategory !== categoryId) {
      setSelectedCategory(categoryId);
      setLocalPhotos([]);
    }
  };

  const getDisplayImageUrl = (photo: any, index: number) => {
    const tempKey = `temp-${selectedCategory}-${index}`;
    if (previewUrls[tempKey]) return previewUrls[tempKey]; 
    return photo.link; 
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && selectedCategory !== null) {
      const selectedCategoryName = categories.find((cat) => cat.id === selectedCategory)?.name;
      if (selectedCategoryName === 'ユーザーからの写真情報') {
        showModal('この分類の写真はアップロードできません。');
        event.target.value = '';
        return;
      }

      if (localPhotos.length >= MAX_PHOTOS_PER_CATEGORY) {
        showModal(`この分類の最大画像数（${MAX_PHOTOS_PER_CATEGORY}枚）に達しました`);
        event.target.value = '';
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        showModal('ファイルサイズが最大制限の5MBを超えています。');
        event.target.value = '';
        return;
      }

      const tempKey = `temp-${selectedCategory}-${Date.now()}`;
      const immediatePreview = imageCompressionUtil.createPreviewUrl(file);
      setPreviewUrls(prev => ({ ...prev, [tempKey]: immediatePreview }));
      setIsCompressing(true);

      const tempPhoto = {
        photoId: tempKey,
        link: immediatePreview,
        isUploading: true
      };
      setLocalPhotos(prev => [...prev, tempPhoto]);

      try {
        const compressedFile = await imageCompressionUtil.compressImage(file, {
          maxSizeMB: 0.8,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
          quality: 0.8
        });

        const shopId = userId;
        const appraisalId = singleAprisial?.appraisalid?.content;

        const generateSafeFileName = (originalName: string) => {
          const lastDotIndex = originalName.lastIndexOf('.');
          const extension = lastDotIndex !== -1 ? originalName.substring(lastDotIndex) : '';
          
          const timestamp = Date.now();
          const randomString = Math.random().toString(36).substring(2, 8);
          const safeFileName = `photo_${timestamp}_${randomString}${extension}`;
          
          return safeFileName;
        };

        const safeFileName = generateSafeFileName(file.name);
        const fileName = `vehicle-information/${safeFileName}`;
        const fileData = { bucketName: 'ctn-uploads', keyName: fileName };

        const presignedUrlResponse = await getPresignedUrl(fileData).unwrap();

        const renamedFile = new File([compressedFile], safeFileName, {
          type: compressedFile.type,
          lastModified: compressedFile.lastModified,
        });

        await uploadFile({
          url: presignedUrlResponse.url,
          file: renamedFile
        }).unwrap();

        const imgURL = `https://ctn-uploads.s3.ap-northeast-1.amazonaws.com/${fileName}`;

        await uploadPhoto({
          shopId,
          appraisalId,
          link: imgURL,
          category: selectedCategoryName || ''
        }).unwrap();

        if (previewUrls[tempKey]) {
          imageCompressionUtil.revokePreviewUrl(previewUrls[tempKey]);
          setPreviewUrls(prev => {
            const updated = { ...prev };
            delete updated[tempKey];
            return updated;
          });
        }

        setLocalPhotos(prev => prev.filter(photo => photo.photoId !== tempKey));

        refetchPhotos();
        showModal('更新が完了しました');
      } catch (error) {
        console.error('Error uploading file:', error);
        
        if (previewUrls[tempKey]) {
          imageCompressionUtil.revokePreviewUrl(previewUrls[tempKey]);
          setPreviewUrls(prev => {
            const updated = { ...prev };
            delete updated[tempKey];
            return updated;
          });
        }
        
        setLocalPhotos(prev => prev.filter(photo => photo.photoId !== tempKey));
        
        showModal('画像のアップロードに失敗しました。もう一度お試しください。');
      } finally {
        setIsCompressing(false);
        event.target.value = '';
      }
    }
  };

  const handlePlusIconClick = () => {
    if (selectedCategory !== null && fileInputRef.current && !isCompressing) {
      const selectedCategoryName = categories.find((cat) => cat.id === selectedCategory)?.name;

      if (selectedCategoryName === 'ユーザーからの写真情報' && localPhotos.length === 0) {
        return;
      }

      fileInputRef.current.click();
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-xl font-bold bg-[#587c94] text-white p-2 text-center py-4">写真情報</h2>
      <div className="flex">
        <div className="w-full max-w-[120px] md:max-w-full md:w-1/4 pr-4">
          {categories?.map((category) => (
            <div
              key={category?.id}
              className={`p-2 h-20 border cursor-pointer ${
                selectedCategory === category?.id ? 'bg-[#eeeeee]' : 'bg-white'
              } border-black`}
              onClick={() => handleCategoryClick(category?.id)}>
              {category?.name}
            </div>
          ))}
        </div>
        <div className="w-full md:w-3/4 pt-4">
          {categories.find((cat) => cat.id === selectedCategory)?.name !==
            'ユーザーからの写真情報' && (
            <div className="mb-4 w-full flex items-center justify-center">
              <div className="relative w-full md:w-24 h-10 z-20 border border-black rounded-sm flex items-center justify-center cursor-pointer">
                <h1 className="cursor-pointer">
                  {isCompressing ? '処理中...' : 'ファイル選択'}
                </h1>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  className="absolute top-0 left-0 w-24 h-10 opacity-0 z-40"
                  disabled={selectedCategory === null || isCompressing}
                  accept="image/*"
                />
              </div>
            </div>
          )}
          {isLoading ? (
            <div className="flex justify-center items-center">
              <p>読み込み中...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4 px-4 md:px-10">
              {localPhotos
                .filter(
                  (photo: any) =>
                    categories.find((cat) => cat.id === selectedCategory)?.name !==
                      'ユーザーからの写真情報' ||
                    (selectedCategory === 1 && photo && photo.link && photo.link.trim() !== '')
                )
                .map((photo: any, index) => (
                  <div
                    key={photo.photoId || index}
                    className="relative h-[95px] md:h-[200px] bg-gray-200 border border-gray-300 flex items-center justify-center overflow-hidden">
                    {categories.find((cat) => cat.id === selectedCategory)?.name !==
                      'ユーザーからの写真情報' && !photo.isUploading && (
                      <button
                        onClick={() => handleDeleteClick(photo.photoId)}
                        className="absolute top-2 right-2 z-10 bg-red-500 rounded-full p-1 hover:bg-red-600">
                        <X className="w-4 h-4 text-white" />
                      </button>
                    )}

                    <img
                      src={getDisplayImageUrl(photo, index)}
                      alt={`Upload ${index + 1}`}
                      className="object-contain w-full h-full max-w-full max-h-full"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain'
                      }}
                    />
                  </div>
                ))}
              {categories.find((cat) => cat.id === selectedCategory)?.name !==
                'ユーザーからの写真情報' &&
                [...Array(Math.max(0, 6 - localPhotos.length))].map((_, index) => (
                  <div
                    key={`empty-${index}`}
                    className="h-[95px] md:h-[200px] bg-gray-200 border border-black flex items-center justify-center">
                    <div
                      onClick={handlePlusIconClick}
                      className={`flex items-center justify-center rounded-full border border-gray-400 w-12 h-12 bg-gray-50 ${
                        isCompressing ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-gray-100'
                      }`}>
                      <span className="text-4xl text-gray-400">+</span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      <Modal
        title="通知"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleOk}
        closable={false}
        wrapClassName="notranslate"
        footer={[
          <button key="ok" onClick={handleOk} className="px-4 py-2 bg-blue-500 text-white rounded">
            オッケー
          </button>
        ]}>
        <p>{modalMessage}</p>
      </Modal>

      <Modal
        title="削除の確認"
        visible={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        closable={false}
        wrapClassName="notranslate"
        footer={[
          <button
            key="cancel"
            onClick={() => setDeleteModalVisible(false)}
            className="px-4 py-2 bg-gray-500 text-white rounded mr-2">
            キャンセル
          </button>,
          <button
            key="delete"
            onClick={handleConfirmDelete}
            className="px-4 py-2 bg-red-500 text-white rounded">
            削除
          </button>
        ]}>
        <p>この写真を削除してもよろしいですか？</p>
      </Modal>
    </div>
  );
};
