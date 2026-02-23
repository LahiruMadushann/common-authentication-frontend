import React, { useState, KeyboardEvent } from 'react';
import { Button, Modal } from 'antd';
import { Store } from 'antd/es/form/interface';
import { useTabStore } from '@/src/stores/tabStore';
import { useAppStore } from '@/src/stores/app.store';
import { useBuyerStore } from '@/src/stores/buyer.store';
import ParseJwt from '@/src/pages/login/ParseJwt';

interface ShopListControlsProps {
  handleCsvTemplateDownload: () => void;
  handleCsvUpload: () => Promise<{ success: boolean; statusCode: number }> | any;
  fileInputRef: React.RefObject<HTMLInputElement> | any;
  onSearch: (searchTerm: string) => void;
  onRefreshData?: () => void;
  uploadStatus: any;
  setUploadStatus: any;
  storeData:
    | {
        content?: Store[];
      }
    | null
    | undefined
    | any;
  merchnatData: any;
}

const ShopListControls: React.FC<ShopListControlsProps> = ({
  handleCsvTemplateDownload,
  handleCsvUpload,
  fileInputRef,
  uploadStatus,
  setUploadStatus,
  onSearch,
  onRefreshData,
  storeData,
  merchnatData
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [alertInfo, setAlertInfo] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );
  const { setTabKeyAction } = useTabStore();
  const { setEditRegisterId, setEditRegisterFormStatus } = useAppStore();
  const { setStroeTypeDisbale, setHeadBranchId } = useBuyerStore();
  const urlParams = new URLSearchParams(window.location.search);
  const token = localStorage.getItem('token');
  const decodedToken = ParseJwt(token);
  const shopType = decodedToken?.shopType;

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleFileSelection = () => {
    setIsFileSelected(!!fileInputRef.current?.files?.length);
    setAlertInfo(null);
  };

  const handleUpload = async () => {
    setIsUploading(true);
    try {
      const result = await handleCsvUpload();
      if (result.success) {
        setAlertInfo({ type: 'success', message: 'ファイルが正常にアップロードされました。' });
        if (onRefreshData) {
          onRefreshData();
        }
      } else {
        let errorMessage = 'アップロードに失敗しました。';
        switch (result.statusCode) {
          case 400:
            errorMessage += ' ' + (result.message || 'Invalid request.');
            break;
          case 403:
            errorMessage += ' アップロードする権限がありません。';
            break;
          default:
            errorMessage += ' エラーが発生しました。';
        }
        setAlertInfo({ type: 'error', message: errorMessage });
      }
    } catch (error) {
      setAlertInfo({ type: 'error', message: 'アップロード中にエラーが発生しました。' });
    } finally {
      setIsUploading(false);
      setIsFileSelected(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCloseAlert = () => {
    setAlertInfo(null);
  };

  const isButtonDisabled = (merchnatData: any) => {
    return merchnatData?.id === 219 || merchnatData?.id === 346;
  };

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start mb-4 space-y-4 lg:space-y-0">
      <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-[31vw] mt-[10%] w-full lg:w-[75%]">
        <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-2 lg:space-y-0 lg:space-x-4 w-full lg:w-1/2">
          {merchnatData && merchnatData.shopTypeEnum === 'HEAD_BRANCH' && (
            <>
              <input
                type="text"
                placeholder="店名"
                className="border border-gray-300 p-2 rounded-md w-full lg:w-auto"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button
                className="bg-gray-200 border border-gray-400 text-gray-900 rounded-md px-4 py-2 w-full lg:w-auto"
                onClick={handleSearch}>
                検索
              </Button>
            </>
          )}
        </div>
        <div className="lg:justify-end">
          {merchnatData && merchnatData.shopTypeEnum === 'HEAD_BRANCH' && (
            <Button
              className="bg-gray-200 border border-gray-400 rounded-md px-4 py-2 w-full lg:w-auto"
              onClick={() => {
                setEditRegisterId(null);
                setEditRegisterFormStatus(false);
                setTabKeyAction('7');
                setStroeTypeDisbale(true);
                setHeadBranchId(merchnatData?.id);
              }}>
              新規登録
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col space-y-2 w-full lg:w-auto items-end">
        {shopType !== 'SUB_BRANCH' && (
          <Button
            className="border border-orange-400 text-orange-500 px-4 py-2 rounded-md w-full lg:w-auto"
            disabled={isButtonDisabled(merchnatData)}
            onClick={() => {
              setEditRegisterFormStatus(true);
              setEditRegisterId(merchnatData?.id);
              setTabKeyAction('7');
              setStroeTypeDisbale(true);
              setHeadBranchId(merchnatData?.id);
            }}
            style={{
              opacity: isButtonDisabled(merchnatData) ? 0.5 : 1,
              cursor: isButtonDisabled(merchnatData) ? 'not-allowed' : 'pointer',
              borderColor: isButtonDisabled(merchnatData) ? '#d1d5db' : undefined,
              color: isButtonDisabled(merchnatData) ? '#6b7280' : undefined
            }}>
            買取店情報編集
          </Button>
        )}

        {merchnatData && merchnatData.shopTypeEnum === 'HEAD_BRANCH' && (
          <>
            <Button
              className="border border-blue-700 text-blue-800 rounded-md px-4 py-2 w-full lg:w-auto"
              onClick={handleCsvTemplateDownload}>
              CSVテンプレートをダウンロード
            </Button>

            <div className="flex items-center space-x-2">
              <Button
                className="bg-gray-200 border border-gray-400 rounded-md px-4 py-2 w-full lg:w-auto"
                onClick={() => fileInputRef.current?.click()}
                disabled={isFileSelected || isUploading}>
                ファイルを選択
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".csv"
                onChange={handleFileSelection}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Button
                className="bg-gray-900 border border-gray-800 text-white px-4 py-2 rounded-md w-full lg:w-auto"
                onClick={handleUpload}
                disabled={!isFileSelected || isUploading}>
                保存
              </Button>
            </div>
          </>
        )}
      </div>

      <Modal
        title={alertInfo?.type === 'success' ? '成功' : 'エラー'}
        open={!!alertInfo}
        onOk={handleCloseAlert}
        onCancel={handleCloseAlert}
        wrapClassName="notranslate"
        footer={[
          <Button
            key="ok"
            onClick={handleCloseAlert}
            className="bg-blue-500 text-white px-4 py-2 rounded-md">
            OK
          </Button>
        ]}>
        <p>{alertInfo?.message}</p>
      </Modal>
    </div>
  );
};

export default ShopListControls;
