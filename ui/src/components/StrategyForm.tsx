import { FormEvent, useMemo, useState } from "react";

type Product = {
  id: number;
  sku: string;
  title: string;
};

type ProfileInput = {
  name: string;
  minMarginBps: number;
  fixedCostCents: number;
  variableFeeBps: number;
  productIds: number[];
  makeActive: boolean;
};

type Props = {
  products: Product[];
  onSubmit: (input: ProfileInput) => Promise<void>;
};

export function StrategyForm({ products, onSubmit }: Props): JSX.Element {
  const [name, setName] = useState("");
  const [minMarginBps, setMinMarginBps] = useState(1500);
  const [fixedCostCents, setFixedCostCents] = useState(0);
  const [variableFeeBps, setVariableFeeBps] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [message, setMessage] = useState<string>("");

  const canSubmit = useMemo(
    () => name.trim().length > 0 && selectedProducts.length > 0,
    [name, selectedProducts]
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) {
      setMessage("Complétez le nom et sélectionnez au moins un produit.");
      return;
    }

    await onSubmit({
      name,
      minMarginBps,
      fixedCostCents,
      variableFeeBps,
      productIds: selectedProducts,
      makeActive: true
    });

    setName("");
    setMessage("Profil enregistré avec succès.");
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Stratégie & paramètres</h2>
      <label>
        Nom du profil
        <input
          aria-label="Nom du profil"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </label>

      <label>
        Marge minimale (bps)
        <input
          aria-label="Marge minimale"
          type="number"
          value={minMarginBps}
          onChange={(event) => setMinMarginBps(Number(event.target.value))}
        />
      </label>

      <label>
        Frais fixes (centimes)
        <input
          aria-label="Frais fixes"
          type="number"
          value={fixedCostCents}
          onChange={(event) => setFixedCostCents(Number(event.target.value))}
        />
      </label>

      <label>
        Frais variables (bps)
        <input
          aria-label="Frais variables"
          type="number"
          value={variableFeeBps}
          onChange={(event) => setVariableFeeBps(Number(event.target.value))}
        />
      </label>

      <fieldset>
        <legend>Produits surveillés</legend>
        {products.map((product) => (
          <label key={product.id}>
            <input
              type="checkbox"
              checked={selectedProducts.includes(product.id)}
              onChange={(event) => {
                setSelectedProducts((current) =>
                  event.target.checked
                    ? [...current, product.id]
                    : current.filter((id) => id !== product.id)
                );
              }}
            />
            {product.sku} - {product.title}
          </label>
        ))}
      </fieldset>

      <button type="submit">Enregistrer le profil</button>
      {message ? <p>{message}</p> : null}
    </form>
  );
}
