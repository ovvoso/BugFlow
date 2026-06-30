import { crx } from "@crxjs/vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import manifest from "./manifest.config";

/**
 * Configuration Vite de l'extension via @crxjs/vite-plugin.
 * Génère un bundle MV3 — aucune logique de capture à ce stade.
 */
export default defineConfig({
  plugins: [react(), crx({ manifest })],
  build: { outDir: "dist", sourcemap: true },
});
