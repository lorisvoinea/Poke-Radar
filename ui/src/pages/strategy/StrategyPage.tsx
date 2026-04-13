import { useEffect, useState } from "react";
import { StrategyForm } from "../../components/StrategyForm";

type TauriInternals = {
  invoke: <T>(command: string, args?: Record<string, unknown>) => Promise<T>;
};

type Product = {
  id: number;
  sku: string;
  title: string;
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
  { id: 1, sku: "PS5-DISC", title: "Console PS5" },
  { id: 2, sku: "NSW-OLED", title: "Nintendo Switch OLED" }
];

export function StrategyPage(): JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [status, setStatus] = useState("Initialisation...");

  const tauri = (window as Window & { __TAURI_INTERNALS__?: TauriInternals }).__TAURI_INTERNALS__;

  async function refreshData() {
    if (!tauri) {
      setProducts(FALLBACK_PRODUCTS);
      setStatus("Mode navigateur: données de démonstration affichées.");
      return;
    }

    await tauri.invoke("app_ready");
    const loadedProducts = await tauri.invoke<Product[]>("list_products_command");
    const loadedProfiles = await tauri.invoke<Profile[]>("list_monitor_profiles_command");
    setProducts(loadedProducts);
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

  return (
    <main>
      <h1>Poke Radar - Stratégie</h1>
      <p>{status}</p>
      <StrategyForm products={products} onSubmit={createProfile} />

      <section>
        <h2>Profils sauvegardés</h2>
        <ul>
          {profiles.map((profile) => (
            <li key={profile.id}>
              {profile.name} — Marge min: {profile.minMarginBps} bps — Produits: {profile.productIds.join(", ")}
              {profile.isActive ? " (actif)" : ""}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
