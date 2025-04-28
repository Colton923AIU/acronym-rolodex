import * as React from "react";
import { Card } from '../ui';

interface RolodexLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const RolodexLayout: React.FC<RolodexLayoutProps> = ({
  children,
  className = "",
}) => {
  return (
    <Card className={className}>
      <div>{children}</div>
    </Card>
  );
}; 