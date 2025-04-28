import * as React from 'react';

interface TextProps {
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  children: React.ReactNode;
}

const Text: React.FC<TextProps> = ({
  as = 'span',
  className = '',
  children,
}) => {
  const Component = as;
  return (
    <Component className={className}>{children}</Component>
  );
};

export default Text; 