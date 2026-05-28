// Affiche la phrase avec les mots révélés progressivement + animations polish
import { playReveal } from "@/lib/sounds";
import { useEffect, useRef, useState } from "react";

interface PhraseDisplayProps {
  words: string[];
  revealedCount: number;
  isGameOver: boolean;
}

interface Particle {
  id: number;
  tx: string;
  ty: string;
  color: string;
  size: number;
  delay: number;
  star: boolean;
}

const COLORS = [
  "#4ade80", "#22c55e", "#86efac", "#34d399",
  "#6ee7b7", "#bbf7d0", "#a7f3d0", "#d9f99d",
];

let nextId = 0;

function createParticles(): Particle[] {
  const count = 18;
  return Array.from({ length: count }, (_, i) => {
    const angle = ((360 / count) * i + (Math.random() - 0.5) * 20) * (Math.PI / 180);
    const distance = 28 + Math.random() * 50;
    return {
      id: nextId++,
      tx: `${(Math.cos(angle) * distance).toFixed(1)}px`,
      ty: `${(Math.sin(angle) * distance).toFixed(1)}px`,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 5 + Math.random() * 8,
      delay: Math.random() * 80,
      star: Math.random() > 0.6,
    };
  });
}

// Détecte les écritures non-latines (hébreu, arabe, chinois, japonais, coréen, cyrillique, etc.)
// Seuil : U+024F = fin de Latin Extended-B (conserve les accents européens comme é, ü, ñ)
function isNonLatinScript(word: string): boolean {
  return [...word].some(char => (char.codePointAt(0) ?? 0) > 0x024F);
}

export function PhraseDisplay({ words, revealedCount, isGameOver }: PhraseDisplayProps) {
  const prevRevealed = useRef(revealedCount);
  const [sparkleIndex, setSparkleIndex] = useState<number | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (revealedCount > prevRevealed.current) {
      const idx = revealedCount - 1;
      playReveal();
      setSparkleIndex(idx);
      setParticles(createParticles());

      const t1 = setTimeout(() => { setSparkleIndex(null); setParticles([]); }, 750);

      prevRevealed.current = revealedCount;
      return () => { clearTimeout(t1); };
    }
    prevRevealed.current = revealedCount;
  }, [revealedCount]);

  return (
    <div className="flex flex-wrap gap-x-2 gap-y-3 justify-center items-center min-h-24 px-4">
      {words.map((word, index) => {
        const isRevealed = index < revealedCount;
        const isNew = index === sparkleIndex;

        if (!isRevealed) {
          // Écritures non-latines : afficher les caractères floutés plutôt que des tirets
          // (le système d'écriture lui-même est un indice visuel pertinent)
          if (isNonLatinScript(word)) {
            return (
              <span
                key={index}
                className="inline-block text-lg font-medium tracking-wide select-none"
                style={{
                  filter: isGameOver ? undefined : "blur(6px)",
                  opacity: isGameOver ? 0.4 : 0.9,
                  transition: "filter 0.3s ease",
                }}
              >
                {word}
              </span>
            );
          }

          return (
            <span
              key={index}
              className="inline-block text-lg font-medium tracking-widest text-muted-foreground/40 select-none"
              style={{ opacity: isGameOver ? 0.3 : 1 }}
            >
              {"—".repeat(Math.max(word.length, 2))}
            </span>
          );
        }

        return (
          <span
            key={index}
            className="inline-block px-1.5 py-0.5 rounded text-lg font-medium tracking-wide relative"
          >
            {word}

            {/* Particules de célébration */}
            {isNew && particles.map((p) => (
              <span
                key={p.id}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: p.size,
                  height: p.star ? p.size * 0.4 : p.size,
                  marginLeft: -p.size / 2,
                  marginTop: -(p.star ? p.size * 0.2 : p.size / 2),
                  borderRadius: p.star ? "1px" : "50%",
                  backgroundColor: p.color,
                  pointerEvents: "none",
                  zIndex: 20,
                  "--tx": p.tx,
                  "--ty": p.ty,
                  animationDelay: `${p.delay}ms`,
                  animation: `sparkle-fly 0.7s ease-out forwards`,
                  ...(p.star ? { transform: `rotate(${Math.random() * 60}deg)` } : {}),
                } as React.CSSProperties}
              />
            ))}
          </span>
        );
      })}
    </div>
  );
}
