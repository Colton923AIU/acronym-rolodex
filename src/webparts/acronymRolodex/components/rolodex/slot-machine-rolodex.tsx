import * as React from "react";
import { ThemeProvider } from "../context/theme-context";
import { Alert, Spinner, Text, Button, FieldList } from "../ui";
import { useRolodex } from "../hooks/use-rolodex";
import { useSharePointData } from "../hooks/use-sharepoint-data";
import type { AcronymRolodexProps, AcronymData } from "../types";
import "./slot-machine-rolodex.css";

export function SlotMachineRolodex({
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

  // Use the rolodex hook for letters
  const {
    uniqueChars,
    selectedChar,
    handleCharSelect,
  } = useRolodex<AcronymData>(data, "acronym");

  // Filter acronyms by selected letter
  const filteredAcronyms = React.useMemo(() => {
    if (!selectedChar) return [];
    return data.filter(item => item.acronym && item.acronym[0].toUpperCase() === selectedChar);
  }, [data, selectedChar]);

  // State for selected indices
  const [letterIndex, setLetterIndex] = React.useState(0);
  const [acronymIndex, setAcronymIndex] = React.useState(0);

  // Refs for scroll containers
  const letterScrollRef = React.useRef<HTMLDivElement>(null);
  const acronymScrollRef = React.useRef<HTMLDivElement>(null);

  // When selectedChar changes, reset acronym index and scroll
  React.useEffect(() => {
    setAcronymIndex(0);
    if (acronymScrollRef.current) {
      acronymScrollRef.current.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [selectedChar]);

  // When uniqueChars changes, reset letter index and scroll
  React.useEffect(() => {
    setLetterIndex(0);
    if (letterScrollRef.current) {
      letterScrollRef.current.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [uniqueChars]);

  // Current acronym to display
  const currentAcronym = filteredAcronyms[acronymIndex] || null;

  // Error/loading/empty states
  if (error) {
    return (
      <div className="slot-machine-rolodex">
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
          <Button onClick={refreshData}>Retry</Button>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="slot-machine-rolodex">
        <Alert type="info">
          <Spinner size={20} />
          <Text as="span">Loading acronym data...</Text>
        </Alert>
      </div>
    );
  }

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="slot-machine-rolodex">
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
          <Button onClick={refreshData}>Retry</Button>
        </Alert>
      </div>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <div className={`slot-machine-rolodex ${className} ${primaryColor ? 'primary-theme' : 'secondary-theme'}`}>
        <div className="rolodex-columns">
          {/* Letters Column */}
          <div className="column-container">
            <div className="scroll-frame">
              {/* Up Arrow */}
              <button
                className="slot-arrow-thin slot-arrow-up"
                onClick={() => {
                  if (letterScrollRef.current) {
                    letterScrollRef.current.scrollBy({
                      top: -180,
                      behavior: 'smooth',
                    });
                  }
                }}
                aria-label="Scroll up"
                type="button"
              >
                <span className="chevron">▲</span>
              </button>
              <div
                className="scroll-container masked-scroll"
                ref={letterScrollRef}
                style={{ scrollSnapType: 'y mandatory', justifyContent:'flex-start' }}
              >
                <div style={{ height: 90 }} />
                {uniqueChars.map((letter, idx) => (
                  <div
                    key={letter}
                    className={`acronym-card${letterIndex === idx ? ' selected' : ''}`}
                    style={{ scrollSnapAlign: 'center', cursor: 'pointer' }}
                    onClick={() => {
                      setLetterIndex(idx);
                      handleCharSelect(letter);
                    }}
                  >
                    <div className="card-header">{letter}</div>
                  </div>
                ))}
                <div style={{ height: 90 }} />
              </div>
              {/* Down Arrow */}
              <button
                className="slot-arrow-thin slot-arrow-down"
                onClick={() => {
                  if (letterScrollRef.current) {
                    letterScrollRef.current.scrollBy({
                      top: 180,
                      behavior: 'smooth',
                    });
                  }
                }}
                aria-label="Scroll down"
                type="button"
              >
                <span className="chevron">▼</span>
              </button>
            </div>
          </div>

          {/* Acronyms Column */}
          <div className="column-container">
            <div className="scroll-frame">
              {/* Up Arrow */}
              <button
                className="slot-arrow-thin slot-arrow-up"
                onClick={() => {
                  if (acronymScrollRef.current) {
                    acronymScrollRef.current.scrollBy({
                      top: -180,
                      behavior: 'smooth',
                    });
                  }
                }}
                aria-label="Scroll up"
                type="button"
              >
                <span className="chevron">▲</span>
              </button>
              <div
                className="scroll-container masked-scroll"
                ref={acronymScrollRef}
                style={{ scrollSnapType: 'y mandatory', justifyContent:'flex-start'  }}
              >
                <div style={{ height: 90 }} />
                {filteredAcronyms.map((item, idx) => (
                  <div
                    key={item.acronym + idx}
                    className={`acronym-card${acronymIndex === idx ? ' selected' : ''}`}
                    style={{ scrollSnapAlign: 'center', cursor: 'pointer' }}
                    onClick={() => {
                      setAcronymIndex(idx);
                    }}
                  >
                    <div className="card-header" style={{fontSize:"1rem"}}>{item.acronym}</div>
                  </div>
                ))}
                <div style={{ height: 90 }} />
              </div>
              {/* Down Arrow */}
              <button
                className="slot-arrow-thin slot-arrow-down"
                onClick={() => {
                  if (acronymScrollRef.current) {
                    acronymScrollRef.current.scrollBy({
                      top: 180,
                      behavior: 'smooth',
                    });
                  }
                }}
                aria-label="Scroll down"
                type="button"
              >
                <span className="chevron">▼</span>
              </button>
            </div>
          </div>

          {/* Details Column */}
          <div className="column-container acronyms-container">
            <div className="acronym-frame">
              {currentAcronym ? (
                <div className="acronym-card selected">
                  <div className="card-header">{currentAcronym.acronym}</div>
                  <div className="card-content">{currentAcronym.definition}</div>
                  {/* Category badges */}
                  {currentAcronym.categories && currentAcronym.categories.length > 0 && (
                    <div style={{ marginBottom: 8 }}>
                      {currentAcronym.categories.map((cat, i) => (
                        <span className="category-badge" key={cat + i}>{cat}</span>
                      ))}
                    </div>
                  )}
                  {/* Large text placeholder */}
                  {currentAcronym.details && (
                    <div className="card-details">{currentAcronym.details}</div>
                  )}
                </div>
              ) : (
                <div className="no-acronyms">
                  {selectedChar
                    ? `No acronyms starting with '${selectedChar}'`
                    : 'No acronyms found'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default SlotMachineRolodex;
