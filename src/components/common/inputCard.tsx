import React, { useEffect, useState } from 'react';
import { Checkbox, Button } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import TypedInputNumber from 'antd/es/input-number';
import { useBuyerStore } from '@/src/stores/buyer.store';

// Define types for the props
interface WeekDay {
  label: string;
  value: string;
}

interface Component {
  id: string | null;
  week: string | null;
  days: string[];
}

interface InputCardProps {
  id?: string | null;
}

export const InputCard: React.FC<InputCardProps> = ({ id }) => {
  const { results, setResult } = useBuyerStore();
  const [components, setComponents] = useState<Component[]>([{ id: null, week: '', days: [] }]);
  const [error, setError] = useState<string>('');

  const jpWeekDays: WeekDay[] = [
    { label: '月', value: 'MONDAY' },
    { label: '火', value: 'TUESDAY' },
    { label: '水', value: 'WEDNESDAY' },
    { label: '木', value: 'THURSDAY' },
    { label: '金', value: 'FRIDAY' },
    { label: '土', value: 'SATURDAY' },
    { label: '日', value: 'SUNDAY' }
  ];

  // Update components whenever results change
  useEffect(() => {
    if (results && results?.length > 0) {
      const groupedComponents = results.reduce((acc, item) => {
        const foundIndex = acc.findIndex((comp) => comp.week === item.week);
        if (foundIndex !== -1) {
          acc[foundIndex].days.push(item.day);
        } else {
          acc.push({ id: item.id, week: item.week, days: [item.day] });
        }
        return acc;
      }, [] as Component[]);

      setComponents(
        groupedComponents.length > 0 ? groupedComponents : [{ id: null, week: '', days: [] }]
      );
    }
  }, [results]);

  const addComponent = () => {
    if (components.length < 6) {
      setComponents([...components, { id: null, week: '', days: [] }]);
    }
  };

  const removeComponent = (index: number) => {
    if (index > 0) {
      const newComponents = [...components];
      newComponents.splice(index, 1);
      setComponents(newComponents);

      // Update store after removing a component
      const result = newComponents.flatMap((component) =>
        component.days.map((day) => ({
          id: component.id,
          week: component.week,
          day
        }))
      );
      setResult(result);
    }
  };

  const handleWeekChange = (index: number, value: number | null) => {
    const newComponents = [...components];

    if (value === null || value === undefined) {
      newComponents[index].week = '';
    } else if (value < 1 || value > 5) {
      setError('定休日の間隔に1から5までの数字を入力してください');
      return;
    } else {
      newComponents[index].week = value.toString();
      setError('');
    }

    setComponents(newComponents);

    // Only update store if there are days selected
    if (newComponents[index].days.length > 0) {
      const result = newComponents.flatMap((component) =>
        component.days.map((day) => ({
          id: component.id,
          week: component.week,
          day
        }))
      );
      setResult(result);
    }
  };

  const handleCheckboxChange = (index: number, value: string) => {
    const newComponents = [...components];
    const days = newComponents[index].days;

    if (days.includes(value)) {
      newComponents[index].days = days.filter((day) => day !== value);
    } else {
      newComponents[index].days.push(value);
    }

    setComponents(newComponents);

    // Update store only if there are days selected
    if (newComponents[index].days.length > 0) {
      const result = newComponents.flatMap((component) =>
        component.days.map((day) => ({
          id: component.id,
          week: component.week,
          day
        }))
      );
      setResult(result);
    }
  };

  const isWeekValid = (week: string | null): boolean => {
    if (!week || week === '') return false;
    const weekNumber = Number(week);
    return weekNumber >= 1 && weekNumber <= 5;
  };

  return (
    <div className="flex items-start flex-wrap gap-2">
      {components.map((component, index) => (
        <React.Fragment key={index}>
          <div className="w-11/12 md:w-7/12 flex flex-col items-start gap-4 p-4 border border-[#587c94]">
            <div className="w-full flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <h1 className="text-black">第</h1>
                <div className="flex items-center gap-2">
                  <TypedInputNumber
                    min={'1'}
                    max={'5'}
                    className="bg-white w-20"
                    onChange={(value: any) => handleWeekChange(index, value)}
                    value={component.week === '' ? null : component.week}
                    controls={false}
                  />
                  <h1 className="text-black">週</h1>
                </div>
              </div>
            </div>
            {error && <div className="text-red-500 w-full text-left">{error}</div>}
            <div className="w-full flex flex-wrap gap-4">
              {jpWeekDays.map((day) => (
                <div key={day.value} className="flex items-center gap-2">
                  <Checkbox
                    value={day.value}
                    checked={component.days.includes(day.value)}
                    onChange={() => handleCheckboxChange(index, day.value)}
                    disabled={!isWeekValid(component.week)}>
                    {day.label}
                  </Checkbox>
                </div>
              ))}
            </div>
          </div>
          <div className="my-1">
            {index > 0 && (
              <Button
                className="rounded-full"
                onClick={() => removeComponent(index)}
                icon={<DeleteOutlined />}
                danger
              />
            )}
          </div>
        </React.Fragment>
      ))}
      <Button
        className="rounded-full mx-4 mb-2 md:mb-0"
        onClick={addComponent}
        icon={<PlusOutlined />}
        disabled={components.length >= 6}
      />
    </div>
  );
};
