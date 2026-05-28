import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
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
