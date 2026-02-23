import { Select, Input, Button, DatePicker } from 'antd';
import type { DatePickerProps } from 'antd';

const AppraisalsFilterSection = () => {
  //Todo : when buyer status change fetch appraisals list.
  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  //Todo : when change date fetch appraisals list.
  const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    console.log(date, dateString);
  };

  return (
    <div className="grid grid-cols-2 mb-5">
      <div>
        <Select
          defaultValue="not compatible"
          style={{ width: 120 }}
          onChange={handleChange}
          options={[
            { value: 'not compatible', label: 'not compatible' },
            { value: 'lucy', label: 'Lucy' },
            { value: 'Yiminghe', label: 'yiminghe' },
            { value: 'disabled', label: 'Disabled' }
          ]}
        />
      </div>
      <div className="grid grid-cols-1">
        <div className="grid grid-cols-3">
          <div className="mr-5 col-span-2">
            <Input placeholder="" />
          </div>
          <div>
            <Button type="primary">検索</Button>
          </div>
        </div>
        <div className="flex my-3">
          <div className="mr-5">
            <p>開始日</p>
            <DatePicker onChange={onChange} width={400} />
          </div>
          <div>
            <p>終了日</p>
            <DatePicker onChange={onChange} width={200} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppraisalsFilterSection;
