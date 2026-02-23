import React, { useEffect, useState } from 'react';
import { DatePicker, ConfigProvider } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import jaJP from 'antd/es/locale/ja_JP';

dayjs.extend(customParseFormat);

interface DateTimePickerProps {
  time: string | null;
  setTime: (time: string | null) => void;
  initialValue?: string | null;
  minDate?: any;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  time,
  setTime,
  initialValue,
  minDate
}) => {
  const [formattedDate, setFormattedDate] = useState<Dayjs | null>(
    initialValue ? dayjs(initialValue) : null
  );

  useEffect(() => {
    if (initialValue) {
      setFormattedDate(dayjs(initialValue));
    }
  }, [initialValue]);

  const handleChange = (value: Dayjs | null) => {
    if (value) {
      setFormattedDate(value);
      setTime(value.format('YYYY-MM-DD HH:mm:ss'));
    } else {
      setFormattedDate(null);
      setTime(null);
    }
  };

  return (
    <ConfigProvider
      locale={jaJP}
      theme={{
        components: {
          DatePicker: {
            colorBgContainer: '#fff9c5'
          }
        }
      }}>
      <DatePicker
        format="YYYY-MM-DD"
        value={formattedDate ?? undefined}
        minDate={minDate ? dayjs(minDate) : undefined}
        onChange={handleChange}
        placeholder=""
        className="py-2 w-full"
        suffixIcon={<h1></h1>}
      />
    </ConfigProvider>
  );
};
