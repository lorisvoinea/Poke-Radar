# EXPERIENCE.md — Poke-Radar User Experience

> Généré le 2026-07-22 à partir des 13 décisions UX validées avec Loris.

## 1. Promesse d'Expérience

> « Recevoir moins de bruit, plus de décisions exploitables. »

Poke-Radar transforme une veille marché lourde en décisions d'achat **rapides, fiables et traçables**. L'objectif UX est de permettre à un revendeur de passer d'un signal à une décision en **moins de 5 minutes**.

## 2. Personas

### Alex — Revendeur indépendant (primaire)
- Besoin d'aller vite avec risque contrôlé
- Veut une vue triée par opportunité nette
- Passe 2–4h/jour sur l'outil, en continu

### Sam — Flipper premium (primaire)
- Préfère peu d'alertes mais à forte conviction
- Exige des filtres fins (marge, risque, fraîcheur)
- Utilisation ponctuelle mais intensive (30 min/session)

### Opérateur logistique (secondaire)
- Exécute des actions simples sur consignes claires
- N'a pas besoin de voir la décomposition financière complète

## 3. Émotions Cibles

| Émotion | Comment on l'obtient |
|---------|---------------------|
| **Confiance** | Chaque chiffre clé est justifié et décomposable |
| **Contrôle** | L'utilisateur règle ses seuils, priorités et niveau de risque |
| **Calme opérationnel** | Hiérarchie claire, pas de surcharge visuelle, densité maîtrisée |
| **Momentum** | Perception de progression via stats et revue des décisions |

Émotions à **éviter** :
- Anxiété (trop de rouge, trop d'alertes)
- Confusion (chiffres sans explication)
- Impuissance (source bloquée sans alternative)

## 4. Boucle Produit Principale

```
┌──────────┐    ┌──────────┐    ┌──────────┐
│ COLLECTE │───▶│ ANALYSE  │───▶│ NOTIFIER │
│ sources  │    │ scoring  │    │ si seuil │
└──────────┘    └──────────┘    └──────────┘
                                      │
                                      ▼
┌──────────┐    ┌──────────┐    ┌──────────┐
│CALIBRER │◀───│ ARCHIVER │◀───│ DÉCIDER  │
│hebdo     │    │ stats    │    │ agir/ign │
└──────────┘    └──────────┘    └──────────┘
```

1. **Collecte** — Scan automatique des disponibilités/prix sur sources activées
2. **Analyse** — Normalisation + calcul marge nette + scoring configurable
3. **Notification** — Alerte si seuil atteint (Telegram, in-app)
4. **Décision** — Agir / Ignorer / Suivre
5. **Archive** — Historisation pour calibration
6. **Calibration** — Ajustement hebdomadaire des seuils et poids

## 5. Parcours Utilisateurs

### Journey 1 — Signal prioritaire vers décision

**Objectif :** passer d'une alerte Telegram à une décision en < 5 minutes.

```
Telegram ──▶ Ouvrir Radar ──▶ Vérifier marge ──▶ Ouvrir détail
                                                 │
                                                 ▼
         ◀── Marquer statut ◀── DÉCIDER ◀── Ouvrir source
```

**Étapes détaillées :**

1. **Notification Telegram** — « Dracaufeu VMAX : marge nette 37,55 € (ROI 38,5 %) »
2. **Ouverture Radar** — Filtre automatique sur alertes critiques, carte en haut
3. **Vérification rapide** — Coup d'œil sur marge nette, confiance, fraîcheur dans la row
4. **Ouverture détail** — Décomposition complète (frais, historique prix)
5. **Ouverture source** — Lien externe vers l'annonce
6. **Décision** — Swipe droite ✅ Traité ou swipe gauche ❌ Ignorer
7. **Marquage** — Statut mis à jour, disparition de la file active

**Critère UX :** décision en moins de 5 minutes.

**Points de friction anticipés :**
- Si la source est lente à charger → loader avec temps estimé
- Si le scoring semble aberrant → badge « estimé » visible + transparence calcul
- Si l'utilisateur hésite → possibilité de « Suivre » (ni traité ni ignoré, suivi passif)

### Journey 2 — Recalibrage hebdomadaire

**Objectif :** ajuster sa stratégie en 10 minutes max.

```
Stats semaine ──▶ Analyser manqués ──▶ Ajuster seuils ──▶ Sauver preset
```

**Étapes détaillées :**

1. **Consultation stats** — Nombre d'opportunités vues / traitées / ignorées / manquées
2. **Analyse faux positifs** — Pourquoi certaines alertes n'étaient pas pertinentes ?
3. **Analyse opportunités manquées** — Trop de filtres ? Seuil trop haut ?
4. **Ajustement seuils** — Modification marge min, ROI min, confiance min
5. **Ajustement poids** — Rééquilibrage scoring (rentabilité vs urgence vs confiance)
6. **Sauvegarde** — Preset nommé (« Q3 2026 Standard », « Agressif Noël »)

**Critère UX :** session complète < 10 minutes.

### Journey 3 — Source indisponible (mode dégradé)

**Objectif :** ne jamais bloquer le flux décisionnel.

```
Source down ──▶ Alerte visuelle ──▶ Fallback proposé ──▶ Continuer
                   │
                   ▼
              Reprise auto ◀── Source rétablie
```

**Étapes détaillées :**

1. **Détection automatique** — La source passe 🟢 → 🟡 → 🔴
2. **Alerte visuelle** — Badge dans l'écran Sources + compteur d'opportunités gelé
3. **Fallback proposé** — Saisie manuelle activable en 1 tap
4. **Continuité** — Les opportunités déjà collectées restent consultables
5. **Reprise automatique** — Dès que la source répond, retour 🟢 + notification

**Critère UX :** aucun blocage complet du flux décisionnel.

### Journey 4 — Saisie manuelle d'opportunité

**Objectif :** injecter une opportunité en moins de 2 minutes.

```
Ajouter entrée ──▶ Produit ──▶ Prix achat ──▶ Frais ──▶ Estimation revente ──▶ Enregistrer
```

**Étapes détaillées :**

1. **Tap « + Ajouter une entrée »** dans Sources → Saisie manuelle
2. **Choix produit** — Autocomplétion depuis les référentiels (sets, séries, cartes)
3. **Saisie prix d'achat** — Champ numérique avec devise
4. **Saisie frais** — Port, commission, frais transaction (pré-remplis depuis stratégie)
5. **Estimation revente** — Manuelle ou suggérée depuis historique
6. **Enregistrement** — Apparaît dans le Radar avec badge « Manuel »

## 6. Micro-Interactions

| Interaction | Timing | Description |
|-------------|--------|-------------|
| Pulse alerte prioritaire | boucle 1.5s × 3 | Pulse léger sur nouvelle opportunité critique |
| Transition navigation | 150ms | Transition entre écrans |
| Swipe decision | 200ms | Animation de sortie latérale |
| Undo toast | entrée 150ms / visible 3s | Toast réversible après swipe |
| Collapse section | 200ms ease | Pliage/dépliage section |
| Pull-to-refresh | immédiat | Tirette avec spinner |
| Skeleton loading | permanent | Placeholder pendant chargement |
| Bottom sheet | 250ms slide-up | Apparition modale contextuelle |
| Hover row (desktop) | 100ms | Surbrillance fond au survol |
| Focus ring | immédiat | Anneau 3px #8FA0FF sur élément focus |

## 7. Rédactionnel UX

### Principes

- **Orienté décision** — Verbes d'action, pas de jargon
- **Toujours justifier** — Répondre à « Pourquoi cette alerte ? »
- **Incertitude explicite** — Badge « estimé » vs « confirmé »
- **Français par défaut** — Cohérent FR (dates, nombres, monnaie)

### Exemples de micro-copie

| Contexte | Texte |
|----------|-------|
| État source OK | « Dernier scan : il y a 2 min » |
| État source dégradé | « Rate limit : 85 % utilisé — prochain scan dans 12 min » |
| État source bloqué | « Bloqué : CAPTCHA — dernière connexion réussie le 18/07 » |
| Aucun produit suivi | « Aucun produit suivi. Ajoutez une carte ou un set pour commencer à recevoir des alertes. » |
| Aucune opportunité | « Aucune opportunité pour le moment. Vos sources sont actives — une alerte apparaîtra dès qu'un seuil sera franchi. » |
| Confiance haute | « Confiance haute — prix vérifié sur 3 sources » |
| Confiance basse | « Confiance basse — prix estimé à partir d'une seule source » |
| Marge nette | « Marge nette : après déduction de tous les frais (port, commission, transaction) » |
| Undo ignore | « Opportunité ignorée · [Annuler] » |

## 8. Gestion des Erreurs

### Erreurs source

| Situation | Affichage |
|-----------|-----------|
| Timeout | « Cardmarket ne répond pas — nouvelle tentative dans 5 min » |
| Rate limit | « Limite atteinte (500/500 appels) — réinitialisation à 14:00 » |
| CAPTCHA | « Connexion bloquée par CAPTCHA — intervention manuelle nécessaire » |
| Parse error | « Format de donnée inattendu — l'équipe est notifiée » |

### Erreurs utilisateur

| Situation | Affichage |
|-----------|-----------|
| Produit introuvable | « Aucun produit ne correspond à votre recherche. Vérifiez l'orthographe ou ajoutez-le manuellement. » |
| Seuil incohérent | « Le ROI minimum ne peut pas dépasser le ROI maximum. » |
| Champ requis vide | « Le prix d'achat est requis pour calculer la marge. » |

### Principes de résilience

- Toute erreur source doit proposer une **action suivante** (réessayer, ignorer, fallback manuel)
- Les données déjà chargées restent **consultables** même si la source tombe
- Aucune **modale bloquante** — préférer un bandeau d'erreur in-line
- Les erreurs réseau sont **retentées automatiquement** avec backoff exponentiel

## 9. États Vides

Chaque écran a un état vide conçu :

| Écran | État vide |
|-------|-----------|
| **Radar** | « Aucune opportunité pour le moment. Vos sources sont actives — une alerte apparaîtra dès qu'un seuil sera franchi. » + illustration calme |
| **Détail** | N/A (on n'arrive jamais sur un détail vide) |
| **Stratégie** (produits) | « Aucun produit suivi. Ajoutez une carte ou un set pour commencer à recevoir des alertes. » + bouton CTA |
| **Stratégie** (profils) | « Aucun profil enregistré. Créez votre première stratégie de trading. » |
| **Sources** | « Aucune source configurée. Ajoutez Cardmarket, eBay ou saisissez vos opportunités manuellement. » + CTA |
| **Sources** (saisie manuelle) | « Aucune entrée manuelle. Utile quand une source est indisponible ou pour noter une trouvaille. » |

## 10. Gestes et Raccourcis

### Gestes mobiles

| Geste | Contexte | Action |
|-------|----------|--------|
| Swipe droite | Ligne opportunité | ✅ Traiter |
| Swipe gauche | Ligne opportunité | ❌ Ignorer (avec undo) |
| Pull down | Liste opportunités | Rafraîchir |
| Long press | Ligne opportunité | Menu contextuel |
| Long press | Source | Menu contextuel (Pause/Retirer/Dupliquer) |
| Tap | Carte opportunité | Ouvrir détail |
| Tap | Section header ▼ | Pliage/dépliage |

### Raccourcis desktop

| Raccourci | Action |
|-----------|--------|
| `→` / `j` | Naviguer opportunité suivante |
| `←` / `k` | Naviguer opportunité précédente |
| `Enter` | Ouvrir détail |
| `d` | Marquer traité |
| `i` | Ignorer |
| `o` | Ouvrir la source dans un nouvel onglet |
| `s` | Suivre (watch) |
| `f` | Focus barre de recherche |
| `Esc` | Fermer détail / bottom sheet |
| `1-4` | Navigation écrans (Radar, Détail, Stratégie, Sources) |

## 11. Notifications

### Canaux

| Canal | Usage | Configuration |
|-------|-------|---------------|
| **Telegram** | Alertes critiques uniquement (seuil dépassé) | Bot token + chat ID |
| **In-app** | Toutes les alertes, pull-to-refresh | Automatique |
| **Push mobile** | Réservé futur (PWA ou app native) | Désactivé par défaut |

### Format notification Telegram

```
🔔 Poke-Radar — Nouvelle opportunité

Dracaufeu VMAX — Épée et Bouclier
⭐ Confiance haute

Achat : 89,00 € (Cardmarket)
Revente estimée : 135,00 €
Marge nette : 37,55 € (ROI 38,5 %)

[Voir dans le Radar →]
```

## 12. UX North-Star Metrics

| Métrique | Cible | Mesure |
|----------|-------|--------|
| **Decision-ready rate** | > 60 % | % d'opportunités avec assez de données pour décider |
| **Signal → décision** | < 5 min | Temps médian entre notif et action |
| **Signal → notification** | < 60 sec | Latence technique collecte → alerte |
| **Source uptime** | > 95 % | % du temps où les sources répondent |
| **Faux positifs** | < 20 % | % d'opportunités ignorées après vérification |
| **Recalibrage** | < 10 min/session | Temps médian d'une session d'ajustement |

## 13. Tests UX Recommandés

### Tests de parcours

1. **Test Journey 1** — Envoyer 5 alertes simulées, mesurer temps jusqu'à décision
2. **Test Journey 2** — Fournir un historique d'une semaine, demander recalibrage
3. **Test Journey 3** — Simuler panne Cardmarket, vérifier fallback et reprise

### Tests d'accessibilité

- Navigation clavier complète sur les 4 écrans
- Contraste AA minimum vérifié (AAA sur KPI)
- Labels aria sur badges et icônes
- `prefers-reduced-motion` respecté

### Tests de responsive

- Mobile 320px : tout le contenu accessible sans scroll horizontal
- Tablet 768px : layout 2 colonnes fonctionnel
- Desktop 1280px : densité expert, navigation clavier

## 14. État Actuel

### Pages implémentées
- ✅ `BootPage` — démarrage
- ✅ `StrategyPage` — stratégie & réglages (partiel)

### Pages à implémenter
- ❌ `RadarPage` — tableau principal des opportunités
- ❌ `DetailPage` — fiche détaillée d'une opportunité
- ❌ `SourcesPage` — gestion des connecteurs

### Composants partagés à créer
- ❌ `OpportunityRow` / `OpportunityCard`
- ❌ `SignalBadge` / `ConfidenceBadge`
- ❌ `MarginBreakdown`
- ❌ `SourceCard` / `SourceHealthPanel`
- ❌ `Toast` / `Snackbar`
- ❌ `BottomSheet`
- ❌ `CollapsibleSection`
- ❌ `Sparkline`
- ❌ `EmptyState`
