---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
lastStep: 14
inputDocuments:
  - _bmad-output/planning-artifacts/product-brief-bmad-2026-02-18.md
  - _bmad-output/planning-artifacts/prd.md
  - market-Poke-Radar-research.md
  - technical-Poke-Radar-research.md
date: 2026-02-18
author: Loris
project: Poke-Radar
---

# UX Design Specification — Poke-Radar

## 1) Executive summary et objectif UX

Poke-Radar doit permettre à un revendeur Pokémon de **prendre une décision d’achat exploitable en moins de 2 minutes** à partir d’un signal (restock + rentabilité nette) au lieu de consulter manuellement plusieurs sources.

Objectifs UX centraux :

- Réduire la charge mentale (trop de signaux, peu de décisions claires).
- Maximiser la vitesse de décision (priorisation visuelle immédiate).
- Rendre la confiance mesurable (score + détail de calcul de marge).
- Assurer une utilisation 24/7 sans friction (desktop, notifications Telegram).

## 2) Discovery utilisateur et contexte produit

### Personas UX opérationnels

1. **Revendeur indépendant (primaire)**
   - Recherche des opportunités fiables en flux continu.
   - Tolère peu les faux positifs.
2. **Flipper premium (primaire)**
   - Privilégie le ROI unitaire élevé.
   - Veut des filtres de sévérité et de liquidité.
3. **Assistant logistique (secondaire)**
   - Besoin d’une lecture simple des priorités à traiter.

### Jobs to be done

- "Quand un restock rentable apparaît, je veux savoir **immédiatement** si je dois acheter, afin de ne pas rater la fenêtre de marché."
- "Quand je compare plusieurs opportunités, je veux une **priorisation claire**, afin d’éviter les achats sous-optimaux."
- "Quand j’agis sur une alerte, je veux comprendre le **calcul net**, afin d’avoir confiance dans la décision."

## 3) Core experience (expérience cœur)

### Promesse d’expérience

> "Voir moins d’alertes, mais mieux décidées."

### Boucle produit principale

1. Le moteur détecte un changement stock/prix.
2. Le système calcule la marge nette estimée.
3. L’opportunité est scorée (rentabilité, vitesse, risque).
4. L’utilisateur reçoit un signal priorisé.
5. L’utilisateur décide (agir / ignorer / suivre).
6. Le système conserve l’historique pour calibration.

### North-star UX metric

- **Decision-ready rate** : pourcentage d’alertes jugées immédiatement actionnables.

## 4) Emotional response design

Émotions visées dans l’interface :

- **Contrôle** : l’utilisateur pilote ses seuils, pas l’inverse.
- **Confiance** : chaque score est explicable (marge, frais, commissions).
- **Calme** : éviter le "panic trading" via hiérarchie visuelle claire.
- **Momentum** : sentiment de progression avec suivi d’impact hebdomadaire.

Principes de ton UX :

- Décisionnel, sobre, orienté action.
- Peu de bruit rédactionnel.
- Toujours expliciter "Pourquoi cette alerte ?".

## 5) Inspiration et patterns UX de référence

Patterns retenus (adaptés au contexte Poke-Radar) :

- **Tableau de tri prioritaire** (type trading dashboard) pour scanner vite.
- **Card detail latérale** pour expliquer une opportunité sans quitter la liste.
- **Filtres persistants** (seuil marge, source, catégorie, risque).
- **Feedback de confiance** (badge qualité donnée + fraîcheur).
- **Mode focus** pour les périodes de drop/restock intense.

Patterns explicitement évités :

- Timeline dense sans score explicite.
- Multiplication des KPI non actionnables.
- Couleurs agressives permanentes (fatigue cognitive).

## 6) Design system strategy

### Approche

- Base design system légère, orientée B2B opérationnel.
- Composants unifiés React + tokens (couleurs, espacements, typographie).
- États normalisés (default/hover/focus/error/success/warning).

### Design tokens (naming)

- `color.bg.base`, `color.bg.elevated`, `color.text.primary`
- `color.signal.critical`, `color.signal.high`, `color.signal.medium`, `color.signal.low`
- `space.2`, `space.4`, `space.8`, `space.12`, `space.16`
- `radius.sm`, `radius.md`, `radius.lg`

### Accessibilité système

- Contraste AA minimum pour tous les textes clés.
- Taille interactive min 40px.
- États focus visibles clavier.

## 7) Définition de l’expérience et mécaniques principales

### Écran 1 — Radar (priorité temps réel)

- Liste d’opportunités triée par score.
- Colonnes minimales : produit, source, prix achat, prix revente estimé, marge nette, score, fraîcheur.
- Actions rapides : `Voir détail`, `Marquer traité`, `Ignorer`.

### Écran 2 — Détail opportunité

- Décomposition du calcul de marge.
- Coûts inclus (frais plateforme, expédition, commissions).
- Indicateur de risque (volatilité / liquidité si disponible).
- CTA principal : `Ouvrir source d’achat`.

### Écran 3 — Paramètres stratégie

- Seuils de marge/ROI.
- Pondération du score.
- Paramètres alertes Telegram (fréquence, mode urgence).

## 8) Visual foundation

### Palette (mode sombre par défaut)

- Fond principal: `#0B1020`
- Surface: `#131A2E`
- Texte principal: `#F5F7FF`
- Texte secondaire: `#A8B0CC`
- Signal critique: `#FF4D6D`
- Signal élevé: `#FF9F1C`
- Signal moyen: `#2EC4B6`
- Signal faible: `#7B8CDE`
- Succès: `#35D07F`

### Typographie

- Inter (UI)
- Échelle : 12 / 14 / 16 / 20 / 24 / 32
- Densité élevée mais lisible (table-centric)

### Spacing et structure

- Layout en grille 12 colonnes (desktop).
- Cartes/sections avec respiration `16–24px`.
- Priorité à la lisibilité des nombres (alignement décimal).

## 9) Design directions (concepts)

### Direction A — "Trading Desk"

- Dense, orientée vitesse.
- Idéale pour utilisateurs experts.
- Risque : intimidation des nouveaux utilisateurs.

### Direction B — "Decision Assistant" (recommandée)

- Équilibre entre clarté et puissance.
- Score + explication + action rapide.
- Compatible montée en compétence progressive.

### Direction C — "Calm Monitor"

- Très minimaliste.
- Bonne lisibilité globale.
- Peut ralentir la comparaison multi-opportunités.

**Choix recommandé : Direction B**, avec mode "densité expert" activable.

## 10) User journeys clés

### Journey 1 — Détection et décision rapide

1. Notification Telegram reçue.
2. Ouverture du dashboard Radar.
3. Vérification du score et de la marge nette.
4. Ouverture du détail puis du lien source.
5. Décision d’achat.
6. Marquage "traité".

**Critère UX** : < 120 secondes du signal à la décision.

### Journey 2 — Calibration hebdomadaire

1. Accès écran stratégie.
2. Analyse historique alertes (actionnées vs ignorées).
3. Ajustement seuil marge et risque.
4. Validation et sauvegarde.

**Critère UX** : session de calibration < 10 minutes.

## 11) Component strategy

### Composants cœur

- `OpportunityTable`
- `OpportunityRow`
- `SignalBadge`
- `ConfidenceMeter`
- `MarginBreakdownCard`
- `StrategyFilterPanel`
- `AlertPreviewPanel`

### Règles de composition

- Tous les composants décisionnels doivent afficher : valeur, contexte, action.
- Les badges de sévérité ont une forme/couleur + libellé (pas couleur seule).
- Les tableaux supportent tri, recherche, et navigation clavier.

## 12) UX patterns de cohérence

### Patterns transverses

- **Pattern d’alerte** : titre clair + marge nette + raison du score.
- **Pattern d’erreur source** : état dégradé explicite (ne pas masquer).
- **Pattern de confirmation** : actions irréversibles avec confirm modal.
- **Pattern de données absentes** : skeleton puis message d’état utile.

### Micro-interactions

- Pulse discret pour nouvelle opportunité prioritaire.
- Transition 150–200ms pour feedback sans ralentir la lecture.
- Snackbars non bloquants pour actions de gestion.

## 13) Responsive & accessibility strategy

### Breakpoints

- Desktop prioritaire : `>= 1280px`
- Laptop : `1024–1279px`
- Tablet support minimal : `768–1023px` (lecture + actions clés)

### Accessibilité

- Navigation clavier complète sur tableau et filtres.
- Libellés explicites pour icônes et états.
- Vérification contraste AA (minimum) / AAA pour KPI critiques.
- Support réduction d’animations (`prefers-reduced-motion`).

### Internationalisation

- Français par défaut.
- Préparer extraction des chaînes pour futur multilingue.

## 14) Plan d’implémentation UX (handoff)

### Sprint design recommandé

1. **Sprint UX-1** : wireframes direction B + parcours Journey 1.
2. **Sprint UX-2** : UI kit tokens + composants cœur.
3. **Sprint UX-3** : prototype interactif + tests utilisateurs (5 profils).
4. **Sprint UX-4** : ajustements accessibilité + handoff dev complet.

### DoD UX

- Tous les écrans clés couverts par specs d’états.
- Tous les composants critiques documentés.
- Tous les parcours clés testés sur cas réel.
- Décisions de design tracées dans ce document.

---

## Annexes

### A. KPI UX à suivre après lancement

- Taux d’alertes actionnées.
- Temps médian signal → décision.
- Taux d’erreurs perçues sur calcul marge.
- Taux d’utilisation des filtres stratégiques.
- Satisfaction perçue "confiance dans le signal".

### B. Risques UX majeurs

- Sur-optimisation densité au détriment de lisibilité.
- Faux positifs entraînant perte de confiance.
- Friction setup initial (seuils mal configurés).

### C. Décision finale workflow

Le workflow **/bmad-bmm-create-ux-design** est exécuté et finalisé.
Le livrable principal est prêt pour wireframing, prototypage et implémentation.
