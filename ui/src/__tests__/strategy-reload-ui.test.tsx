/**
 * Story 1.2 AC2 S6 — UI State Consistency After Reload (Component)
 *
 * 🔴 TDD RED PHASE: test.skip() — remove once AC2 UI feedback is implemented
 */
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { StrategyPage } from '../pages/strategy/StrategyPage';

describe('Story 1.2 AC2 — UI State After Reload (Component)', () => {
  afterEach(() => {
    cleanup();
    delete (window as Window & { __TAURI_INTERNALS__?: unknown }).__TAURI_INTERNALS__;
  });

  it('[P2|S6] should show reloaded config status without residual error after mounting with persistence', async () => {
    (window as Window & { __TAURI_INTERNALS__?: unknown }).__TAURI_INTERNALS__ = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      invoke: async (command: string): Promise<any> => {
        if (command === 'app_ready') return undefined;
        if (command === 'list_products_command') {
          return [{ id: 1, sku: 'PS5-DISC', title: 'Console PS5', normalizationStatus: 'free_text', reference: null }];
        }
        if (command === 'list_product_references_command') {
          return [{ id: 'pokemon-sv1-fr-001', code: 'SVI-013-FR', name: 'Poussacha', setName: 'Écarlate et Violet', edition: 'Standard', rarity: 'Commune', language: 'fr' }];
        }
        if (command === 'list_monitor_profiles_command') {
          return [{ id: 10, name: 'Profil Persisté', minMarginBps: 2000, fixedCostCents: 300, variableFeeBps: 600, isActive: true, productIds: [1] }];
        }
        throw new Error(`Unexpected command: ${command}`);
      },
    };

    render(<StrategyPage />);

    expect(await screen.findByText('Profil Persisté')).toBeInTheDocument();

    // AC2 S6: Status must confirm automatic reload, not "Initialisation..."
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('Configuration rechargée automatiquement.');

    // AC2 S6: No residual error message (form hints with role=alert are normal UI, not errors)
    expect(screen.queryByText(/erreur/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/échec/i)).not.toBeInTheDocument();

    // AC2 S6: Profile data should be complete
    expect(screen.getByText('Actif')).toBeInTheDocument();
    expect(screen.getByText('PS5-DISC')).toBeInTheDocument();
  });

  it('[P2|S6] should show demo mode message (not error) when no Tauri bridge is present', async () => {
    render(<StrategyPage />);

    expect(await screen.findByText('Mode navigateur: données de démonstration affichées.')).toBeInTheDocument();
    expect(screen.queryByText(/erreur/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/échec/i)).not.toBeInTheDocument();
  });
});
