import { useEffect, useState } from "react";

// États d'interface possibles pendant la phase de boot.
export type BootStatus = "loading" | "ready" | "error";

// Type minimal de l'API Tauri exposée au runtime frontend.
type TauriInternals = {
  invoke: <T>(command: string, args?: Record<string, unknown>) => Promise<T>;
};

// Message standardisé pour les cas où l'UI est ouverte hors runtime Tauri.
const TAURI_UNAVAILABLE_MESSAGE =
  "Runtime Tauri indisponible. Lancez l'application via Tauri (et non dans un navigateur seul).";

// Exécute la commande de healthcheck backend et échoue explicitement si Tauri est absent.
async function runBootSequence(): Promise<void> {
  // On lit les internals injectés par Tauri dans la fenêtre globale.
  const tauri = (window as Window & {
    __TAURI_INTERNALS__?: TauriInternals;
  }).__TAURI_INTERNALS__;

  // Cas de garde: si Tauri n'est pas présent, on ne doit PAS marquer l'app comme prête.
  if (!tauri) {
    throw new Error(TAURI_UNAVAILABLE_MESSAGE);
  }

  // Appel IPC de la commande Rust enregistrée côté runtime Tauri.
  await tauri.invoke("app_ready");
}

// Page de boot: orchestre le chargement initial et affiche un état explicite.
export function BootPage(): JSX.Element {
  // État visuel principal du boot.
  const [status, setStatus] = useState<BootStatus>("loading");
  // Message utilisateur associé à l'état courant.
  const [message, setMessage] = useState("Initialisation en cours...");

  // Déclenchement du boot au montage du composant.
  useEffect(() => {
    void runBootSequence()
      .then(() => {
        // Succès nominal: backend prêt et persistance initialisée.
        setStatus("ready");
        setMessage("Application prête");
      })
      .catch((error: unknown) => {
        // Échec: on bloque l'accès normal et on fournit un message actionnable.
        setStatus("error");
        setMessage(
          error instanceof Error
            ? error.message
            : "Impossible de terminer l'initialisation. Vérifiez les logs puis redémarrez l'application."
        );
      });
  }, []);

  // Rendu dédié pour les erreurs critiques de boot.
  if (status === "error") {
    return (
      <main>
        <h1>Erreur d&apos;initialisation</h1>
        <p>{message}</p>
      </main>
    );
  }

  // Rendu nominal (chargement puis prêt).
  return (
    <main>
      <h1>Boot Poke Radar</h1>
      <p>{message}</p>
    </main>
  );
}
