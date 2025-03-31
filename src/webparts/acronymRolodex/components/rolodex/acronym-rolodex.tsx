import * as React from "react";
import type { AcronymRolodexProps, AcronymData } from "../types";
import { ThemeProvider } from "../context/theme-context";
import { LetterSelector, ItemList, DetailView, TagList } from "../ui";
import { useRolodex } from "../hooks/use-rolodex";

export function AcronymRolodex({
  data = [],
  primaryColor,
  secondaryColor,
  tertiaryColor,
  // inlineCSS = {},
  className = "",
}: AcronymRolodexProps) {
  // Custom theme for this instance
  const theme = {
    primaryColor,
    secondaryColor,
    tertiaryColor,
    // inlineCSS,
  };

  // Ensure data is an array
  const safeData = Array.isArray(data) ? data : [];

  // Use the rolodex hook
  const {
    uniqueChars,
    filteredItems,
    selectedChar,
    selectedItem,
    setSelectedItem,
    handleCharSelect,
  } = useRolodex<AcronymData>(safeData, "acronym");

  return (
    <ThemeProvider theme={theme}>
      <div
        className={`w-full max-w-[800px] mx-auto border rounded-lg shadow-sm overflow-hidden ${className}`}
        // style={{ ...inlineCSS }}
      >
        <div className="flex h-[400px]">
          {/* Column 1: Letters */}
          <div className="w-1/6 border-r">
            <LetterSelector
              letters={uniqueChars}
              selectedLetter={selectedChar}
              onSelectLetter={handleCharSelect}
            />
          </div>

          {/* Column 2: Acronyms */}
          <div className="w-1/3 border-r">
            <ItemList
              items={filteredItems}
              selectedItem={selectedItem}
              onSelectItem={setSelectedItem}
              emptyMessage={
                selectedChar
                  ? `No acronyms found starting with '${selectedChar}'`
                  : "No acronyms available"
              }
              renderItem={(item) => (
                <>
                  <div className="font-medium text-base">{item.acronym}</div>
                  <div className="text-sm truncate">{item.definition}</div>
                </>
              )}
            />
          </div>

          {/* Column 3: Acronym Details */}
          <DetailView isEmpty={!selectedItem}>
            {selectedItem && (
              <>
                <div>
                  <h2 className="text-2xl font-bold">{selectedItem.acronym}</h2>
                  <h3 className="text-xl">{selectedItem.definition}</h3>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-1">Details</h4>
                  <p className="text-base">{selectedItem.details}</p>
                </div>
                {selectedItem.categories ? (
                  <div className="mt-auto">
                    <h4 className="text-sm font-medium mb-1">Categories</h4>
                    <TagList tags={selectedItem.categories} />
                  </div>
                ) : null}
              </>
            )}
          </DetailView>
        </div>
      </div>
    </ThemeProvider>
  );
}
