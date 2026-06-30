import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App";
import "./index.css";

/**
 * Point de montage du dashboard.
 * Fondations uniquement : aucune route, aucun appel API, aucune feature.
 */
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Élément racine #root introuvable.");
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
