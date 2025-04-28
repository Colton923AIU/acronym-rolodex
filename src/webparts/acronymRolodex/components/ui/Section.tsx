import * as React from 'react';
import Text from './Text';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

const Section: React.FC<SectionProps> = ({ children, className = '', title }) => (
  <section className={className}>
    {title && <Text as="h2">{title}</Text>}
    {children}
  </section>
);

export default Section; 