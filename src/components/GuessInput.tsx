// Champ de saisie avec autocomplétion pour deviner la langue
import { useState, useRef, Fragment } from "react";
import { cn } from "@/lib/utils";
import { ALL_LANGUAGES } from "@/data/phrases";
import { FlagIcon } from "@/components/FlagIcon";

const CONTINENT_ORDER = ["Europe", "Asie", "Moyen-Orient", "Afrique", "Autre"];

// Ordre de popularité (nombre total de locuteurs) dans chaque continent
const CONTINENT_LANGUAGE_ORDER: Record<string, string[]> = {
  Europe: [
    "Anglais", "Espagnol", "Français", "Portugais", "Russe", "Allemand",
    "Italien", "Ukrainien", "Polonais", "Roumain", "Néerlandais", "Serbe",
    "Hongrois", "Grec", "Tchèque", "Suédois", "Catalan", "Bulgare",
    "Biélorusse", "Slovaque", "Danois", "Finnois", "Norvégien", "Croate",
    "Bosnien", "Lituanien", "Slovène", "Macédonien", "Letton", "Estonien",
    "Irlandais", "Gallois", "Islandais",
  ],
  Asie: [
    "Chinois (Mandarin)", "Hindi", "Bengali", "Ourdou", "Indonésien",
    "Japonais", "Vietnamien", "Filipino", "Turc", "Malais", "Coréen",
    "Tamoul", "Thaï", "Kazakh", "Azerbaïdjanais", "Arménien", "Géorgien",
  ],
  "Moyen-Orient": ["Arabe", "Persan", "Hébreu"],
  Afrique: ["Swahili", "Afrikaans"],
  Autre: [],
};

// Affectation de chaque langue à un continent pour le regroupement visuel
const LANGUAGE_CONTINENT: Record<string, string> = {
  Afrikaans: "Afrique",
  Allemand: "Europe",
  Anglais: "Europe",
  Arabe: "Moyen-Orient",
  Arménien: "Asie",
  Azerbaïdjanais: "Asie",
  Bengali: "Asie",
  Biélorusse: "Europe",
  Bosnien: "Europe",
  Bulgare: "Europe",
  Catalan: "Europe",
  "Chinois (Mandarin)": "Asie",
  Coréen: "Asie",
  Croate: "Europe",
  Danois: "Europe",
  Estonien: "Europe",
  Espagnol: "Europe",
  Filipino: "Asie",
  Finnois: "Europe",
  Français: "Europe",
  Gallois: "Europe",
  Géorgien: "Asie",
  Grec: "Europe",
  Hébreu: "Moyen-Orient",
  Hindi: "Asie",
  Hongrois: "Europe",
  Indonésien: "Asie",
  Irlandais: "Europe",
  Islandais: "Europe",
  Italien: "Europe",
  Japonais: "Asie",
  Kazakh: "Asie",
  Letton: "Europe",
  Lituanien: "Europe",
  Macédonien: "Europe",
  Malais: "Asie",
  Néerlandais: "Europe",
  Norvégien: "Europe",
  Ourdou: "Asie",
  Persan: "Moyen-Orient",
  Polonais: "Europe",
  Portugais: "Europe",
  Roumain: "Europe",
  Russe: "Europe",
  Serbe: "Europe",
  Slovaque: "Europe",
  Slovène: "Europe",
  Suédois: "Europe",
  Swahili: "Afrique",
  Tamoul: "Asie",
  Thaï: "Asie",
  Tchèque: "Europe",
  Turc: "Asie",
  Ukrainien: "Europe",
  Vietnamien: "Asie",
};

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


  return (
    <div className="relative w-full">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => { setValue(e.target.value); setShowSuggestions(true); setSelectedIndex(-1); }}
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

          {/* Liste de suggestions groupées par continent */}
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute top-full mt-1 left-0 right-0 z-50 bg-card border border-border rounded-lg shadow-lg overflow-hidden animate-fade-in max-h-72 overflow-y-auto">
              {CONTINENT_ORDER.map((continent) => {
                const order = CONTINENT_LANGUAGE_ORDER[continent] ?? [];
                const langs = suggestions
                  .filter((l) => (LANGUAGE_CONTINENT[l.language] ?? "Autre") === continent)
                  .sort((a, b) => {
                    const ia = order.indexOf(a.language);
                    const ib = order.indexOf(b.language);
                    return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
                  });
                if (langs.length === 0) return null;
                return (
                  <Fragment key={continent}>
                    <li className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted/50 border-t border-border first:border-t-0 select-none">
                      {continent}
                    </li>
                    {langs.map((lang) => {
                      const flatIndex = suggestions.indexOf(lang);
                      return (
                        <li
                          key={lang.languageCode}
                          className={cn(
                            "flex items-center gap-2 px-4 py-2.5 cursor-pointer text-sm transition-colors",
                            flatIndex === selectedIndex
                              ? "bg-primary/20 text-foreground"
                              : "hover:bg-muted text-foreground",
                          )}
                          onMouseDown={() => handleSubmit(lang.language)}
                        >
                          <FlagIcon languageCode={lang.languageCode} flagCode={lang.flagCode} />
                          <span className="font-medium">{lang.language}</span>
                        </li>
                      );
                    })}
                  </Fragment>
                );
              })}
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
