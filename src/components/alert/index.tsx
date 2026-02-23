import React from 'react';
import ReactDOM from 'react-dom';

interface AlertProps {
  message: string;
  type: 'success' | 'error' | 'normal';
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, type, onClose }) => {
  if (!message) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50"
      role="dialog"
      aria-labelledby="alert-dialog-title"
      aria-modal="true"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 border-[#08234C] border">
        {type !== 'normal' && (
          <h3
            id="alert-dialog-title"
            className={`text-lg font-semibold ${
              type === 'success' ? 'text-green-700' : 'text-red-700'
            }`}
          >
            {type === 'success' ? '成功' : 'エラー'}
          </h3>
        )}
        <p className="mt-2 text-sm text-gray-700">{message}</p>
        <div className="mt-6 flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#08234C] text-white rounded-lg hover:bg-[#0a2a68] focus:ring focus:ring-blue-300 transition ease-in-out duration-150"
          >
            {type === 'normal' ? '閉じる' : 'オーケー'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Alert;
