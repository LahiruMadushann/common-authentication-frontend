import React from 'react';
import imageCompression from 'browser-image-compression';

export interface CompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
  quality?: number;
}

const ImageCompressionUtil = () => {

  const compressImage = async (
    file: File,
    options: CompressionOptions = {}
  ): Promise<File> => {
    const defaultOptions = {
      maxSizeMB: 0.8, // 800KB
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      quality: 0.8
    };

    const compressionOptions = { ...defaultOptions, ...options };

    try {
      const compressedFile = await imageCompression(file, compressionOptions);
      return compressedFile;
    } catch (error) {
      console.error('Image compression failed:', error);
      throw new Error('Failed to compress image');
    }
  };

  const createPreviewUrl = (file: File): string => {
    return URL.createObjectURL(file);
  };

  const revokePreviewUrl = (url: string): void => {
    URL.revokeObjectURL(url);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };


  return {
    compressImage,
    createPreviewUrl,
    revokePreviewUrl,
    formatFileSize
  };
};

export default ImageCompressionUtil;