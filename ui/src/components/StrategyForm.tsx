import { FormEvent, useMemo, useRef, useState } from "react";

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
  onCreateStarterProducts?: () => Promise<void>;
};

type Feedback = {
  kind: "error" | "success";
  text: string;
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  if (typeof error === "string" && error.trim().length > 0) {
    return error;
  }

  return "Échec de la sauvegarde du profil. Réessayez dans quelques instants.";
}

export function StrategyForm({ products, onSubmit, onCreateStarterProducts }: Props): JSX.Element {
  const [name, setName] = useState("");
  const [minMarginBps, setMinMarginBps] = useState(1500);
  const [fixedCostCents, setFixedCostCents] = useState(0);
  const [variableFeeBps, setVariableFeeBps] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatingProducts, setIsCreatingProducts] = useState(false);
  const isSubmittingRef = useRef(false);
  const editRevisionRef = useRef(0);

  function markEdited() {
    editRevisionRef.current += 1;
    setFeedback(null);
  }

  const canSubmit = useMemo(
    () => name.trim().length > 0 && selectedProducts.length > 0,
    [name, selectedProducts]
  );

  const validationMessage = useMemo(() => {
    if (name.trim().length === 0 && selectedProducts.length === 0) {
      return "Complétez le nom et sélectionnez au moins un produit.";
    }
    if (name.trim().length === 0) {
      return "Complétez le nom du profil.";
    }
    if (selectedProducts.length === 0) {
      return "Sélectionnez au moins un produit.";
    }
    return "";
  }, [name, selectedProducts]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit || isSubmittingRef.current) {
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setFeedback(null);
    const submittedRevision = editRevisionRef.current;

    try {
      await onSubmit({
        name,
        minMarginBps,
        fixedCostCents,
        variableFeeBps,
        productIds: selectedProducts,
        makeActive: true
      });

      if (editRevisionRef.current === submittedRevision) {
        setName("");
        setSelectedProducts([]);
        setFeedback({ kind: "success", text: "Profil enregistré avec succès." });
      }
    } catch (error: unknown) {
      if (editRevisionRef.current === submittedRevision) {
        setFeedback({ kind: "error", text: getErrorMessage(error) });
      }
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  }

  async function handleCreateStarterProducts() {
    if (!onCreateStarterProducts) {
      return;
    }

    setIsCreatingProducts(true);
    setFeedback(null);

    try {
      await onCreateStarterProducts();
      setFeedback({
        kind: "success",
        text: "Produits de démarrage créés. Sélectionnez-les puis enregistrez votre profil."
      });
    } catch {
      setFeedback({ kind: "error", text: "Impossible de créer les produits de démarrage pour le moment." });
    } finally {
      setIsCreatingProducts(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Stratégie & paramètres</h2>
      <label>
        Nom du profil
        <input
          aria-label="Nom du profil"
          value={name}
          onChange={(event) => {
            markEdited();
            setName(event.target.value);
          }}
        />
      </label>

      <label>
        Marge minimale (bps)
        <input
          aria-label="Marge minimale"
          type="number"
          value={minMarginBps}
          onChange={(event) => {
            markEdited();
            setMinMarginBps(Number(event.target.value));
          }}
        />
      </label>

      <label>
        Frais fixes (centimes)
        <input
          aria-label="Frais fixes"
          type="number"
          value={fixedCostCents}
          onChange={(event) => {
            markEdited();
            setFixedCostCents(Number(event.target.value));
          }}
        />
      </label>

      <label>
        Frais variables (bps)
        <input
          aria-label="Frais variables"
          type="number"
          value={variableFeeBps}
          onChange={(event) => {
            markEdited();
            setVariableFeeBps(Number(event.target.value));
          }}
        />
      </label>

      <fieldset>
        <legend>Produits surveillés</legend>
        {products.length === 0 ? (
          <p>Aucun produit disponible pour le moment.</p>
        ) : null}
        {products.map((product) => (
          <label key={product.id}>
            <input
              type="checkbox"
              checked={selectedProducts.includes(product.id)}
              onChange={(event) => {
                markEdited();
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

      {products.length === 0 && onCreateStarterProducts ? (
        <button type="button" onClick={() => void handleCreateStarterProducts()} disabled={isCreatingProducts}>
          {isCreatingProducts ? "Création en cours..." : "Créer des produits de démarrage"}
        </button>
      ) : null}

      {validationMessage && feedback?.kind !== "success" ? <p role="alert">{validationMessage}</p> : null}

      <button type="submit" disabled={!canSubmit || isSubmitting}>
        {isSubmitting ? "Enregistrement en cours..." : "Enregistrer le profil"}
      </button>
      {feedback ? (
        <p role={feedback.kind === "error" ? "alert" : "status"}>{feedback.text}</p>
      ) : null}
    </form>
  );
}
