import { expect, test } from "@playwright/test";

test("keeps the strategy flow usable without horizontal overflow at 320 px", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Votre stratégie" })).toBeVisible();
  await expect(page.getByText("Mode navigateur: données de démonstration affichées.")).toBeVisible();

  const layout = await page.evaluate(() => ({
    bodyClientWidth: document.body.clientWidth,
    bodyScrollWidth: document.body.scrollWidth,
    documentClientWidth: document.documentElement.clientWidth,
    documentScrollWidth: document.documentElement.scrollWidth,
  }));
  expect(layout.documentClientWidth).toBe(320);
  expect(layout.documentScrollWidth).toBeLessThanOrEqual(layout.documentClientWidth);
  expect(layout.bodyScrollWidth).toBeLessThanOrEqual(layout.bodyClientWidth);

  const referenceMode = page.getByRole("radio", { name: "Référentiel" });
  const freeTextMode = page.getByRole("radio", { name: "Saisie libre" });
  const selector = page.getByRole("combobox", { name: "Référence Pokémon" });
  const submit = page.getByRole("button", { name: "Ajouter le produit" });

  await page.keyboard.press("Tab");
  await expect(referenceMode).toBeFocused();

  await page.keyboard.press("ArrowRight");
  await expect(freeTextMode).toBeChecked();
  await expect(freeTextMode).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("textbox", { name: "Code libre" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("textbox", { name: "Nom libre" })).toBeFocused();

  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Shift+Tab");
  await expect(freeTextMode).toBeFocused();
  await page.keyboard.press("ArrowLeft");
  await expect(referenceMode).toBeChecked();
  await page.keyboard.press("Tab");
  await expect(selector).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(submit).toBeFocused();

  const modeTarget = referenceMode.locator("xpath=ancestor::label");
  const modeBox = await modeTarget.boundingBox();
  const submitBox = await submit.boundingBox();
  expect(modeBox?.height).toBeGreaterThanOrEqual(44);
  expect(submitBox?.height).toBeGreaterThanOrEqual(44);
});
