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
    expect(screen.getByText("Produits et profils chargés; référentiel indisponible. La saisie libre reste possible.", { selector: ".status-pill" })).toBeInTheDocument();
  });

  it("n'efface pas le dernier référentiel connu quand sa lecture échoue", async () => {
    const reference = { id: "ref-1", code: "REF-001", name: "Carte conservée", setName: "Set", edition: "Standard", rarity: "Rare", language: "fr" };
    let refreshCount = 0;
    const invoke = vi.fn(async (command: string) => {
      if (command === "app_ready") return "ok";
      if (command === "list_products_command") return [{ id: 7, sku: "HIST-1", title: "Historique", normalizationStatus: "free_text", reference: null }];
      if (command === "list_monitor_profiles_command") return [];
      if (command === "list_product_references_command") {
        if (refreshCount++ === 0) return [reference];
        throw new Error("catalogue absent");
      }
      if (command === "create_product_command") return {};
      return undefined;
    });
    (window as Window & { __TAURI_INTERNALS__?: unknown }).__TAURI_INTERNALS__ = { invoke };

    render(<StrategyPage />);
    expect(await screen.findByRole("option", { name: /Carte conservée/ })).toBeInTheDocument();
    await waitFor(() => expect(screen.getByRole("button", { name: "Ajouter le produit" })).toBeEnabled());
    fireEvent.click(screen.getByRole("button", { name: "Ajouter le produit" }));

    expect(await screen.findByText(/référentiel indisponible/)).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /Carte conservée/ })).toBeInTheDocument();
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
    const submit = screen.getByRole("button", { name: "Ajouter le produit" });
    await waitFor(() => expect(submit).toBeEnabled());
    fireEvent.click(submit);

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

  it("conserve un instantané cohérent si une lecture essentielle du rafraîchissement échoue", async () => {
    const reference = { id: "ref-1", code: "REF-001", name: "Carte", setName: "Set", edition: "Standard", rarity: "Rare", language: "fr" };
    const replacementReference = { id: "ref-2", code: "REF-002", name: "Référence publiée trop tôt", setName: "Set", edition: "Standard", rarity: "Rare", language: "fr" };
    const historicalProduct = { id: 7, sku: "HIST-1", title: "Produit historique", normalizationStatus: "free_text", reference: null };
    const refreshedProduct = { id: 8, sku: reference.code, title: reference.name, normalizationStatus: "normalized", reference };
    const historicalProfile = { id: 3, name: "Profil cohérent", minMarginBps: 100, fixedCostCents: 0, variableFeeBps: 0, isActive: true, productIds: [7] };
    let refreshCount = 0;
    const invoke = vi.fn(async (command: string) => {
      if (command === "app_ready" || command === "create_product_command") return {};
      if (command === "list_product_references_command") {
        return refreshCount === 0 ? [reference] : [replacementReference];
      }
      if (command === "list_products_command") {
        return refreshCount === 0 ? [historicalProduct] : [refreshedProduct];
      }
      if (command === "list_monitor_profiles_command") {
        if (refreshCount++ === 0) return [historicalProfile];
        throw new Error("lecture profils impossible");
      }
      return undefined;
    });
    (window as Window & { __TAURI_INTERNALS__?: unknown }).__TAURI_INTERNALS__ = { invoke };

    render(<StrategyPage />);
    expect(await screen.findByText("Produit historique", { selector: ".product-option strong" })).toBeInTheDocument();
    await waitFor(() => expect(screen.getByRole("button", { name: "Ajouter le produit" })).toBeEnabled());
    fireEvent.click(screen.getByRole("button", { name: "Ajouter le produit" }));

    expect(await screen.findByText(/Produit créé, mais son rafraîchissement a échoué/)).toBeInTheDocument();
    const profile = screen.getByText("Profil cohérent").closest("li");
    expect(profile).toHaveTextContent("Produit historique · HIST-1");
    expect(profile).not.toHaveTextContent("Produit indisponible");
    expect(screen.getByRole("option", { name: /Carte/ })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: /Référence publiée trop tôt/ })).not.toBeInTheDocument();
  });

  it.each([
    ["vide", "Aucune référence n'est disponible. La saisie libre reste possible."],
    ["indisponible", "Le référentiel est indisponible. La saisie libre reste possible."]
  ])("conserve l'indication de référentiel %s après une création libre", async (referenceCase, expectedMessage) => {
    let products: unknown[] = [];
    const invoke = vi.fn(async (command: string, args?: Record<string, unknown>) => {
      if (command === "app_ready") return {};
      if (command === "list_product_references_command") {
        if (referenceCase === "indisponible") throw new Error("catalogue absent");
        return [];
      }
      if (command === "list_products_command") return products;
      if (command === "list_monitor_profiles_command") return [];
      if (command === "create_product_command") {
        const input = args?.input as { sku: string; title: string };
        products = [{ id: 9, sku: input.sku, title: input.title, normalizationStatus: "free_text", reference: null }];
        return products[0];
      }
      return undefined;
    });
    (window as Window & { __TAURI_INTERNALS__?: unknown }).__TAURI_INTERNALS__ = { invoke };

    render(<StrategyPage />);
    fireEvent.click(await screen.findByRole("radio", { name: "Saisie libre" }));
    fireEvent.change(screen.getByLabelText("Code libre"), { target: { value: "LIBRE-9" } });
    fireEvent.change(screen.getByLabelText("Nom libre"), { target: { value: "Carte locale" } });
    fireEvent.click(screen.getByRole("button", { name: "Ajouter le produit" }));

    expect(await screen.findByText("Produit créé et liste actualisée.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("radio", { name: "Référentiel" }));
    expect(screen.getByText(expectedMessage)).toBeInTheDocument();
  });

  it("ignore une réponse de rafraîchissement plus ancienne arrivée en dernier", async () => {
    const reference = { id: "ref-1", code: "REF-001", name: "Carte récente", setName: "Set", edition: "Standard", rarity: "Rare", language: "fr" };
    const initialProduct = { id: 7, sku: "HIST-1", title: "Produit initial", normalizationStatus: "free_text", reference: null };
    const recentProduct = { id: 8, sku: reference.code, title: reference.name, normalizationStatus: "normalized", reference };
    const recentProfile = { id: 4, name: "Profil récent", minMarginBps: 1500, fixedCostCents: 0, variableFeeBps: 0, isActive: true, productIds: [7] };
    let resolveOldProducts!: (products: unknown[]) => void;
    const oldProducts = new Promise<unknown[]>((resolve) => { resolveOldProducts = resolve; });
    let refreshIndex = -1;
    const invoke = vi.fn(async (command: string) => {
      if (command === "app_ready" || command === "create_product_command" || command === "create_monitor_profile_command") return {};
      if (command === "run_monitoring_cycle_stub_command") return { message: "Cycle récent" };
      if (command === "list_products_command") {
        refreshIndex += 1;
        if (refreshIndex === 0) return [initialProduct];
        if (refreshIndex === 1) return oldProducts;
        return [initialProduct, recentProduct];
      }
      if (command === "list_product_references_command") return [reference];
      if (command === "list_monitor_profiles_command") return refreshIndex >= 2 ? [recentProfile] : [];
      return undefined;
    });
    (window as Window & { __TAURI_INTERNALS__?: unknown }).__TAURI_INTERNALS__ = { invoke };

    render(<StrategyPage />);
    await screen.findByText("Produit initial", { selector: ".product-option strong" });
    fireEvent.change(screen.getByLabelText("Nom du profil"), { target: { value: "Profil récent" } });
    fireEvent.click(screen.getByRole("checkbox", { name: /Produit initial/ }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Ajouter le produit" })).toBeEnabled());

    fireEvent.click(screen.getByRole("button", { name: "Ajouter le produit" }));
    fireEvent.click(screen.getByRole("button", { name: "Enregistrer le profil" }));

    expect(await screen.findByText("Profil récent", { selector: ".profile-card strong" })).toBeInTheDocument();
    expect(screen.getByText("Carte récente", { selector: ".product-option strong" })).toBeInTheDocument();

    resolveOldProducts([initialProduct]);
    await waitFor(() => expect(screen.getByText("Produit créé et liste actualisée.")).toBeInTheDocument());
    expect(screen.getByText("Profil récent", { selector: ".profile-card strong" })).toBeInTheDocument();
    expect(screen.getByText("Carte récente", { selector: ".product-option strong" })).toBeInTheDocument();
  });

  it("propage l'échec du rafraîchissement gagnant à une création dont le rafraîchissement a été supplanté", async () => {
    const reference = { id: "ref-1", code: "REF-001", name: "Carte", setName: "Set", edition: "Standard", rarity: "Rare", language: "fr" };
    const initialProduct = { id: 7, sku: "HIST-1", title: "Produit initial", normalizationStatus: "free_text", reference: null };
    let resolveSupersededProducts!: (products: unknown[]) => void;
    const supersededProducts = new Promise<unknown[]>((resolve) => { resolveSupersededProducts = resolve; });
    let productReads = 0;
    const invoke = vi.fn(async (command: string) => {
      if (command === "app_ready" || command === "create_product_command" || command === "create_monitor_profile_command") return {};
      if (command === "run_monitoring_cycle_stub_command") return { message: "Cycle terminé" };
      if (command === "list_products_command") {
        productReads += 1;
        if (productReads === 1) return [initialProduct];
        if (productReads === 2) return supersededProducts;
        return [initialProduct];
      }
      if (command === "list_product_references_command") return [reference];
      if (command === "list_monitor_profiles_command") {
        if (productReads >= 3) throw new Error("lecture profils impossible");
        return [];
      }
      return undefined;
    });
    (window as Window & { __TAURI_INTERNALS__?: unknown }).__TAURI_INTERNALS__ = { invoke };

    render(<StrategyPage />);
    await screen.findByText("Produit initial", { selector: ".product-option strong" });
    fireEvent.change(screen.getByLabelText("Nom du profil"), { target: { value: "Profil concurrent" } });
    fireEvent.click(screen.getByRole("checkbox", { name: /Produit initial/ }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Ajouter le produit" })).toBeEnabled());

    fireEvent.click(screen.getByRole("button", { name: "Ajouter le produit" }));
    fireEvent.click(screen.getByRole("button", { name: "Enregistrer le profil" }));

    expect(await screen.findByText("Impossible de recharger les produits ou les profils.")).toBeInTheDocument();
    resolveSupersededProducts([initialProduct]);

    expect(await screen.findByText(/Produit créé, mais son rafraîchissement a échoué/)).toBeInTheDocument();
    expect(screen.getByText("Produit créé et liste actualisée.")).toBeInTheDocument();
  });

  it("ignore l'échec app_ready d'une requête supplantée après un rafraîchissement gagnant réussi", async () => {
    const reference = { id: "ref-1", code: "REF-001", name: "Carte", setName: "Set", edition: "Standard", rarity: "Rare", language: "fr" };
    const initialProduct = { id: 7, sku: "HIST-1", title: "Produit initial", normalizationStatus: "free_text", reference: null };
    const recentProfile = { id: 4, name: "Profil gagnant", minMarginBps: 1500, fixedCostCents: 0, variableFeeBps: 0, isActive: true, productIds: [7] };
    let rejectSupersededReady!: (error: Error) => void;
    const supersededReady = new Promise<unknown>((_resolve, reject) => { rejectSupersededReady = reject; });
    let appReadyCalls = 0;
    let productReads = 0;
    const invoke = vi.fn(async (command: string) => {
      if (command === "app_ready") {
        appReadyCalls += 1;
        if (appReadyCalls === 2) return supersededReady;
        return {};
      }
      if (command === "create_product_command" || command === "create_monitor_profile_command") return {};
      if (command === "run_monitoring_cycle_stub_command") return { message: "Cycle gagnant" };
      if (command === "list_products_command") {
        productReads += 1;
        return [initialProduct];
      }
      if (command === "list_product_references_command") return [reference];
      if (command === "list_monitor_profiles_command") return productReads >= 2 ? [recentProfile] : [];
      return undefined;
    });
    (window as Window & { __TAURI_INTERNALS__?: unknown }).__TAURI_INTERNALS__ = { invoke };

    render(<StrategyPage />);
    await screen.findByText("Produit initial", { selector: ".product-option strong" });
    fireEvent.change(screen.getByLabelText("Nom du profil"), { target: { value: "Profil gagnant" } });
    fireEvent.click(screen.getByRole("checkbox", { name: /Produit initial/ }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Ajouter le produit" })).toBeEnabled());

    fireEvent.click(screen.getByRole("button", { name: "Ajouter le produit" }));
    fireEvent.click(screen.getByRole("button", { name: "Enregistrer le profil" }));

    expect(await screen.findByText("Profil gagnant", { selector: ".profile-card strong" })).toBeInTheDocument();
    rejectSupersededReady(new Error("ancienne initialisation échouée"));

    expect(await screen.findByText("Produit créé et liste actualisée.")).toBeInTheDocument();
    expect(screen.queryByText(/Produit créé, mais son rafraîchissement a échoué/)).not.toBeInTheDocument();
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

  it("préserve les contrôles clavier et les classes de cibles tactiles", async () => {
    render(<StrategyPage />);
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
    const modeTarget = mode.closest<HTMLElement>("label");
    expect(modeTarget).not.toBeNull();
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
