import * as React from "react";
import type { AcronymRolodexProps } from "../types";
import { ThemeProvider } from "../context/theme-context";
import { Alert, Spinner, Text, Button, FieldList } from "../ui";
import { useSharePointData } from "../hooks/use-sharepoint-data";
// import { SlotMachineRolodex } from "./slot-machine-rolodex";
const SlotMachineRolodex = React.lazy(() => import("./slot-machine-rolodex").then(module => ({ default: module.SlotMachineRolodex })));
import "../../globals.css";

export function AcronymRolodexApp({
  data: initialData = [],
  primaryColor,
  secondaryColor,
  tertiaryColor,
  className = "",
  spService,
  config,
}: AcronymRolodexProps) {
  // Custom theme for this instance
  const theme = {
    primaryColor,
    secondaryColor,
    tertiaryColor,
  };

  // Use SharePoint data hook if service is available
  const { data: spData, isLoading, error, refreshData } = useSharePointData(
    spService!,
    config
  );

  // Combine initial data with SharePoint data
  const data = React.useMemo(() => {
    if (!spService) {
      return initialData;
    }
    return spData;
  }, [initialData, spData, spService]);

  // Function to retry loading data
  const handleRetry = React.useCallback(() => {
    refreshData();
  }, [refreshData]);

  if (error) {
    return (
      <div className="acronym-rolodex-app">
        <Alert type="error">
          <Text as="h3">Error loading data:</Text>
          <Text as="p">{error.message}</Text>
          <FieldList
            fields={[
              { label: "List URL", value: config.listUrl || "Not set" },
              { label: "Acronym", value: config.fieldMappings.acronym || "Not set" },
              { label: "Definition", value: config.fieldMappings.definition || "Not set" },
              { label: "Categories", value: config.fieldMappings.categories || "Not set" },
              { label: "Details", value: config.fieldMappings.details || "Not set" },
            ]}
          />
          <Button onClick={handleRetry}>Retry</Button>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="acronym-rolodex-app">
        <Alert type="info">
          <Spinner size={20} />
          <Text as="span">Loading acronym data...</Text>
        </Alert>
      </div>
    );
  }

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="acronym-rolodex-app">
        <Alert type="warning">
          <Text as="h3">No acronym data available</Text>
          <Text as="p">Please check your SharePoint list configuration.</Text>
          <FieldList
            fields={[
              { label: "List URL", value: config.listUrl || "Not set" },
              { label: "Acronym", value: config.fieldMappings.acronym || "Not set" },
              { label: "Definition", value: config.fieldMappings.definition || "Not set" },
              { label: "Categories", value: config.fieldMappings.categories || "Not set" },
              { label: "Details", value: config.fieldMappings.details || "Not set" },
            ]}
          />
          <Button onClick={handleRetry}>Retry</Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="acronym-rolodex-app">
      <ThemeProvider theme={theme}>
        <React.Suspense fallback={<div>Loading Rolodex...</div>}>
          <SlotMachineRolodex
            data={data}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            tertiaryColor={tertiaryColor}
            className={className}
            spService={spService}
            config={config}
          />
        </React.Suspense>
      </ThemeProvider>
    </div>
  );
} 