import { useEffect, useRef, useState } from "react";
import type { GameStatus } from "./useGame";

export function useStreak(status: GameStatus) {
  const [streak, setStreak] = useState<number>(0);

  // Garde la valeur précédente de status pour détecter les transitions
  const prevStatus = useRef<GameStatus>("playing");

  useEffect(() => {
    const prev = prevStatus.current;
    prevStatus.current = status;

    // Réagir uniquement sur la transition playing → won/lost
    if (prev !== "playing") return;

    if (status === "won") {
      setStreak((s) => {
        const next = s + 1;
        localStorage.setItem("streak", String(next));
        return next;
      });
    } else if (status === "lost") {
      setStreak(0);
      localStorage.setItem("streak", "0");
    }
  }, [status]);

  // Réinitialise le suivi quand une nouvelle partie commence
  const resetTracking = () => {
    prevStatus.current = "playing";
  };

  return { streak, resetTracking };
}
