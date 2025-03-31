import * as React from "react";
import { getUniqueFirstChars, filterByFirstChar } from "../utils/rolodex-utils";

export function useRolodex<T>(items: T[] = [], propertyKey: keyof T) {
  const [selectedChar, setSelectedChar] = React.useState<string | null>(null);
  const [selectedItem, setSelectedItem] = React.useState<T | null>(null);

  // Get unique first characters
  const uniqueChars = React.useMemo(() => {
    // Ensure items is an array before mapping
    if (!Array.isArray(items)) return [];

    const propertyValues = items.map((item) => {
      const value = item[propertyKey];
      return typeof value === "string" ? value : "";
    });
    return getUniqueFirstChars(propertyValues);
  }, [items, propertyKey]);

  // Filter items by selected character
  const filteredItems = React.useMemo(() => {
    if (!selectedChar || !Array.isArray(items)) return [];
    return filterByFirstChar(items, selectedChar, propertyKey);
  }, [items, selectedChar, propertyKey]);

  // Select the first character by default if none is selected
  if (uniqueChars.length > 0 && !selectedChar) {
    setSelectedChar(uniqueChars[0]);
  }

  // Handle character selection
  const handleCharSelect = (char: string) => {
    setSelectedChar(char);
    setSelectedItem(null);
  };

  return {
    uniqueChars,
    filteredItems,
    selectedChar,
    selectedItem,
    setSelectedItem,
    handleCharSelect,
  };
}
