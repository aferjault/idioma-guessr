// Bouton d'écoute — utilise ElevenLabs si la clé API est définie, sinon Web Speech API
import { useState, useCallback, useRef, forwardRef, useImperativeHandle } from "react";
import { Volume2, VolumeX, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AudioButtonHandle {
  stop: () => void;
}

interface AudioButtonProps {
  text: string;
  languageCode: string;
  variant?: "default" | "accent";
  disabled?: boolean;
}

// Voix ElevenLabs : "George" — voice_id premade disponible sur tous les comptes, y compris gratuits.
const ELEVENLABS_VOICE_ID = "JBFqnCBsd6RMkjVDRZzb";
// eleven_v3 supporte 70+ langues dont le vietnamien, le tagalog, etc.
const ELEVENLABS_MODEL = "eleven_v3";

// Extrait le code ISO 639-1 depuis un code BCP-47 (ex: "nb-NO" → "nb")
function toIso639(bcp47: string): string {
  return bcp47.split("-")[0];
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
  // Nouvelles langues eleven_v3
  "nb": ["nb-NO", "no-NO", "no"],
  "hu": ["hu-HU", "hu"],
  "lt": ["lt-LT", "lt"],
  "lv": ["lv-LV", "lv"],
  "et": ["et-EE", "et"],
  "sr": ["sr-RS", "sr-Cyrl", "sr"],
  "sl": ["sl-SI", "sl"],
  "ca": ["ca-ES", "ca"],
  "mk": ["mk-MK", "mk"],
  "is": ["is-IS", "is"],
  "gl": ["gl-ES", "gl"],
  "ga": ["ga-IE", "ga"],
  "cy": ["cy-GB", "cy"],
  "bs": ["bs-BA", "bs"],
  "he": ["he-IL", "he"],
  "fa": ["fa-IR", "fa"],
  "az": ["az-AZ", "az"],
  "kk": ["kk-KZ", "kk"],
  "ka": ["ka-GE", "ka"],
  "hy": ["hy-AM", "hy"],
  "th": ["th-TH", "th"],
  "bn": ["bn-BD", "bn-IN", "bn"],
  "ur": ["ur-PK", "ur"],
  "sw": ["sw-KE", "sw-TZ", "sw"],
  "af": ["af-ZA", "af"],
  "be": ["be-BY", "be"],
};

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

// --- ElevenLabs ---

async function speakWithElevenLabs(
  text: string,
  languageCode: string,
  apiKey: string,
  onEnd: () => void
): Promise<HTMLAudioElement | null> {
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: ELEVENLABS_MODEL,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0,
          speed: 0.9,
        },
      }),
    }
  );

  if (!res.ok) {
    console.error("ElevenLabs error", res.status, await res.text());
    return null;
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  audio.onended = () => {
    URL.revokeObjectURL(url); // libère la mémoire
    onEnd();
  };
  audio.onerror = () => {
    URL.revokeObjectURL(url);
    onEnd();
  };
  audio.play();
  return audio;
}

// --- Composant ---

export const AudioButton = forwardRef<AudioButtonHandle, AudioButtonProps>(
function AudioButton({ text, languageCode, variant = "default", disabled = false }, ref) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY as string | undefined;
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
      const audio = await speakWithElevenLabs(text, languageCode, apiKey!, onEnd).catch(() => null);
      if (audio) {
        audioRef.current = audio;
      } else {
        // ElevenLabs a échoué — repli sur Web Speech
        await speakWithWebSpeech(text, languageCode, onEnd);
      }
    } else {
      // Pas de clé API, ou langue non supportée par ElevenLabs → Web Speech directement
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
      title={hasApiKey ? "ElevenLabs · Écouter les mots révélés" : "Web Speech · Écouter les mots révélés"}
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
