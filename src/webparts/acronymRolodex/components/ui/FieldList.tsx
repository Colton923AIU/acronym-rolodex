import * as React from 'react';

interface Field {
  label: string;
  value: string;
}

interface FieldListProps {
  fields: Field[];
  className?: string;
}

const FieldList: React.FC<FieldListProps> = ({ fields, className = '' }) => (
  <div className={className}>
    {fields.map((field) => (
      <div key={field.label}>
        <span>{field.label}:</span> {field.value || 'Not set'}
      </div>
    ))}
  </div>
);

export default FieldList; 