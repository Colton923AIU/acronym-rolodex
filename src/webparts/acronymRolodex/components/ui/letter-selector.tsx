import * as React from "react";

interface LetterSelectorProps {
  letters: string[];
  selectedLetter: string;
  onSelectLetter: (letter: string) => void;
}

export const LetterSelector: React.FC<LetterSelectorProps> = ({
  letters,
  selectedLetter,
  onSelectLetter,
}) => {
  // Sort and group letters and numbers
  const numbers = letters.filter(char => /[0-9]/.test(char)).sort();
  const alphas = letters.filter(char => /[A-Za-z]/.test(char)).sort();
  
  // All possible letters for complete alphabet
  const fullAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  
  return (
    <div className="ar-filter-grid">
      {/* Render numbers if there are any */}
      {numbers.length > 0 && (
        <>
          <div className="ar-filter-label">Numbers</div>
          {numbers.map(num => (
            <button
              key={num}
              className={`ar-filter-button ${selectedLetter === num ? 'selected' : ''}`}
              onClick={() => onSelectLetter(num)}
              aria-pressed={selectedLetter === num}
            >
              {num}
            </button>
          ))}
          <div className="ar-filter-divider" />
        </>
      )}
      
      {/* Render letters - show all alphabet but disable unused letters */}
      <div className="ar-filter-label">Letters</div>
      {fullAlphabet.map(letter => {
        const isAvailable = alphas.includes(letter);
        return (
          <button
            key={letter}
            className={`ar-filter-button ${selectedLetter === letter ? 'selected' : ''} ${!isAvailable ? 'disabled' : ''}`}
            onClick={() => isAvailable && onSelectLetter(letter)}
            disabled={!isAvailable}
            aria-pressed={selectedLetter === letter}
          >
            {letter}
          </button>
        );
      })}
    </div>
  );
};