import * as React from "react";
import { Button } from "../ui";

interface ResultsListProps<T> {
  items: T[];
  selectedItem?: T;
  onSelectItem: (item: T) => void;
  renderItem: (item: T) => React.ReactNode;
  emptyMessage?: string;
  keyExtractor?: (item: T) => string | number;
}

export function ResultsList<T>({
  items,
  selectedItem,
  onSelectItem,
  renderItem,
  emptyMessage = "No items found",
  keyExtractor = (item: any) => item.id || Math.random().toString(36),
}: ResultsListProps<T>) {
  return (
    <div>
      {items.length === 0 ? (
        <div className="ar-empty-state">{emptyMessage}</div>
      ) : (
        <ul>
          {items.map((item) => {
            const key = keyExtractor(item);
            const isSelected = item === selectedItem;
            return (
              <li key={key}>
                <button
                  className={`ar-result-item${isSelected ? " selected" : ""}`}
                  onClick={() => onSelectItem(item)}
                  type="button"
                >
                  {renderItem(item)}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
} 