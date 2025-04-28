import * as React from "react";
import { getUniqueFirstChars, filterByFirstChar } from "../utils/rolodex-utils";

export function useRolodex<T>(items: T[] = [], propertyKey: keyof T) {
  const [selectedChar, setSelectedChar] = React.useState<string | null>(null);
  const [selectedItem, setSelectedItem] = React.useState<T | null>(null);

  // Debug the incoming data
  React.useEffect(() => {
    console.log('useRolodex received items:', items);
    if (items && items.length > 0) {
      console.log('Sample item:', items[0]);
      console.log('Property key being used:', propertyKey);
      console.log('Sample property value:', items[0][propertyKey]);
    } else {
      console.warn('No items received in useRolodex hook');
    }
  }, [items, propertyKey]);

  // Get unique first characters
  const uniqueChars = React.useMemo(() => {
    // Ensure items is an array before mapping
    if (!Array.isArray(items)) {
      console.warn('Items is not an array in uniqueChars calculation');
      return [];
    }

    // Check if items actually has content
    if (items.length === 0) {
      console.warn('Empty items array in uniqueChars calculation');
      return [];
    }

    console.log(`Processing ${items.length} items to get unique first chars`);
    
    const propertyValues = items
      .filter(item => item && typeof item === 'object') 
      .map((item) => {
        const value = item[propertyKey];
        const result = typeof value === "string" ? value : "";
        if (!result) {
          console.warn(`Item has no value for property ${String(propertyKey)}:`, item);
        }
        return result;
      })
      .filter(value => value && value.length > 0); // Filter out empty values
      
    console.log(`Extracted ${propertyValues.length} property values for uniqueChars`);
    
    return getUniqueFirstChars(propertyValues);
  }, [items, propertyKey]);

  // Filter items by selected character
  const filteredItems = React.useMemo(() => {
    if (!selectedChar) {
      console.log('No character selected for filtering');
      return [];
    }
    
    if (!Array.isArray(items)) {
      console.warn('Items is not an array in filteredItems calculation');
      return [];
    }
    
    // Check if items actually has content
    if (items.length === 0) {
      console.warn('Empty items array in filteredItems calculation');
      return [];
    }
    
    console.log(`Filtering ${items.length} items by character '${selectedChar}'`);
    return filterByFirstChar(items, selectedChar, propertyKey);
  }, [items, selectedChar, propertyKey]);

  // Handle initialization or updates when uniqueChars changes
  React.useEffect(() => {
    if (uniqueChars.length > 0) {
      if (!selectedChar || !uniqueChars.includes(selectedChar)) {
        console.log(`Setting initial selected char to '${uniqueChars[0]}'`);
        setSelectedChar(uniqueChars[0]);
      }
    } else {
      console.warn('No unique chars available, clearing selected char');
      setSelectedChar(null);
    }
  }, [uniqueChars, selectedChar]);

  // Handle character selection
  const handleCharSelect = (char: string) => {
    console.log(`Character selected: '${char}'`);
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
