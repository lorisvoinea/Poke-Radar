import { useEffect, useState } from "react";

export type BootStatus = "loading" | "ready" | "error";

async function runBootSequence(): Promise<void> {
  const tauri = (window as Window & {
    __TAURI_INTERNALS__?: {
      invoke: <T>(command: string, args?: Record<string, unknown>) => Promise<T>;
    };
  }).__TAURI_INTERNALS__;

  if (!tauri) {
    return;
  }

  await tauri.invoke("app_ready");
}

export function BootPage(): JSX.Element {
  const [status, setStatus] = useState<BootStatus>("loading");
  const [message, setMessage] = useState("Initialisation en cours...");

  useEffect(() => {
    void runBootSequence()
      .then(() => {
        setStatus("ready");
        setMessage("Application prête");
      })
      .catch((error: unknown) => {
        setStatus("error");
        setMessage(
          error instanceof Error
            ? error.message
            : "Impossible de terminer l'initialisation. Vérifiez les logs puis redémarrez l'application."
        );
      });
  }, []);

  if (status === "error") {
    return (
      <main>
        <h1>Erreur d&apos;initialisation</h1>
        <p>{message}</p>
      </main>
    );
  }

  return (
    <main>
      <h1>Boot Poke Radar</h1>
      <p>{message}</p>
    </main>
  );
}
