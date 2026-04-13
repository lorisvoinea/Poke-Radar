import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { StrategyForm } from "../components/StrategyForm";

describe("StrategyForm", () => {
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
});
