import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  disabled?: boolean;
};

const Button = ({
  children,
  onClick,
  type = 'button',
  className = '',
  disabled = false
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-outline btn-primary h-12 sm:h-10 md:h-14 px-4 sm:px-6 md:px-8 mx-1 sm:mx-2 my-1 sm:my-0 text-sm sm:text-base md:text-lg`}>
      {children}
    </button>
  );
};

export default Button;
