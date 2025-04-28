import * as React from "react";
import { TagList } from "../ui/tag-list";
import { AcronymData } from "../types";
import Text from "../ui/Text";

interface DetailPanelProps {
  item?: AcronymData;
}

export const DetailPanel: React.FC<DetailPanelProps> = ({ item }) => {
  const isEmpty = !item;

  return (
    <div className="ar-details-content">
      {isEmpty ? (
        <div className="ar-empty-state">
          <Text as="p">Select an acronym to view details</Text>
        </div>
      ) : (
        <>
          <div className="ar-details-header">
            <Text as="h2">{item.acronym}</Text>
            <Text as="h3">{item.definition}</Text>
          </div>
          <div className="ar-details-section">
            <Text as="h4">Details</Text>
            <Text as="p">{item.details}</Text>
          </div>
          {item.categories && item.categories.length > 0 ? (
            <div className="ar-details-section">
              <Text as="h4">Categories</Text>
              <TagList tags={item.categories} />
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}; 