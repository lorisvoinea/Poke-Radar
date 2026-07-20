import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { StrategyForm } from "../components/StrategyForm";

describe("StrategyForm", () => {
  const products = [{ id: 7, sku: "PKM-007", title: "Carapuce" }];

  afterEach(cleanup);

  it("signale explicitement les produits historiques non normalisés", () => {
    render(<StrategyForm products={[{ ...products[0], normalizationStatus: "free_text" }]} onSubmit={vi.fn()} />);
    expect(screen.getByText("Non normalisé")).toBeInTheDocument();
  });

  it("rend la validation du nom et du produit accessible avant soumission", () => {
    render(<StrategyForm products={products} onSubmit={vi.fn().mockResolvedValue(undefined)} />);

    expect(screen.getByRole("button", { name: "Enregistrer le profil" })).toBeDisabled();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Complétez le nom et sélectionnez au moins un produit."
    );
  });

  it("garde le produit obligatoire même quand le nom est renseigné", () => {
    render(<StrategyForm products={products} onSubmit={vi.fn().mockResolvedValue(undefined)} />);

    fireEvent.change(screen.getByLabelText("Nom du profil"), { target: { value: "Profil cartes" } });

    expect(screen.getByRole("button", { name: "Enregistrer le profil" })).toBeDisabled();
    expect(screen.getByRole("alert")).toHaveTextContent("Sélectionnez au moins un produit.");
  });

  it("affiche le message actionnable renvoyé par le backend", async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error("La marge minimale doit être inférieure à 10000 bps."));
    render(<StrategyForm products={products} onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText("Nom du profil"), { target: { value: "Profil cartes" } });
    fireEvent.click(screen.getByRole("checkbox", { name: /PKM-007/ }));
    fireEvent.click(screen.getByRole("button", { name: "Enregistrer le profil" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "La marge minimale doit être inférieure à 10000 bps."
    );
  });

  it("affiche le succès et empêche une double soumission concurrente", async () => {
    let resolveSubmission!: () => void;
    const onSubmit = vi.fn(
      () => new Promise<void>((resolve) => {
        resolveSubmission = resolve;
      })
    );
    render(<StrategyForm products={products} onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText("Nom du profil"), { target: { value: "Profil cartes" } });
    fireEvent.click(screen.getByRole("checkbox", { name: /PKM-007/ }));
    const form = screen.getByLabelText("Nom du profil").closest("form");
    expect(form).not.toBeNull();
    fireEvent.submit(form!);
    fireEvent.submit(form!);

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "Enregistrement en cours..." })).toBeDisabled();

    resolveSubmission();
    await waitFor(() => expect(screen.getByText("Profil enregistré avec succès.")).toBeInTheDocument());
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("conserve les saisies modifiées sans leur attribuer le succès de l'ancienne sauvegarde", async () => {
    let resolveSubmission!: () => void;
    const onSubmit = vi.fn(
      () => new Promise<void>((resolve) => {
        resolveSubmission = resolve;
      })
    );
    render(<StrategyForm products={products} onSubmit={onSubmit} />);

    const nameInput = screen.getByLabelText("Nom du profil");
    fireEvent.change(nameInput, { target: { value: "Profil initial" } });
    fireEvent.click(screen.getByRole("checkbox", { name: /PKM-007/ }));
    fireEvent.click(screen.getByRole("button", { name: "Enregistrer le profil" }));

    fireEvent.change(nameInput, { target: { value: "Profil modifié pendant la sauvegarde" } });
    resolveSubmission();

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Enregistrer le profil" })).toBeEnabled()
    );
    expect(screen.queryByText("Profil enregistré avec succès.")).not.toBeInTheDocument();
    expect(nameInput).toHaveValue("Profil modifié pendant la sauvegarde");
    expect(screen.getByRole("checkbox", { name: /PKM-007/ })).toBeChecked();
  });

  it("n'affiche pas l'erreur d'une ancienne sauvegarde après modification du brouillon", async () => {
    let rejectSubmission!: (error: Error) => void;
    const onSubmit = vi.fn(
      () => new Promise<void>((_resolve, reject) => {
        rejectSubmission = reject;
      })
    );
    render(<StrategyForm products={products} onSubmit={onSubmit} />);

    const nameInput = screen.getByLabelText("Nom du profil");
    fireEvent.change(nameInput, { target: { value: "Profil initial" } });
    fireEvent.click(screen.getByRole("checkbox", { name: /PKM-007/ }));
    fireEvent.click(screen.getByRole("button", { name: "Enregistrer le profil" }));

    fireEvent.change(nameInput, { target: { value: "Brouillon corrigé" } });
    rejectSubmission(new Error("Erreur liée à l'ancien brouillon"));

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Enregistrer le profil" })).toBeEnabled()
    );
    expect(screen.queryByText("Erreur liée à l'ancien brouillon")).not.toBeInTheDocument();
    expect(nameInput).toHaveValue("Brouillon corrigé");
  });

  it("écarte une sélection qui disparaît lors du rafraîchissement", async () => {
    const { rerender } = render(<StrategyForm products={products} onSubmit={vi.fn()} />);
    fireEvent.change(screen.getByLabelText("Nom du profil"), { target: { value: "Profil" } });
    fireEvent.click(screen.getByRole("checkbox", { name: /PKM-007/ }));
    expect(screen.getByRole("button", { name: "Enregistrer le profil" })).toBeEnabled();

    rerender(<StrategyForm products={[]} onSubmit={vi.fn()} />);
    await waitFor(() => expect(screen.getByRole("button", { name: "Enregistrer le profil" })).toBeDisabled());
  });

  it("traite l'élagage d'une sélection comme une modification du brouillon en cours", async () => {
    let resolveSubmission!: () => void;
    const onSubmit = vi.fn(
      () => new Promise<void>((resolve) => {
        resolveSubmission = resolve;
      })
    );
    const { rerender } = render(<StrategyForm products={products} onSubmit={onSubmit} />);

    const nameInput = screen.getByLabelText("Nom du profil");
    fireEvent.change(nameInput, { target: { value: "Profil à conserver" } });
    fireEvent.click(screen.getByRole("checkbox", { name: /PKM-007/ }));
    fireEvent.click(screen.getByRole("button", { name: "Enregistrer le profil" }));

    rerender(<StrategyForm products={[]} onSubmit={onSubmit} />);
    await waitFor(() => expect(screen.queryByRole("checkbox", { name: /PKM-007/ })).not.toBeInTheDocument());
    resolveSubmission();

    await waitFor(() => expect(screen.getByRole("button", { name: "Enregistrer le profil" })).toBeDisabled());
    expect(nameInput).toHaveValue("Profil à conserver");
    expect(screen.queryByText("Profil enregistré avec succès.")).not.toBeInTheDocument();
  });
});
