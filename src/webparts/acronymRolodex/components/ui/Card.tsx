import * as React from 'react';
import Text from './Text';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  actions?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, className = '', title, actions }) => (
  <div className={className}>
    {(title || actions) && (
      <div>
        {title && <Text as="h2">{title}</Text>}
        {actions && <div>{actions}</div>}
      </div>
    )}
    <div>{children}</div>
  </div>
);

export default Card; 