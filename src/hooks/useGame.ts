// Hook principal gérant toute la logique du jeu IdiomaGuessr
import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { fetchRandomPhrase } from "@/services/tatoebaService";
import { ALL_LANGUAGES } from "@/data/phrases";
import type { Phrase } from "@/data/phrases";
import type { GuessResult } from "@/components/GuessList";

const MAX_GUESSES = 5;

export type GameStatus = "playing" | "won" | "lost";

// Découpe un texte en unités de sens adaptées à chaque langue.
// Intl.Segmenter comprend que le japonais/chinois/coréen n'utilisent pas d'espaces
// comme séparateurs de mots, et segmente selon les règles linguistiques réelles.
function splitIntoWords(text: string, languageCode: string): string[] {
  if ("Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter(languageCode, { granularity: "word" });
    const segments = Array.from(segmenter.segment(text))
      .filter((s) => s.isWordLike)
      .map((s) => s.segment);
    if (segments.length > 1) return segments;
  }
  // Fallback pour les navigateurs anciens : séparation par espaces
  return text.split(/\s+/).filter(Boolean);
}

export function useGame() {
  const [phrase, setPhrase] = useState<Phrase | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [revealedCount, setRevealedCount] = useState(1);
  const [guesses, setGuesses] = useState<GuessResult[]>([]);
  const [status, setStatus] = useState<GameStatus>("playing");

  const loadPhrase = useCallback(async () => {
    setIsLoading(true);
    setPhrase(null);
    setRevealedCount(1);
    setGuesses([]);
    setStatus("playing");
    const p = await fetchRandomPhrase();
    setPhrase(p);
    setIsLoading(false);
  }, []);

  // Garde contre le double appel de StrictMode en dev
  const initialized = useRef(false);

  // Chargement de la première phrase au montage du composant
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    loadPhrase();
  }, []);

  // Recalcul uniquement quand la phrase change
  const words = useMemo(
    () => (phrase ? splitIntoWords(phrase.text, phrase.languageCode) : []),
    [phrase]
  );

  // Cherche les infos de la langue devinée (BCP-47 et drapeau) pour l'historique
  function findLanguageInfo(languageName: string) {
    return ALL_LANGUAGES.find(
      (l) => l.language.toLowerCase() === languageName.toLowerCase()
    );
  }

  const guess = useCallback(
    (languageName: string) => {
      if (status !== "playing" || !phrase) return;

      const isCorrect =
        phrase.language.toLowerCase() === languageName.toLowerCase();
      const langInfo = findLanguageInfo(languageName);

      const newGuess: GuessResult = {
        language: langInfo?.language ?? languageName,
        languageCode: langInfo?.languageCode ?? "xx-XX",
        correct: isCorrect,
      };

      const newGuesses = [...guesses, newGuess];
      setGuesses(newGuesses);

      if (isCorrect) {
        setRevealedCount(words.length); // révèle toute la phrase en cas de victoire
        setStatus("won");
        return;
      }

      // Mauvaise réponse : on révèle un mot supplémentaire
      const nextReveal = Math.min(revealedCount + 1, words.length);
      setRevealedCount(nextReveal);

      if (newGuesses.length >= MAX_GUESSES) {
        setRevealedCount(words.length); // révèle tout en fin de partie
        setStatus("lost");
      }
    },
    [phrase, guesses, revealedCount, status, words.length]
  );

  const restart = useCallback(() => {
    loadPhrase();
  }, [loadPhrase]);

  return {
    phrase,
    isLoading,
    words,
    revealedCount,
    guesses,
    status,
    maxGuesses: MAX_GUESSES,
    guess,
    restart,
  };
}
