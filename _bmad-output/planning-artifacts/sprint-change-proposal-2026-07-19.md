# Sprint Change Proposal — Responsive mobile

**Date :** 2026-07-19  
**Projet :** Poke-Radar  
**Déclencheur :** L’application web déployée sur `pokeradar.lumpy.top` doit être utilisable depuis un téléphone.

## 1. Résumé du problème

L’interface React actuelle repose sur le rendu HTML natif sans feuille de styles applicative ni règles responsive. La spécification UX ne définit que les usages desktop, laptop et tablette à partir de 768 px. Sur un écran mobile, la hiérarchie visuelle, les espacements, les champs, les actions et les listes de produits/profils ne garantissent donc ni une lecture confortable ni des zones tactiles suffisantes.

## 2. Analyse d’impact

- **Epic affecté :** Epic 1 — configuration du cockpit, plus précisément la story 1.2 déjà terminée.
- **Stories futures :** les écrans des epics 3 et 4 devront réutiliser les mêmes fondations responsive, sans changement de leur périmètre fonctionnel.
- **PRD :** aucun conflit avec le MVP ; NFR-05 « UX lisible et accessible » est précisé pour inclure le mobile web.
- **Architecture :** aucun changement de backend, d’API, de modèle de données ou de déploiement. Ajout d’une fondation CSS responsive côté UI uniquement.
- **UX :** extension officielle de la stratégie responsive sous 768 px.
- **Tests :** ajout de contrôles structurels/accessibilité et validation du build ; vérification manuelle aux largeurs 320, 375, 390 et 768 px.

## 3. Approche recommandée

**Option retenue : ajustement direct.**

Créer une mise en page mobile-first, conserver une largeur de lecture bornée sur desktop, empiler les champs et actions sur petit écran, assurer des contrôles tactiles d’au moins 44 px, permettre le retour à la ligne des textes longs et transformer les profils sauvegardés en cartes lisibles.

- **Effort :** faible
- **Risque :** faible
- **Impact calendrier :** aucun décalage significatif
- **Rollback :** inutile
- **Révision du MVP :** inutile

## 4. Propositions détaillées

### Story 1.2 — Critères d’acceptation

**Avant :**

> Les paramètres produits/seuils/frais sont persistés localement et réutilisés automatiquement au prochain cycle de monitoring.

**Après :**

> Les paramètres produits/seuils/frais sont persistés localement et réutilisés automatiquement au prochain cycle de monitoring. L’écran de stratégie reste intégralement utilisable de 320 px jusqu’au desktop, sans défilement horizontal de page, avec champs et actions adaptés au tactile.

**Justification :** la configuration est le parcours actuellement disponible sur le déploiement web et doit rester exploitable sur téléphone.

### UX — Section 13 « Responsive »

**Avant :**

> Desktop prioritaire : >= 1280 px ; Laptop : 1024–1279 px ; Tablet : 768–1023 px en consultation + actions critiques.

**Après :**

> Mobile : 320–767 px avec contenu empilé, navigation sans débordement horizontal, actions pleine largeur lorsque nécessaire et cibles tactiles de 44 px minimum. Tablet, laptop et desktop bénéficient d’une densité progressive à partir de la même fondation mobile-first.

**Justification :** le canal web public rend l’usage mobile réel, alors que la spécification initiale était desktop-first.

### Implémentation UI

- Ajouter une feuille de styles globale avec tokens, reset et breakpoints mobile-first.
- Structurer `StrategyPage` et `StrategyForm` avec des classes sémantiques.
- Afficher les paramètres en grille adaptative et les produits sous forme de lignes tactiles.
- Afficher les profils sauvegardés sous forme de cartes qui acceptent les textes longs.
- Conserver les libellés, rôles ARIA, focus visible et support `prefers-reduced-motion`.
- Ajouter/adapter les tests sans modifier la logique métier.

## 5. Handoff d’implémentation

**Classification : mineure.** Le Developer agent peut implémenter directement après approbation.

Critères de succès :

1. Aucun défilement horizontal de page entre 320 et 767 px.
2. Tous les champs et boutons sont utilisables au tactile et au clavier.
3. Les contenus longs reviennent à la ligne sans casser la mise en page.
4. Les tests UI et le build de production passent.
5. Le bundle déployé sur `pokeradar.lumpy.top` est remplacé puis contrôlé en HTTPS.

## Checklist Correct Course

- [x] Déclencheur, problème et preuve identifiés.
- [x] Impacts epic/story et dépendances futures évalués.
- [x] PRD, architecture, UX, tests et déploiement analysés.
- [x] Ajustement direct retenu ; rollback et réduction du MVP non nécessaires.
- [x] Propositions avant/après et handoff définis.
- [x] Proposition approuvée explicitement par Loris le 2026-07-19 avant implémentation.
- [N/A] Aucun ajout, retrait ou renommage d’epic/story dans `sprint-status.yaml`.

## Journal de handoff et résultat

- **Routé vers :** Developer agent.
- **Implémenté :** fondation CSS mobile-first, formulaire adaptatif, cibles tactiles, profils en cartes et retours à la ligne sûrs.
- **Artefacts mis à jour :** Epic 1 / Story 1.2, spécification UX et présente proposition.
- **Validation :** 12/12 tests UI réussis ; build Vite de production réussi.
- **Déploiement :** bundle publié via le volume Caddy existant ; `https://pokeradar.lumpy.top` répond en HTTP 200 avec la nouvelle feuille de styles.
- **Statut :** workflow et handoff terminés le 2026-07-19.
