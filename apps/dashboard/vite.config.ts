import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

/**
 * Configuration Vite du dashboard.
 * Aucune route ni logique métier — uniquement l'ossature de build.
 */
export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  build: { outDir: "dist", sourcemap: true },
});
