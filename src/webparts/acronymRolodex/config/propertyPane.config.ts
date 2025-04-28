import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown,
  IPropertyPaneDropdownOption,
} from "@microsoft/sp-property-pane";

export interface IPropertyPaneState {
  dropdownOptions: IPropertyPaneDropdownOption[];
}

export function getPropertyPaneConfig(state: IPropertyPaneState): IPropertyPaneConfiguration {
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
                options: state.dropdownOptions,
              }),
              PropertyPaneDropdown("definition", {
                label: "Acronym Definition Column",
                options: state.dropdownOptions,
              }),
              PropertyPaneDropdown("categories", {
                label: "Acronym Categories Column",
                options: state.dropdownOptions,
              }),
              PropertyPaneDropdown("details", {
                label: "Acronym Details Column",
                options: state.dropdownOptions,
              }),
            ],
          },
          {
            groupName: "Theme Settings",
            groupFields: [
              PropertyPaneTextField("fontFamily", {
                label: "Base Font Family",
                placeholder: "system-ui, -apple-system, sans-serif",
              }),
              PropertyPaneTextField("headingFontFamily", {
                label: "Heading Font Family",
                placeholder: "system-ui, -apple-system, sans-serif",
              }),
              PropertyPaneTextField("monoFontFamily", {
                label: "Monospace Font Family",
                placeholder: "ui-monospace, monospace",
              }),
              PropertyPaneTextField("baseFontSize", {
                label: "Base Font Size",
                placeholder: "16px",
              }),
              PropertyPaneTextField("primaryColor", {
                label: "Primary Color",
                placeholder: "#000000",
              }),
              PropertyPaneTextField("secondaryColor", {
                label: "Secondary Color",
                placeholder: "#4A5568",
              }),
              PropertyPaneTextField("accentColor", {
                label: "Accent Color",
                placeholder: "#3182CE",
              }),
              PropertyPaneTextField("textColor", {
                label: "Text Color",
                placeholder: "#1A202C",
              }),
              PropertyPaneTextField("backgroundColor", {
                label: "Background Color",
                placeholder: "#FFFFFF",
              }),
              PropertyPaneTextField("containerPadding", {
                label: "Container Padding",
                placeholder: "2rem",
              }),
              PropertyPaneTextField("borderRadius", {
                label: "Border Radius",
                placeholder: "0.5rem",
              }),
            ],
          },
        ],
      },
    ],
  };
} 