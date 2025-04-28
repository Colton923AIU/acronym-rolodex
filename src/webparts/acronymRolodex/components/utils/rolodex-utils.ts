/**
 * Extracts the first character from a string and converts it to uppercase
 */
export function getFirstChar(str: string): string {
  if (!str || typeof str !== 'string' || str.length === 0) {
    console.warn('Empty or invalid string provided to getFirstChar:', str);
    return ''; // Return empty string for empty input
  }
  return str.charAt(0).toUpperCase();
}

/**
 * Creates an array of unique first characters from an array of strings
 */
export function getUniqueFirstChars(items: string[]): string[] {
  console.log('Getting unique first chars from:', items);
  
  if (!Array.isArray(items) || items.length === 0) {
    console.warn('No items provided to getUniqueFirstChars');
    return [];
  }
  
  const uniqueChars = new Set<string>();
  
  items.forEach(item => {
    if (item && typeof item === 'string' && item.length > 0) {
      uniqueChars.add(getFirstChar(item));
    }
  });
  
  const result = Array.from(uniqueChars).sort();
  console.log('Unique first chars:', result);
  return result;
}

/**
 * Filters an array of items by the first character of a specified property
 */
export function filterByFirstChar<T>(
  items: T[],
  char: string,
  property: keyof T
): T[] {
  if (!Array.isArray(items) || items.length === 0) {
    console.warn('No items provided to filterByFirstChar');
    return [];
  }
  
  if (!char) {
    console.warn('No character provided to filterByFirstChar');
    return [];
  }
  
  console.log(`Filtering ${items.length} items by first char '${char}' on property '${String(property)}'`);
  
  const filtered = items.filter((item) => {
    const value = item[property];
    if (typeof value === "string" && value.length > 0) {
      const firstChar = getFirstChar(value);
      return firstChar === char;
    }
    return false;
  });
  
  console.log(`Filtered to ${filtered.length} items`);
  return filtered;
}
