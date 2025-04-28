import * as React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  disabled = false,
  ...props
}) => (
  <button
    className={className}
    disabled={disabled}
    {...props}
  >
    {children}
  </button>
);

export default Button; 