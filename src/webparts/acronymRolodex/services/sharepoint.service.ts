import { SPHttpClient } from "@microsoft/sp-http";
import { AcronymData } from "../components/types";

export interface ISPListFieldInfo {
  fieldTitle: string;
  fieldInternalName: string;
}

export interface ISharePointField {
  Title: string;
  InternalName: string;
}

export interface ISharePointListItem {
  [key: string]: string;
}

export interface ISharePointServiceConfig {
  listUrl: string;
  fieldMappings: {
    acronym: string;
    definition: string;
    categories: string;
    details: string;
  };
}

export class SharePointError extends Error {
  constructor(message: string, public readonly statusCode?: number) {
    super(message);
    this.name = 'SharePointError';
  }
}

export class SharePointService {
  private readonly _spHttpClient: SPHttpClient;
  private readonly _subsiteUrl: string;
  private readonly _listTitle: string;

  constructor(spHttpClient: SPHttpClient, config: ISharePointServiceConfig) {
    this._spHttpClient = spHttpClient;
    
    // Extract the proper list URL by removing any potential view URLs or parameters
    const listUrl = this.cleanListUrl(config.listUrl);
    console.log('Cleaned list URL:', listUrl);
    
    // Split the URL properly
    const urlParts = this.extractListParts(listUrl);
    this._subsiteUrl = urlParts.siteUrl;
    this._listTitle = urlParts.listTitle;
    
    console.log('Extracted site URL:', this._subsiteUrl);
    console.log('Extracted list title:', this._listTitle);
  }
  
  // Clean the list URL to handle various formats (view pages, query parameters, etc.)
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
  
  // Extract site URL and list title from the cleaned URL
  private extractListParts(url: string): { siteUrl: string; listTitle: string } {
    // First check if the URL follows the standard /Lists/ pattern
    if (url.includes('/Lists/')) {
      const parts = url.split('/Lists/');
      const siteUrl = parts[0];
      const listParts = parts[1].split('/');
      const listTitle = decodeURIComponent(listParts[0]);
      
      return { siteUrl, listTitle };
    }
    
    // Handle document libraries (which don't use /Lists/ in their URL)
    const urlParts = url.split('/');
    const listTitle = decodeURIComponent(urlParts[urlParts.length - 1]);
    const siteUrl = urlParts.slice(0, urlParts.length - 1).join('/');
    
    return { siteUrl, listTitle };
  }

  public async getListFieldsInfo(): Promise<ISPListFieldInfo[]> {
    try {
      console.log(`Fetching fields from list "${this._listTitle}" in site "${this._subsiteUrl}"`);
      const apiUrl = `${this._subsiteUrl}/_api/web/lists/getbytitle('${this._listTitle}')/fields`;
      console.log('API URL for fields:', apiUrl);
      
      const response = await this._spHttpClient.get(apiUrl, SPHttpClient.configurations.v1);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        console.error('Error response from SharePoint:', error);
        throw new SharePointError(`Failed to fetch list fields: ${response.statusText}`, response.status);
      }

      const data = await response.json();
      return data.value.map((field: ISharePointField) => ({
        fieldTitle: field.Title,
        fieldInternalName: field.InternalName,
      }));
    } catch (error) {
      console.error('Error in getListFieldsInfo:', error);
      if (error instanceof SharePointError) {
        throw error;
      }
      throw new SharePointError('Failed to fetch list fields');
    }
  }

  public async getListItems(fieldMappings: ISharePointServiceConfig['fieldMappings']): Promise<AcronymData[]> {
    try {
      // Make sure we have valid field mappings and none are empty
      const validFieldMappings = Object.entries(fieldMappings)
        .filter(([_, value]) => !!value);
      
      if (validFieldMappings.length === 0) {
        throw new SharePointError('No valid field mappings provided');
      }

      // Create a select query using only valid field mappings
      const selectFields = validFieldMappings.map(([_, value]) => value).join(',');
      
      // Ensure we're not sending empty or invalid select fields
      const apiUrl = `${this._subsiteUrl}/_api/web/lists/getbytitle('${this._listTitle}')/items?$select=${selectFields}`;
      
      console.log('SharePoint API URL for items:', apiUrl);
      
      const response = await this._spHttpClient.get(apiUrl, SPHttpClient.configurations.v1);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message?.value || `HTTP Error ${response.status}`;
        throw new SharePointError(`Failed to fetch list items: ${errorMessage}`, response.status);
      }

      const data = await response.json();
      console.log('Raw SharePoint data:', data);
      
      // Check if we got a valid response with a 'value' property that is an array
      if (!data || !Array.isArray(data.value)) {
        console.error('Invalid response format from SharePoint:', data);
        throw new SharePointError('Invalid response format from SharePoint');
      }
      
      console.log('Number of items received:', data.value.length);
      
      const mappedItems = data.value.map((item: any) => {
        // Log each item to troubleshoot mapping issues
        console.log('Mapping item:', {
          rawItem: item,
          acronymField: fieldMappings.acronym,
          definitionField: fieldMappings.definition,
          categoriesField: fieldMappings.categories,
          detailsField: fieldMappings.details,
          acronymValue: item[fieldMappings.acronym],
          definitionValue: item[fieldMappings.definition],
          categoriesValue: item[fieldMappings.categories],
          detailsValue: item[fieldMappings.details],
        });
        
        const mappedItem: AcronymData = {
          acronym: item[fieldMappings.acronym] || '',
          definition: item[fieldMappings.definition] || ''
        };
        
        // Only add categories if the field exists and has content
        if (fieldMappings.categories && item[fieldMappings.categories] !== null && item[fieldMappings.categories] !== undefined) {
          // Check if categories is stored as a string or already as an array
          const categoryData = item[fieldMappings.categories];
          if (typeof categoryData === 'string') {
            mappedItem.categories = categoryData.split(';').filter(Boolean);
          } else if (Array.isArray(categoryData)) {
            mappedItem.categories = categoryData;
          }
        }
        
        // Add details if the field exists
        if (fieldMappings.details && item[fieldMappings.details] !== null && item[fieldMappings.details] !== undefined) {
          mappedItem.details = item[fieldMappings.details];
        }
        
        return mappedItem;
      });
      
      console.log('Mapped items:', mappedItems);
      return mappedItems;
    } catch (error) {
      console.error('Error fetching SharePoint items:', error);
      if (error instanceof SharePointError) {
        throw error;
      }
      throw new SharePointError(error instanceof Error ? error.message : 'Failed to fetch list items');
    }
  }
} 