import React from "react";
import { createRoot } from "react-dom/client";
import { BootPage } from "./pages/BootPage";

// `const` déclare une constante (réassignation interdite).
const element = document.getElementById("root");

// Garde-fou: on échoue tôt si le nœud racine HTML est absent.
if (!element) {
  throw new Error("Root element introuvable");
}

// `createRoot(...).render(...)` démarre l'application React 18.
createRoot(element).render(
  <React.StrictMode>
    {/* StrictMode active des vérifications supplémentaires en développement. */}
    <BootPage />
  </React.StrictMode>
);
