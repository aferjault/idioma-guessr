import { useEffect, useRef, useState } from "react";

interface Props {
  streak: number;
  onDone: () => void;
}

type Phase = "show" | "fadetext" | "fly";

export function StreakCelebration({ streak, onDone }: Props) {
  const flameRef = useRef<HTMLSpanElement>(null);
  const [phase, setPhase] = useState<Phase>("show");
  const [flyStyle, setFlyStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    // t1 : faire disparaître le texte et le chiffre
    const t1 = setTimeout(() => setPhase("fadetext"), 800);

    // t2 : lancer le vol de la flamme une fois le texte disparu
    const t2 = setTimeout(() => {
      const target = document.querySelector<HTMLElement>("[data-streak-flame]");
      const flame = flameRef.current;

      if (target && flame) {
        const fr = flame.getBoundingClientRect();
        const tr = target.getBoundingClientRect();

        const initStyle: React.CSSProperties = {
          position: "fixed",
          left: fr.left + fr.width / 2,
          top: fr.top + fr.height / 2,
          transform: "translate(-50%, -50%)",
          fontSize: `${fr.height * 0.85}px`,
          lineHeight: 1,
          zIndex: 70,
          pointerEvents: "none",
          userSelect: "none",
        };

        setFlyStyle(initStyle);
        setPhase("fly");

        // Double rAF : laisser le DOM committer la position initiale avant d'animer
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setFlyStyle({
              ...initStyle,
              left: tr.left + tr.width / 2,
              top: tr.top + tr.height / 2,
              fontSize: `${tr.height}px`,
              transition:
                "left 0.5s cubic-bezier(0.4, 0, 0.2, 1), top 0.5s cubic-bezier(0.4, 0, 0.2, 1), font-size 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            });
          });
        });
      } else {
        setPhase("fly");
      }
    }, 1650);

    const t3 = setTimeout(() => onDone(), 2200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onDone]);

  const label =
    streak >= 10
      ? "Série légendaire !"
      : streak >= 5
        ? "En feu !"
        : "Bonne série !";

  const textVisible = phase === "show";
  const overlayFading = phase === "fly";

  return (
    <>
      {/* Overlay avec fond + contenu */}
      <div
        className={`fixed inset-0 z-[60] flex flex-col items-center justify-center ${
          overlayFading
            ? "animate-celebration-exit"
            : "animate-celebration-enter"
        }`}
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255,80,0,0.4) 0%, rgba(0,0,0,0.88) 70%)",
        }}
      >
        <div className="flex flex-col items-center gap-6 pointer-events-none select-none">
          {/* Flamme : visible en show/fadetext, invisible en fly (remplacée par la flamme volante) */}
          <span
            ref={flameRef}
            className={`leading-none ${
              phase === "show"
                ? "animate-flame-wiggle"
                : phase === "fly"
                  ? "opacity-0"
                  : ""
            }`}
            style={{ fontSize: "clamp(96px, 28vw, 160px)" }}
          >
            🔥
          </span>

          {/* Chiffre et texte : disparaissent en phase fadetext */}
          <div
            className="flex flex-col items-center gap-2 animate-streak-number-pop"
            style={{
              opacity: textVisible ? 1 : 0,
              transition: textVisible ? undefined : "opacity 0.3s ease-out",
            }}
          >
            <span
              className="font-black tabular-nums leading-none"
              style={{
                fontSize: "clamp(80px, 22vw, 128px)",
                color: "#ff6b00",
                textShadow:
                  "0 0 40px rgba(255,107,0,0.9), 0 0 80px rgba(255,50,0,0.5)",
              }}
            >
              {streak}
            </span>
            <span className="text-xl sm:text-2xl font-bold text-white/90 tracking-wide text-center px-4">
              {label}
            </span>
          </div>
        </div>
      </div>

      {/* Flamme volante indépendante — au-dessus de l'overlay en phase fly */}
      {phase === "fly" && Object.keys(flyStyle).length > 0 && (
        <span style={flyStyle}>🔥</span>
      )}
    </>
  );
}
