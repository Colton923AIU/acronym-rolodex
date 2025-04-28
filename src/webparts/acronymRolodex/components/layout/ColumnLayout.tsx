import * as React from "react";
import { Section } from '../ui';

interface ColumnLayoutProps {
  letterColumn: React.ReactNode;
  itemColumn: React.ReactNode;
  detailColumn: React.ReactNode;
}

export const ColumnLayout: React.FC<ColumnLayoutProps> = ({
  letterColumn,
  itemColumn,
  detailColumn,
}) => {
  return (
    <>
      {/* Column 1: Letters */}
      <Section className="w-1/6 border-r h-full m-0 rounded-none">{letterColumn}</Section>

      {/* Column 2: Acronyms */}
      <Section className="w-1/3 border-r h-full m-0 rounded-none">{itemColumn}</Section>

      {/* Column 3: Acronym Details */}
      <Section className="w-1/2 h-full m-0 rounded-none">{detailColumn}</Section>
    </>
  );
}; 