import { FormEvent, useRef, useState } from "react";

export type ProductReference = {
  id: string;
  code: string;
  name: string;
  setName: string;
  edition: string;
  language: string;
};

export type ProductInput =
  | { referenceId: string; sku?: never; title?: never }
  | { referenceId?: never; sku: string; title: string };

type Props = {
  references: ProductReference[];
  onSubmit: (input: ProductInput) => Promise<void>;
};

function errorMessage(error: unknown): string {
  if (typeof error === "string" && error.trim()) return error;
  if (error instanceof Error && error.message.trim()) return error.message;
  return "Impossible de créer le produit. Réessayez.";
}

export function ProductConfigurator({ references, onSubmit }: Props): JSX.Element {
  const [mode, setMode] = useState<"reference" | "free_text">("reference");
  const [referenceId, setReferenceId] = useState(references[0]?.id ?? "");
  const [sku, setSku] = useState("");
  const [title, setTitle] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const revisionRef = useRef(0);

  function edited() {
    revisionRef.current += 1;
    setFeedback(null);
  }

  const selected = references.find((item) => item.id === referenceId);
  const valid = mode === "reference" ? Boolean(selected) : Boolean(sku.trim() && title.trim());

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!valid || submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    setFeedback(null);
    const revision = revisionRef.current;
    try {
      await onSubmit(
        mode === "reference" ? { referenceId } : { sku: sku.trim(), title: title.trim() }
      );
      if (revisionRef.current === revision) {
        if (mode === "free_text") {
          setSku("");
          setTitle("");
        }
        setFeedback("Produit créé et liste actualisée.");
      }
    } catch (error) {
      if (revisionRef.current === revision) setFeedback(errorMessage(error));
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  return (
    <form className="product-configurator" onSubmit={submit}>
      <div className="section-heading">
        <p className="eyebrow">Produits</p>
        <h2>Ajouter un produit suivi</h2>
        <p>Choisissez une référence vérifiée ou utilisez la saisie libre.</p>
      </div>

      <fieldset className="mode-picker">
        <legend>Mode de création</legend>
        <label><input type="radio" name="product-mode" checked={mode === "reference"} onChange={() => { edited(); setMode("reference"); }} /> Référentiel</label>
        <label><input type="radio" name="product-mode" checked={mode === "free_text"} onChange={() => { edited(); setMode("free_text"); }} /> Saisie libre</label>
      </fieldset>

      {mode === "reference" ? (
        <>
          <label className="form-field">
            Référence Pokémon
            <select value={referenceId} onChange={(event) => { edited(); setReferenceId(event.target.value); }}>
              <option value="">Sélectionnez une référence</option>
              {references.map((item) => <option key={item.id} value={item.id}>{item.name} — {item.code}</option>)}
            </select>
          </label>
          {selected ? (
            <dl className="reference-preview" aria-label="Métadonnées de la référence">
              <div><dt>Nom</dt><dd>{selected.name}</dd></div>
              <div><dt>Set</dt><dd>{selected.setName}</dd></div>
              <div><dt>Édition</dt><dd>{selected.edition}</dd></div>
              <div><dt>Langue</dt><dd>{selected.language}</dd></div>
              <div><dt>Code</dt><dd>{selected.code}</dd></div>
            </dl>
          ) : null}
        </>
      ) : (
        <div className="form-grid">
          <p className="normalization-warning form-field--wide" role="status"><strong>Non normalisé</strong> — ce produit ne sera pas relié au référentiel.</p>
          <label className="form-field">Code libre<input aria-label="Code libre" value={sku} onChange={(event) => { edited(); setSku(event.target.value); }} /></label>
          <label className="form-field">Nom libre<input aria-label="Nom libre" value={title} onChange={(event) => { edited(); setTitle(event.target.value); }} /></label>
        </div>
      )}

      <button className="button button--secondary" type="submit" disabled={!valid || submitting}>
        {submitting ? "Création en cours..." : "Ajouter le produit"}
      </button>
      {feedback ? <p className="feedback" role="status">{feedback}</p> : null}
    </form>
  );
}
