import { useGame } from "@/hooks/useGame";
import { PhraseDisplay } from "@/components/PhraseDisplay";
import { GuessInput } from "@/components/GuessInput";
import { GuessList } from "@/components/GuessList";
import { AudioButton } from "@/components/AudioButton";
import { ProgressBar } from "@/components/ProgressBar";
import { GameOverModal } from "@/components/GameOverModal";
import {
  HelpCircle,
  MapPin,
  Globe,
  Sun,
  Moon,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";
import { useStreak } from "@/hooks/useStreak";
import { useSound } from "@/hooks/useSound";
import { setSoundMuted } from "@/lib/sounds";
import { StreakCounter } from "@/components/StreakCounter";

function App() {
  const {
    phrase,
    words,
    revealedCount,
    guesses,
    status,
    maxGuesses,
    guess,
    restart,
  } = useGame();
  const [showHelp, setShowHelp] = useState(false);
  const { theme, toggle: toggleTheme } = useTheme();
  const { streak, resetTracking } = useStreak(status);
  const { soundEnabled, toggle: toggleSound } = useSound();

  const usedGuessLanguages = guesses.map((g) => g.language);
  // Synchronise le flag mute du module audio dès que soundEnabled change
  useEffect(() => {
    setSoundMuted(!soundEnabled);
  }, [soundEnabled]);

  // Texte lu à l'audio = uniquement les mots actuellement visibles
  const revealedText = words.slice(0, revealedCount).join(" ");

  const dark = theme === "dark";
  const sideShadow = dark
    ? "-18px 0 35px -8px rgba(0,0,0,0.5), 18px 0 35px -8px rgba(0,0,0,0.5)"
    : "-18px 0 35px -8px rgba(0,0,0,0.09), 18px 0 35px -8px rgba(0,0,0,0.09)";
  const topShadow = dark
    ? "0 4px 20px -4px rgba(0,0,0,0.4)"
    : "0 4px 20px -4px rgba(0,0,0,0.08)";
  const bottomShadow = dark
    ? "0 -4px 20px -4px rgba(0,0,0,0.4)"
    : "0 -4px 20px -4px rgba(0,0,0,0.08)";

  return (
    <div className="w-full min-h-screen flex justify-center">
      <div
        className="w-full max-w-lg min-h-screen flex flex-col relative"
        style={{ boxShadow: sideShadow }}
      >
        {/* En-tête */}
        <header className="w-full bg-card" style={{ boxShadow: topShadow }}>
          <div className="max-w-lg mx-auto px-3 py-3 grid grid-cols-[1fr_auto_1fr] items-center">
            {/* Colonne gauche : streak */}
            <div className="flex justify-start">
              <StreakCounter streak={streak} />
            </div>

            {/* Colonne centrale : titre */}
            <div className="flex flex-col items-center min-w-0">
              <div className="flex items-center gap-1.5">
                <span
                  className="text-xl sm:text-4xl font-bold tracking-tight text-foreground whitespace-nowrap"
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                >
                  Idioma
                </span>
                <span
                  className="text-xl sm:text-3xl font-bold tracking-tight whitespace-nowrap"
                  style={{
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    background: "linear-gradient(135deg, #10b981, #06b6d4)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Guessr
                </span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 36 36"
                  xmlns="http://www.w3.org/2000/svg"
                  className="shrink-0 sm:w-[26px] sm:h-[26px]"
                >
                  <circle cx="18" cy="18" r="16" fill="#0ea5e9" />
                  <ellipse
                    cx="18"
                    cy="18"
                    rx="16"
                    ry="6"
                    fill="none"
                    stroke="rgba(255,255,255,0.35)"
                    strokeWidth="1.2"
                  />
                  <line
                    x1="18"
                    y1="2"
                    x2="18"
                    y2="34"
                    stroke="rgba(255,255,255,0.35)"
                    strokeWidth="1.2"
                  />
                  <ellipse
                    cx="14"
                    cy="14"
                    rx="4"
                    ry="6"
                    fill="#10b981"
                    opacity="0.85"
                    transform="rotate(-10 14 14)"
                  />
                  <ellipse
                    cx="22"
                    cy="21"
                    rx="4"
                    ry="5"
                    fill="#10b981"
                    opacity="0.7"
                  />
                </svg>
              </div>
              <div
                className="h-0.5 w-full rounded-full mt-0.5"
                style={{
                  background: "linear-gradient(90deg, #10b981, #06b6d4)",
                  opacity: 0.35,
                }}
              />
            </div>

            {/* Colonne droite : boutons */}
            <div className="flex justify-end items-center">
              <button
                onClick={toggleSound}
                className="p-1.5 sm:p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label={soundEnabled ? "Couper le son" : "Activer le son"}
              >
                {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>
              <button
                onClick={toggleTheme}
                className="p-1.5 sm:p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label={
                  theme === "dark"
                    ? "Passer en mode clair"
                    : "Passer en mode sombre"
                }
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button
                onClick={() => setShowHelp((v) => !v)}
                className="p-1.5 sm:p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Aide"
              >
                <HelpCircle size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* Panneau d'aide déroulant */}
        {showHelp && (
          <div className="w-full border-b border-border bg-card animate-slide-up">
            <div className="max-w-lg mx-auto px-4 py-4 space-y-2 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">Comment jouer ?</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Un seul mot est visible au départ.</li>
                <li>Chaque mauvaise réponse révèle un mot de plus.</li>
                <li>
                  Vous avez{" "}
                  <strong className="text-foreground">
                    {maxGuesses} tentatives
                  </strong>{" "}
                  pour deviner la langue.
                </li>
                <li>
                  Utilisez le bouton{" "}
                  <strong className="text-foreground">Écouter</strong> pour
                  entendre la phrase complète.
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Corps du jeu */}
        <main className="bg-background flex-1 flex flex-col items-center justify-start px-4 py-8 sm:py-10 gap-8 sm:gap-10 w-full">
          {/* Numéro de mots révélés */}
          <div className="text-xs text-muted-foreground font-medium tracking-wider uppercase">
            {revealedCount} mot{revealedCount > 1 ? "s" : ""} révélé
            {revealedCount > 1 ? "s" : ""} sur {words.length}
          </div>

          {/* Zone d'affichage de la phrase */}
          <div className="w-full bg-card border border-border rounded-2xl p-4 sm:p-6 min-h-32 flex flex-col items-center justify-center gap-4 relative overflow-hidden">
            {/* Ombrage vertical gauche */}
            <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-card to-transparent pointer-events-none z-10" />
            {/* Ombrage vertical droit */}
            <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-card to-transparent pointer-events-none z-10" />
            <PhraseDisplay
              words={words}
              revealedCount={revealedCount}
              isGameOver={status !== "playing"}
            />
            <AudioButton
              text={revealedText}
              languageCode={phrase.languageCode}
            />
          </div>

          {/* Indices progressifs */}
          <div className="w-full flex flex-col gap-2">
            {/* Zone géographique — visible à partir de la 3e tentative */}
            {guesses.length >= 3 && phrase.hint && (
              <div className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-muted/50 text-sm animate-fade-in">
                <MapPin size={14} className="text-primary shrink-0" />
                <span className="text-muted-foreground">Zone :</span>
                <span className="text-foreground font-medium">
                  {phrase.hint}
                </span>
              </div>
            )}
            {/* Famille linguistique — visible à partir de la 4e tentative */}
            {guesses.length >= 4 && phrase.languageFamily && (
              <div className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-muted/50 text-sm animate-fade-in">
                <Globe size={14} className="text-primary shrink-0" />
                <span className="text-muted-foreground">Famille :</span>
                <span className="text-foreground font-medium">
                  {phrase.languageFamily}
                </span>
              </div>
            )}
          </div>

          {/* Barre de progression */}
          <ProgressBar used={guesses.length} max={maxGuesses} />

          {/* Champ de saisie */}
          {status === "playing" && (
            <GuessInput
              onGuess={guess}
              disabled={status !== "playing"}
              usedGuesses={usedGuessLanguages}
            />
          )}

          {/* Historique des tentatives */}
          {guesses.length > 0 && (
            <GuessList guesses={guesses} maxGuesses={maxGuesses} />
          )}
        </main>

        {/* Modal fin de partie */}
        {status !== "playing" && (
          <GameOverModal
            won={status === "won"}
            phrase={phrase}
            guessCount={guesses.length}
            maxGuesses={maxGuesses}
            onRestart={() => {
              resetTracking();
              restart();
            }}
          />
        )}

        {/* Pied de page */}
        <footer className="w-full mt-auto" style={{ boxShadow: bottomShadow }}>
          <div className="max-w-lg mx-auto px-4 py-4 text-center text-xs text-muted-foreground">
            © 2026 IdiomaGuessr. Tous droits réservés. Fait avec 💚 par{" "}
            <a
              href="https://www.linkedin.com/in/arthurferjault/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Arthur FERJAULT
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
