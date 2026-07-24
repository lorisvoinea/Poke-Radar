import { test, expect } from '@playwright/test';

/**
 * Story 1.2 AC2: Persisted profiles reload automatically on restart and reuse without re-entry.
 *
 * These tests validate the end-to-end user journey:
 *  - Profile created → app restarted → profile loaded automatically in UI
 *  - Active profile reused in monitoring cycle without re-configuration
 *  - Deterministic behavior when multiple profiles exist
 *
 * 🔴 TDD RED PHASE: All tests use test.skip() — remove once AC2 implementation is complete.
 */

test.describe('Story 1.2 AC2 — Profile Persistence Across Restart (ATDD)', () => {
  test('[P0|S1] should reload existing profile automatically after restart', async ({ page }) => {
    // Inject Tauri bridge mock simulating a previously-saved profile
    await page.addInitScript(() => {
      (window as Window & { __TAURI_INTERNALS__?: unknown }).__TAURI_INTERNALS__ = {
        invoke: async <T>(command: string): Promise<T> => {
          if (command === 'app_ready') return undefined as T;
          if (command === 'list_products_command') {
            return [
              {
                id: 1,
                sku: 'PS5-DISC',
                title: 'Console PS5',
                normalizationStatus: 'free_text',
                reference: null,
              },
            ] as T;
          }
          if (command === 'list_product_references_command') {
            return [
              {
                id: 'pokemon-sv1-fr-001',
                code: 'SVI-013-FR',
                name: 'Poussacha',
                setName: 'Écarlate et Violet',
                edition: 'Standard',
                rarity: 'Commune',
                language: 'fr',
              },
            ] as T;
          }
          if (command === 'list_monitor_profiles_command') {
            return [
              {
                id: 10,
                name: 'Surveillance Pikachu',
                minMarginBps: 2000,
                fixedCostCents: 300,
                variableFeeBps: 600,
                isActive: true,
                productIds: [1],
              },
            ] as T;
          }
          throw new Error(`Unexpected Tauri command: ${command}`);
        },
      };
    });

    const responsePromise = page.waitForResponse(
      (resp) => resp.url().includes('/') && resp.status() === 200
    );
    await page.goto('/');
    await responsePromise;

    // AC2: Profile loaded automatically without manual re-entry
    await expect(page.getByRole('heading', { name: 'Profils sauvegardés' })).toBeVisible();

    // Expect the previously-saved profile to be visible
    const profileCard = page.getByText('Surveillance Pikachu').locator('..');
    await expect(profileCard.getByText('Actif')).toBeVisible();

    // Expect the product associated with the profile to be listed
    await expect(page.getByText('Console PS5 · PS5-DISC')).toBeVisible();

    // AC2: No re-entry required — status confirms automatic reload
    await expect(page.getByText('Configuration rechargée automatiquement.')).toBeVisible();

    // The profile name input is for creating NEW profiles, not editing existing ones
    await expect(page.getByRole('textbox', { name: 'Nom du profil' })).toHaveValue('');
  });

  test('[P0|S2] should reuse active profile in monitoring cycle without re-configuration', async ({ page }) => {
    await page.addInitScript(() => {
      const savedProfiles: unknown[] = [
        { id: 10, name: 'Profil Stratégique', minMarginBps: 2500, fixedCostCents: 200, variableFeeBps: 800, isActive: true, productIds: [1] }
      ];
      (window as Window & { __TAURI_INTERNALS__?: unknown }).__TAURI_INTERNALS__ = {
        invoke: async <T>(command: string, args?: Record<string, unknown>): Promise<T> => {
          if (command === 'app_ready') return undefined as T;
          if (command === 'list_products_command') return [{ id: 1, sku: 'PS5-DISC', title: 'Console PS5', normalizationStatus: 'free_text', reference: null }] as T;
          if (command === 'list_product_references_command') return [{ id: 'pokemon-sv1-fr-001', code: 'SVI-013-FR', name: 'Poussacha', setName: 'Écarlate et Violet', edition: 'Standard', rarity: 'Commune', language: 'fr' }] as T;
          if (command === 'list_monitor_profiles_command') return savedProfiles as T;
          if (command === 'create_monitor_profile_command') {
            const input = args?.input as { name?: string; minMarginBps?: number; fixedCostCents?: number; variableFeeBps?: number; productIds?: number[] };
            const profile = { id: 20, ...input, isActive: true };
            savedProfiles.push(profile);
            return profile as T;
          }
          if (command === 'run_monitoring_cycle_stub_command') return { message: 'Cycle de monitoring exécuté avec le profil actif.' } as T;
          throw new Error(`Unexpected command: ${command}`);
        },
      };
    });

    await page.goto('/');

    // Step 1: Verify profile loaded automatically
    await expect(page.getByRole('heading', { name: 'Profils sauvegardés' })).toBeVisible();
    await expect(page.getByText('Profil Stratégique')).toBeVisible();
    await expect(page.getByText('Configuration rechargée automatiquement.')).toBeVisible();

    // Step 2: Create a new profile to trigger monitoring cycle
    await page.getByRole('checkbox', { name: /Console PS5/ }).check();
    await page.getByRole('textbox', { name: 'Nom du profil' }).fill('Nouveau Profil');

    await page.getByRole('button', { name: 'Enregistrer le profil' }).click();
    // Wait for status pill to update (mocked Tauri — no real HTTP)
    await expect(page.locator('.status-pill')).toContainText('Cycle de monitoring');

    // Step 3: Verify monitoring cycle status confirms reuse
    await expect(page.getByText('Cycle de monitoring exécuté avec le profil actif.')).toBeVisible();

    // Step 4: Verify profile persisted + reused
    await expect(page.getByText('Nouveau Profil')).toBeVisible();
    // Both profiles share PS5 — count confirms persistence
    await expect(page.getByText('Console PS5 · PS5-DISC')).toHaveCount(2);
  });

  test('[P1|S3] should use only the active profile by default when multiple profiles exist', async ({ page }) => {
    await page.addInitScript(() => {
      (window as Window & { __TAURI_INTERNALS__?: unknown }).__TAURI_INTERNALS__ = {
        invoke: async <T>(command: string): Promise<T> => {
          if (command === 'app_ready') return undefined as T;
          if (command === 'list_products_command') {
            return [
              { id: 1, sku: 'PS5-DISC', title: 'Console PS5', normalizationStatus: 'free_text', reference: null },
              { id: 2, sku: 'NSW-OLED', title: 'Nintendo Switch OLED', normalizationStatus: 'free_text', reference: null },
            ] as T;
          }
          if (command === 'list_product_references_command') {
            return [{ id: 'pokemon-sv1-fr-001', code: 'SVI-013-FR', name: 'Poussacha', setName: 'Écarlate et Violet', edition: 'Standard', rarity: 'Commune', language: 'fr' }] as T;
          }
          if (command === 'list_monitor_profiles_command') {
            return [
              { id: 1, name: 'Profil Inactif', minMarginBps: 1500, fixedCostCents: 100, variableFeeBps: 500, isActive: false, productIds: [1] },
              { id: 2, name: 'Profil Actif Principal', minMarginBps: 3000, fixedCostCents: 400, variableFeeBps: 900, isActive: true, productIds: [2] },
              { id: 3, name: 'Ancien Profil', minMarginBps: 1000, fixedCostCents: 50, variableFeeBps: 300, isActive: false, productIds: [1] },
            ] as T;
          }
          throw new Error(`Unexpected command: ${command}`);
        },
      };
    });

    await page.goto('/');

    // All three profiles visible in saved list
    await expect(page.getByText('Profil Inactif')).toBeVisible();
    await expect(page.getByText('Profil Actif Principal')).toBeVisible();
    await expect(page.getByText('Ancien Profil')).toBeVisible();

    // Only one "Actif" badge
    const activeBadges = page.locator('.active-badge');
    await expect(activeBadges).toHaveCount(1);

    // Active badge is on the correct profile
    const activeCard = page.getByText('Profil Actif Principal').locator('..');
    await expect(activeCard.getByText('Actif', { exact: true })).toBeVisible();

    // Inactive profiles do NOT have the active badge
    const inactiveCard = page.getByText('Profil Inactif').locator('..');
    await expect(inactiveCard.getByText('Actif', { exact: true })).not.toBeAttached();

    // AC2: Status confirms automatic reload
    await expect(page.getByText('Configuration rechargée automatiquement.')).toBeVisible();
  });
});
