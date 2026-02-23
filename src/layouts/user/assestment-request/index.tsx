import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLazyGetAppraisalQuery, useUpdateAppraisalMutation } from '@/src/app/services/appraisal';
import { AppraisalRequestInformation } from '@/src/types/appraisal';
import Skelton from './skelton';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/pages/login/store';
import InputField from '@/src/components/input/InputField';
import Alert from '@/src/components/alert';
import moment from 'moment';

export interface UpdateResponse {
  message?: string;
  error?: string;
}

const AssessmentRequestInformationLayout: React.FC = () => {
  const [appraisalData, setAppraisalData] = useState<AppraisalRequestInformation | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [getAppraisal, { isError: isGetError, error: getError }] = useLazyGetAppraisalQuery();
  const [updateAppraisal] = useUpdateAppraisalMutation();
  const userId = useSelector((state: RootState) => state.auth?.userId ?? null);
  const [alert, setAlert] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>(
    {
      show: false,
      message: '',
      type: 'success'
    }
  );

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...(prevData as Record<string, any>),
      [name]: value
    }));
  }, []);

  const handleSubmit = useCallback(async () => {
    try {
      await updateAppraisal(formData).unwrap();
      setAlert({ show: true, message: 'アップデートは成功した！', type: 'success' });
    } catch (err) {
      if (err instanceof Error) {
        console.error('Update failed:', err.message);
        setAlert({ show: true, message: `更新失敗: ${err.message}`, type: 'error' });
      } else {
        console.error('Update failed with unknown error:', err);
        setAlert({
          show: true,
          message: '不明なエラーでアップデートに失敗しました。',
          type: 'error'
        });
      }
    }
  }, [formData, updateAppraisal]);

  const handleCloseAlert = () => {
    setAlert({ show: false, message: '', type: 'success' });
  };

  const fetchAppraisalData = useCallback(() => {
    setIsLoading(true);
    getAppraisal(Number(userId))
      .unwrap()
      .then((data: any) => {
        setAppraisalData(data);
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
  }, [fetchAppraisalData]);

  useEffect(() => {
    if (appraisalData) {
      setFormData(appraisalData);
    }
  }, [appraisalData]);

  useEffect(() => {
    if (isGetError) {
      handleErrors(getError);
    }
  }, [isGetError, getError]);

  const handleErrors = (error: any) => {
    console.error('An error occurred:', error);
  };

  const formatCarTraveledDistance = (value: string) => {
    if (value === "～900000000km") {
      return "210,000Km以上";
    }
    return value;
  };

  return (
    <div className="p-4">
      {isLoading ? (
        <div>
          <Skelton />
        </div>
      ) : (
        <>
          <div className="mt-6">
            <p className="flex justify-center mb-4 text-lg font-bold bg-[#597C95] text-white">車両</p>
            <table className="w-full table-auto">
              <tbody>
                {[
                  ['carMaker', 'inspectRemain', 'shift'],
                  ['carType', 'runnable', 'fuel'],
                  ['carModelYear', 'accident', 'wheelDrive'],
                  ['grade', 'loan', 'carState'],
                  ['carTraveledDistance', 'desireDate', 'displacement'],
                  ['bodyColor']
                ].map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {row.map((field, colIndex) => (
                      <td key={colIndex} className="px-4">
                        <InputField
                          label={getLabel(field)}
                          name={field}
                          value={field === 'carTraveledDistance' ? 
                            formatCarTraveledDistance(formData?.[field] || '') : 
                            formData?.[field] || ''}
                          onChange={handleInputChange}
                          readOnly={true}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            <p className="flex justify-center mb-4 text-lg font-bold bg-[#597C95] text-white">
              査定希望日
            </p>
            <table className="w-full table-auto">
              <tbody>
                {[['assessmentDateFirst', 'assessmentDateSecond', 'assessmentDateThird']].map(
                  (row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {row.map((field, colIndex) => (
                        <td key={colIndex} className="px-4">
                          <InputField
                            label={getLabel(field)}
                            name={field}
                            value={formData?.assessmentDates?.[colIndex] && moment(formData?.assessmentDates?.[colIndex]?.assessmentDate).format('YYYY-MM-DD')}                            
                            onChange={handleInputChange}
                            readOnly={true}
                          />
                        </td>
                      ))}
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            <p className="flex justify-center mb-4 text-lg font-bold bg-[#597C95] text-white">
              外装の状態
            </p>
            <table className="w-full table-auto">
              <tbody>
                {[
                  ['exterior', 'scratch', 'peel'],
                  ['dent', 'rust']
                ].map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {row.map((field, colIndex) => (
                      <td key={colIndex} className="px-4">
                        <InputField
                          label={getLabel(field)}
                          name={field}
                          value={formData?.[field] || ''}
                          onChange={handleInputChange}
                          readOnly={true}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            <p className="flex justify-center mb-4 text-lg font-bold bg-[#597C95] text-white">
              内装の状態
            </p>
            <table className="w-full table-auto">
              <tbody>
                {[
                  ['interior', 'dirt', 'airConditioning'],
                  ['tear', 'smoke']
                ].map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {row.map((field, colIndex) => (
                      <td key={colIndex} className="px-4">
                        <InputField
                          label={getLabel(field)}
                          name={field}
                          value={formData?.[field] || ''}
                          onChange={handleInputChange}
                          readOnly={true}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            <p className="flex justify-center mb-4 text-lg font-bold bg-[#597C95] text-white">
              装飾品
            </p>
            <table className="w-full table-auto">
              <tbody>
                {[
                  ['navigation', 'handleType', 'sunroof'],
                  ['autoSlide', 'backMonitor', 'wheel'],
                  ['leatherSheet']
                ].map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {row.map((field, colIndex) => (
                      <td key={colIndex} className="px-4">
                        <InputField
                          label={getLabel(field)}
                          name={field}
                          value={formData?.[field] || ''}
                          onChange={handleInputChange}
                          readOnly={true}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* <div className="flex justify-center mt-4">
            {alert.show && (
              <Alert message={alert.message} type={alert.type} onClose={handleCloseAlert} />
            )}
            <Button onClick={handleSubmit}>保存する</Button>
          </div> */}
        </>
      )}
    </div>
  );
};

const getLabel = (field: string) => {
  const labels: Record<string, string> = {
    carMaker: 'メーカー',
    inspectRemain: '車検日',
    shift: 'シフト',
    carType: '車種',
    runnable: '走行',
    fuel: '燃料',
    carModelYear: '年式',
    accident: '事故歴',
    wheelDrive: '駆動',
    grade: 'グレード',
    loan: 'ローン',
    carState: '車両状態',
    carTraveledDistance: '走行距離',
    desireDate: '希望査定日',
    displacement: '排気量',
    bodyColor: 'ボディカラー',
    assessmentDateFirst: '査定希望日1',
    assessmentDateSecond: '査定希望日2',
    assessmentDateThird: '査定希望日3',
    exterior: '外装',
    scratch: '傷',
    peel: '剥がれ',
    dent: '凹み',
    rust: '錆',
    interior: '内装',
    dirt: '汚れ',
    airConditioning: 'エアコン',
    tear: '破れ',
    smoke: '喫煙',
    navigation: 'ナビ',
    handleType: 'ハンドル',
    sunroof: 'サンルーフ',
    autoSlide: 'オートスライドドア',
    backMonitor: 'バックモニター',
    wheel: 'ホイール',
    leatherSheet: 'レザーシート'
  };
  return labels[field] || field;
};

export default AssessmentRequestInformationLayout;
