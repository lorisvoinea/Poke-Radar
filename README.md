# Poke Radar — Démarrage rapide local

Ce dépôt contient une application desktop **Tauri v2** avec:
- backend Rust (`src-tauri/`),
- frontend React + TypeScript (`ui/`),
- persistance locale SQLite avec migrations.

## Prérequis

- Rust (toolchain stable)
- Node.js 20+
- npm 10+

## 1) Installer les dépendances frontend

```bash
cd ui
npm install
```

## 2) Lancer les tests UI (smoke)

```bash
npm test
```

## 3) Lancer les tests Rust

Depuis la racine du repo:

```bash
cd src-tauri
cargo test
```

## 4) Démarrer l'application en local (mode dev)

Le message `error: no such command: tauri` signifie que la CLI Tauri n'est pas installée.

### Option A — installer la sous-commande cargo (globale)

```bash
cargo install tauri-cli --locked
cd src-tauri
cargo tauri dev
```

### Option B — utiliser la CLI npm (sans install globale cargo)

```bash
cd ui
npm install -D @tauri-apps/cli
npx tauri dev
```

## Notes utiles

- Au boot, la commande `app_ready` initialise la DB SQLite locale et applique les migrations.
- Le fichier SQLite est stocké dans le dossier applicatif `app_data_dir` de Tauri (pas dans le `current_dir`).
- Si le runtime Tauri est absent (exécution frontend seule), l'écran de boot affiche une erreur explicite.
