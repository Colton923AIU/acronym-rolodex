import * as React from "react";
import { useTheme } from "../context/theme-context";

interface TagListProps {
  tags: string[];
  className?: string;
}

export function TagList({ tags = [], className = "" }: TagListProps) {
  const { primaryColor } = useTheme();

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {Array.isArray(tags) &&
        tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 text-xs rounded-full"
            style={{
              backgroundColor: `${primaryColor}20`,
              color: "inherit",
            }}
          >
            {tag}
          </span>
        ))}
    </div>
  );
}
