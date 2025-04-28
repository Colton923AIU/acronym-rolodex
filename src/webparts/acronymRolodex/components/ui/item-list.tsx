import * as React from "react";

import { useTheme } from "../context/theme-context";
import type { AcronymData } from "../types";
import Button from "./Button";
import Section from './Section';

interface ItemListProps<T extends AcronymData> {
  items: T[];
  selectedItem: T | null;
  onSelectItem: (item: T) => void;
  renderItem: (item: T) => React.ReactNode;
  emptyMessage?: string;
}

export function ItemList<T extends AcronymData>({
  items = [],
  selectedItem,
  onSelectItem,
  renderItem,
  emptyMessage = "No items found",
}: ItemListProps<T>) {
  const { primaryColor, secondaryColor, tertiaryColor } = useTheme();

  return (
    <Section className="w-full h-full overflow-y-auto m-0 rounded-none bg-transparent p-0">
      <div className="flex flex-col">
        {Array.isArray(items) && items.length > 0 ? (
          items.map((item) => (
            <Button
              key={item.id || JSON.stringify(item)}
              variant="secondary"
              className="py-3 px-4 text-left hover:opacity-80 transition-colors border-b"
              style={{
                backgroundColor:
                  selectedItem === item ? `${primaryColor}20` : "transparent",
                borderColor: tertiaryColor,
              }}
              onClick={() => onSelectItem(item)}
            >
              {renderItem(item)}
            </Button>
          ))
        ) : (
          <div className="p-4 text-center">{emptyMessage}</div>
        )}
      </div>
    </Section>
  );
}
