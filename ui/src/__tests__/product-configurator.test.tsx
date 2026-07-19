import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ProductConfigurator } from "../components/ProductConfigurator";

const references = [{
  id: "ref-1",
  code: "SV1-001-FR",
  name: "Poussacha",
  setName: "Écarlate et Violet",
  edition: "Première édition",
  language: "fr"
}];

describe("ProductConfigurator", () => {
  afterEach(cleanup);

  it("affiche les métadonnées et soumet une référence", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<ProductConfigurator references={references} onSubmit={onSubmit} />);

    expect(screen.getByLabelText("Métadonnées de la référence")).toHaveTextContent("Écarlate et Violet");
    expect(screen.getByLabelText("Métadonnées de la référence")).toHaveTextContent("Première édition");
    fireEvent.click(screen.getByRole("button", { name: "Ajouter le produit" }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ referenceId: "ref-1" }));
    expect(await screen.findByText("Produit créé et liste actualisée.")).toBeInTheDocument();
  });

  it("permet une saisie libre avec un avertissement accessible", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<ProductConfigurator references={references} onSubmit={onSubmit} />);
    fireEvent.click(screen.getByRole("radio", { name: "Saisie libre" }));

    expect(screen.getByRole("status")).toHaveTextContent("Non normalisé");
    fireEvent.change(screen.getByLabelText("Code libre"), { target: { value: "LIBRE-1" } });
    fireEvent.change(screen.getByLabelText("Nom libre"), { target: { value: "Carte locale" } });
    fireEvent.click(screen.getByRole("button", { name: "Ajouter le produit" }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ sku: "LIBRE-1", title: "Carte locale" }));
  });

  it("affiche une erreur backend actionnable", async () => {
    render(<ProductConfigurator references={references} onSubmit={vi.fn().mockRejectedValue("Référence introuvable")} />);
    fireEvent.click(screen.getByRole("button", { name: "Ajouter le produit" }));
    expect(await screen.findByText("Référence introuvable")).toBeInTheDocument();
  });

  it("ne réinitialise pas un brouillon modifié pendant la création", async () => {
    let resolve!: () => void;
    const onSubmit = vi.fn(() => new Promise<void>((done) => { resolve = done; }));
    render(<ProductConfigurator references={references} onSubmit={onSubmit} />);
    fireEvent.click(screen.getByRole("radio", { name: "Saisie libre" }));
    fireEvent.change(screen.getByLabelText("Code libre"), { target: { value: "A" } });
    fireEvent.change(screen.getByLabelText("Nom libre"), { target: { value: "Initial" } });
    fireEvent.click(screen.getByRole("button", { name: "Ajouter le produit" }));
    fireEvent.change(screen.getByLabelText("Nom libre"), { target: { value: "Modifié" } });
    resolve();

    await waitFor(() => expect(screen.getByRole("button", { name: "Ajouter le produit" })).toBeEnabled());
    expect(screen.getByLabelText("Nom libre")).toHaveValue("Modifié");
    expect(screen.queryByText("Produit créé et liste actualisée.")).not.toBeInTheDocument();
  });
});
