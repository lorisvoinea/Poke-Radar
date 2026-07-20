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
  { id: "pokemon-sv1-fr-001", code: "SVI-013-FR", name: "Poussacha", setName: "Écarlate et Violet", edition: "Standard", rarity: "Commune", language: "fr" }
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
    const [productResult, referenceResult, profileResult] = await Promise.allSettled([
      tauri.invoke<Product[]>("list_products_command"),
      tauri.invoke<ProductReference[]>("list_product_references_command"),
      tauri.invoke<Profile[]>("list_monitor_profiles_command")
    ]);
    if (productResult.status === "fulfilled") setProducts(productResult.value);
    if (referenceResult.status === "fulfilled") setReferences(referenceResult.value);
    else setReferences([]);
    if (profileResult.status === "fulfilled") setProfiles(profileResult.value);

    if (productResult.status === "rejected" || profileResult.status === "rejected") {
      throw new Error("Impossible de recharger les produits ou les profils.");
    }
    setStatus(referenceResult.status === "rejected"
      ? "Configuration chargée; référentiel indisponible. La saisie libre reste possible."
      : "Configuration rechargée automatiquement.");
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
      const sku = reference?.code ?? input.sku?.trim() ?? "";
      if (products.some((product) => product.sku === sku)) {
        throw new Error("Un produit avec ce code existe déjà.");
      }
      setProducts((current) => [...current, {
        id: Math.max(0, ...current.map((product) => product.id)) + 1,
        sku,
        title: reference?.name ?? input.title ?? "",
        normalizationStatus: reference ? "normalized" : "free_text",
        reference
      }]);
      setStatus("Produit ajouté en mode démonstration.");
      return;
    }
    await tauri.invoke("create_product_command", { input });
    try {
      await refreshData();
      setStatus("Produit créé et configuration rechargée.");
    } catch {
      throw new Error("Produit créé, mais son rafraîchissement a échoué. Rechargez la configuration pour l'afficher.");
    }
  }

  const productsById = new Map(products.map((product) => [product.id, product]));

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
          <ProductConfigurator references={references} existingSkus={products.map((product) => product.sku)} onSubmit={createProduct} />
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
                <div>
                  <dt>Produits</dt>
                  <dd>
                    <ul className="profile-product-list">
                      {profile.productIds.map((productId) => {
                        const product = productsById.get(productId);
                        return (
                          <li key={productId}>
                            {product ? <><span>{product.title} · {product.sku}</span>{product.normalizationStatus === "free_text" ? <span className="normalization-badge">Non normalisé</span> : null}</> : <span>Produit indisponible (ID {productId})</span>}
                          </li>
                        );
                      })}
                    </ul>
                  </dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
        </section>
      </div>
    </main>
  );
}
