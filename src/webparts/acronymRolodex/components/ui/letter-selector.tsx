import * as React from "react";
import { useTheme } from "../context/theme-context";

interface LetterSelectorProps {
  letters: string[];
  selectedLetter: string | null;
  onSelectLetter: (letter: string) => void;
}

export function LetterSelector({
  letters = [],
  selectedLetter,
  onSelectLetter,
}: LetterSelectorProps) {
  const { primaryColor, tertiaryColor } = useTheme();

  return (
    <div
      className="w-full h-full overflow-y-auto"
      style={{ backgroundColor: tertiaryColor }}
    >
      <div className="flex flex-col">
        {Array.isArray(letters) && letters.length > 0 ? (
          letters.map((letter) => (
            <button
              key={letter}
              className="py-3 px-4 text-center text-lg font-medium hover:opacity-80 transition-colors"
              style={{
                backgroundColor:
                  selectedLetter === letter ? primaryColor : "transparent",
                color: selectedLetter === letter ? "#ffffff" : "inherit",
              }}
              onClick={() => onSelectLetter(letter)}
            >
              {letter}
            </button>
          ))
        ) : (
          <div className="p-4 text-center">No items</div>
        )}
      </div>
    </div>
  );
}
