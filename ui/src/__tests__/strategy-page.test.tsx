import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StrategyPage } from "../pages/strategy/StrategyPage";

describe("StrategyPage", () => {
  it("affiche le formulaire stratégie en mode navigateur", async () => {
    render(<StrategyPage />);

    expect(await screen.findByText("Poke Radar - Stratégie")).toBeInTheDocument();
    expect(await screen.findByText("Mode navigateur: données de démonstration affichées.")).toBeInTheDocument();
    expect(await screen.findByRole("button", { name: "Enregistrer le profil" })).toBeInTheDocument();
  });
});
