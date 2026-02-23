import React, { useState, useEffect, ChangeEvent } from 'react';
import { CameraOutlined, CloseOutlined } from '@ant-design/icons';
import { useBuyerStore } from '@/src/stores/buyer.store';
import placeholder from '../../assets/images/no-image.jpg';
import { useAppStore } from '@/src/stores/app.store';

interface FileInfo {
  name: string;
  size: number;
  type: string;
  extension: string;
}

interface UploaderProps {
  label: string;
  url?: string | null;
  file?: File | null;
  edit?: boolean;
  setFile: (file: File | null) => void;
  setFileInfo: (info: FileInfo | null) => void;
}

export const Uploader: React.FC<UploaderProps> = ({
  label,
  url = null,
  file = null,
  edit = false,
  setFile,
  setFileInfo
}) => {
  const [editStates, setEditStates] = useState<boolean>(edit);
  const [previewUrl, setPreviewUrl] = useState<string | null | undefined>(url);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { setClearImage } = useBuyerStore();
  const { editExistingFile, setEditExistingFile } = useAppStore();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(''); // Clear any previous error messages
    setEditExistingFile(true);

    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      const fileExtension = uploadedFile.name.split('.').pop()?.toLowerCase();
      const allowedTypes = ['jpeg', 'jpg', 'png'];

      // Validate file type
      if (!fileExtension || !allowedTypes.includes(fileExtension)) {
        setErrorMessage('ファイル形式はJPEGまたはPNGのみ許可されています。');
        return;
      }

      setFile(uploadedFile);
      setClearImage(false);
      setFileInfo({
        name: uploadedFile.name,
        size: uploadedFile.size,
        type: uploadedFile.type,
        extension: fileExtension
      });
    }
  };

  const handleClearImage = () => {
    setPreviewUrl(null);
    setEditExistingFile(true);
    setErrorMessage(''); // Clear error message when clearing the image
    setFile(null);
    setFileInfo(null);
    setClearImage(true);
  };

  useEffect(() => {
    let objectUrl: string | null = null;
    switch (true) {
      case url && editStates && !editExistingFile:
        console.log('first');
        setPreviewUrl(url);
        break;
      case !url && editStates && !editExistingFile:
        setPreviewUrl(undefined);
        break;
      case file !== null && editExistingFile:
        objectUrl = URL.createObjectURL(file);
        console.log('helsdslo');
        setPreviewUrl(objectUrl);
        break;
    }

    console.log('hello', previewUrl, url);
  }, [file, url, editStates]);

  return (
    <div className="w-full flex flex-col md:flex-row items-center gap-2">
      <div className="text-sm font-semibold h-14 md:h-40 flex items-center justify-center md:justify-start md:juce px-2 bg-[#587c94] border-b-[1px] border-white text-white w-full md:w-[7rem]">
        {label}
      </div>
      <div className="relative border w-40 min-h-[150px] min-w-40 border-[#587c94] h-full flex items-center justify-center">
        {!previewUrl && <CameraOutlined className="text-black text-2xl" />}
        {previewUrl && (
          <img
            src={previewUrl}
            alt="Uploaded"
            className="w-full h-full object-fit min-w-40 max-h-[150px]"
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="max-h-40 absolute opacity-0 w-full h-full top-0 left-0 cursor-pointer"
        />
        {previewUrl && (
          <button
            type="button"
            onClick={handleClearImage}
            className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-200">
            <CloseOutlined className="text-black" />
          </button>
        )}
      </div>
      {errorMessage && (
        <div className="text-red-600 text-sm mt-1 w-full absolute right-0">{errorMessage}</div>
      )}
    </div>
  );
};
