import * as React from "react";

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
    <div className="flex-1 overflow-y-auto p-4 flex flex-col">
      {!isEmpty ? (
        <div className="space-y-4 flex-1">{children}</div>
      ) : (
        <div className="h-full flex items-center justify-center">
          {emptyState}
        </div>
      )}
    </div>
  );
}
