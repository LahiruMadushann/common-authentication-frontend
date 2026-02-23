import { useRef } from 'react';

const MessageTextAreaWithPreview = ({ value, onChange, onFileChange, file }: any) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const renderFilePreview = () => {
    if (!file) return null;

    if (file.type.startsWith('image/')) {
      return (
        <div className="relative w-20 h-10 mt-2">
          <img
            src={URL.createObjectURL(file)}
            alt={file.name}
            className="w-full h-full object-cover rounded"
          />
          <button
            className="absolute top-0 right-0 bg-red-500 text-white rounded-sm w-3 h-3 flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              onFileChange(null);
            }}>
            ×
          </button>
        </div>
      );
    } else {
      return (
        <div className="flex items-center space-x-2 mt-2">
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
          <span className="text-blue-500">{file.name}</span>
          <button
            className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              onFileChange(null);
            }}>
            ×
          </button>
        </div>
      );
    }
  };

  return (
    <div className="relative border border-[#B7B7B7] md:my-[20px] md:ml-[24px]">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={onChange}
        placeholder="メッセージを入力"
        className="w-full resize-none outline-none p-2 md:p-0 md:h-[48px] md:pt-3 md:pl-[28px]"
        rows={1}
      />
    </div>
  );
};

export default MessageTextAreaWithPreview;