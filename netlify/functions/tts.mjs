// Proxy serverless vers ElevenLabs TTS — la clé API reste côté serveur, jamais exposée au client
const VOICE_ID = "JBFqnCBsd6RMkjVDRZzb"; // George (voix premade disponible sur tous les comptes)
const MODEL_ID = "eleven_v3"; // Supporte 70+ langues

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return { statusCode: 503, body: "TTS service not configured" };
  }

  let payload;
  try {
    payload = JSON.parse(event.body ?? "{}");
  } catch {
    return { statusCode: 400, body: "Invalid JSON body" };
  }

  const { text, voice_settings } = payload;
  if (!text || typeof text !== "string") {
    return { statusCode: 400, body: "Missing text field" };
  }

  const upstream = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: MODEL_ID,
        voice_settings: voice_settings ?? {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0,
          speed: 0.9,
        },
      }),
    }
  );

  if (!upstream.ok) {
    const errorText = await upstream.text();
    console.error("ElevenLabs error", upstream.status, errorText);
    return { statusCode: upstream.status, body: errorText };
  }

  const buffer = await upstream.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");

  return {
    statusCode: 200,
    headers: { "Content-Type": "audio/mpeg" },
    body: base64,
    isBase64Encoded: true,
  };
}
