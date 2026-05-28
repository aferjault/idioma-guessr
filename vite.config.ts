import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import type { Plugin } from "vite";

// Middleware de dev qui proxifie /api/tts vers ElevenLabs avec la clé serveur.
// En prod, c'est la Netlify Function netlify/functions/tts.mjs qui joue ce rôle.
// Mettre ELEVENLABS_API_KEY=xxx dans .env.local (sans le préfixe VITE_).
function devTtsProxy(): Plugin {
  const VOICE_ID = "JBFqnCBsd6RMkjVDRZzb";
  const MODEL_ID = "eleven_v3";

  return {
    name: "dev-tts-proxy",
    configureServer(server) {
      server.middlewares.use("/api/tts", (req, res) => {
        const apiKey = process.env.ELEVENLABS_API_KEY;
        if (!apiKey) {
          res.statusCode = 503;
          res.end("ELEVENLABS_API_KEY non définie dans .env.local");
          return;
        }
        let body = "";
        req.on("data", (chunk: Buffer) => { body += chunk.toString(); });
        req.on("end", async () => {
          try {
            const payload = JSON.parse(body || "{}");
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
                  text: payload.text,
                  model_id: MODEL_ID,
                  voice_settings: payload.voice_settings ?? {
                    stability: 0.5,
                    similarity_boost: 0.75,
                    style: 0,
                    speed: 0.9,
                  },
                }),
              }
            );
            if (!upstream.ok) {
              res.statusCode = upstream.status;
              res.end(await upstream.text());
              return;
            }
            const buffer = Buffer.from(await upstream.arrayBuffer());
            res.setHeader("Content-Type", "audio/mpeg");
            res.end(buffer);
          } catch (err) {
            res.statusCode = 500;
            res.end(String(err));
          }
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), devTtsProxy()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // Proxy local pour contourner le blocage CORS de l'API Tatoeba en développement.
    // En production, un proxy équivalent doit être configuré côté hébergeur
    // (voir netlify.toml pour Netlify, ou vercel.json pour Vercel).
    proxy: {
      "/tatoeba-api": {
        target: "https://api.dev.tatoeba.org",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/tatoeba-api/, ""),
      },
    },
  },
});
