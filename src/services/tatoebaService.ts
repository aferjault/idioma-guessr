// Service d'accès à l'API Tatoeba v1 pour générer des phrases aléatoires
// Tatoeba est une base de données open-source de phrases traduites dans 400+ langues
// Doc API : https://api.dev.tatoeba.org

import type { Phrase, LanguageMeta } from "@/data/phrases";
import { LANGUAGE_META } from "@/data/phrases";

interface TatoebaTranslation {
  id: number;
  lang: string;
  text: string;
  is_direct: boolean;
}

interface TatoebaResult {
  id: number;
  lang: string;
  text: string;
  is_unapproved: boolean;
  translations: TatoebaTranslation[];
}

interface TatoebaResponse {
  data: TatoebaResult[];
}

// En dev : passe par le proxy Vite (/tatoeba-api → https://api.dev.tatoeba.org)
// En prod : proxy côté hébergeur (netlify.toml / vercel.json)
const TATOEBA_SEARCH_URL = "/tatoeba-api/v1/sentences";

// Pour les langues sans espaces (thaï, CJK…), split(" ") renvoie toujours 1.
// On estime à ~3 caractères par mot dans ce cas.
function estimateLength(text: string): number {
  const spaceWords = text.split(/\s+/).filter(Boolean).length;
  if (spaceWords <= 1 && text.length > 5) return Math.floor(text.length / 3);
  return spaceWords;
}
const FETCH_TIMEOUT_MS = 8000;
const MIN_WORD_COUNT = 5;
const MAX_WORD_COUNT = 14;

// Récupère une phrase aléatoire avec traduction française pour un code de langue Tatoeba donné
async function fetchFromTatoeba(
  tatoebaCode: string
): Promise<{ text: string; translation: string } | null> {
  const params = new URLSearchParams({
    lang: tatoebaCode,
    "trans:lang": "fra",
    sort: "random",
    limit: "20",
  });

  const res = await fetch(`${TATOEBA_SEARCH_URL}?${params}`, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });

  if (!res.ok) {
    console.warn(`[Tatoeba] HTTP ${res.status} pour "${tatoebaCode}"`);
    return null;
  }

  // Vérifie que la réponse est bien du JSON (l'ancienne API renvoyait du HTML)
  const contentType = res.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    console.warn(`[Tatoeba] Réponse non-JSON pour "${tatoebaCode}" : ${contentType}`);
    return null;
  }

  const data: TatoebaResponse = await res.json();
  console.log(`[Tatoeba] "${tatoebaCode}" → ${data.data?.length ?? 0} résultats bruts`);

  // Garde uniquement les phrases approuvées avec une traduction française et assez de mots
  const candidates = (data.data ?? []).filter((r) => {
    if (r.is_unapproved) return false;
    const hasFrench = r.translations.some((t) => t.lang === "fra");
    const len = estimateLength(r.text);
    return hasFrench && len >= MIN_WORD_COUNT && len <= MAX_WORD_COUNT;
  });
  console.log(`[Tatoeba] "${tatoebaCode}" → ${candidates.length} candidats valides (≥${MIN_WORD_COUNT} mots + trad. FR)`);

  if (candidates.length === 0) return null;

  const picked = candidates[Math.floor(Math.random() * candidates.length)];
  const translation = picked.translations.find((t) => t.lang === "fra")?.text;

  if (!translation) return null;
  return { text: picked.text, translation };
}

// Construit un objet Phrase à partir des métadonnées et du contenu récupéré
function buildPhrase(
  meta: LanguageMeta,
  content: { text: string; translation: string },
  source: "tatoeba" | "fallback"
): Phrase {
  return {
    id: `${meta.tatoebaCode}-${source}-${Date.now()}`,
    text: content.text,
    translation: content.translation,
    language: meta.language,
    languageCode: meta.languageCode,
    flag: meta.flag,
    hint: meta.hint,
    languageFamily: meta.languageFamily,
  };
}

// Retourne une phrase aléatoire depuis Tatoeba, avec repli sur le fallback statique
export async function fetchRandomPhrase(languageName?: string): Promise<Phrase> {
  const meta = languageName
    ? (LANGUAGE_META.find((m) => m.language === languageName) ??
        LANGUAGE_META[Math.floor(Math.random() * LANGUAGE_META.length)])
    : LANGUAGE_META[Math.floor(Math.random() * LANGUAGE_META.length)];

  try {
    const result = await fetchFromTatoeba(meta.tatoebaCode);
    if (result) {
      return buildPhrase(meta, result, "tatoeba");
    }
  } catch (err) {
    console.warn(`[Tatoeba] Erreur réseau pour "${meta.tatoebaCode}" :`, err);
  }

  console.warn(`[Tatoeba] Repli sur fallback statique pour "${meta.language}"`);
  return buildPhrase(meta, meta.fallback, "fallback");
}
