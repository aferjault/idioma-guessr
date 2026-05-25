// Champ de saisie avec autocomplétion pour deviner la langue
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ALL_LANGUAGES } from "@/data/phrases";
import { FlagIcon } from "@/components/FlagIcon";

interface GuessInputProps {
  onGuess: (language: string) => void;
  disabled: boolean;
  usedGuesses: string[];
}

export function GuessInput({
  onGuess,
  disabled,
  usedGuesses,
}: GuessInputProps) {
  const [value, setValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filtre les langues selon la saisie et exclut les langues déjà tentées
  const suggestions = ALL_LANGUAGES.filter(
    (l) =>
      l.language.toLowerCase().includes(value.toLowerCase()) &&
      !usedGuesses.includes(l.language),
  );

  // Vérifie que la valeur saisie correspond exactement à une langue connue
  const isValidLanguage = ALL_LANGUAGES.some(
    (l) =>
      l.language.toLowerCase() === value.toLowerCase() &&
      !usedGuesses.includes(l.language),
  );

  function handleSubmit(lang?: string) {
    const target = lang ?? suggestions[selectedIndex]?.language;
    if (!target) return;
    onGuess(target);
    setValue("");
    setShowSuggestions(false);
    setSelectedIndex(-1);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  }

  // Réinitialise l'index sélectionné quand la saisie change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [value]);

  return (
    <div className="relative w-full">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => { setValue(e.target.value); setShowSuggestions(true); }}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            disabled={disabled}
            placeholder="Deviner la langue..."
            className={cn(
              "w-full px-4 py-3 rounded-lg text-foreground placeholder:text-muted-foreground",
              "bg-secondary border border-border outline-none",
              "focus:border-ring focus:ring-1 focus:ring-ring",
              "transition-all duration-200 text-sm font-medium",
              disabled && "opacity-50 cursor-not-allowed",
            )}
            autoComplete="off"
          />

          {/* Liste de suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute top-full mt-1 left-0 right-0 z-50 bg-card border border-border rounded-lg shadow-lg overflow-hidden animate-fade-in">
              {suggestions.map((lang, i) => (
                <li
                  key={lang.languageCode}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 cursor-pointer text-sm transition-colors",
                    i === selectedIndex
                      ? "bg-primary/20 text-foreground"
                      : "hover:bg-muted text-foreground",
                  )}
                  onMouseDown={() => handleSubmit(lang.language)}
                >
                  <FlagIcon languageCode={lang.languageCode} />
                  <span className="font-medium">{lang.language}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          onClick={() => handleSubmit()}
          disabled={disabled || !isValidLanguage}
          className={cn(
            "px-5 py-3 rounded-lg font-semibold text-sm transition-all duration-200",
            "bg-primary text-primary-foreground",
            "hover:opacity-90 active:scale-95",
            (disabled || !isValidLanguage) && "opacity-40 cursor-not-allowed",
          )}
        >
          Valider
        </button>
      </div>
    </div>
  );
}
