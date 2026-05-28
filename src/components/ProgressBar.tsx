// Barre de progression indiquant le nombre de tentatives utilisées
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  used: number;
  max: number;
}

export function ProgressBar({ used, max }: ProgressBarProps) {
  const percentage = (used / max) * 100;
  const isWarning = used >= max - 3;
  const isDanger = used >= max - 1;

  return (
    <div className="w-full space-y-1.5">
      <div className="flex justify-between text-xs text-muted-foreground font-medium">
        <span>Tentatives</span>
        <span className={cn(isDanger && "text-wrong", isWarning && !isDanger && "text-partial")}>
          {used} / {max}
        </span>
      </div>
      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            isDanger ? "bg-wrong" : isWarning ? "bg-partial" : "bg-primary"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
