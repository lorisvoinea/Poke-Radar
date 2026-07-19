import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { StrategyPage } from "../pages/strategy/StrategyPage";

describe("Parcours E2E de configuration de stratégie", () => {
  afterEach(() => {
    cleanup();
    delete (window as Window & { __TAURI_INTERNALS__?: unknown }).__TAURI_INTERNALS__;
  });

  it("crée un produit libre puis l'utilise immédiatement dans un profil", async () => {
    render(<StrategyPage />);
    await screen.findByText("Mode navigateur: données de démonstration affichées.");

    fireEvent.click(screen.getByRole("radio", { name: "Saisie libre" }));
    fireEvent.change(screen.getByLabelText("Code libre"), {
      target: { value: "  PKM-E2E-001  " }
    });
    fireEvent.change(screen.getByLabelText("Nom libre"), {
      target: { value: "  Coffret Pikachu E2E  " }
    });
    fireEvent.click(screen.getByRole("button", { name: "Ajouter le produit" }));

    expect(await screen.findByText("Produit créé et liste actualisée.")).toBeInTheDocument();
    const productCheckbox = screen.getByRole("checkbox", { name: /Coffret Pikachu E2E/ });
    expect(productCheckbox).toBeInTheDocument();
    expect(productCheckbox.closest("label")).toHaveTextContent("PKM-E2E-001");
    expect(productCheckbox.closest("label")).toHaveTextContent("Non normalisé");

    fireEvent.change(screen.getByLabelText("Nom du profil"), {
      target: { value: "Surveillance Pikachu" }
    });
    fireEvent.click(productCheckbox);
    fireEvent.click(screen.getByRole("button", { name: "Enregistrer le profil" }));

    expect(await screen.findByText("Profil enregistré avec succès.")).toBeInTheDocument();
    const savedProfile = screen.getByText("Surveillance Pikachu").closest("li");
    expect(savedProfile).not.toBeNull();
    expect(within(savedProfile as HTMLElement).getByText("Actif")).toBeInTheDocument();
    expect(within(savedProfile as HTMLElement).getByText(/Coffret Pikachu E2E · PKM-E2E-001/)).toBeInTheDocument();
    expect(within(savedProfile as HTMLElement).getByText("Non normalisé")).toBeInTheDocument();
    expect(screen.getByText("Profil sauvegardé en mode démonstration.")).toBeInTheDocument();
  });

  it("bloque le profil tant qu'aucun produit n'est sélectionné", async () => {
    render(<StrategyPage />);
    await screen.findByText("Mode navigateur: données de démonstration affichées.");

    fireEvent.change(screen.getByLabelText("Nom du profil"), {
      target: { value: "Profil incomplet" }
    });

    expect(screen.getByRole("alert")).toHaveTextContent("Sélectionnez au moins un produit.");
    expect(screen.getByRole("button", { name: "Enregistrer le profil" })).toBeDisabled();
    expect(screen.queryByText("Profil incomplet", { selector: ".profile-card strong" })).not.toBeInTheDocument();
  });
});
