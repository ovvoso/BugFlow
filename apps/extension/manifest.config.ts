import type { ManifestV3Export } from "@crxjs/vite-plugin";

/**
 * Manifest Chrome (V3) de l'extension BugFlow.
 *
 * Étape 2 : permission `storage` pour conserver les jetons d'authentification ;
 * accès à l'API BugFlow. Les permissions de capture (tabs, scripting, ...)
 * seront ajoutées aux étapes suivantes.
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
  permissions: ["storage"],
  host_permissions: ["http://localhost:3000/*"],
};

export default manifest;
