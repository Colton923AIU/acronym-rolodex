import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  type IPropertyPaneConfiguration,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import { SPHttpClient } from "@microsoft/sp-http";
import { AcronymData } from "./components/types";
import { SharePointService, ISharePointServiceConfig } from "./services/sharepoint.service";
import { getPropertyPaneConfig, IPropertyPaneState } from "./config/propertyPane.config";
import { Log } from '@microsoft/sp-core-library';
import { SlotMachineRolodex } from "./components/rolodex";
class ListService {
  private _spHttpClient: SPHttpClient;

  constructor(spHttpClient: SPHttpClient) {
    this._spHttpClient = spHttpClient;
  }

  // Fetch columns of a SharePoint list
  public getListFieldsInfo(listUrl: string): Promise<ISPListFieldInfo[]> {
    // Extract the subsite and list name from the provided URL
    const urlParts = listUrl.split("/Lists/");
    if (urlParts.length < 2) {
      return Promise.reject(new Error("Invalid list URL format. Expected format: https://site/subsite/Lists/ListName"));
    }
    
    const subsiteUrl = urlParts[0]; // This includes the subsite part
    const listParts = urlParts[1].split("/");
    if (listParts.length === 0) {
      return Promise.reject(new Error("Invalid list URL format. Could not extract list name."));
    }
    
    const listTitle = decodeURIComponent(listParts[0]); // Extract list title and decode it

    // Construct the full API URL pointing to the subsite and the list's fields
    const apiUrl = `${subsiteUrl}/_api/web/lists/getbytitle('${listTitle}')/fields`;

    console.log('Fetching fields from:', apiUrl);

    return this._spHttpClient
      .get(apiUrl, SPHttpClient.configurations.v1)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch fields: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((data: any) => {
        if (!data || !data.value || !Array.isArray(data.value)) {
          console.error('Invalid response from SharePoint:', data);
          throw new Error('Invalid response from SharePoint');
        }
        
        return data.value
          .filter((field: any) => field.Title && field.InternalName)
          .map((field: any) => ({
            fieldTitle: field.Title,
            fieldInternalName: field.InternalName,
          }));
      })
      .catch(error => {
        console.error('Error fetching list fields:', error);
        throw error;
      });
  }
}

// Define interfaces for the data returned by SharePoint API
interface ISPListFieldInfo {
  fieldTitle: string;
  fieldInternalName: string;
}

interface IPropertyPaneDropdownOption {
  key: string;
  text: string;
}

export interface IAcronymRolodexWebPartProps {
  description: string;
  listURL: string;
  spHTTPClient: SPHttpClient;
  acronym: string;
  definition: string;
  categories: string;
  details: string;
  
  // Theme Properties
  fontFamily: string;
  headingFontFamily: string;
  monoFontFamily: string;
  baseFontSize: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
  backgroundColor: string;
  containerPadding: string;
  borderRadius: string;
}

export default class AcronymRolodexWebPart extends BaseClientSideWebPart<IAcronymRolodexWebPartProps> {
  private _listService: ListService; // Add list service to fetch list details
  private _dropdownFieldOptions: IPropertyPaneDropdownOption[] = [];
  private data: AcronymData[];
  private _sharePointService: SharePointService | null = null;
  private _propertyPaneState: IPropertyPaneState = {
    dropdownOptions: [],
  };

  private getThemeVariables(): string {
    const {
      fontFamily,
      headingFontFamily,
      monoFontFamily,
      baseFontSize,
      primaryColor,
      secondaryColor,
      accentColor,
      textColor,
      backgroundColor,
      containerPadding,
      borderRadius,
    } = this.properties;

    return `
      --font-sans: ${fontFamily || 'system-ui, -apple-system, sans-serif'};
      --font-heading: ${headingFontFamily || 'var(--font-sans)'};
      --font-mono: ${monoFontFamily || 'ui-monospace, monospace'};
      --font-size-base: ${baseFontSize || '16px'};
      --primary: ${primaryColor || '#000000'};
      --secondary: ${secondaryColor || '#4A5568'};
      --accent: ${accentColor || '#3182CE'};
      --foreground: ${textColor || '#1A202C'};
      --background: ${backgroundColor || '#FFFFFF'};
      --container-padding: ${containerPadding || '2rem'};
      --radius: ${borderRadius || '0.5rem'};
    `;
  }

  public render(): void {
    // Create a style element for theme variables
    const style = document.createElement('style');
    style.textContent = `
      .${this.context.manifest.id} {
        ${this.getThemeVariables()}
      }
      
      /* Force Tailwind to take precedence in SharePoint */
      .${this.context.manifest.id} .tailwind-acronym-rolodex * {
        box-sizing: border-box;
      }
    `;
    this.domElement.appendChild(style);

    // Add Tailwind scoping classes to the root element
    this.domElement.classList.add('tailwind-enabled');

    // Initialize the service config
    const serviceConfig = this.getServiceConfig();
    
    // Log what we're passing to the component

    const element: React.ReactElement = React.createElement(SlotMachineRolodex, {
      data: [],
      spService: this._sharePointService,
      config: serviceConfig,
      className: `${this.context.manifest.id} tailwind-acronym-rolodex`,
    });

    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    await super.onInit();
    
    // Initialize list service
    this._listService = new ListService(this.context.spHttpClient as unknown as SPHttpClient);
    
    // Initialize SharePoint service if we have list URL
    this.initializeSharePointService();
    
    // Log initialization
    console.log('AcronymRolodexWebPart initialized with properties:', this.properties);
    
    return Promise.resolve();
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  private initializeSharePointService(): void {
    if (this.properties.listURL) {
      try {
        console.log('Initializing SharePoint service with list URL:', this.properties.listURL);
        this._sharePointService = new SharePointService(
          this.context.spHttpClient as unknown as SPHttpClient,
          this.getServiceConfig()
        );
      } catch (error) {
        console.error('Error initializing SharePoint service:', error);
        this._sharePointService = null;
      }
    } else {
      console.log('No list URL provided, SharePoint service not initialized');
      this._sharePointService = null;
    }
  }

  // Helper function to clean the list URL (strip off any query parameters and view pages)
  private cleanListUrl(url: string): string {
    if (!url) return '';
    
    // Remove any query parameters
    let cleanUrl = url.split('?')[0];
    
    // Remove AllItems.aspx or any other view page
    if (cleanUrl.includes('/AllItems.aspx')) {
      cleanUrl = cleanUrl.split('/AllItems.aspx')[0];
    } else if (cleanUrl.includes('.aspx')) {
      // Handle any other .aspx pages
      const parts = cleanUrl.split('/');
      const lastPart = parts[parts.length - 1];
      if (lastPart.includes('.aspx')) {
        parts.pop();
        cleanUrl = parts.join('/');
      }
    }
    
    return cleanUrl;
  }

  private getServiceConfig(): ISharePointServiceConfig {
    return {
      listUrl: this.properties.listURL || '',
      fieldMappings: {
        acronym: this.properties.acronym || '',
        definition: this.properties.definition || '',
        categories: this.properties.categories || '',
        details: this.properties.details || '',
      },
    };
  }

  protected async onPropertyPaneFieldChanged(
    propertyPath: string,
    oldValue: any,
    newValue: any
  ): Promise<void> {
    if (propertyPath === "listURL" && newValue !== oldValue) {
      console.log('List URL changed from', oldValue, 'to', newValue);
      
      if (!newValue) {
        this._sharePointService = null;
        this._propertyPaneState.dropdownOptions = [];
        this.context.propertyPane.refresh();
        this.render();
        return;
      }
      
      // Re-initialize service with new URL
      this.initializeSharePointService();
      
      if (this._listService && newValue) {
        try {
          console.log('Fetching field information for list:', newValue);
          const fields = await this._listService.getListFieldsInfo(newValue);
          
          console.log('Retrieved fields:', fields);
          this._propertyPaneState.dropdownOptions = fields.map((field) => ({
            key: field.fieldInternalName,
            text: field.fieldTitle,
          }));
          
          this.context.propertyPane.refresh();
          this.render();
        } catch (error) {
          console.error('Error fetching list fields:', error);
          Log.error('AcronymRolodexWebPart', error as Error, this.context.serviceScope);
          
          // Clear dropdown options on error
          this._propertyPaneState.dropdownOptions = [];
          this.context.propertyPane.refresh();
        }
      }
    } else if (["acronym", "definition", "categories", "details"].includes(propertyPath) && newValue !== oldValue) {
      // Re-render component when field mappings change
      this.render();
    }
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return getPropertyPaneConfig(this._propertyPaneState);
  }
}
