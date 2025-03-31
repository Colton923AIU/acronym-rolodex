/**
 * Extracts the first character from a string and converts it to uppercase
 */
export function getFirstChar(str: string): string {
  return str.charAt(0).toUpperCase();
}
/**
 * Creates an array of unique first characters from an array of strings
 */
export function getUniqueFirstChars(items: string[]): string[] {
  const firstChars = items.map((item) => getFirstChar(item));
  return Array.from(new Set(firstChars)).sort();
}

/**
 * Filters an array of items by the first character of a specified property
 */
export function filterByFirstChar<T>(
  items: T[],
  char: string,
  property: keyof T
): T[] {
  return items.filter((item) => {
    const value = item[property];
    if (typeof value === "string") {
      return getFirstChar(value) === char;
    }
    return false;
  });
}
