import { useEffect, useRef, useState } from "react";
import { StrategyForm } from "../../components/StrategyForm";
import { ProductConfigurator, ProductInput, ProductReference, ReferenceAvailability } from "../../components/ProductConfigurator";

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
  const [referenceAvailability, setReferenceAvailability] = useState<ReferenceAvailability>("loading");
  const [status, setStatus] = useState("Initialisation...");
  const refreshRequestRef = useRef(0);
  const latestRefreshRef = useRef<Promise<boolean> | null>(null);
  const creatingRef = useRef(false);

  const tauri = (window as Window & { __TAURI_INTERNALS__?: TauriInternals }).__TAURI_INTERNALS__;

  async function waitForWinningRefresh(): Promise<void> {
    const latestRefresh = latestRefreshRef.current;
    if (!latestRefresh) {
      throw new Error("Impossible de déterminer l'issue du rafraîchissement actif.");
    }
    await latestRefresh;
  }

  async function performRefresh(requestId: number): Promise<boolean> {
    if (!tauri) {
      setProducts(FALLBACK_PRODUCTS);
      setReferences(FALLBACK_REFERENCES);
      setReferenceAvailability("available");
      setStatus("Mode navigateur: données de démonstration affichées.");
      return true;
    }

    try {
      await tauri.invoke("app_ready");
    } catch (error) {
      if (requestId === refreshRequestRef.current) throw error;
      await waitForWinningRefresh();
      return false;
    }
    if (requestId !== refreshRequestRef.current) {
      await waitForWinningRefresh();
      return false;
    }

    const [productResult, referenceResult, profileResult] = await Promise.allSettled([
      tauri.invoke<Product[]>("list_products_command"),
      tauri.invoke<ProductReference[]>("list_product_references_command"),
      tauri.invoke<Profile[]>("list_monitor_profiles_command")
    ]);
    if (requestId !== refreshRequestRef.current) {
      await waitForWinningRefresh();
      return false;
    }

    if (productResult.status === "rejected" || profileResult.status === "rejected") {
      throw new Error("Impossible de recharger les produits ou les profils.");
    }

    if (referenceResult.status === "fulfilled") {
      setReferences(referenceResult.value);
      setReferenceAvailability(referenceResult.value.length > 0 ? "available" : "empty");
    } else {
      setReferenceAvailability("unavailable");
    }

    if (productResult.status === "fulfilled") {
      setProducts(productResult.value);
    }
    if (profileResult.status === "fulfilled") {
      setProfiles(profileResult.value);
    }

    const partial = [
      productResult.status === "rejected" && "produits",
      profileResult.status === "rejected" && "profils",
      referenceResult.status === "rejected" && "référentiel"
    ].filter(Boolean);

    if (partial.length > 0) {
      setStatus(`Configuration partielle chargée; ${partial.join("/")} indisponible(s).`);
    } else {
      setStatus(referenceResult.status === "rejected"
        ? "Configuration chargée; référentiel indisponible. La saisie libre reste possible."
        : "Configuration rechargée automatiquement.");
    }
    return true;
  }

  function refreshData(): Promise<boolean> {
    const requestId = ++refreshRequestRef.current;
    const refresh = performRefresh(requestId);
    latestRefreshRef.current = refresh;
    return refresh;
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
    const refreshed = await refreshData();
    if (refreshed) setStatus(cycle.message);
  }

  async function createProduct(input: ProductInput) {
    if (creatingRef.current) {
      throw new Error("Une création de produit est déjà en cours.");
    }
    creatingRef.current = true;
    try {
      if (!tauri) {
        if ("referenceId" in input) {
          const reference = references.find((item) => item.id === input.referenceId);
          if (!reference) throw new Error("Référence introuvable. Rechargez la page et réessayez.");
          if (products.some((product) => product.sku === reference.code)) {
            throw new Error("Un produit avec ce code existe déjà.");
          }
          setProducts((current) => [...current, {
            id: Date.now(),
            sku: reference.code,
            title: reference.name,
            normalizationStatus: "normalized",
            reference
          }]);
          setStatus("Produit ajouté en mode démonstration.");
          return;
        }
        const sku = input.sku?.trim() ?? "";
        if (products.some((product) => product.sku === sku)) {
          throw new Error("Un produit avec ce code existe déjà.");
        }
        setProducts((current) => [...current, {
          id: Date.now(),
          sku,
          title: input.title ?? "",
          normalizationStatus: "free_text",
          reference: null
        }]);
        setStatus("Produit ajouté en mode démonstration.");
        return;
      }
      await tauri.invoke("create_product_command", { input });
      try {
        const refreshed = await refreshData();
        if (refreshed) setStatus("Produit créé et configuration rechargée.");
        else setStatus("Produit créé; un rafraîchissement concurrent est en cours.");
      } catch {
        setStatus("Produit créé, mais son rafraîchissement a échoué. Rechargez la configuration pour l'afficher.");
      }
    } finally {
      creatingRef.current = false;
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
          <ProductConfigurator referenceAvailability={referenceAvailability} references={references} existingSkus={products.map((product) => product.sku)} onSubmit={createProduct} />
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
                            {product ? <><span>{product.title} · {product.sku}</span>{product.normalizationStatus === "free_text" ? <span className="normalization-badge" aria-label="Statut : Non normalisé">Non normalisé</span> : null}</> : <span>Produit indisponible (ID {productId})</span>}
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
