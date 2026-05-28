// Drapeau SVG via la librairie flag-icons (contourne le bug Windows des emojis drapeaux)
import { cn } from "@/lib/utils";

interface FlagIconProps {
  // Code BCP-47 (ex: "fr-FR", "zh-CN", "ar-SA") — on extrait le code pays automatiquement
  languageCode: string;
  // Surcharge optionnelle pour les subdivisions flag-icons (ex: "es-ct" pour Catalogne)
  flagCode?: string;
  className?: string;
}

// Extrait le code ISO 3166-1 alpha-2 depuis un code BCP-47
function getCountryCode(languageCode: string): string {
  return languageCode.split("-")[1]?.toLowerCase() ?? languageCode.split("-")[0].toLowerCase();
}

export function FlagIcon({ languageCode, flagCode, className }: FlagIconProps) {
  const code = flagCode ?? getCountryCode(languageCode);
  return (
    <span
      className={cn("fi", `fi-${code}`, "rounded-sm", className)}
      style={{ fontSize: "1.25rem", lineHeight: 1 }}
      aria-hidden="true"
    />
  );
}
