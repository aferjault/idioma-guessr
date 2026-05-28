// Bouton d'écoute — utilise Google Cloud TTS si la clé API est définie, sinon Web Speech API
import { useState, useCallback, useRef, forwardRef, useImperativeHandle } from "react";
import { Volume2, VolumeX, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { markLanguageUnsupported } from "@/data/phrases";

export interface AudioButtonHandle {
  stop: () => void;
}

interface AudioButtonProps {
  text: string;
  languageCode: string;
  variant?: "default" | "accent";
  disabled?: boolean;
}

// --- Fallback Web Speech API ---

const LANG_FALLBACKS: Record<string, string[]> = {
  "ar": ["ar-XA", "ar-SA", "ar-EG", "ar"],
  "zh": ["zh-CN", "zh-TW", "zh-HK", "zh"],
  "ja": ["ja-JP", "ja"],
  "ko": ["ko-KR", "ko"],
  "hi": ["hi-IN", "hi"],
  "vi": ["vi-VN", "vi"],
  "id": ["id-ID", "id"],
  "tr": ["tr-TR", "tr"],
  "el": ["el-GR", "el"],
  "ru": ["ru-RU", "ru"],
  "pl": ["pl-PL", "pl"],
  "nl": ["nl-NL", "nl"],
  "sv": ["sv-SE", "sv"],
  "da": ["da-DK", "da"],
  "fi": ["fi-FI", "fi"],
  "pt": ["pt-PT", "pt-BR", "pt"],
  "de": ["de-DE", "de"],
  "it": ["it-IT", "it"],
  "es": ["es-ES", "es-US", "es"],
  "fr": ["fr-FR", "fr"],
};

function toIso639(bcp47: string): string {
  return bcp47.split("-")[0];
}

function getVoicesAsync(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) resolve(voices);
    else
      window.speechSynthesis.addEventListener(
        "voiceschanged",
        () => resolve(window.speechSynthesis.getVoices()),
        { once: true }
      );
  });
}

function selectBestVoice(
  voices: SpeechSynthesisVoice[],
  languageCode: string
): SpeechSynthesisVoice | undefined {
  const prefix = toIso639(languageCode);
  const candidates = LANG_FALLBACKS[prefix] ?? [languageCode, prefix];
  for (const code of candidates) {
    const v = voices.find((v) => v.lang === code && !v.localService);
    if (v) return v;
  }
  for (const code of candidates) {
    const v = voices.find((v) => v.lang === code);
    if (v) return v;
  }
  return (
    voices.find((v) => v.lang.startsWith(prefix) && !v.localService) ??
    voices.find((v) => v.lang.startsWith(prefix))
  );
}

async function speakWithWebSpeech(
  text: string,
  languageCode: string,
  onEnd: () => void
) {
  window.speechSynthesis.cancel();
  const voices = await getVoicesAsync();
  const voice = selectBestVoice(voices, languageCode);
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = voice?.lang ?? languageCode;
  utterance.rate = 0.85;
  utterance.pitch = 1;
  if (voice) utterance.voice = voice;
  utterance.onend = onEnd;
  utterance.onerror = onEnd;
  window.speechSynthesis.speak(utterance);
}

// --- Google Cloud TTS ---

// ar-SA → ar-XA : seul code arabe supporté par Google TTS (ar-SA n'existe pas dans l'API)
const GOOGLE_TTS_LANG_MAP: Record<string, string> = {
  "ar-SA": "ar-XA",
};

// Endpoint REST v1 — authentification par clé API en query param.
// La réponse contient audioContent encodé en base64 (MP3).
// On tente les voix dans l'ordre de qualité décroissant : Neural2-A → Wavenet-A.
// Si aucune n'existe (400), retourne null — la langue sera marquée non-supportée par l'appelant.
async function speakWithGoogleTTS(
  text: string,
  languageCode: string,
  apiKey: string,
  onEnd: () => void
): Promise<HTMLAudioElement | null> {
  const mappedCode = GOOGLE_TTS_LANG_MAP[languageCode] ?? languageCode;

  const voiceCandidates: string[] = [
    `${mappedCode}-Neural2-A`,
    `${mappedCode}-Wavenet-A`,
  ];

  for (const voiceName of voiceCandidates) {
    const voice = { languageCode: mappedCode, name: voiceName };

    const res = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: { text },
          voice,
          audioConfig: { audioEncoding: "MP3", speakingRate: 0.9 },
        }),
      }
    );

    if (res.status === 400) continue; // voix introuvable → essayer la suivante

    if (!res.ok) {
      console.error("Google TTS error", res.status, await res.text());
      return null;
    }

    const { audioContent } = await res.json() as { audioContent: string };

    // Décodage base64 → Blob audio
    const byteChars = atob(audioContent);
    const byteArr = new Uint8Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) byteArr[i] = byteChars.charCodeAt(i);
    const blob = new Blob([byteArr], { type: "audio/mpeg" });
    const url = URL.createObjectURL(blob);

    const audio = new Audio(url);
    audio.onended = () => { URL.revokeObjectURL(url); onEnd(); };
    audio.onerror = () => { URL.revokeObjectURL(url); onEnd(); };
    audio.play();
    return audio;
  }

  return null;
}

// --- Composant ---

export const AudioButton = forwardRef<AudioButtonHandle, AudioButtonProps>(
function AudioButton({ text, languageCode, variant = "default", disabled = false }, ref) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const apiKey = import.meta.env.VITE_GOOGLE_TTS_API_KEY as string | undefined;
  const hasApiKey = Boolean(apiKey?.trim());

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    window.speechSynthesis?.cancel();
    setIsPlaying(false);
  }, []);

  useImperativeHandle(ref, () => ({ stop }), [stop]);

  const speak = useCallback(async () => {
    if (disabled) return;
    if (isPlaying) {
      stop();
      return;
    }
    setIsPlaying(true);

    const onEnd = () => setIsPlaying(false);

    if (hasApiKey) {
      const audio = await speakWithGoogleTTS(text, languageCode, apiKey!, onEnd).catch(() => null);
      if (audio) {
        audioRef.current = audio;
      } else {
        // Ni Neural2 ni Wavenet disponibles → exclure la langue des prochaines parties
        markLanguageUnsupported(languageCode);
        // Repli Web Speech pour la phrase en cours uniquement
        await speakWithWebSpeech(text, languageCode, onEnd);
      }
    } else {
      await speakWithWebSpeech(text, languageCode, onEnd);
    }
  }, [text, languageCode, isPlaying, hasApiKey, apiKey, stop, disabled]);

  if (!("speechSynthesis" in window) && !hasApiKey) {
    return (
      <button
        disabled
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-muted-foreground text-sm cursor-not-allowed opacity-50"
      >
        <VolumeX size={16} />
        Audio non disponible
      </button>
    );
  }

  return (
    <button
      onClick={speak}
      className={cn(
        "flex items-center gap-2 rounded-lg transition-all duration-200 active:scale-95",
        disabled && "opacity-40 cursor-not-allowed",
        variant !== "accent" && "px-4 py-2.5 text-sm font-semibold",
        variant === "accent"
          ? cn(
              "p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10",
              isPlaying && "text-primary cursor-wait"
            )
          : cn(
              "border border-border hover:border-primary/50 bg-secondary hover:bg-secondary/80",
              isPlaying
                ? "text-primary cursor-wait border-primary/50"
                : "text-foreground hover:text-primary"
            )
      )}
      title={hasApiKey ? "Google TTS · Écouter les mots révélés" : "Web Speech · Écouter les mots révélés"}
    >
      {isPlaying ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <Volume2 size={16} />
      )}
      {variant !== "accent" && (isPlaying ? "Arrêter" : "Écouter")}
    </button>
  );
});
