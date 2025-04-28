import * as React from "react";

interface SearchSelectorProps {
  letters: string[];
  selectedLetter?: string;
  onSelectLetter: (letter: string) => void;
}

export const SearchSelector: React.FC<SearchSelectorProps> = ({
  letters,
  selectedLetter,
  onSelectLetter,
}) => {
  return (
    <div className="ar-filter-grid">
      {letters.map((letter) => (
        <button
          key={letter}
          className={`ar-filter-button${selectedLetter === letter ? " selected" : ""}`}
          onClick={() => onSelectLetter(letter)}
        >
          {letter}
        </button>
      ))}
    </div>
  );
}; 