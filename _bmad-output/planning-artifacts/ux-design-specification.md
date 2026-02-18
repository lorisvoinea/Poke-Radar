---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
inputDocuments:
  - _bmad/_bmad-output/planning-artifacts/research/domain-tcg-pokemon-prix-marche-research-2025-02-05.md
workflowType: create-ux-design
lastStep: 14
project_name: bmad
user_name: Loris
date: 2026-02-18
---

# UX Design Specification bmad

**Auteur :** Loris  
**Date :** 2026-02-18

---

## 1) Compréhension du projet et vision UX

### Objectif produit
Créer une application qui aide les collectionneurs Pokémon TCG à comparer rapidement le prix d'une carte selon plusieurs sources (marketplaces + magasins), avec un focus initial Suisse/France.

### Problème utilisateur principal
Aujourd'hui, l'information prix est fragmentée : l'utilisateur jongle entre plusieurs sites, ne sait pas toujours quelle donnée est fraîche, et a du mal à distinguer les références comparables (édition, état, langue, version gradée/non gradée).

### Utilisateurs cibles
- **Collectionneur occasionnel** : veut acheter au bon prix sans passer 1h à vérifier.
- **Collectionneur passionné** : suit ses cartes et recherche des opportunités.
- **Acheteur/revendeur actif** : a besoin d'un comparateur fiable + historique.

### Défis UX clés
- Désambiguïser une carte (set, numéro, état, langue, gradation).
- Rendre transparentes la provenance et la fraîcheur des prix.
- Réduire la charge cognitive lors de la comparaison multi-sources.

### Opportunités UX
- Recherche guidée + scan de carte à terme.
- Vue unifiée des offres avec filtres intelligents.
- Alertes personnalisées quand une carte atteint un seuil de prix.

## 2) Expérience cœur et réponse émotionnelle

### Promesse d'expérience
**"Comparer en confiance, décider en quelques secondes."**

### Émotions visées
- **Clarté** : je comprends immédiatement quelle offre est pertinente.
- **Confiance** : je vois d'où vient la donnée et quand elle a été mise à jour.
- **Contrôle** : je peux filtrer selon mes critères réels de collection.

### Principes UX
1. **Vérité des données d'abord** (source + timestamp visibles).
2. **Simplicité progressive** (basique par défaut, expert sur demande).
3. **Décision rapide** (CTA d'action clairs : enregistrer, alerte, ouvrir l'offre).

## 3) Analyse d'inspiration et patterns de marché

### Références utiles
- Comparateurs de prix e-commerce (structure de liste/filtres).
- Outils de suivi de collection (watchlist, portfolio, historique).
- Agrégateurs de cotes TCG (mise en avant de la source et du trend).

### Patterns conservés
- Barre de recherche persistante.
- Filtres latéraux + tri.
- Carte résultat synthétique (prix, vendeur, état, frais éventuels).

### Améliorations différenciantes
- Normalisation des attributs de carte pour comparaison équitable.
- Indicateur de fiabilité/complétude de chaque offre.
- Mise en évidence du "meilleur choix" selon profil (achat rapide vs coût total).

## 4) Stratégie Design System

### Choix recommandé
Design system **custom léger** basé sur des fondations tokenisées (couleurs, typo, spacing, rayons, ombres), compatible implémentation web app moderne.

### Raisons
- Besoin de composants spécifiques au domaine cartes/prix.
- Contrôle total sur lisibilité de données tabulaires.
- Evolution progressive sans dette visuelle massive.

### Gouvernance
- Bibliothèque de composants versionnée.
- Règles d'usage par composant (quand utiliser, anti-patterns).
- Revue UX/UI à chaque ajout significatif.

## 5) Définition de l'expérience et interactions clés

### Parcours principal
1. L'utilisateur recherche une carte.
2. Le système propose correspondances précises.
3. L'utilisateur applique filtres (état, langue, pays, gradée/non gradée).
4. Le système affiche résultats comparables et triables.
5. L'utilisateur sauvegarde, active une alerte, ou ouvre l'offre.

### Mécaniques d'interaction critiques
- **Recherche tolérante** (fautes, alias).
- **Filtrage instantané** avec feedback visuel.
- **Comparaison côte à côte** de 2 à 4 offres.
- **Historique de prix** simple (mini-graphe).

## 6) Fondation visuelle

### Palette
- **Primary:** Bleu nuit `#1D2A44` (confiance, sérieux)
- **Accent:** Jaune électrique `#FFD447` (énergie, Pokémon vibe)
- **Success:** Vert `#2FBF71`
- **Warning:** Orange `#FF9F43`
- **Error:** Rouge `#E55039`
- **Neutres:** `#0F172A` à `#F8FAFC`

### Typographie
- **Titres:** Inter SemiBold
- **Texte:** Inter Regular
- **Numérique/prix:** JetBrains Mono Medium (lisibilité des montants)

### Spacing & layout
- Grille 8pt
- Largeur max contenu desktop: 1200px
- Densité "données" optimisée pour desktop, simplifiée mobile

## 7) Directions de design retenues

### Direction A – "Data Pro"
UI dense, orientée efficacité, idéale utilisateurs experts.

### Direction B – "Collector Friendly" (retenue)
Équilibre lisibilité + personnalité visuelle, onboarding plus doux.

### Direction C – "Marketplace"  
Très commerciale, bonne conversion mais moins spécialisée collection.

### Décision
**Direction B** retenue pour maximiser adoption grand public sans pénaliser les usages avancés.

## 8) User journeys

### Journey 1 – Trouver le meilleur prix d'achat
- Entrée via recherche carte.
- Filtre état "Near Mint" + langue FR.
- Tri par coût total.
- Ouverture de l'offre la plus pertinente.

### Journey 2 – Suivre une carte cible
- Ajout carte à la watchlist.
- Définition seuil de prix.
- Notification quand condition atteinte.

### Journey 3 – Vérifier une opportunité en mobilité
- Recherche rapide mobile.
- Lecture des 3 meilleures offres.
- Sauvegarde pour analyse détaillée plus tard.

## 9) Stratégie composants

### Composants de base
- Boutons, champs, tags, badges d'état, chips de filtre.

### Composants métier
- **CardIdentityBlock** (set, numéro, langue, état, gradation)
- **PriceSourceCard** (vendeur, prix, frais, timestamp, fiabilité)
- **PriceTrendSparkline** (évolution courte)
- **WatchlistItem** (objectif + seuil + statut)

### Priorisation MVP
1. Recherche + résultats comparables
2. Filtres avancés
3. Watchlist + alertes simples
4. Tendances prix enrichies

## 10) UX patterns de cohérence

### Recherche & sélection
- Auto-complétion standardisée.
- États vide/chargement/erreur harmonisés.

### Filtres
- Filtres actifs toujours visibles.
- Bouton "réinitialiser" global + reset par filtre.

### Feedback
- Toasts non bloquants pour actions réussies.
- Messages d'erreur actionnables (quoi faire ensuite).

## 11) Responsive + accessibilité

### Responsive
- **Mobile** : focus recherche + top 3 offres.
- **Tablet** : comparaison simplifiée.
- **Desktop** : densité complète + multi-colonnes.

### Accessibilité
- Contrastes WCAG AA minimum.
- Navigation clavier complète.
- Libellés explicites pour lecteurs d'écran.
- Ne jamais communiquer l'état par la couleur seule.

### Localisation
- Formats prix adaptés (CHF/EUR).
- Terminologie FR cohérente (état, gradation, extension).

## 12) Risques UX et mitigations

- **Risque :** Données incomplètes selon source.  
  **Mitigation :** Badge de complétude + filtre "sources fiables uniquement".
- **Risque :** Ambiguïté de cartes homonymes.  
  **Mitigation :** Identifiants visuels et techniques obligatoires.
- **Risque :** Surcharge d'info sur mobile.  
  **Mitigation :** Vue résumé, détails à la demande.

## 13) Plan de validation UX

- Test modéré sur 5 à 8 utilisateurs cibles (profils mixtes).
- Scénarios: retrouver une carte, comparer, configurer une alerte.
- Métriques: taux de réussite, temps de décision, confiance déclarée.
- Itération rapide sur friction majeure avant développement complet.

## 14) Synthèse finale

Cette spécification UX établit une base claire pour implémenter un comparateur de prix Pokémon TCG centré utilisateur, transparent sur les données et adapté à des usages collectionneurs réels. Elle est prête à alimenter les wireframes, l'architecture technique et la découpe en epics.
