import { useEffect, useState } from "react";
import { StrategyForm } from "../../components/StrategyForm";
import { ProductConfigurator, ProductInput, ProductReference } from "../../components/ProductConfigurator";

type TauriInternals = {
  invoke: <T>(command: string, args?: Record<string, unknown>) => Promise<T>;
};

type Product = {
  id: number;
  sku: string;
  title: string;
  normalizationStatus: "normalized" | "free_text";
  reference: ProductReference | null;
};

type Profile = {
  id: number;
  name: string;
  minMarginBps: number;
  fixedCostCents: number;
  variableFeeBps: number;
  isActive: boolean;
  productIds: number[];
};

const FALLBACK_PRODUCTS: Product[] = [
  { id: 1, sku: "PS5-DISC", title: "Console PS5", normalizationStatus: "free_text", reference: null },
  { id: 2, sku: "NSW-OLED", title: "Nintendo Switch OLED", normalizationStatus: "free_text", reference: null }
];
const FALLBACK_REFERENCES: ProductReference[] = [
  { id: "pokemon-sv1-fr-001", code: "SV1-001-FR", name: "Poussacha", setName: "Écarlate et Violet", edition: "Écarlate et Violet", language: "fr" }
];

export function StrategyPage(): JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [references, setReferences] = useState<ProductReference[]>([]);
  const [status, setStatus] = useState("Initialisation...");

  const tauri = (window as Window & { __TAURI_INTERNALS__?: TauriInternals }).__TAURI_INTERNALS__;

  async function refreshData() {
    if (!tauri) {
      setProducts(FALLBACK_PRODUCTS);
      setReferences(FALLBACK_REFERENCES);
      setStatus("Mode navigateur: données de démonstration affichées.");
      return;
    }

    await tauri.invoke("app_ready");
    const loadedProducts = await tauri.invoke<Product[]>("list_products_command");
    const loadedReferences = await tauri.invoke<ProductReference[]>("list_product_references_command");
    const loadedProfiles = await tauri.invoke<Profile[]>("list_monitor_profiles_command");
    setProducts(loadedProducts);
    setReferences(loadedReferences);
    setProfiles(loadedProfiles);
    setStatus("Configuration rechargée automatiquement.");
  }

  useEffect(() => {
    void refreshData();
  }, []);

  async function createProfile(input: {
    name: string;
    minMarginBps: number;
    fixedCostCents: number;
    variableFeeBps: number;
    productIds: number[];
    makeActive: boolean;
  }) {
    if (!tauri) {
      setProfiles((current) => [
        ...current,
        {
          id: current.length + 1,
          ...input,
          isActive: true
        }
      ]);
      setStatus("Profil sauvegardé en mode démonstration.");
      return;
    }

    await tauri.invoke("create_monitor_profile_command", { input });
    const cycle = await tauri.invoke<{ message: string }>("run_monitoring_cycle_stub_command");
    setStatus(cycle.message);
    await refreshData();
  }

  async function createProduct(input: ProductInput) {
    if (!tauri) {
      const reference = "referenceId" in input
        ? references.find((item) => item.id === input.referenceId) ?? null
        : null;
      setProducts((current) => [...current, {
        id: Math.max(0, ...current.map((product) => product.id)) + 1,
        sku: reference?.code ?? input.sku ?? "",
        title: reference?.name ?? input.title ?? "",
        normalizationStatus: reference ? "normalized" : "free_text",
        reference
      }]);
      setStatus("Produit ajouté en mode démonstration.");
      return;
    }
    await tauri.invoke("create_product_command", { input });
    await refreshData();
    setStatus("Produit créé et configuration rechargée.");
  }

  return (
    <main className="app-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">Poke Radar</p>
          <h1>Votre stratégie</h1>
        </div>
        <p className="status-pill" role="status">{status}</p>
      </header>

      <div className="dashboard-grid">
        <section className="panel panel--form" aria-label="Configuration de la stratégie">
          <ProductConfigurator references={references} onSubmit={createProduct} />
          <StrategyForm
            products={products}
            onSubmit={createProfile}
          />
        </section>

        <section className="panel profiles-panel">
          <div className="section-heading">
            <p className="eyebrow">Suivi</p>
            <h2>Profils sauvegardés</h2>
          </div>
        {profiles.length === 0 ? <p className="empty-state">Aucun profil sauvegardé pour le moment.</p> : null}
        <ul className="profile-list">
          {profiles.map((profile) => (
            <li className="profile-card" key={profile.id}>
              <div className="profile-card__heading">
                <strong>{profile.name}</strong>
                {profile.isActive ? <span className="active-badge">Actif</span> : null}
              </div>
              <dl>
                <div><dt>Marge min.</dt><dd>{profile.minMarginBps} bps</dd></div>
                <div><dt>Produits</dt><dd>{profile.productIds.join(", ")}</dd></div>
              </dl>
            </li>
          ))}
        </ul>
        </section>
      </div>
    </main>
  );
}
