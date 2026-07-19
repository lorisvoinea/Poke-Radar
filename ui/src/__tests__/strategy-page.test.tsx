import { readFileSync } from "node:fs";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { StrategyPage } from "../pages/strategy/StrategyPage";
const styles = readFileSync(`${process.cwd()}/src/styles.css`, "utf8");

let stylesheet: HTMLStyleElement;

beforeAll(() => {
  stylesheet = document.createElement("style");
  stylesheet.textContent = styles;
  document.head.append(stylesheet);
});

afterAll(() => stylesheet.remove());

describe("StrategyPage", () => {
  afterEach(() => {
    cleanup();
    delete (window as Window & { __TAURI_INTERNALS__?: unknown }).__TAURI_INTERNALS__;
  });

  it("affiche le formulaire stratégie en mode navigateur", async () => {
    render(<StrategyPage />);

    expect(await screen.findByRole("heading", { name: "Votre stratégie" })).toBeInTheDocument();
    expect(await screen.findByText("Mode navigateur: données de démonstration affichées.")).toBeInTheDocument();
    expect(await screen.findByRole("button", { name: "Enregistrer le profil" })).toBeInTheDocument();
  });

  it("expose une structure responsive sans tableau ni largeur fixe", async () => {
    const { container } = render(<StrategyPage />);

    expect(await screen.findByRole("main")).toHaveClass("app-shell");
    expect(container.querySelector(".dashboard-grid")).toBeInTheDocument();
    expect(container.querySelector("table")).not.toBeInTheDocument();
  });

  it("conserve produits et profils lorsque le référentiel Tauri est indisponible", async () => {
    const invoke = vi.fn(async (command: string) => {
      if (command === "app_ready") return "ok";
      if (command === "list_products_command") return [{ id: 7, sku: "HIST-1", title: "Historique", normalizationStatus: "free_text", reference: null }];
      if (command === "list_monitor_profiles_command") return [{ id: 3, name: "Profil conservé", minMarginBps: 100, fixedCostCents: 0, variableFeeBps: 0, isActive: true, productIds: [7] }];
      if (command === "list_product_references_command") throw new Error("catalogue absent");
      return undefined;
    });
    (window as Window & { __TAURI_INTERNALS__?: unknown }).__TAURI_INTERNALS__ = { invoke };

    render(<StrategyPage />);

    expect(await screen.findByText("Historique")).toBeInTheDocument();
    expect(await screen.findByText("Profil conservé")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("référentiel indisponible");
  });

  it("crée via Tauri puis relit le même identifiant de référence", async () => {
    const reference = { id: "ref-1", code: "REF-001", name: "Carte", setName: "Set", edition: "Première édition", rarity: "Rare", language: "fr" };
    let products: unknown[] = [];
    const invoke = vi.fn(async (command: string, args?: Record<string, unknown>) => {
      if (command === "app_ready") return "ok";
      if (command === "list_product_references_command") return [reference];
      if (command === "list_monitor_profiles_command") return [];
      if (command === "list_products_command") return products;
      if (command === "create_product_command") {
        expect(args).toEqual({ input: { referenceId: "ref-1" } });
        products = [{ id: 9, sku: reference.code, title: reference.name, normalizationStatus: "normalized", reference }];
        return products[0];
      }
      return undefined;
    });
    (window as Window & { __TAURI_INTERNALS__?: unknown }).__TAURI_INTERNALS__ = { invoke };
    render(<StrategyPage />);

    await screen.findByRole("option", { name: /Carte/ });
    fireEvent.click(screen.getByRole("button", { name: "Ajouter le produit" }));

    await waitFor(() => expect(invoke).toHaveBeenCalledWith("create_product_command", { input: { referenceId: "ref-1" } }));
    expect(await screen.findByText("Carte", { selector: ".product-option strong" })).toBeInTheDocument();
    expect(screen.getByText("REF-001", { selector: ".product-option small" })).toBeInTheDocument();
    expect(products).toEqual(expect.arrayContaining([expect.objectContaining({ reference: expect.objectContaining({ id: "ref-1" }) })]));
  });

  it("annonce qu'une création est acquise si son rafraîchissement échoue", async () => {
    let productReads = 0;
    const reference = { id: "ref-1", code: "REF-001", name: "Carte", setName: "Set", edition: "Première édition", rarity: "Rare", language: "fr" };
    const invoke = vi.fn(async (command: string) => {
      if (command === "app_ready" || command === "create_product_command") return {};
      if (command === "list_product_references_command") return [reference];
      if (command === "list_monitor_profiles_command") return [];
      if (command === "list_products_command" && productReads++ === 0) return [];
      if (command === "list_products_command") throw new Error("lecture impossible");
      return undefined;
    });
    (window as Window & { __TAURI_INTERNALS__?: unknown }).__TAURI_INTERNALS__ = { invoke };
    render(<StrategyPage />);
    await screen.findByRole("option", { name: /Carte/ });
    fireEvent.click(screen.getByRole("button", { name: "Ajouter le produit" }));

    expect(await screen.findByText(/Produit créé, mais son rafraîchissement a échoué/)).toBeInTheDocument();
  });

  it("refuse en mode navigateur un SKU libre déjà présent", async () => {
    render(<StrategyPage />);
    await screen.findByText("Mode navigateur: données de démonstration affichées.");
    fireEvent.click(screen.getByRole("radio", { name: "Saisie libre" }));
    fireEvent.change(screen.getByLabelText("Code libre"), { target: { value: " PS5-DISC " } });
    fireEvent.change(screen.getByLabelText("Nom libre"), { target: { value: "Doublon" } });
    fireEvent.click(screen.getByRole("button", { name: "Ajouter le produit" }));

    expect(await screen.findByText("Un produit avec ce code existe déjà.")).toBeInTheDocument();
  });

  it("respecte le parcours clavier et les cibles tactiles à 320 px", async () => {
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 320 });
    const { container } = render(<StrategyPage />);
    const mode = await screen.findByRole("radio", { name: "Référentiel" });
    const selector = screen.getByRole("combobox", { name: "Référence Pokémon" });
    const submit = screen.getByRole("button", { name: "Ajouter le produit" });

    mode.focus();
    expect(mode).toHaveFocus();
    selector.focus();
    expect(selector).toHaveFocus();
    await waitFor(() => expect(submit).toBeEnabled());
    submit.focus();
    expect(submit).toHaveFocus();
    expect(screen.getByRole("main")).toHaveClass("app-shell");
    const grid = container.querySelector<HTMLElement>(".dashboard-grid");
    const modeTarget = mode.closest<HTMLElement>("label");
    expect(grid).not.toBeNull();
    expect(modeTarget).not.toBeNull();
    expect(styles).toMatch(/html\s*{[^}]*min-width:\s*320px/);
    expect(styles).toMatch(/\.app-shell\s*{[^}]*width:\s*min\(100%,\s*1180px\)/);
    expect(styles).toMatch(/\.dashboard-grid\s*{[^}]*min-width:\s*0/);
    expect(styles).toMatch(/\.touch-target\s*{[^}]*min-height:\s*44px/);
    expect(styles).toMatch(/\.button\s*{[^}]*min-height:\s*48px/);
    expect(modeTarget).toHaveClass("touch-target");
    expect(submit).toHaveClass("touch-target");
  });

  it("affiche les produits libres des profils avec leur libellé et leur état", async () => {
    const invoke = vi.fn(async (command: string) => {
      if (command === "app_ready") return "ok";
      if (command === "list_product_references_command") return [];
      if (command === "list_products_command") return [{ id: 7, sku: "LIBRE-7", title: "Carte locale", normalizationStatus: "free_text", reference: null }];
      if (command === "list_monitor_profiles_command") return [{ id: 3, name: "Profil libre", minMarginBps: 100, fixedCostCents: 0, variableFeeBps: 0, isActive: true, productIds: [7] }];
      return undefined;
    });
    (window as Window & { __TAURI_INTERNALS__?: unknown }).__TAURI_INTERNALS__ = { invoke };

    render(<StrategyPage />);

    const profile = (await screen.findByText("Profil libre")).closest("li");
    expect(profile).toHaveTextContent("Carte locale");
    expect(profile).toHaveTextContent("LIBRE-7");
    expect(profile).toHaveTextContent("Non normalisé");
    expect(profile).not.toHaveTextContent(/^7$/);
  });
});
