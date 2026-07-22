# DESIGN.md — Poke-Radar Design System

> Généré le 2026-07-22 à partir des 13 décisions de design validées avec Loris.

## 1. Design Tokens

### 1.1 Couleurs — Thème Dark « Amber Warmth »

| Token | Hex | Usage |
|-------|-----|-------|
| `color.bg.app` | `#0B1020` | Fond d'écran principal |
| `color.bg.surface` | `#131A2E` | Cartes, panneaux, surfaces surélevées |
| `color.bg.surface-alt` | `#10182D` | Surfaces secondaires (aperçu, carte profil) |
| `color.bg.input` | `#0E1529` | Champs de saisie |
| `color.bg.button-secondary` | `#1B2542` | Boutons secondaires |
| `color.bg.glow` | `radial-gradient(circle at top right, #202A50, #0B1020 38rem)` | Fond avec glow directionnel |
| `color.text.primary` | `#F5F7FF` | Texte principal |
| `color.text.secondary` | `#A8B0CC` | Texte secondaire, labels |
| `color.text.tertiary` | `#CBD2EB` | Texte tertiaire, champs |
| `color.text.accent` | `#95A5FF` | Eyebrows, accents texte |
| `color.border.default` | `#2A345A` / `#303B63` | Bordures standards |
| `color.border.input` | `#3B4773` | Bordures de champs |
| `color.border.button-secondary` | `#48578B` | Bordures boutons secondaires |
| `color.border.dashed` | `#39446E` | Bordures pointillées (états vides) |
| `color.border.pill` | `#34406A` | Bordures status-pill |
| `color.focus` | `#8FA0FF` | Anneau de focus |
| `color.signal.success` | `#35D07F` | Succès |
| `color.signal.warning` | `#FF9F1C` / `#FFC857` | Avertissements |
| `color.signal.critical` | `#FF4D6D` | Erreurs, critiques |
| `color.signal.info` | `#7B8CDE` | Information |
| `color.button.primary` | `#8FA0FF` | Bouton principal |
| `color.button.primary-text` | `#09101D` | Texte sur bouton principal |
| `color.bg.feedback-hint` | `#202943` | Fond feedback info |
| `color.bg.feedback-error` | `#5B2030` | Fond feedback erreur |
| `color.bg.feedback-success` | `#15452F` | Fond feedback succès |
| `color.bg.feedback-warning` | `#483A15` | Fond feedback warning |
| `color.text.feedback-hint` | `#D4DAF1` | Texte feedback info |
| `color.text.feedback-error` | `#FFD7DF` | Texte feedback erreur |
| `color.text.feedback-success` | `#D7FFEA` / `#BAFFD7` | Texte feedback succès |
| `color.text.feedback-warning` | `#FFF0BD` | Texte feedback warning |
| `color.badge.active` | fond `#164B34` / texte `#BAFFD7` | Badge actif |
| `color.source.ok` | `#35D07F` | Source active OK |
| `color.source.degraded` | `#FF9F1C` | Source dégradée |
| `color.source.blocked` | `#FF4D6D` | Source bloquée |
| `color.source.manual` | `#7B8CDE` | Saisie manuelle |

### 1.2 Typographie

- **Famille** : Inter (UI) → fallback système sans-serif (`ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI"`)
- **Alignement tabulaire** : activé pour toutes les colonnes de chiffres (prix, marges, ROI)

| Token | Taille | Line-height | Poids | Usage |
|-------|--------|-------------|-------|-------|
| `font.size.eyebrow` | `0.75rem` (12px) | 1.0 | 800 | Labels de section uppercase |
| `font.size.body` | `0.88rem` (14px) | 1.5 | 400 | Texte courant |
| `font.size.field-label` | `0.88rem` (14px) | 1.0 | 700 | Labels de champs |
| `font.size.badge` | `0.72rem` (11.5px) | 1.0 | 800 | Badges, tags |
| `font.size.h2` | `clamp(1.25rem, 5vw, 1.6rem)` | 1.05 | variable | Titres de section |
| `font.size.h1` | `clamp(1.75rem, 8vw, 2.75rem)` | 1.05 | variable | Titre de page |

### 1.3 Espacement — Grille 8px

| Token | Valeur | Usage |
|-------|--------|-------|
| `space.4` | 4px | Micro-gaps internes |
| `space.8` | 8px | Gap entre label et input |
| `space.10` | 10px | Gap mode-picker |
| `space.12` | 12px | Gap interne listes |
| `space.16` | 16px | Gap grille dashboard, padding standard |
| `space.20` | 20px | Gap section |
| `space.22` | 22px | Gap dashboard large |
| `space.24` | 24px | Padding panneau desktop |
| `space.28` | 28px | Marge basse configurateur |
| `space.36` | 36px | Padding shell large |
| `space.48` | 48px | Padding bas shell |

### 1.4 Rayons de bordure

| Token | Valeur | Usage |
|-------|--------|-------|
| `radius.sm` | `8px` | Feedback, badges inline |
| `radius.md` | `10px` | Inputs, feedback |
| `radius.lg` | `11-12px` | Boutons, cartes |
| `radius.xl` | `18px` | Panneaux |
| `radius.full` | `999px` | Pills, badges circulaires |

### 1.5 Ombres

| Token | Valeur | Usage |
|-------|--------|-------|
| `shadow.panel` | `0 18px 50px rgba(0,0,0,.2)` | Panneaux sur fond sombre |

### 1.6 Animations

- **Durée standard** : 150–200ms (transitions UI)
- **Easing** : `ease` par défaut
- **Pulse notification** : pulse léger sur nouvelle alerte prioritaire
- **Swipe** : animation de sortie latérale + undo toast 3s
- **Collapse/expand** : transition de hauteur des sections pilables
- **Respecte** `prefers-reduced-motion: reduce` → désactive toutes les transitions

## 2. Breakpoints Responsive

| Breakpoint | Plage | Layout |
|------------|-------|--------|
| Mobile | `320px – 639px` | Empilé, navigation sans débordement horizontal, cibles tactiles 44px min |
| Tablet | `640px – 959px` | Header en ligne, grille formulaire 2 colonnes |
| Desktop | `≥ 960px` | Dashboard 2 colonnes (1.45fr / 0.75fr) |
| Large | `≥ 1280px` | Densité expert activable |

La mise en page suit une fondation **mobile-first** puis augmente progressivement sa densité.

## 3. Composants Réutilisables

### 3.1 SignalBadge / ConfidenceBadge

Badges d'état à trois niveaux :
- **Haute** → fond `#164B34`, texte `#BAFFD7`, icône ★★★
- **Moyenne** → fond `#483A15`, texte `#FFF0BD`, icône ★★☆
- **Basse** → fond `#5B2030`, texte `#FFD7DF`, icône ★☆☆

Format : `padding: 4px 8px; border-radius: 999px; font-size: 0.72rem; font-weight: 800; text-transform: uppercase`

### 3.2 StatusPill

Pillule de statut global en haut de page :
```
padding: 9px 12px; border: 1px solid #34406A; border-radius: 999px;
color: #CBD2EB; background: rgba(19,26,46,.85); font-size: 0.82rem
```

### 3.3 Panel

Conteneur de contenu standard :
```
padding: 20px 16px (mobile) / 24px (≥640px);
border: 1px solid #2A345A; border-radius: 18px;
background: rgba(19,26,46,.96); box-shadow: 0 18px 50px rgba(0,0,0,.2)
```

### 3.4 Card (OpportunityCard, SourceCard, ProfileCard)

Variante surface :
```
padding: 14px; border: 1px solid #303B63; border-radius: 12px; background: #10182D
```

### 3.5 Toast / Snackbar

- Position : bas de l'écran, centré
- Fond : `#131A2E` avec bordure `#303B63`
- Durée : 3s (undo) ou 4s (confirmation)
- Animation : slide-up + fade-in
- Action : bouton "Annuler" intégré pour les actions réversibles

### 3.6 Button

Deux variantes :
- **Primary** : fond `#8FA0FF`, texte `#09101D`, bordure transparente
- **Secondary** : fond `#1B2542`, texte `#F5F7FF`, bordure `#48578B`

Spécifications : `min-height: 48px; padding: 11px 16px; border-radius: 11px; font-weight: 800`
Desktop : `min-width: 220px; width: auto` (pas pleine largeur)

### 3.7 FormField

```
display: grid; gap: 8px; color: #CBD2EB; font-size: 0.88rem; font-weight: 700
```
Input/select : `min-height: 48px; padding: 11px 12px; border: 1px solid #3B4773; border-radius: 10px`

### 3.8 Feedback (info/success/error/warning)

```
margin: 12px 0 0; padding: 11px 12px; border-radius: 10px
```

### 3.9 EmptyState

```
padding: 20px 14px; border: 1px dashed #39446E; border-radius: 12px;
color: #A8B0CC; text-align: center
```

### 3.10 BottomSheet

Pour sélecteurs contextuels (ajout source, sélection filtre) :
- Fond : `#131A2E`
- Border-radius top : `18px`
- Drag handle visible
- Backdrop : `rgba(0,0,0,.5)` avec fermeture au tap

### 3.11 Section Pliable (Collapsible)

- Header avec icône ▼/▶ en rotation 180°
- Contenu avec transition de hauteur
- Bordure subtile entre sections

## 4. Écrans

### 4.1 Écran Radar (principal)

**Layout mobile** :
```
┌─────────────────────────────────┐
│ 🔍 Radar          ⚙️ ⚡ (3 act.)│
│                                 │
│ [Filtres rapides : champs]      │
│ Tous | Critiques | Suivis       │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ ★★★ Dracaufeu VMAX   +37,55€│ │
│ │ Cardmarket · Mint FR · 2min │ │
│ │ Achat 89€ → Revente 135€    │ │
│ │ Marge nette 38,5% · ROI ⬆️  │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ ★★☆ Mewtwo EX        +22,10€│ │
│ │ eBay · NM EN · 8min         │ │
│ │ ...                         │ │
│ └─────────────────────────────┘ │
│          ... (scroll infini)     │
└─────────────────────────────────┘
```

**Comportements** :
- Scroll infini avec chargement par lot de 20
- Pull-to-refresh
- Swipe gauche → Ignorer, swipe droite → Traiter
- Tap → navigation vers écran Détail
- Long press → menu contextuel (Traiter / Ignorer / Suivre)
- Barre de recherche avec filtrage en temps réel
- Filtres persistants en session

### 4.2 Écran Détail

**Layout mobile** :
```
┌──────────────────────────────────┐
│ ← Radar          Dracaufeu VMAX │
│                                  │
│  ┌────────────────────────────┐  │
│  │    [Illustration carte]    │  │
│  │     Dracaufeu VMAX         │  │
│  │     Épée et Bouclier       │  │
│  │     ★★★  Confiance haute   │  │
│  └────────────────────────────┘  │
│                                  │
│  ▼ Décomposition de la marge    │
│  ┌────────────────────────────┐  │
│  │ Prix d'achat        89,00€ │  │
│  │ Frais de port       +3,50€ │  │
│  │ Commission plateforme +4,45│  │
│  │ Frais transaction   +0,50€ │  │
│  │ ─────────────────────────  │  │
│  │ Coût total          97,45€ │  │
│  │ Prix de revente    135,00€ │  │
│  │ ─────────────────────────  │  │
│  │ Marge nette         37,55€ │  │
│  │ Marge brute         46,00€ │  │
│  │ ROI net               38,5%│  │
│  └────────────────────────────┘  │
│                                  │
│  ▼ Source                       │
│  ┌────────────────────────────┐  │
│  │ 🟢 Cardmarket · 22/07/26  │  │
│  │ Vendeur: ProSeller (98%)  │  │
│  │ État: Mint · Langue: FR   │  │
│  │                            │  │
│  │ [↗️ Ouvrir la source]      │  │
│  └────────────────────────────┘  │
│                                  │
│  ▼ Historique                   │
│  ┌────────────────────────────┐  │
│  │ ▁▂▃▂▁▄▅▆ (sparkline prix) │  │
│  │ Min: 82€ · Max: 140€      │  │
│  │ Vu la 1ʳᵉ fois: 15/07/26  │  │
│  └────────────────────────────┘  │
│                                  │
│  ┌──────────┐  ┌──────────────┐  │
│  │ ✅ Traité │  │  ❌ Ignorer  │  │
│  └──────────┘  └──────────────┘  │
└──────────────────────────────────┘
```

**Comportements** :
- Swipe gauche → ❌ Ignorer (animation + undo toast 3s)
- Swipe droite → ✅ Traité (animation + disparition)
- Tap "Ouvrir la source" → nouvel onglet navigateur
- Sections pilables (Décomposition, Source, Historique)
- Sparkline de prix interactive (tooltip au survol desktop, tap mobile)
- Back button en haut à gauche (navigation native)

### 4.3 Écran Stratégie & Réglages

**Layout mobile** :
```
┌──────────────────────────────────┐
│ ⚙️ Réglages                      │
│                                  │
│  ▼ Stratégie de trading          │
│  ┌────────────────────────────┐  │
│  │ Profil actif: [Standard ▼] │  │
│  │                             │  │
│  │ Seuil marge nette min:     │  │
│  │ [═══════●══════] 15,00€    │  │
│  │                             │  │
│  │ ROI minimum:               │  │
│  │ [════════●═════] 25%        │  │
│  │                             │  │
│  │ Niveau de confiance min:   │  │
│  │ [═══●══════════] ★★☆       │  │
│  │                             │  │
│  │ Risque maximum:            │  │
│  │ [══════════●══] Modéré     │  │
│  └────────────────────────────┘  │
│                                  │
│  ▼ Produits suivis           (3) │
│  ┌────────────────────────────┐  │
│  │ Dracaufeu VMAX · E&S       │  │
│  │ Mewtwo EX · XY             │  │
│  │ Rayquaza V · E&S           │  │
│  │ [+ Ajouter un produit]     │  │
│  └────────────────────────────┘  │
│                                  │
│  ▼ Notifications                │
│  ┌────────────────────────────┐  │
│  │ Telegram    [🟢 Activé  ▼]│  │
│  │ Push mobile [🔴 Désactivé] │  │
│  │ Email       [🔴 Désactivé] │  │
│  └────────────────────────────┘  │
│                                  │
│  ▼ Référentiels                 │
│  ┌────────────────────────────┐  │
│  │ Sets: 4 · Séries: 12       │  │
│  │ Produits: 156              │  │
│  │ [📥 Importer] [🔄 Sync]    │  │
│  └────────────────────────────┘  │
└──────────────────────────────────┘
```

**Comportements** :
- Sliders tactiles avec valeur numérique affichée
- Sélecteurs de profil (Standard / Agressif / Conservateur / Perso)
- Toggle switches pour les notifications
- FAB pour ajouter un produit

### 4.4 Écran Sources

**Layout mobile** :
```
┌──────────────────────────────────┐
│ 📡 Sources                       │
│                                  │
│  ▼ Sources actives          (3)  │
│  ┌────────────────────────────┐  │
│  │ 🟢 Cardmarket              │  │
│  │ Dernier scan: il y a 2 min │  │
│  │ 147 opportunités trouvées  │  │
│  │ ↳ 12 cartes suivies        │  │
│  │ [⋯ Paramètres]  [🔄 Scan]  │  │
│  └────────────────────────────┘  │
│  ┌────────────────────────────┐  │
│  │ 🟡 eBay France             │  │
│  │ Dernier scan: il y a 8 min │  │
│  │ 43 opportunités trouvées   │  │
│  │ ↳ 8 cartes suivies         │  │
│  │ Rate limit: 85% utilisé    │  │
│  │ [⋯ Paramètres]  [🔄 Scan]  │  │
│  └────────────────────────────┘  │
│  ┌────────────────────────────┐  │
│  │ 🔵 Saisie manuelle         │  │
│  │ 3 entrées · Toujours actif │  │
│  │ [+ Ajouter une entrée]     │  │
│  └────────────────────────────┘  │
│                                  │
│  ▼ Sources en pause         (1)  │
│  ┌────────────────────────────┐  │
│  │ 🔴 Vinted                  │  │
│  │ Bloqué: CAPTCHA            │  │
│  │ Dernier succès: 18/07/26   │  │
│  │ [▶️ Réactiver] [🗑️ Retirer]│  │
│  └────────────────────────────┘  │
│                                  │
│  [+ Ajouter une source]          │
└──────────────────────────────────┘
```

**Comportements** :
- Tap ⋯ Paramètres → mini-fiche avec seuils spécifiques à cette source
- Tap 🔄 Scan → lance un scan manuel (spinner, puis MAJ statut)
- Tap "Ajouter une source" → bottom sheet avec les connecteurs disponibles
- Long press sur une source → menu contextuel (Pause / Retirer / Dupliquer config)
- État visuel automatique : 🟢 OK → 🟡 Dégradé → 🔴 Bloqué basé sur le dernier succès

## 5. Icônes

Système d'icônes léger (SVG inline ou sprite) :

| Icône | Usage |
|-------|-------|
| ★★★ / ★★☆ / ★☆☆ | Niveaux de confiance |
| 🟢 / 🟡 / 🔴 / 🔵 | État des sources |
| ← | Navigation retour |
| ↗️ | Lien externe (ouvrir source) |
| ⋯ | Menu contextuel (paramètres source) |
| 🔄 | Scan / synchronisation |
| ▶️ | Réactiver |
| 🗑️ | Retirer |
| ⬆️ / ⬇️ | Tendance prix |
| ▼ / ▶ | Sections pilables |
| ✅ | Traité / confirmé |
| ❌ | Ignorer / rejeter |
| ⚙️ | Réglages |
| ⚡ | Alertes actives |
| 🔍 | Recherche |
| 📡 | Sources |
| 📥 | Importer |
| + | Ajouter |

## 6. États des Composants

Chaque composant interactif doit gérer ces états :

| État | Comportement |
|------|-------------|
| **default** | Rendu standard |
| **hover** (desktop) | Surbrillance légère (pas sur mobile) |
| **focus-visible** | Anneau `3px solid #8FA0FF`, offset 2px |
| **active** | Feedback tactile (opacité ou scale) |
| **disabled** | `opacity: 0.48; cursor: not-allowed` |
| **loading** | Skeleton ou spinner dans le composant |
| **error** | Bordure rouge + message feedback |
| **success** | Badge vert + confirmation |

## 7. Accessibilité

- ✅ Contraste AA minimum sur tout le texte
- ✅ KPI critiques (marge, ROI) ciblent AAA
- ✅ Focus clavier visible sur tout élément interactif
- ✅ Zone cliquable minimum 44×44px (mobile)
- ✅ Labels explicites pour icônes et badges (aria-label)
- ✅ Navigation complète au clavier (Tab, Enter, Escape, flèches)
- ✅ Support `prefers-reduced-motion: reduce`
- ✅ Vérification contraste automatisable en CI
- ✅ HTML sémantique (landmarks, headings hiérarchiques)

## 8. Format des Données

- **Monnaie** : `XX,XX €` (virgule, espace fine, symbole)
- **Dates** : `JJ/MM/AA` (français)
- **Pourcentages** : `XX,X %` (virgule, espace fine)
- **Temps relatifs** : « il y a X min », « il y a X h », « il y a X j »
- **Alignement tabulaire** : activé sur les colonnes de chiffres
- **Architecture i18n** : prête pour extension future (français par défaut)

## 9. Implémentation Actuelle

### Composants existants

- `ProductConfigurator.tsx` — configurateur produit avec picker
- `StrategyForm.tsx` — formulaire de stratégie (seuils, notifications)

### Pages existantes

- `BootPage.tsx` — page de démarrage
- `StrategyPage.tsx` — page stratégie & réglages

### Fichier de styles

- `styles.css` — tokens implémentés (variables CSS, composants, responsive, reduced-motion)

### Prochaines étapes d'implémentation

1. Composants partagés : `Badge`, `Button`, `Card`, `Feedback`, `EmptyState`, `BottomSheet`, `Toast`
2. Pages : `RadarPage`, `DetailPage`, `SourcesPage`
3. Hooks : `useInfiniteScroll`, `useSwipe`, `useCollapsible`
4. Routing : navigation entre les 4 écrans
