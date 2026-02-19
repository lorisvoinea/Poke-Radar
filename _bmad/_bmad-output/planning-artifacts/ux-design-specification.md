---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
lastStep: 14
inputDocuments:
  - _bmad/_bmad-output/planning-artifacts/product-brief-bmad-2026-02-18.md
  - _bmad/_bmad-output/planning-artifacts/prd.md
  - _bmad/_bmad-output/planning-artifacts/research/domain-tcg-pokemon-prix-marche-research-2025-02-05.md
  - _bmad/_bmad-output/brainstorming/brainstorming-session-2025-02-05.md
date: 2026-02-19
author: Loris
project: Poke-Radar
---

# UX Design Specification — Poke-Radar

## 1) Executive summary et objectif UX

Poke-Radar doit transformer une veille marché lourde en décisions d’achat **rapides, fiables et traçables**. L’objectif UX MVP est de permettre à un revendeur de passer d’un signal à une décision en **moins de 5 minutes**, avec un contexte suffisant pour agir sans ouvrir 10 onglets.

Objectifs UX prioritaires :

- Réduire la charge cognitive de surveillance multi-sources.
- Élever l’actionnabilité des alertes (qualité > quantité).
- Rendre la rentabilité nette explicable et vérifiable.
- Maintenir l’utilisabilité en mode dégradé (source indisponible / saisie manuelle).

## 2) Discovery utilisateur et contexte produit

### Personas opérationnels

1. **Alex — Revendeur indépendant (primaire)**
   - Besoin d’aller vite avec risque contrôlé.
   - Veut une vue triée par opportunité nette.
2. **Sam — Flipper premium (primaire)**
   - Préfère peu d’alertes mais à forte conviction.
   - Exige des filtres fins (marge, risque, fraîcheur).
3. **Opérateur logistique (secondaire)**
   - Exécute des actions simples sur consignes claires.

### Jobs to be done

- « Quand une opportunité sort, je veux savoir vite si elle est exploitable. »
- « Quand une source est instable, je veux un fallback explicite pour continuer. »
- « Quand je reçois une alerte, je veux comprendre la marge nette et son niveau de confiance. »

### Contraintes UX issues du contexte

- Stack desktop orientée usage opérationnel continu.
- Nécessité de transparence des sources et timestamps.
- Priorité MVP : Telegram + tableau décisionnel central.

## 3) Core experience (expérience cœur)

### Promesse d’expérience

> « Recevoir moins de bruit, plus de décisions exploitables. »

### Boucle produit principale

1. Collecte disponibilité/prix sur sources activées.
2. Normalisation + calcul marge nette.
3. Scoring configurable (rentabilité, urgence, confiance).
4. Notification sur seuil.
5. Décision utilisateur (agir / ignorer / suivre).
6. Historisation pour calibration hebdomadaire.

### UX North-star metrics

- **Decision-ready rate** (cible > 60 %)
- **Signal → décision** (cible < 5 min)
- **Signal → notification** (cible technique < 60 sec)

## 4) Emotional response design

Émotions recherchées :

- **Confiance** : chaque chiffre clé est justifié.
- **Contrôle** : l’utilisateur règle ses seuils, ses priorités et son risque.
- **Calme opérationnel** : hiérarchie claire, pas de surcharge visuelle.
- **Momentum** : perception de progression via revue des décisions.

Principes rédactionnels UX :

- Écriture orientée décision (verbes d’action, pas de jargon inutile).
- Toujours répondre à « Pourquoi cette alerte ? ».
- Afficher l’incertitude explicitement (estimé vs confirmé).

## 5) Inspiration et patterns UX de référence

Patterns retenus :

- **Table priorisée** (scan rapide multi-opportunités).
- **Panneau détail contextualisé** sans changer de page.
- **Filtres persistants** et presets de stratégie.
- **État source visible** (OK / instable / indisponible).
- **Mode dégradé explicite** avec actions alternatives.

Patterns à éviter :

- KPI décoratifs sans action associée.
- Mur de données sans score unifié.
- Couleurs d’alerte omniprésentes (fatigue).

## 6) Design system strategy

### Approche

- Design system léger orienté B2B desktop.
- Composants React réutilisables, tokens centralisés.
- États standards : default / hover / focus / success / warning / error / disabled.

### Tokens recommandés

- Couleurs : `color.bg.*`, `color.text.*`, `color.signal.*`, `color.state.*`
- Espacement : `space.4` à `space.24`
- Rayons : `radius.sm|md|lg`
- Typo : `font.size.12|14|16|20|24|32`

### Accessibilité système

- Contraste AA minimum ; KPI critiques ciblent AAA.
- Focus clavier visible sur tout élément interactif.
- Zone cliquable min 40x40.

## 7) Définition de l’expérience et mécaniques principales

### Écran 1 — Radar (vue principale)

- Tableau trié par score d’opportunité.
- Colonnes MVP : produit, source, prix achat, estimation revente, marge nette, confiance, fraîcheur, statut.
- Actions : `Voir détail`, `Ouvrir source`, `Marquer traité`, `Ignorer`.

### Écran 2 — Détail opportunité

- Décomposition marge (frais, commission, port).
- Justification du score et niveau de confiance.
- Historique court des variations si disponible.
- CTA principal : `Ouvrir source d’achat`.

### Écran 3 — Stratégie & paramètres

- Seuils (marge/ROI/risque).
- Poids du scoring.
- Paramétrage des notifications Telegram.
- Référentiels (sets/produits) pour limiter la saisie libre.

### Écran 4 — Santé des sources & fallback

- État de collecte par source + dernière synchro.
- Journal erreurs simplifié orienté action.
- Entrée manuelle/import minimal quand une source tombe.

## 8) Visual foundation

### Palette (dark desktop-first)

- Fond app : `#0B1020`
- Surface : `#131A2E`
- Texte principal : `#F5F7FF`
- Texte secondaire : `#A8B0CC`
- Info : `#7B8CDE`
- Success : `#35D07F`
- Warning : `#FF9F1C`
- Critical : `#FF4D6D`

### Typographie

- Inter (UI) / fallback système sans-serif.
- Priorité lisibilité des chiffres (alignement tabulaire).
- Hiérarchie compacte : H1/H2 lisibles + densité table élevée.

### Mise en page

- Grille 12 colonnes desktop.
- Densité ajustable (normal / expert).
- Marges internes 16–24 px.

## 9) Design directions (concepts)

### Direction A — Trading Desk

- Densité élevée, performance de scan maximale.
- Adaptée aux experts habitués aux dashboards financiers.
- Risque : intimidation au premier usage.

### Direction B — Decision Assistant (recommandée MVP)

- Équilibre lisibilité et puissance.
- Focus sur justification du score + actions immédiates.
- Convient aux personas Alex et Sam.

### Direction C — Calm Monitor

- Minimalisme fort, charge visuelle très faible.
- Excellente pour supervision continue.
- Limites sur comparaison massive rapide.

**Recommandation : Direction B + option “densité expert” activable.**

## 10) User journeys clés

### Journey 1 — Signal prioritaire vers décision

1. Réception Telegram.
2. Ouverture Radar filtré sur alertes critiques.
3. Vérification marge nette + confiance + fraîcheur.
4. Ouverture détail et source.
5. Décision (agir/ignorer), marquage du statut.

**Critère UX :** décision en moins de 5 minutes.

### Journey 2 — Recalibrage hebdomadaire

1. Consultation de l’historique décisions.
2. Analyse faux positifs / opportunités manquées.
3. Ajustement seuils et poids de scoring.
4. Sauvegarde preset de stratégie.

**Critère UX :** session < 10 minutes.

### Journey 3 — Source indisponible

1. Détection automatique d’échec source.
2. Passage en mode dégradé visible.
3. Utilisation fallback manuel/import.
4. Reprise automatique lorsque source rétablie.

**Critère UX :** pas de blocage complet du flux décisionnel.

## 11) Component strategy

Composants cœur :

- `OpportunityTable`
- `OpportunityRow`
- `SignalBadge`
- `ConfidenceBadge`
- `MarginBreakdown`
- `SourceHealthPanel`
- `StrategyPresetPanel`
- `NotificationPreview`

Règles de composition :

- Toute carte décisionnelle expose : **valeur + contexte + action**.
- Les statuts critiques combinent couleur + icône + libellé.
- Les tableaux supportent tri, recherche, focus clavier.

## 12) UX consistency patterns

Patterns transverses :

- **Alerte** : titre + marge nette + raison + fraîcheur.
- **Erreur source** : message explicite + prochaine action recommandée.
- **Donnée estimée** : badge “estimé” + niveau de confiance.
- **Confirmation action** : modale seulement pour actions irréversibles.

Micro-interactions :

- Pulse léger sur nouvelle alerte prioritaire.
- Transition 150–200ms.
- Feedback non bloquant (snackbar discret).

## 13) Responsive & accessibility strategy

### Responsive

- Desktop prioritaire : `>= 1280px`
- Laptop : `1024–1279px`
- Tablet : `768–1023px` en consultation + actions critiques

### Accessibilité

- Navigation clavier complète.
- Labels explicites pour icônes et badges.
- Support `prefers-reduced-motion`.
- Vérification contraste automatisée en CI design.

### Langue et formats

- Français par défaut.
- Architecture i18n prête pour extension future.
- Formats monétaires et dates cohérents FR/CH.

## 14) Conclusion UX et plan d’alignement implémentation

La stratégie UX retenue vise un produit **décisionnel, sobre et robuste** :

- MVP centré sur l’actionnabilité des alertes.
- Transparence du calcul de rentabilité.
- Résilience UX (mode dégradé explicite).
- Base de composants compatible avec la roadmap technique.

### Livrables de continuité recommandés

1. Wireframes low-fi des 4 écrans cœur.
2. Spécification d’états (source, confiance, erreur, estimé).
3. Scénarios de tests UX sur journeys 1/2/3.
4. Checklist d’implémentation UX pour l’équipe dev.
