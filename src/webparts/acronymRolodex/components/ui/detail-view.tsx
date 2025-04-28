import * as React from "react";
import { Card, Section } from '../ui';

interface DetailViewProps {
  children: React.ReactNode;
  emptyState?: React.ReactNode;
  isEmpty?: boolean;
}

export function DetailView({
  children,
  emptyState = "Select an item to view details",
  isEmpty = false,
}: DetailViewProps) {
  return (
    <Card className="flex-1 overflow-y-auto p-4 flex flex-col">
      {!isEmpty ? (
        <div className="space-y-4 flex-1">{children}</div>
      ) : (
        <Section className="h-full flex items-center justify-center m-0 rounded-none bg-transparent p-0">
          {emptyState}
        </Section>
      )}
    </Card>
  );
}
