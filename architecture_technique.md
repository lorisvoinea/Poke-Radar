# Architecture Technique : Projet "Poke-Radar" & Arbitrage

## 1. Vision du Projet
L'objectif est de développer une application de bureau performante ("Poke-Radar") capable de :
1.  **Monitorer les stocks** des revendeurs officiels (Fnac, Cultura, Pokémon Center) pour détecter les disponibilités de produits scellés (Displays, ETB).
2.  **Analyser le marché secondaire** (Cardmarket, eBay) pour estimer la valeur de revente réelle (Mark-to-Market) et calculer la marge potentielle.
3.  **Alerter en temps réel** via Telegram lors d'une opportunité d'arbitrage rentable.

## 2. La Stack Technologique ("Modern & Hype")

Pour répondre à votre envie de découvrir des technologies récentes tout en capitalisant sur votre logique de développeur (Java/Angular), voici la stack recommandée :

| Composant | Technologie | Pourquoi ce choix ? |
| :--- | :--- | :--- |
| **Architecture App** | **Tauri v2** | Le remplaçant moderne d'Electron. Permet de créer une app bureau (Windows/Mac/Linux) ultra-légère et sécurisée. |
| **Backend / Core** | **Rust** | Langage système moderne, sécurisé et ultra-rapide. Excellent pour apprendre la gestion mémoire et la concurrence. Remplace votre Java. |
| **Frontend** | **React** (via TypeScript) | Le standard du marché web actuel. Plus flexible qu'Angular. Utiliser **Vite** comme outil de build (très rapide). |
| **Scraping** | **headless_chrome** (Rust) | Bibliothèque Rust pour piloter Chrome (similaire à Puppeteer/Playwright). Permet de gérer les sites dynamiques (JS). |
| **Base de Données** | **SQLite** | Stockage local, fichier unique, zéro configuration. Interface via la librairie Rust `sqlx` ou `rusqlite`. |
| **Notifications** | **Telegram Bot API** | Gratuit, push mobile immédiat, facile à intégrer via requêtes HTTP simples. |

### Note sur Playwright
*Playwright est un outil exceptionnel (et gratuit), mais ses bindings officiels sont Node.js, Python, Java et .NET. Bien qu'il existe des wrappers Rust, pour une expérience d'apprentissage optimale en Rust, l'utilisation de `headless_chrome` ou `fantoccini` est plus idiomatique et robuste dans cet écosystème.*

## 3. Architecture Détaillée

### A. Module de Sourcing (Le "Chasseur")
Ce module tourne en tâche de fond (thread Rust) et visite périodiquement les sites Retail.

*   **Cibles :** Fnac, Cultura, Micromania, Amazon FR, Pokémon Center.
*   **Technique :**
    *   Rotation d'User-Agents pour éviter le blocage.
    *   Gestion des délais aléatoires (Jitter) pour paraître humain.
    *   Détection des boutons "Ajouter au panier" via sélecteurs CSS.

### B. Module d'Estimation (L' "Analyste")
Ce module est déclenché lorsqu'un produit est trouvé en stock, ou périodiquement pour mettre à jour les cotes.

*   **Cibles :**
    *   **Cardmarket :** Scraper les listings pour un produit donné. Prendre le prix du "Premier vendeur professionnel français" ou "Moyenne des 5 moins chers en Europe".
    *   **eBay :** Scraper les "Ventes réussies" (Sold Listings) uniquement. C'est le seul indicateur fiable du prix réel que les gens paient.
*   **Calcul d'Arbitrage :**
    *   `Prix Achat` = Prix Retail + Frais de port.
    *   `Prix Revente` = (Prix eBay - 15% frais) ou (Prix Cardmarket - 5% com).
    *   `Marge` = Prix Revente - Prix Achat.

### C. Base de Données (Le "Cerveau")
Schéma relationnel simple (SQLite) :

*   `products` : (id, name, ean, retail_price_target)
*   `tracked_urls` : (id, product_id, url, site_name, last_status)
*   `market_prices` : (id, product_id, source, price, date)
*   `opportunities` : (id, product_id, buy_price, sell_price_estimate, detected_at)

### D. Interface Utilisateur (Le "Tableau de Bord")
Développée en **React + Tailwind CSS**.
*   **Dashboard :** Liste des produits surveillés avec statut (En stock / Rupture).
*   **Vue Arbitrage :** Tableau comparatif "Prix Fnac vs Prix eBay" avec code couleur (Vert = Marge > 20%).
*   **Config :** Ajout d'URL à surveiller, réglage des seuils de marge.

## 4. Flux de Données (Workflow)

1.  **Scan :** Le backend Rust lance une vérification sur Fnac.com pour "Coffret 151".
2.  **Détection :** Le produit est détecté "En stock" à 50€.
3.  **Vérification Marché :** Le backend interroge immédiatement eBay -> Dernière vente à 90€.
4.  **Calcul :** Marge brute = 90 - 50 = 40€. (Hors frais).
5.  **Décision :** Si Marge > Seuil (ex: 15€), alors...
6.  **Notification :** Envoi d'un message Telegram : *"🚨 ALERTE : Coffret 151 dispo Fnac (50€) -> Se revend 90€ sur eBay !"*
7.  **Affichage :** Mise à jour de l'UI React en temps réel.

## 5. Pourquoi cette stack est idéale pour vous ?

1.  **Transition Java -> Rust :** Vous retrouverez le typage fort et la rigueur de Java, mais avec une syntaxe moderne et une gestion mémoire novatrice. C'est un profil très recherché.
2.  **Transition Angular -> React :** React est moins "verbeux" qu'Angular. Vous apprendrez le concept de "Composants fonctionnels" et de "Hooks", qui dominent le web actuel.
3.  **Performance :** Contrairement à un bot Python qui peut être lent, Rust est fulgurant.
4.  **Scalabilité :** Cette architecture (Backend séparé du Frontend) prépare le terrain si un jour vous voulez héberger la partie Rust sur un serveur cloud (AWS/VPS) et garder l'interface React accessible via le web.

## 6. Prochaines étapes (Roadmap)

1.  **Setup :** Installer Rust (`rustup`), Node.js, et initialiser un projet Tauri (`npm create tauri-app`).
2.  **Hello World Rust :** Faire un petit script Rust qui télécharge le HTML d'une page Fnac.
3.  **Scraping eBay :** Réussir à extraire le prix d'une vente eBay via `headless_chrome`.
4.  **UI React :** Afficher ce prix dans une fenêtre Tauri.
5.  **Bot Telegram :** Connecter les notifications.