import React from "react";
import { createRoot } from "react-dom/client";
import { StrategyPage } from "./pages/strategy/StrategyPage";

const element = document.getElementById("root");

if (!element) {
  throw new Error("Root element introuvable");
}

createRoot(element).render(
  <React.StrictMode>
    <StrategyPage />
  </React.StrictMode>
);
