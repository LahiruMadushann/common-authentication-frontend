import React, { useState, useEffect } from 'react';
import { Button, Checkbox } from 'antd';

interface Input {
  prefectures: string;
  manicipalities: string;
}

interface Props {
  firstOptions: Array<{ value: string; label: string }>;
  secondOptions: { [key: string]: Array<{ value: string; label: string }> };
  onPrefectureChange?: (value: string, index: number) => void;
  setInputs: (inputs: Input[]) => void;
  inputs?: Input[];
  disable?: boolean;
}

export const MultipleOptionList: React.FC<Props> = ({
  firstOptions = [],
  secondOptions = {},
  onPrefectureChange,
  setInputs,
  inputs = [{ prefectures: '', manicipalities: '' }],
  disable
}) => {
  const [displayInputs, setDisplayInputs] = useState<Input[]>([]);
  const [selectedPrefecture, setSelectedPrefecture] = useState<string | null>(null);
  const [allMunicipalitiesSelected, setAllMunicipalitiesSelected] = useState(false);
  const [backendData, setBackendData] = useState<Input[]>([]);

  const getDisplayMunicipalities = (input: Input): string => {
    if (!input.manicipalities) return '';

    if (input.manicipalities === '全域') {
      const municipalityOptions = secondOptions[input.prefectures] || [];
      return municipalityOptions.map(opt => opt.value).join(',');
    }

    return input.manicipalities;
  };

  useEffect(() => {
    if (inputs.some(input => input.prefectures === '全国')) {
      const allPrefectures = firstOptions.map(option => {
        const existingInput = inputs.find(input => 
          input.prefectures === option.value || input.prefectures === '全国'
        );
        return {
          prefectures: option.value,
          manicipalities: existingInput ? getDisplayMunicipalities(existingInput) : ''
        };
      });
      setDisplayInputs(allPrefectures);
      setBackendData([{ prefectures: '全国', manicipalities: '' }]);
    } else {
      const displayData = inputs.map(input => ({
        ...input,
        manicipalities: getDisplayMunicipalities(input)
      }));
      setDisplayInputs(displayData);
      setBackendData(inputs);
    }
  }, [inputs, firstOptions, secondOptions]);

  const updateBackendData = (newDisplayInputs: Input[]): Input[] => {
    const allPrefecturesSelected = firstOptions.every(opt =>
      newDisplayInputs.some(input => input.prefectures === opt.value)
    );

    if (allPrefecturesSelected) {
      const municipalitySelections = newDisplayInputs.reduce((acc: { [key: string]: string }, input) => {
        if (input.manicipalities) {
          acc[input.prefectures] = input.manicipalities;
        }
        return acc;
      }, {});

      return firstOptions.map(opt => ({
        prefectures: opt.value,
        manicipalities: municipalitySelections[opt.value] || ''
      }));
    }

    return newDisplayInputs
      .filter(input => input.prefectures)
      .map(input => {
        if (!input.manicipalities) {
          return {
            prefectures: input.prefectures,
            manicipalities: ''
          };
        }

        const municipalityOptions = secondOptions[input.prefectures] || [];
        const selectedMunicipalities = input.manicipalities.split(',');
        const allMunicipalitiesSelected = 
          municipalityOptions.length > 0 &&
          municipalityOptions.length === selectedMunicipalities.length;

        return {
          prefectures: input.prefectures,
          manicipalities: allMunicipalitiesSelected ? '全域' : selectedMunicipalities.join(',')
        };
      });
  };

  const handleSelectAllPrefectures = () => {
    const allSelected = firstOptions.every(opt =>
      displayInputs.some(input => input.prefectures === opt.value)
    );

    if (!allSelected) {
      const allPrefectures = firstOptions.map(option => {
        const existingSelection = displayInputs.find(
          input => input.prefectures === option.value
        );
        return {
          prefectures: option.value,
          manicipalities: existingSelection ? existingSelection.manicipalities : ''
        };
      });
      setDisplayInputs(allPrefectures);
      const newBackendData = updateBackendData(allPrefectures);
      setBackendData(newBackendData);
      setInputs(newBackendData);
    } else {
      const emptyInput = [{ prefectures: '', manicipalities: '' }];
      setDisplayInputs(emptyInput);
      setBackendData(emptyInput);
      setInputs(emptyInput);
    }
    setSelectedPrefecture(null);
  };

  const handleSelectAllMunicipalities = () => {
    const newState = !allMunicipalitiesSelected;
    setAllMunicipalitiesSelected(newState);

    const newDisplayInputs = displayInputs.map(input => {
      if (input.prefectures) {
        const municipalityOptions = secondOptions[input.prefectures] || [];
        return {
          ...input,
          manicipalities: newState
            ? municipalityOptions.map(opt => opt.value).join(',')
            : ''
        };
      }
      return input;
    });

    setDisplayInputs(newDisplayInputs);
    const newBackendData = updateBackendData(newDisplayInputs);
    setBackendData(newBackendData);
    setInputs(newBackendData);
  };

  const handlePrefectureChange = (value: string, isSelected: boolean) => {
    if (isSelected) {
      const currentSelected = displayInputs
        .map(input => input.prefectures)
        .filter(p => p !== '');
      const willBeAllSelected = [...currentSelected, value].length === firstOptions.length;

      let newDisplayInputs: Input[];
      if (willBeAllSelected) {
        newDisplayInputs = firstOptions.map(option => ({
          prefectures: option.value,
          manicipalities: ''
        }));
      } else {
        const newInput = { prefectures: value, manicipalities: '' };
        newDisplayInputs = [...displayInputs.filter(p => p.prefectures !== ''), newInput];
      }

      setDisplayInputs(newDisplayInputs);
      const newBackendData = updateBackendData(newDisplayInputs);
      setBackendData(newBackendData);
      setInputs(newBackendData);

      setSelectedPrefecture(value);
      if (onPrefectureChange) {
        onPrefectureChange(value, displayInputs.length);
      }
    } else {
      const filtered = displayInputs.filter(input => input.prefectures !== value);
      const newDisplayInputs = filtered.length ? filtered : [{ prefectures: '', manicipalities: '' }];

      setDisplayInputs(newDisplayInputs);
      const newBackendData = updateBackendData(newDisplayInputs);
      setBackendData(newBackendData);
      setInputs(newBackendData);

      if (selectedPrefecture === value) {
        setSelectedPrefecture(null);
      }
    }
  };

  const handleMunicipalityChange = (prefecture: string, value: string, isSelected: boolean) => {
    const newDisplayInputs = displayInputs.map(input => {
      if (input.prefectures === prefecture) {
        const currentMunicipalities = input.manicipalities
          ? input.manicipalities.split(',')
          : [];

        let newMunicipalities: string[];
        if (isSelected) {
          newMunicipalities = [...new Set([...currentMunicipalities, value])];
        } else {
          newMunicipalities = currentMunicipalities.filter(m => m !== value);
        }

        return {
          ...input,
          manicipalities: newMunicipalities.join(',')
        };
      }
      return input;
    });

    setDisplayInputs(newDisplayInputs);
    const newBackendData = updateBackendData(newDisplayInputs);
    setBackendData(newBackendData);
    setInputs(newBackendData);
  };

  const isPrefectureSelected = (prefecture: string): boolean => {
    return displayInputs.some(input => input.prefectures === prefecture);
  };

  const isMunicipalitySelected = (prefecture: string, municipality: string): boolean => {
    const displayInput = displayInputs.find(input => input.prefectures === prefecture);
    return displayInput ? displayInput.manicipalities.split(',').includes(municipality) : false;
  };

  const getSortedDisplayInputs = () => {
    return firstOptions
      .map(option => displayInputs.find(input => input.prefectures === option.value))
      .filter((input): input is Input => input !== undefined);
  };

  return (
    <div className="w-full">
      <div className="!bg-[#587c94] text-white font-bold p-4 flex items-center">
        <span className="text-sm">対象エリア</span>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="border rounded-lg p-4 bg-[#fafafa]">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm font-medium">都道府県</div>
            <Button
              size="small"
              onClick={handleSelectAllPrefectures}
              className="text-xs"
            >
              {firstOptions.every(opt =>
                displayInputs.some(input => input.prefectures === opt.value)
              )
                ? '全解除'
                : '全選択'}
            </Button>
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            {firstOptions.map(option => (
              <div key={option.value} className="py-1">
                <Checkbox
                  checked={isPrefectureSelected(option.value)}
                  onChange={e => handlePrefectureChange(option.value, e.target.checked)}
                  disabled={disable}
                >
                  <span className="text-sm">{option.label}</span>
                </Checkbox>
              </div>
            ))}
          </div>
        </div>

        <div className="border rounded-lg p-4 bg-[#fafafa]">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm font-medium">市区町村・地域</div>
            {displayInputs.some(input => input.prefectures) && (
              <Button
                size="small"
                onClick={handleSelectAllMunicipalities}
                className="text-xs"
              >
                全選択
              </Button>
            )}
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            {displayInputs.some(input => input.prefectures) ? (
              getSortedDisplayInputs().map((input, index) => {
                const municipalityOptions = secondOptions[input.prefectures] || [];
                return (
                  <div key={index} className="mb-4">
                    <div className="text-sm font-medium mb-2">
                      {input.prefectures}
                    </div>
                    {municipalityOptions.map(option => (
                      <div key={option.value} className="ml-4 py-1">
                        <Checkbox
                          checked={isMunicipalitySelected(input.prefectures, option.value)}
                          onChange={e => handleMunicipalityChange(
                            input.prefectures,
                            option.value,
                            e.target.checked
                          )}
                          disabled={disable}
                        >
                          <span className="text-sm">{option.label}</span>
                        </Checkbox>
                      </div>
                    ))}
                  </div>
                );
              })
            ) : (
              <div className="text-sm text-gray-500">
                都道府県を選択してください
              </div>
            )}
          </div>
        </div>
      </div>

      <div 
        className="mt-4 border rounded-lg p-4"
        style={{ height: '200px', overflowY: 'auto' }}
      >
        <div className="text-sm font-medium mb-4">選択中エリア</div>
        {displayInputs.some(input => input.prefectures && input.manicipalities) ? (
          <div className="space-y-2">
            {getSortedDisplayInputs()
              .filter(input => input.prefectures && input.manicipalities)
              .map((input, index) => (
                <div key={index}>
                  <div className="font-medium">【{input.prefectures}】</div>
                  {input.manicipalities && (
                    <div className="text-sm text-gray-600 ml-4 mt-1">
                      {getDisplayMunicipalities(input).split(',').join('、')}
                    </div>
                  )}
                </div>
              ))}
          </div>
        ) : (
          <div className="text-gray-500">エリアが選択されていません</div>
        )}
      </div>
    </div>
  );
};

export default MultipleOptionList;