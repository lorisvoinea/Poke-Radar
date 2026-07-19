import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { StrategyForm } from "../components/StrategyForm";

describe("StrategyForm", () => {
  const products = [{ id: 7, sku: "PKM-007", title: "Carapuce" }];

  afterEach(cleanup);

  it("propose de créer des produits de démarrage quand la liste est vide", async () => {
    const onCreateStarterProducts = vi.fn().mockResolvedValue(undefined);
    render(
      <StrategyForm
        products={[]}
        onSubmit={vi.fn().mockResolvedValue(undefined)}
        onCreateStarterProducts={onCreateStarterProducts}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Créer des produits de démarrage" }));
    expect(onCreateStarterProducts).toHaveBeenCalledTimes(1);
    expect(
      await screen.findByText("Produits de démarrage créés. Sélectionnez-les puis enregistrez votre profil.")
    ).toBeInTheDocument();
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
});
