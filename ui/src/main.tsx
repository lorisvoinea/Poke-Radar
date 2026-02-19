import React from "react";
import { createRoot } from "react-dom/client";
import { BootPage } from "./pages/BootPage";

const element = document.getElementById("root");

if (!element) {
  throw new Error("Root element introuvable");
}

createRoot(element).render(
  <React.StrictMode>
    <BootPage />
  </React.StrictMode>
);
