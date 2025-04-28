import * as React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
}

const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => (
  <div>
    {label && <label>{label}</label>}
    <input
      className={className}
      {...props}
    />
    {error && <div>{error}</div>}
  </div>
);

export default Input; 