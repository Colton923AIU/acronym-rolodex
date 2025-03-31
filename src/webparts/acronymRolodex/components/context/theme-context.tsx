import * as React from "react";

import { createContext, useContext, type ReactNode } from "react";
import type { ThemeOptions } from "../types";

// Default theme values
const defaultTheme: ThemeOptions = {
  primaryColor: "#3b82f6",
  secondaryColor: "#f3f4f6",
  tertiaryColor: "#e5e7eb",
  // inlineCSS: {},
};

// Create context
const ThemeContext = createContext<ThemeOptions>(defaultTheme);

// Theme provider component
export interface ThemeProviderProps {
  children: ReactNode;
  theme?: ThemeOptions;
}

export function ThemeProvider({ children, theme = {} }: ThemeProviderProps) {
  // Merge default theme with provided theme
  const mergedTheme = { ...defaultTheme, ...theme };

  return (
    <ThemeContext.Provider value={mergedTheme}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to use theme
export function useTheme() {
  return useContext(ThemeContext);
}
