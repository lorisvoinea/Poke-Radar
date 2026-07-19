import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type Product = {
  id: number;
  sku: string;
  title: string;
  normalizationStatus?: "normalized" | "free_text";
  reference?: { setName: string; edition: string; language: string; code: string } | null;
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

export function StrategyForm({ products, onSubmit }: Props): JSX.Element {
  const [name, setName] = useState("");
  const [minMarginBps, setMinMarginBps] = useState(1500);
  const [fixedCostCents, setFixedCostCents] = useState(0);
  const [variableFeeBps, setVariableFeeBps] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);
  const editRevisionRef = useRef(0);

  useEffect(() => {
    const existingIds = new Set(products.map((product) => product.id));
    setSelectedProducts((current) => current.filter((id) => existingIds.has(id)));
  }, [products]);

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

  return (
    <form className="strategy-form" onSubmit={handleSubmit}>
      <div className="section-heading">
        <p className="eyebrow">Configuration</p>
        <h2>Stratégie & paramètres</h2>
        <p>Définissez vos seuils et les produits à surveiller.</p>
      </div>

      <div className="form-grid">
      <label className="form-field form-field--wide">
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

      <label className="form-field">
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

      <label className="form-field">
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

      <label className="form-field">
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
      </div>

      <fieldset className="product-picker">
        <legend>Produits surveillés</legend>
        {products.length === 0 ? (
          <p>Aucun produit disponible pour le moment.</p>
        ) : null}
        {products.map((product) => (
          <label className="product-option" key={product.id}>
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
            <span>
              <strong>{product.title}</strong>
              <small>{product.sku}</small>
              {product.normalizationStatus === "free_text" ? <small className="normalization-badge">Non normalisé</small> : null}
              {product.reference ? <small>{product.reference.setName} · {product.reference.edition} · {product.reference.language}</small> : null}
            </span>
          </label>
        ))}
      </fieldset>

      {validationMessage && feedback?.kind !== "success" ? <p className="feedback feedback--hint" role="alert">{validationMessage}</p> : null}

      <button className="button button--primary" type="submit" disabled={!canSubmit || isSubmitting}>
        {isSubmitting ? "Enregistrement en cours..." : "Enregistrer le profil"}
      </button>
      {feedback ? (
        <p className={`feedback feedback--${feedback.kind}`} role={feedback.kind === "error" ? "alert" : "status"}>{feedback.text}</p>
      ) : null}
    </form>
  );
}
