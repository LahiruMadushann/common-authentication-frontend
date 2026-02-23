import React from 'react';

interface InputFieldProps {
  label: string;
  name: string;
  value?: string; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({ label, name, value = '', onChange, readOnly = false }) => (
  <div className="flex flex-col">
    <label>{label}</label>
    <input
      type="text"
      name={name}
      value={value} 
      onChange={onChange}
      readOnly={readOnly}
      className="font-bold input border-b-1 border-b-primary focus:border-b-1 focus:border-b-primary border-t-transparent border-x-transparent w-full focus:outline-none mb-8"
    />
  </div>
);

export default InputField;
