import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { StrategyPage } from "../pages/strategy/StrategyPage";

describe("StrategyPage", () => {
  afterEach(cleanup);

  it("affiche le formulaire stratégie en mode navigateur", async () => {
    render(<StrategyPage />);

    expect(await screen.findByRole("heading", { name: "Votre stratégie" })).toBeInTheDocument();
    expect(await screen.findByText("Mode navigateur: données de démonstration affichées.")).toBeInTheDocument();
    expect(await screen.findByRole("button", { name: "Enregistrer le profil" })).toBeInTheDocument();
  });

  it("expose une structure responsive sans tableau ni largeur fixe", async () => {
    const { container } = render(<StrategyPage />);

    expect(await screen.findByRole("main")).toHaveClass("app-shell");
    expect(container.querySelector(".dashboard-grid")).toBeInTheDocument();
    expect(container.querySelector("table")).not.toBeInTheDocument();
  });
});
