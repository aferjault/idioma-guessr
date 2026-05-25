// Modal de fin de partie (victoire ou défaite)
import { cn } from "@/lib/utils";
import { Trophy, RefreshCw, XCircle } from "lucide-react";
import type { Phrase } from "@/data/phrases";
import { FlagIcon } from "@/components/FlagIcon";
import { AudioButton, type AudioButtonHandle } from "@/components/AudioButton";
import { playVictory, playDefeat } from "@/lib/sounds";
import { useEffect, useRef, useState } from "react";
import { StreakCelebration } from "@/components/StreakCelebration";

interface GameOverModalProps {
  won: boolean;
  phrase: Phrase;
  guessCount: number;
  maxGuesses: number;
  streak: number;
  onRestart: () => void;
}

export function GameOverModal({
  won,
  phrase,
  guessCount,
  maxGuesses,
  streak,
  onRestart,
}: GameOverModalProps) {
  const audioRef = useRef<AudioButtonHandle>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => (won ? playVictory() : playDefeat()), 120);
    return () => clearTimeout(t);
  }, [won]);

  function handleRestart() {
    audioRef.current?.stop();
    // Affiche le popup streak si série >= 2 et victoire
    if (won && streak >= 3) {
      setShowCelebration(true);
    } else {
      onRestart();
    }
  }

  if (showCelebration) {
    return <StreakCelebration streak={streak} onDone={onRestart} />;
  }

  return (
    <>
      {/* Overlay semi-transparent */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
        <div
          className={cn(
            "relative w-full max-w-md rounded-2xl border p-5 sm:p-8 shadow-2xl animate-slide-up",
            "bg-card border-border text-center space-y-4 sm:space-y-6",
          )}
        >
          {/* Icône résultat */}
          <div className="flex justify-center">
            <div
              className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center text-3xl",
                won ? "bg-correct/15 text-correct" : "bg-wrong/15 text-wrong",
              )}
            >
              {won ? <Trophy size={32} /> : <XCircle size={32} />}
            </div>
          </div>

          {/* Titre */}
          <div>
            <h2
              className={cn(
                "text-2xl font-bold mb-1",
                won ? "text-correct" : "text-wrong",
              )}
            >
              {won ? "Bravo !" : "Dommage !"}
            </h2>
            <p className="text-muted-foreground text-sm">
              {won
                ? `Trouvé en ${guessCount} tentative${guessCount > 1 ? "s" : ""} sur ${maxGuesses} !`
                : "Vous n'avez pas trouvé la langue."}
            </p>
          </div>

          {/* Révélation de la réponse */}
          <div className="bg-muted rounded-xl p-5 space-y-3 text-left">
            <div className="flex items-center gap-3">
              <FlagIcon
                languageCode={phrase.languageCode}
                className="text-4xl"
              />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  La langue était
                </p>
                <p className="text-xl font-bold text-foreground">
                  {phrase.language}
                </p>
              </div>
            </div>
            <div className="border-t border-border pt-3 space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-muted-foreground font-medium">
                    Phrase complète :
                  </p>
                  <AudioButton
                    ref={audioRef}
                    text={phrase.text}
                    languageCode={phrase.languageCode}
                    variant="accent"
                  />
                </div>
                <p className="text-sm text-foreground/90 italic leading-relaxed">
                  "{phrase.text}"
                </p>
              </div>
              <div className="bg-background/50 rounded-lg px-3 py-2.5">
                <p className="text-xs text-muted-foreground mb-1 font-medium">
                  Traduction française :
                </p>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  "{phrase.translation}"
                </p>
              </div>
            </div>
          </div>

          {/* Bouton nouvelle partie */}
          <button
            onClick={handleRestart}
            className={cn(
              "w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl",
              "font-semibold text-sm transition-all duration-200",
              "bg-primary text-primary-foreground hover:opacity-90 active:scale-95",
            )}
          >
            <RefreshCw size={16} />
            Nouvelle partie
          </button>
        </div>
      </div>
    </>
  );
}
