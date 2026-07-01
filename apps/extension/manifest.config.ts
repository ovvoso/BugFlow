import type { ManifestV3Export } from "@crxjs/vite-plugin";

/**
 * Manifest Chrome (V3) de l'extension BugFlow.
 *
 * Étape 2 : permission `storage` pour conserver les jetons d'authentification ;
 * accès à l'API BugFlow.
 * Étape 3 : `activeTab` (capturer l'onglet courant sur geste utilisateur) et
 * `tabs`. `scripting` n'est pas requis pour la capture de la zone visible.
 * Étape 4 : `scripting` pour injecter le collecteur d'informations navigateur
 * dans la page (viewport/URL exacts du contexte de l'onglet).
 * Étape 5 : content script (monde MAIN, `document_start`) qui intercepte les
 * logs JavaScript de la page dans un tampon lu à la demande.
 * Étape 6 : content script (monde MAIN, `document_start`) qui intercepte les
 * requêtes réseau (fetch/XHR) — métadonnées seulement — dans un tampon.
 */
const manifest: ManifestV3Export = {
  manifest_version: 3,
  name: "BugFlow",
  version: "0.0.0",
  description: "Capture intelligente de bugs et génération automatique de tickets.",
  action: {
    default_popup: "src/popup/index.html",
    default_title: "BugFlow",
  },
  icons: {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png",
  },
  permissions: ["storage", "activeTab", "tabs", "scripting"],
  host_permissions: ["http://localhost:3000/*"],
  content_scripts: [
    {
      matches: ["http://*/*", "https://*/*"],
      js: ["src/logs/logs.content.ts", "src/network/network.content.ts"],
      run_at: "document_start",
      world: "MAIN",
    },
  ],
};

export default manifest;
