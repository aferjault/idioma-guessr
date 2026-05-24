import { useState, useEffect } from "react";

const KEY = "idioma-sound-enabled";

export function useSound() {
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem(KEY) !== "false";
  });

  useEffect(() => {
    localStorage.setItem(KEY, String(soundEnabled));
  }, [soundEnabled]);

  return { soundEnabled, toggle: () => setSoundEnabled((v) => !v) };
}
