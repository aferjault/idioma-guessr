// Historique des tentatives avec indicateurs visuels
import { cn } from "@/lib/utils";
import { FlagIcon } from "@/components/FlagIcon";

export type GuessResult = {
  language: string;
  languageCode: string;
  correct: boolean;
};

interface GuessListProps {
  guesses: GuessResult[];
  maxGuesses: number;
}

export function GuessList({ guesses, maxGuesses }: GuessListProps) {
  // Crée des emplacements vides pour les tentatives restantes
  const emptySlots = maxGuesses - guesses.length;

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Tentatives effectuées */}
      {guesses.map((guess, i) => (
        <div
          key={i}
          className={cn(
            "flex items-center gap-3 px-4 py-2.5 rounded-lg border animate-slide-up",
            guess.correct
              ? "border-correct/50 bg-correct/10"
              : "border-wrong/40 bg-wrong/8",
          )}
          style={{ animationDelay: `${i * 50}ms` }}
        >
          <FlagIcon languageCode={guess.languageCode} className="text-2xl" />
          <span
            className={cn(
              "flex-1 font-medium text-sm",
              guess.correct ? "text-correct" : "text-foreground",
            )}
          >
            {guess.language}
          </span>
          <span
            className={cn(
              "text-lg font-bold",
              guess.correct ? "text-correct" : "text-wrong",
            )}
          >
            {guess.correct ? "✓" : "✗"}
          </span>
        </div>
      ))}

      {/* Emplacements vides restants */}
      {Array.from({ length: emptySlots }).map((_, i) => (
        <div
          key={`empty-${i}`}
          className="flex items-center px-4 py-2.5 rounded-lg border border-dashed border-border/40 h-10"
        />
      ))}
    </div>
  );
}
