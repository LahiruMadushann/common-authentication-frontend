import React from 'react'

type MessageProps = {
    value?: string;
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    rows?:number;
    cols?:number;
  };

const MessageTextArea = ({ value, onChange, placeholder, rows, cols }:MessageProps) => {
    return (
      <div className="my-4 w-full md:w-auto">
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          cols={cols}
          className=" textarea textarea-primary w-full md:w-[calc(100%-2rem)] p-2 "
          style={{ borderColor: '#08234C' }}
        />
      </div>
    );
  }

export default MessageTextArea
