import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { BootPage } from "../pages/BootPage";

// `describe` regroupe des tests liés à un même composant/fonctionnalité.
describe("BootPage", () => {
  // `afterEach` réinitialise l'environnement entre les tests (isolation).
  afterEach(() => {
    delete (window as Window & { __TAURI_INTERNALS__?: unknown }).__TAURI_INTERNALS__;
  });

  // `it` décrit un scénario de test précis.
  it("affiche un état prêt après le boot nominal", async () => {
    (window as Window & {
      __TAURI_INTERNALS__?: {
        invoke: () => Promise<string>;
      };
    }).__TAURI_INTERNALS__ = {
      invoke: () => Promise.resolve("application prête")
    };

    // `render` monte le composant dans un DOM de test.
    render(<BootPage />);

    // `findByText` attend asynchroniquement que le texte apparaisse.
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

  it("bloque l'application quand Tauri est absent", async () => {
    render(<BootPage />);

    expect(await screen.findByText("Erreur d'initialisation")).toBeInTheDocument();
    expect(
      await screen.findByText(
        "Runtime Tauri indisponible. Lancez l'application via Tauri (et non dans un navigateur seul)."
      )
    ).toBeInTheDocument();
  });
});
