interface Props {
  streak: number;
}

export function StreakCounter({ streak }: Props) {
  if (streak < 3) return null;

  // Paliers progressifs : taille flamme (3-6), éclat (7-11), texte rouge (12+)
  const flameSize =
    streak >= 12 ? "text-2xl"
    : streak >= 9  ? "text-xl"
    : streak >= 6  ? "text-lg"
    : "text-base";

  const flameFilter =
    streak >= 7
      ? `drop-shadow(0 0 ${Math.min(2 + (streak - 7) * 0.6, 8).toFixed(1)}px rgba(255,100,0,0.9))`
      : "none";

  const scoreColor =
    streak >= 12
      ? `rgb(${Math.min(220 + (streak - 12) * 3, 255)}, ${Math.max(60 - (streak - 12) * 4, 20)}, 20)`
      : "inherit";

  return (
    <div
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/60 transition-all duration-500"
      aria-label={`Série de ${streak} victoires`}
    >
      <span
        data-streak-flame
        className={`${flameSize} leading-none transition-all duration-500`}
        style={{ filter: flameFilter }}
      >
        🔥
      </span>
      <span
        className="text-sm font-bold tabular-nums transition-colors duration-500"
        style={{ color: scoreColor }}
      >
        {streak}
      </span>
    </div>
  );
}
