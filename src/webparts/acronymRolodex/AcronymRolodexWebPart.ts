import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import { SPHttpClient } from "@microsoft/sp-http";
import { AcronymData, AcronymRolodexProps } from "./components/types";
import { AcronymRolodex } from "./components/rolodex";

class ListService {
  private _spHttpClient: SPHttpClient;

  constructor(spHttpClient: SPHttpClient) {
    this._spHttpClient = spHttpClient;
  }

  // Fetch columns of a SharePoint list
  public getListFieldsInfo(listUrl: string): Promise<ISPListFieldInfo[]> {
    // Extract the subsite and list name from the provided URL
    const urlParts = listUrl.split("/Lists/");
    const subsiteUrl = urlParts[0]; // This includes the subsite part
    const listTitle = decodeURIComponent(urlParts[1].split("/")[0]); // Extract list title and decode it

    // Construct the full API URL pointing to the subsite and the list's fields
    const apiUrl = `${subsiteUrl}/_api/web/lists/getbytitle('${listTitle}')/fields`;

    return this._spHttpClient
      .get(apiUrl, SPHttpClient.configurations.v1)
      .then((response) => response.json())
      .then((data: any) =>
        data.value.map((field: any) => ({
          fieldTitle: field.Title, // Assuming "Title" is the field you want to use
          fieldInternalName: field.InternalName,
        }))
      );
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
}

export default class AcronymRolodexWebPart extends BaseClientSideWebPart<IAcronymRolodexWebPartProps> {
  // private _isDarkTheme: boolean = false;
  private _listService: ListService; // Add list service to fetch list details
  private _dropdownFieldOptions: IPropertyPaneDropdownOption[] = [];
  private data: AcronymData[];

  public render(): void {
    if (!this.data) return;
    if (this.data.length === 0) return;
    const element: React.ReactElement<AcronymRolodexProps> =
      React.createElement(AcronymRolodex, {
        data: this.data,
      });

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    // Initialize your list service, which will fetch list info
    this._listService = new ListService(
      this.context.spHttpClient as unknown as SPHttpClient
      // this.context.pageContext.web.absoluteUrl    // cool
    );
    return new Promise(() => {});
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected async onPropertyPaneFieldChanged(
    propertyPath: string,
    oldValue: any,
    newValue: any
  ): Promise<void> {
    if (propertyPath === "listURL" && newValue !== oldValue) {
      // Fetch list field options from the service
      const response: ISPListFieldInfo[] =
        await this._listService.getListFieldsInfo(newValue);
      this._dropdownFieldOptions = response.map((field) => ({
        key: field.fieldInternalName, // Use internal name as the key
        text: field.fieldTitle, // Use the display name as the text
      }));

      // Refresh the property pane to display the dropdown
      this.context.propertyPane.refresh();
    }
  }

  protected async onPropertyPaneConfigurationComplete(): Promise<void> {
    const urlParts = this.properties.listURL.split("/Lists/");
    const subsiteUrl = urlParts[0]; // This includes the subsite part
    const listTitle = decodeURIComponent(urlParts[1].split("/")[0]); // Extract list title and decode it
    const selectFields = `${this.properties.acronym},${this.properties.categories},${this.properties.definition},${this.properties.details}`;

    // Construct the full API URL pointing to the subsite and list's items
    const apiUrl = `${subsiteUrl}/_api/web/lists/getbytitle('${listTitle}')/items?$select=${selectFields}`;
    this.data = await this.context.spHttpClient
      .get(apiUrl, SPHttpClient.configurations.v1 as any)
      .then((response) => response.json())
      .then((data: any) => {
        // Map the data to the structure of ISPListData
        return data.value.map((item: any) => {
          const data = {
            acronym: item[this.properties.acronym],
            categories: item[this.properties.categories],
            definition: item[this.properties.definition],
            details: item[this.properties.details],
          };
          return data;
        });
      });
    this.render();
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: "SharePoint Acronyms Project",
          },
          groups: [
            {
              groupName: "Attach List Data",
              groupFields: [
                PropertyPaneTextField("listURL", {
                  label: "SharePoint List URL",
                }),

                PropertyPaneDropdown("acronym", {
                  label: "Acronym Column",
                  options: this._dropdownFieldOptions, // Set options dynamically
                }),
                PropertyPaneDropdown("definition", {
                  label: "Acronym Definition Column",
                  options: this._dropdownFieldOptions, // Set options dynamically
                }),
                PropertyPaneDropdown("categories", {
                  label: "Acronym Categories Column",
                  options: this._dropdownFieldOptions, // Set options dynamically
                }),
                PropertyPaneDropdown("details", {
                  label: "Acronym Details Column",
                  options: this._dropdownFieldOptions, // Set options dynamically
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
