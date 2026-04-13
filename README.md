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

✅ **Commande recommandée (et unique) pour ce repo**

```bash
cd ui
npm install
npm run tauri:dev
```

Ce script lance `cargo tauri dev` depuis la racine et déclenche le build frontend (`npm --prefix ./ui run build`) via `src-tauri/tauri.conf.json`.

⚠️ Évite de lancer `cargo tauri dev` directement depuis `src-tauri/` sur cette base tant que le flux n'a pas été unifié côté tooling.

## Notes utiles

- Au boot, la commande `app_ready` initialise la DB SQLite locale et applique les migrations.
- Le fichier SQLite est stocké dans le dossier applicatif `app_data_dir` de Tauri (pas dans le `current_dir`).
- Si le runtime Tauri est absent (exécution frontend seule), l'écran de boot affiche une erreur explicite.
- En mode dev, Tauri charge `ui-dist/index.html` généré par Vite depuis `ui/src` (bundle React réel).
- Sous Windows, `tauri-build` requiert `src-tauri/icons/icon.ico` pour générer la ressource applicative.
