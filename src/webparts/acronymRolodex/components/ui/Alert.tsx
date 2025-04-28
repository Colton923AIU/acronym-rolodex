import * as React from 'react';

export type AlertType = 'error' | 'warning' | 'info' | 'success';

interface AlertProps {
  type?: AlertType;
  title?: string;
  children?: React.ReactNode;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({ type = 'info', title, children, className = '' }) => (
  <div className={className}>
    {title && <h3>{title}</h3>}
    <div>{children}</div>
  </div>
);

export default Alert; 