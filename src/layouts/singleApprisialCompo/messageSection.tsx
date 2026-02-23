import React, { useEffect, useState, useRef } from 'react';
import {
  useGetSellerQuery,
  useLazyGetMessageQuery,
  useLazySendMessageQuery
} from '@/src/app/services/message';
import { handleErrors } from '@/src/utils/handleErrors';
import MessageTextAreaWithPreview from '@/src/components/message/MessageTextAreaWithPreview';
import { useGetPresignedUrlMutation, useUploadFileMutation } from '@/src/app/services/fileUpload';
import { useTabStore } from '@/src/stores/tabStore';
import { useApprisialStore } from '@/src/stores/apprisials.store';
import { skipToken } from '@reduxjs/toolkit/query';
import { Alert } from 'antd';

interface Message {
  senderId: number;
  receiverId: number;
  content: string;
  createdAt: Date;
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
  receiverName?: string;
}

export const MessageSection = ({ senderId, receiverId }: any) => {
  const [sendMessageValue, setSendMessageValue] = useState<string>('');
  const [messageData, setMessageData] = useState<Message[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fetchGetMessages, { isError: isGetError, error: getError }] = useLazyGetMessageQuery();
  const [sendMessages, { isError: isSendError, error: sendError }] = useLazySendMessageQuery();
  const [getPresignedUrl] = useGetPresignedUrlMutation();
  const [uploadFile] = useUploadFileMutation();
  const { tabKey } = useTabStore();
  const { singleAprisial } = useApprisialStore();
  const messageContainerRef = useRef<HTMLDivElement | null>(null);
  const { data: sellerId } = useGetSellerQuery(singleAprisial?.appraisalid?.content ?? skipToken, {
    skip: singleAprisial?.appraisalid?.content === null
  });
  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const [showSizeAlert, setShowSizeAlert] = useState(false);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messageData]);

  const fetchMessages = async () => {
    try {
      const [messages1, messages2] = await Promise.all([
        fetchGetMessages(senderId).unwrap(),
        fetchGetMessages(receiverId).unwrap()
      ]);
      let combinedMessages = [...messages1, ...messages2];
      combinedMessages = combinedMessages?.filter(
        (message) =>
          (message?.senderId == senderId || message?.senderId == receiverId) &&
          (message?.receiverId == senderId || message?.receiverId == receiverId)
      );

      const sortedMessages = getSortedMessages(combinedMessages);
      setMessageData(sortedMessages);
    } catch (error) {
      handleErrors(error);
    }
  };

  useEffect(() => {
    if (tabKey === '4' && sellerId !== undefined) {
      fetchMessages();
    }
  }, [tabKey, sellerId]);

  if (isGetError) {
    handleErrors(getError);
  }

  if (isSendError) {
    handleErrors(sendError);
  }

  const handleUpload = async (file: File): Promise<string> => {
    if (file.size > MAX_FILE_SIZE) {
      setShowSizeAlert(true);
      throw new Error('File size exceeds the maximum limit of 5MB.');
    }
    try {
      const fileName = `${file.name}`;
      const fileData = { bucketName: 'ctn-uploads', keyName: fileName };

      const presignedUrlResponse = await getPresignedUrl(fileData).unwrap();
      const imgURL = `https://ctn-uploads.s3.ap-northeast-1.amazonaws.com/${fileName}`;

      await uploadFile({ url: presignedUrlResponse.url, file }).unwrap();

      return imgURL;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Unexpected error occurred during file upload.'
      );
    }
  };

  const handleSendMessageClick = async () => {
    if (!sendMessageValue.trim() && !selectedFile) return;

    let fileUrl = '';
    let fileName = '';
    let fileType = '';

    if (selectedFile) {
      try {
        if (selectedFile.size > MAX_FILE_SIZE) {
          setShowSizeAlert(true);
          return;
        }

        fileUrl = await handleUpload(selectedFile);
        fileName = selectedFile.name;
        fileType = selectedFile.type;
      } catch (error) {
        if (error instanceof Error && error.message.includes('File size exceeds')) {
          setShowSizeAlert(true);
        } else {
          handleErrors(error);
        }
        return;
      }
    }

    sendMessages({
      senderId: senderId,
      receiverId: receiverId,
      content: sendMessageValue.trim(),
      fileUrl,
      fileName,
      fileType
    })
      .then(() => {
        fetchMessages();
        setSendMessageValue('');
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      })
      .catch((error) => {
        handleErrors(error);
      });
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSendMessageValue(event.target.value);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      if (file.size > MAX_FILE_SIZE) {
        setShowSizeAlert(true);
        event.target.value = '';
        setSelectedFile(null);
      } else {
        setSelectedFile(file);
        setShowSizeAlert(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };

  const handleCloseAlert = () => {
    setShowSizeAlert(false);
  };

  const handleFileButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const getSortedMessages = (messages: any[] | undefined): Message[] => {
    if (!messages) return [];

    return messages
      .map(
        ({
          senderId,
          receiverId,
          content,
          createdAt,
          fileUrl,
          fileName,
          fileType,
          receiverName
        }) => ({
          senderId,
          receiverId,
          content,
          createdAt,
          fileUrl,
          fileName,
          fileType,
          receiverName
        })
      )
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  };

  const renderMessageContent = (message: Message) => {
    const renderFile = () => {
      if (!message.fileUrl) return null;

      if (message.fileType?.startsWith('image/')) {
        return (
          <img
            src={message.fileUrl}
            alt={message.fileName}
            className="max-w-full h-auto rounded-lg mt-2 max-h-32 "
          />
        );
      } else {
        return (
          <div className="flex items-center  space-x-2 mt-2">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <a
              href={message.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline">
              {message.fileName}
            </a>
          </div>
        );
      }
    };

    return (
      <>
        {message.content && <div>{message.content}</div>}
        {renderFile()}
      </>
    );
  };

  return (
    <div className="">
      {showSizeAlert && (
        <Alert
          message="最大ファイルサイズは5MBです。より小さいファイルをお選びください"
          type="error"
          onClose={handleCloseAlert}
        />
      )}
      <div
        ref={messageContainerRef}
        className="bg-[#F6F6F6] container_height overflow-y-auto p-4"
        style={{ maxHeight: '400px' }}>
        {messageData?.map((message, index) => (
          <div
            key={index}
            className={`chat ${message?.senderId == senderId ? 'chat-end' : 'chat-start'} mb-4`}>
            <div
              className={`flex ${message?.senderId == senderId ? 'justify-end' : 'justify-start'}`}>
              <div className="w-full">
                <div
                  className={`flex ${
                    message?.senderId == senderId ? 'justify-end' : 'justify-start'
                  } mb-1`}>
                  <span
                    className={`text-sm text-gray-500  px-2 py-1 bg-white rounded-sm shadow-sm`}>
                    {message?.senderId === senderId ? message?.receiverName : message?.receiverName}
                  </span>
                </div>
                <div
                  className={`chat-bubble ${
                    message?.senderId == senderId
                      ? 'bg-[#E5EFF1] text-gray-800' // Adjust for sender bubble color
                      : 'bg-[#FFFFFF] text-gray-800 ' // Adjust for receiver bubble color
                  } p-4 rounded-lg max-w-full text-sm sm:text-base break-words drop-shadow-lg`}>
                  {renderMessageContent(message)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center  border border-gray-300 rounded-xs p-1 w-full mt-6 md:mt-0">
        <div className=" w-full p-4 md:p-0 md:pr-6">
          <MessageTextAreaWithPreview
            value={sendMessageValue}
            onChange={handleTextChange}
            onFileChange={setSelectedFile}
            file={selectedFile}
          />
        </div>

        {/* Send Button */}
        <div className=" w-full flex flex-col md:flex-row items-center justify-between px-6 py-2 md:-mt-4">
          <div className="flex items-center flex-col md:flex-row gap-2">
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <button
                onClick={handleFileButtonClick}
                className="border border-gray-400 text-gray-700 px-3 py-1 h-[40px] rounded-[2px] hover:bg-gray-200 transition-colors duration-200 text-xs whitespace-nowrap">
                {selectedFile && selectedFile.type.startsWith('image/') ? (
                  <div className="relative flex items-center">
                    <div className="relative">
                      <img
                        src={URL.createObjectURL(selectedFile)}
                        alt={selectedFile.name}
                        className="h-5 w-5 object-cover rounded mr-1"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-3 h-3 flex items-center justify-center text-xs leading-none">
                        ×
                      </button>
                    </div>
                    <span className="pl-2">ファイルを選択してください</span>
                  </div>
                ) : (
                  <span>ファイルを選択してください</span>
                )}
              </button>
            </div>

            <span>{selectedFile ? selectedFile.name : 'ファイルが選択されていません'}</span>
          </div>
          <button
            onClick={handleSendMessageClick}
            className="bg-orange-500 mt-2 md:mt-0 text-white px-3 py-1 !w-full h-[40px] max-w-[150px] rounded-[2px] hover:bg-orange-600 transition-colors duration-200 text-xs whitespace-nowrap">
            メッセージを送信する
          </button>
        </div>
      </div>
    </div>
  );
};
