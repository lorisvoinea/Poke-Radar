# Deferred Work

## Deferred from: code review of 1-2-configurer-produits-profils-de-surveillance-et-parametres-economiques (2026-07-17)

- Écarter les identifiants sélectionnés devenus absents de la prop `products`; une actualisation de la liste peut conserver une sélection périmée et laisser le formulaire soumettre des produits inexistants.
- Persister le nom normalisé avec `trim()` plutôt que la valeur brute afin d’éviter les espaces de début ou de fin validés mais enregistrés.

## Deferred from: code review of 1-2-configurer-produits-profils-de-surveillance-et-parametres-economiques (2026-07-19)

- Compléter le CRUD produits côté commandes Tauri : les opérations de mise à jour et suppression sont absentes.
- Exposer dans l'UI la modification et la suppression des profils afin de couvrir la gestion complète annoncée par la story.
- Permettre la gestion libre des produits cibles au lieu des seuls produits de démarrage codés en dur.
- Ajouter la validation ergonomique UI des bornes et valeurs économiques avant l'appel au backend.
- Conserver des erreurs typées sur la surface Tauri au lieu de les aplatir en chaînes de caractères.
- Couvrir en Rust toutes les bornes annoncées pour la marge, les frais variables, les produits requis et la mise à jour.
- Protéger la création des produits de démarrage contre deux appels concurrents avant le rerender React.

## Deferred from: code review of 1-3-exploiter-des-referentiels-preenregistres-pour-limiter-les-erreurs (2026-07-19)

- Traiter les rejets d'initialisation dans `StrategyPage` afin d'éviter une promesse non gérée et un écran bloqué sur « Initialisation... » ; ce comportement existait déjà avant la Story 1.3.
- Séparer le succès de persistance d'un profil de l'échec éventuel du cycle ou du rafraîchissement suivant, afin d'éviter qu'un profil effectivement créé soit présenté comme non sauvegardé ; ce comportement existait déjà avant la Story 1.3.
- Aligner le fallback navigateur sur la règle backend d'un seul profil actif ; il ajoute actuellement chaque nouveau profil avec `isActive: true` sans désactiver les profils précédents, comportement déjà présent avant la Story 1.3.
