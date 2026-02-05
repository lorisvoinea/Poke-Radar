---
stepsCompleted: [1, 2, 3, 4]
stepsCompleted: [1, 2, 3, 4, 5]
stepsCompleted: [1, 2, 3, 4, 5, 6]
inputDocuments: []
workflowType: 'research'
lastStep: 1
research_type: 'technical'
research_topic: 'Poke-Radar'
research_goals: 'Valider la stack Modern & Hype (Tauri/Rust/React), comparer headless_chrome vs fantoccini pour le scraping, et définir l architecture SQLite locale.'
user_name: 'User'
date: '2024-05-21'
web_research_enabled: true
source_verification: true
---

# Research Report: technical

**Date:** 2024-05-21
**Author:** User
**Research Type:** technical

---

## Research Overview

[Research overview and methodology will be appended here]

---

## Technical Research Scope Confirmation

**Research Topic:** Poke-Radar
**Research Goals:** Valider la stack Modern & Hype (Tauri/Rust/React), comparer headless_chrome vs fantoccini pour le scraping, et définir l architecture SQLite locale.

**Technical Research Scope:**

- Architecture Analysis - design patterns, frameworks, system architecture
- Implementation Approaches - development methodologies, coding patterns
- Technology Stack - languages, frameworks, tools, platforms
- Integration Patterns - APIs, protocols, interoperability
- Performance Considerations - scalability, optimization, patterns

**Research Methodology:**

- Current web data with rigorous source verification
- Multi-source validation for critical technical claims
- Confidence level framework for uncertain information
- Comprehensive technical coverage with architecture-specific insights

**Scope Confirmed:** 2024-05-21

## Technology Stack Analysis

### Programming Languages

**Rust (Backend/Core)**
Rust est le choix central pour le cœur logique de "Poke-Radar".
*   **Performance & Sécurité** : Gestion de la mémoire sans garbage collector, idéale pour les tâches de fond (scraping) et la réactivité de l'application.
*   **Adoption** : En forte croissance, particulièrement pour l'outillage système et les applications desktop modernes via Tauri.
*   **Pertinence** : Remplace avantageusement Java pour ce cas d'usage (moins de consommation RAM, binaire unique).

**TypeScript (Frontend)**
Utilisé conjointement avec React pour l'interface utilisateur.
*   **Typage Fort** : Assure une cohérence avec la rigueur de Rust, facilitant la maintenance.
*   **Écosystème** : Standard actuel pour le développement d'interfaces riches.

### Development Frameworks and Libraries

**Tauri v2 (Architecture App)**
*   **Positionnement** : Alternative légère à Electron. Utilise le WebView natif de l'OS (WebView2 sur Windows, WebKit sur macOS/Linux).
*   **Avantages** : Binaires minuscules (<10MB vs >100MB pour Electron), sécurité renforcée par conception (isolation du contexte).
*   **Tauri v2** : Apporte des améliorations sur le système de plugins, le support mobile (Android/iOS) et une meilleure IPC (Inter-Process Communication).

**React (Frontend)**
*   **Choix** : Bibliothèque UI flexible et performante. L'utilisation de Hooks permet une gestion d'état propre pour le tableau de bord temps réel.
*   **Intégration** : S'interface parfaitement avec Tauri via l'API `invoke` pour communiquer avec le backend Rust.

**Scraping : headless_chrome vs fantoccini**
*   **headless_chrome** : Pilotage direct de Chrome via DevTools Protocol. Plus bas niveau, souvent plus rapide, mais peut être plus complexe à masquer (fingerprinting).
*   **fantoccini** : Client WebDriver (compatible Selenium/GeckoDriver). Plus haut niveau, standardisé, mais nécessite un driver externe (chromedriver/geckodriver) à gérer.
*   **Recommandation** : Pour une application distribuée "clé en main", `headless_chrome` (ou des crates comme `chromiumoxide`) est souvent préférable pour éviter à l'utilisateur d'installer des drivers, bien que la détection anti-bot soit un défi majeur.

### Database and Storage Technologies

**SQLite (Stockage Local)**
*   **Architecture** : Base de données fichier, serverless. Idéale pour une application desktop mono-utilisateur.
*   **Intégration Rust** :
    *   `sqlx` : ORM/Query builder asynchrone, vérification des requêtes à la compilation (très puissant).
    *   `rusqlite` : Bindings synchrones plus simples.
    *   **Choix** : `sqlx` est recommandé pour ne pas bloquer la boucle d'événements de Tauri (Tokio) lors des écritures/lectures.

### Development Tools and Platforms

**Vite (Build Tool)**
*   Standard de facto pour Tauri + React. Compilation ultra-rapide et Hot Module Replacement (HMR) efficace.

**Cargo (Rust Package Manager)**
*   Gère les dépendances, la compilation, les tests et la documentation.

### Cloud Infrastructure and Deployment

**GitHub Actions**
*   Pour la CI/CD : Compilation cross-platform des binaires Tauri (Windows, MacOS, Linux) et création des releases automatiques.

### Technology Adoption Trends

*   **Shift vers Rust** : De plus en plus d'outils CLI et Desktop migrent vers Rust (ex: Discord, 1Password partiellement) pour la performance.
*   **Tauri vs Electron** : Tauri gagne du terrain pour les applications où la taille du binaire et la consommation RAM sont critiques.

## Integration and Architecture Analysis

### System Architecture Patterns

**Architecture Événementielle (Event-Driven)**
*   Le cœur de l'application repose sur une boucle d'événements asynchrone (Tokio).
*   **Flux** : Le "Scheduler" déclenche des tâches de scraping -> Les résultats sont envoyés via des canaux (Channels MPSC) -> Le "Processor" analyse et stocke en DB -> Un événement est émis vers le Frontend via Tauri Event.

**Communication Frontend-Backend (IPC)**
*   **Tauri Commands** : Le Frontend appelle des fonctions Rust via `invoke('command_name', { args })`. C'est typé et sécurisé.
*   **Tauri Events** : Le Backend pousse des données au Frontend (ex: "Nouveau stock détecté") via `window.emit('event_name', payload)`.
*   **Isolation** : Le contexte Rust a tous les privilèges système, le contexte Web (React) est sandboxé.

### Integration Patterns

**Telegram Bot API**
*   **Mode Push** : Utilisation de l'API HTTP simple pour envoyer des messages (`sendMessage`).
*   **Librairie** : Utilisation de `reqwest` (client HTTP asynchrone) ou `teloxide` (framework bot complet). Pour de la simple notification, `reqwest` est suffisant et plus léger.

**Database Integration**
*   **SQLx** : Utilisation du pattern de "Connection Pool" pour gérer les accès concurrents à SQLite.
*   **Migrations** : Les schémas SQL sont embarqués dans le binaire et exécutés au premier lancement (`sqlx::migrate!`).

### Interoperability

**Cross-Platform Support**
*   Tauri compile en natif : `.exe` (Windows), `.app` (macOS), `.deb` (Linux).
*   **WebView** : Dépendance au WebView2 sur Windows (pré-installé sur W11, souvent sur W10). C'est un point d'attention pour le déploiement.

## Performance and Scalability Analysis

### Performance Characteristics

**Gestion de la Mémoire (Rust)**
*   **Zero-Cost Abstractions** : Pas de Garbage Collector qui cause des micro-pauses. Crucial pour un scraper qui tourne 24/7 en arrière-plan sans ralentir le PC de l'utilisateur.
*   **Empreinte RAM** : Une app Tauri "Hello World" consomme ~10-15MB de RAM, contre ~100MB+ pour Electron.

**Concurrence (Async/Await)**
*   Rust (via Tokio) permet de lancer des centaines de "Green Threads" (Tasks) pour scraper plusieurs sites en parallèle avec un coût mémoire minime, contrairement aux Threads OS classiques.

### Scalability Patterns

**Modularité du Code**
*   En séparant la logique métier (Core) de l'interface (Tauri), le code Rust peut être réutilisé.
*   **Scénario de montée en charge** : Si le besoin évolue vers une version "Serveur/SaaS", le même code Rust peut être déplacé dans un backend web (Actix-web ou Axum) sans réécrire la logique de scraping.

**Optimisation du Scraping**
*   **Rate Limiting** : Implémentation impérative de délais (Jitter) pour éviter le bannissement IP, qui est le goulot d'étranglement principal, pas le CPU.
*   **Resource Pooling** : Réutilisation des instances de navigateur (Headless Chrome contexts) pour éviter le coût de démarrage de processus Chrome à chaque requête.

## Implementation Approaches and Technology Adoption

### Technology Adoption Strategies

**Approche "Vertical Slice" (Tranche Verticale)**
Pour maîtriser la stack Rust/Tauri sans complexité excessive, il est recommandé de développer une fonctionnalité complète de bout en bout avant de généraliser.
*   *Exemple :* Scraper uniquement le prix d'un produit Fnac -> Stocker en SQLite -> Afficher dans React.
*   *Avantage :* Valide la communication IPC et la structure de la DB immédiatement.

**Gestion de la Courbe d'Apprentissage Rust**
*   **Stratégie** : Ne pas optimiser prématurément. Utiliser `.clone()` et `String` (au lieu de `&str`) au début pour contourner les difficultés liées au "Borrow Checker".
*   **Ressources** : Le livre "The Rust Programming Language" et "Rust by Example" sont les références incontournables.

### Development Workflows and Tooling

**Environnement de Développement**
*   **VS Code** est l'IDE recommandé avec l'extension `rust-analyzer` (indispensable pour l'autocomplétion et les erreurs en temps réel).
*   **Tauri CLI** : Utilisation de `cargo tauri dev` pour le développement avec rechargement à chaud (Hot Reload) du frontend et recompilation rapide du backend.

**Debugging**
*   **Backend** : Les logs Rust (`println!` ou `log::info!`) s'affichent directement dans le terminal qui lance l'app.
*   **Frontend** : Clic droit -> "Inspecter" dans l'application ouvre les DevTools Chrome/Webkit classiques.

### Testing and Quality Assurance

**Stratégie de Test**
*   **Unit Tests (Rust)** : Intégrés au langage via `#[test]`. Idéal pour tester la logique de parsing HTML et les calculs de marge.
*   **Integration Tests** : Tester les requêtes DB avec une base SQLite en mémoire.
*   **Frontend Tests** : Vitest pour les composants React. Il faut "mocker" les appels `invoke` de Tauri pour tester l'UI sans le backend.

### Deployment and Operations Practices

**CI/CD avec GitHub Actions**
*   Tauri fournit une Action officielle (`tauri-apps/tauri-action`) qui compile automatiquement les binaires pour Windows, MacOS et Linux à chaque push ou tag.
*   **Release** : Génération automatique des "Draft Releases" sur GitHub avec les installateurs (.msi, .dmg) prêts à être téléchargés.

**Mise à jour (Auto-Updater)**
*   Tauri intègre un système de mise à jour natif. Il suffit d'héberger un fichier JSON (sur GitHub Pages ou un S3) listant la dernière version et la signature cryptographique. L'application se met à jour automatiquement au lancement.


# Rapport Technique Complet : Architecture et Implémentation du Poke-Radar

## Résumé Exécutif

La recherche technique confirme la viabilité et la pertinence de la stack "Modern & Hype" (Tauri v2, Rust, React) pour le projet Poke-Radar. Cette architecture répond parfaitement aux contraintes de performance (scraping en arrière-plan) et de distribution (application desktop légère).

**Points Clés :**
*   **Architecture :** Le modèle hybride (Cœur Rust performant + UI React flexible) offre le meilleur des deux mondes, surpassant les solutions basées sur Electron ou Python en termes de consommation de ressources.
*   **Scraping :** L'utilisation de `headless_chrome` piloté par Rust permet une interaction fine avec les sites cibles (Fnac, Pokémon Center) tout en maintenant une empreinte mémoire faible.
*   **Risques :** Le défi majeur reste la détection anti-bot. Une stratégie de "mimétisme humain" (délais aléatoires, rotation d'User-Agents) est impérative.

## Table des Matières

1.  Introduction et Objectifs Techniques
2.  Architecture Système et Stack Technologique
3.  Stratégie d'Implémentation et Scraping
4.  Performance et Scalabilité
5.  Sécurité et Données
6.  Recommandations Stratégiques
7.  Roadmap Technique

## 1. Introduction et Objectifs Techniques

Ce rapport définit le cadre technique pour le développement de "Poke-Radar", un outil d'arbitrage automatisé pour le marché Pokémon. L'objectif est de passer d'une logistique manuelle à une solution technologique capable de surveiller les stocks et d'analyser la rentabilité en temps réel.

## 2. Architecture Système et Stack Technologique

### Stack Retenue ("Modern & Hype")
*   **Core (Backend) :** **Rust**. Choisi pour sa sécurité mémoire et sa capacité à gérer des tâches concurrentes (scraping) sans ralentir le système hôte.
*   **Application Shell :** **Tauri v2**. Utilise le WebView natif (WebView2 sur Windows), garantissant un binaire final <10 Mo.
*   **Frontend :** **React + TypeScript**. Permet un développement rapide d'interfaces réactives pour le tableau de bord d'arbitrage.
*   **Base de Données :** **SQLite** (via `sqlx`). Stockage local performant, sans configuration serveur requise pour l'utilisateur.

### Flux de Données
L'architecture est événementielle : le Core Rust émet des événements (ex: `STOCK_DETECTED`) que le Frontend React écoute pour mettre à jour l'interface. Les actions utilisateur (ex: `ADD_PRODUCT`) sont envoyées au Core via des commandes asynchrones.

## 3. Stratégie d'Implémentation et Scraping

### Approche de Scraping
*   **Outil :** `headless_chrome` (Rust) est recommandé pour un contrôle granulaire.
*   **Contre-Mesures :** Pour éviter le bannissement IP par les revendeurs (Fnac, etc.) :
    *   Implémentation de "Jitter" (délais aléatoires entre les actions).
    *   Limitation du taux de requêtes (Rate Limiting) strict.
    *   Gestion des sessions et cookies pour simuler un navigateur réel.

### Workflow de Développement
*   **CI/CD :** GitHub Actions configuré pour compiler et builder les binaires multi-plateformes (Windows, macOS, Linux) à chaque release.
*   **Tests :** Tests unitaires Rust pour la logique de parsing et tests d'intégration pour la base de données.

## 4. Performance et Scalabilité

*   **Concurrence :** Le runtime asynchrone `Tokio` permet de surveiller des dizaines de produits simultanément avec un coût CPU négligeable.
*   **Mémoire :** L'absence de Garbage Collector en Rust assure une consommation RAM stable et prévisible, essentielle pour une application tournant 24/7.

## 5. Sécurité et Données

*   **Isolation :** Le contexte Frontend est isolé du système de fichiers, prévenant les failles XSS critiques.
*   **Données :** Toutes les données (préférences, historique) sont stockées localement chez l'utilisateur. Aucune donnée sensible n'est envoyée vers un serveur tiers, assurant la confidentialité ("Privacy by Design").

## 6. Recommandations Stratégiques

1.  **Adopter l'approche "Vertical Slice" :** Ne pas tenter de construire tout le moteur de scraping d'un coup. Commencer par *un* site (ex: eBay Sold Listings) et *une* vue React pour valider la chaîne complète.
2.  **Prioriser la Robustesse sur la Vitesse :** En scraping, la vitesse mène au bannissement. La fiabilité de la récupération des données est la métrique clé.
3.  **Investir dans l'Outillage Rust :** Configurer correctement VS Code (`rust-analyzer`) et les linter (`clippy`) dès le début pour faciliter l'apprentissage de Rust.

## 7. Roadmap Technique

*   **Phase 1 (POC) :** "Hello World" Tauri + Scraping simple d'une page Fnac (récupération du prix).
*   **Phase 2 (Core) :** Implémentation de la DB SQLite et du moteur de tâches périodiques.
*   **Phase 3 (Market) :** Intégration du scraping eBay/Cardmarket pour le calcul de marge.
*   **Phase 4 (Notification) :** Connexion à l'API Telegram pour les alertes.

---

**Conclusion :** La fondation technique est solide. L'utilisation de Rust et Tauri positionne Poke-Radar comme un outil professionnel, performant et pérenne, capable de supporter la montée en charge vers des milliers de produits surveillés.