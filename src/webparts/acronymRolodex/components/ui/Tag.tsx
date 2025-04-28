import * as React from 'react';

interface TagProps {
  children: React.ReactNode;
  color?: string; // background color
  className?: string;
}

const Tag: React.FC<TagProps> = ({ children, color, className = '' }) => (
  <span
    className={className}
    style={color ? { backgroundColor: color } : {}}
  >
    {children}
  </span>
);

export default Tag; 