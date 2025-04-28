import { SharePointService, ISharePointServiceConfig } from "../../services/sharepoint.service";

// import * as React from "react";
// Common data interfaces
export interface BaseItem {
  id?: string | number;
}

export interface AcronymData extends BaseItem {
  acronym: string;
  definition: string;
  details?: string;
  categories?: string[];
}

// Theme options interface
export interface ThemeOptions {
  primaryColor?: string;
  secondaryColor?: string;
  tertiaryColor?: string;
  // inlineCSS?: React.CSSProperties;
}

// Base props for all rolodex-style components
export interface BaseRolodexProps extends ThemeOptions {
  className?: string;
}

// Specific props for the Acronym Rolodex
export interface AcronymRolodexProps extends BaseRolodexProps {
  data: AcronymData[];
  spService: SharePointService | null;
  config: ISharePointServiceConfig;
}
