import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { BootPage } from "../pages/BootPage";

describe("BootPage", () => {
  afterEach(() => {
    delete (window as Window & { __TAURI_INTERNALS__?: unknown }).__TAURI_INTERNALS__;
  });

  it("affiche un état prêt après le boot nominal", async () => {
    render(<BootPage />);

    expect(await screen.findByText("Application prête")).toBeInTheDocument();
  });

  it("bloque l'application quand le backend échoue", async () => {
    (window as Window & {
      __TAURI_INTERNALS__?: {
        invoke: () => Promise<never>;
      };
    }).__TAURI_INTERNALS__ = {
      invoke: () => Promise.reject(new Error("DB open failure"))
    };

    render(<BootPage />);

    expect(await screen.findByText("Erreur d'initialisation")).toBeInTheDocument();
    expect(await screen.findByText("DB open failure")).toBeInTheDocument();
  });
});
