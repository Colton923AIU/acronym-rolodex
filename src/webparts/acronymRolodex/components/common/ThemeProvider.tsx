import * as React from "react";
import { ThemeProvider as ContextThemeProvider } from "../context/theme-context";
import { ThemeOptions } from "../types";

interface ThemeProviderProps extends ThemeOptions {
  children: React.ReactNode;
  className?: string;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  primaryColor,
  secondaryColor,
  tertiaryColor,
  className = "",
  children,
}) => {
  // Custom theme for this instance
  const theme = {
    primaryColor,
    secondaryColor,
    tertiaryColor,
  };

  return (
    <ContextThemeProvider theme={theme}>
      <div className={className}>{children}</div>
    </ContextThemeProvider>
  );
}; 