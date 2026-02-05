---
stepsCompleted: [1, 2, 3, 4, 5]
inputDocuments: []
workflowType: 'research'
lastStep: 1
research_type: 'domain'
research_topic: 'TCG cartes Pokémon - collection, cotes, marché achat/revente, prix par magasin (Suisse/France puis monde)'
research_goals: '(1) Collection, cotes, marché achat/revente ; (2) Une app pour lister les prix de chaque carte dans tous les magasins (Suisse/France, puis monde) ; (3) Focus sur les prix des cartes.'
user_name: 'Loris'
date: '2025-02-05'
web_research_enabled: true
source_verification: true
---

# TCG cartes Pokémon – Recherche domaine : marché, prix et app de comparaison

**Date :** 2025-02-05  
**Auteur :** Loris  
**Type :** Recherche domaine

---

## Executive Summary

Le marché des cartes Pokémon TCG et du trading cards au sens large connaît une croissance soutenue (CAGR 7,9 % à 13 % selon les périmètres), avec une valorisation comprise entre 13 et 21,4 Md USD en 2024 et des projections jusqu’à 58 Md USD d’ici 2034. Les cartes Pokémon pèsent environ 30 % du volume et dominent le segment TCG en cartes gradées. L’agrégation des prix est déjà assurée par des marketplaces (Cardmarket en Europe, TCGPlayer aux USA, eBay) et par des APIs tierces ; en revanche, **l’agrégation des prix par magasin (détaillants) en Suisse et en France reste un créneau peu couvert**, aligné avec l’objectif d’une app dédiée. Les exigences réglementaires (RGPD, nLPD en Suisse depuis septembre 2023, respect des CGU et du droit des bases de données en cas de collecte de prix) et techniques (APIs, partenariats détaillants, optionnellement scan IA) sont identifiées et peuvent être intégrées dès le MVP.

**Principaux constats :**

- **Marché :** TCG 6,6–7,8 Md USD, forte part Pokémon ; grading et marketplaces structurés ; demande forte pour des outils de comparaison et de cote.
- **Réglementation :** Conformité RGPD et nLPD obligatoire pour une app France/Suisse ; privilégier APIs et partenariats plutôt que le scraping non encadré.
- **Technologie :** APIs de prix (CardMarket API, PokemonPriceTracker, PokéWallet), scan IA (MonPrice, Ludex, etc.) ; opportunité sur l’agrégation détaillants.
- **Concurrence :** PokeCompare (scellé EU), PokeScope, PriceCharting, Kardex ; peu d’offres « prix par magasin détaillant » Suisse/France.

**Recommandations stratégiques :**

1. **MVP :** S’appuyer sur une API de prix (marketplaces) et une première liste de magasins Suisse/France (partenariats ou sources autorisées) pour livrer une comparaison transparente (sources et dates).
2. **Conformité :** Mettre en place dès le lancement politique de confidentialité, bases légales et registre des traitements (RGPD/nLPD).
3. **Différenciation :** Positionner l’app sur « prix par magasin » (détaillants) en complément des prix marketplaces, avec indication de fraîcheur des données.
4. **Roadmap :** Étendre les partenariats détaillants, puis optionnellement scan et alertes ; envisager l’extension géographique une fois le noyau France/Suisse validé.

---

## Table des matières

1. Introduction et méthodologie de recherche  
2. Vue d’ensemble du secteur et dynamiques de marché (Industry Analysis)  
3. Paysage concurrentiel et écosystème (Competitive Landscape)  
4. Cadre réglementaire et conformité (Regulatory Requirements)  
5. Tendances techniques et innovation (Technical Trends)  
6. Synthèse stratégique et opportunités  
7. Mise en œuvre et gestion des risques  
8. Perspectives et planification  
9. Méthodologie et vérification des sources  
10. Conclusion de la recherche  

---

## 1. Introduction et méthodologie de recherche

### Pertinence de la recherche

La recherche sur le TCG Pokémon (collection, cotes, marché achat/revente, prix par magasin) est pertinente au moment où le marché des trading cards dépasse 20 Md USD, où Pokémon domine le segment TCG en volume gradé, et où les attentes en matière de transparence des prix (marketplaces et détaillants) augmentent. Une application de comparaison des prix par magasin pour la Suisse et la France répond à un besoin peu couvert par les comparateurs actuels (centrés sur les marketplaces ou le scellé multi-retailers) et s’appuie sur un écosystème technique mature (APIs, scan, données structurées).

### Méthodologie

- **Périmètre :** Analyse du secteur, paysage concurrentiel, cadre réglementaire (UE/France/Suisse), tendances techniques et opportunités de mise en œuvre.
- **Sources :** Rapports d’études (Market Decipher, ResearchAndMarkets, GM Insights), sites officiels (EUR-Lex, CNIL, BJ/OFPDT), acteurs du marché (Cardmarket, APIs, apps), articles et guides sectoriels.
- **Approche :** Vérification multi-sources pour les chiffres critiques ; citation des URLs ; focus sur les implications pour une app de comparaison de prix (objectifs de recherche).
- **Période et géographie :** Données 2024–2025 ; focus Europe (France, Suisse) avec références USA et globales lorsque pertinent.

### Objectifs de la recherche et réalisations

**Objectifs initiaux :** (1) Collection, cotes, marché achat/revente ; (2) Une app pour lister les prix de chaque carte dans tous les magasins (Suisse/France, puis monde) ; (3) Focus sur les prix des cartes.

**Objectifs atteints :** Marché et chaîne de valeur documentés ; acteurs clés et comparateurs identifiés ; créneau « prix par magasin » Suisse/France mis en évidence ; exigences RGPD/nLPD et bonnes pratiques (APIs, partenariats, scraping) synthétisées ; tendances techniques et recommandations de mise en œuvre proposées.

---

## Domain Research Scope Confirmation

**Research Topic:** TCG cartes Pokémon - collection, cotes, marché achat/revente, prix par magasin (Suisse/France puis monde)
**Research Goals:** (1) Collection, cotes, marché achat/revente ; (2) Une app pour lister les prix de chaque carte dans tous les magasins (Suisse/France, puis monde) ; (3) Focus sur les prix des cartes.

**Domain Research Scope:**

- Industry Analysis - structure du marché, paysage concurrentiel
- Regulatory Environment - exigences de conformité, cadres légaux
- Technology Trends - tendances d'innovation, transformation numérique
- Economic Factors - taille du marché, projections de croissance
- Supply Chain Analysis - chaîne de valeur, écosystème, partenariats

**Research Methodology:**

- Toutes les affirmations vérifiées auprès de sources publiques actuelles
- Validation multi-sources pour les points critiques
- Niveau de confiance pour les informations incertaines
- Couverture domaine avec insights sectoriels

**Scope Confirmed:** 2025-02-05

---

## Industry Analysis

### Market Size and Valuation

Le marché des cartes à collectionner (trading cards) est évalué entre **13 et 21,4 milliards USD en 2024** selon le périmètre (TCG seuls vs. l’ensemble cartes sport, animation, etc.). Le segment TCG (Pokémon, Magic, Yu-Gi-Oh!) est estimé à environ **6,6–7,8 milliards USD en 2024–2025**, avec une croissance annuelle (CAGR) de **7,9 % à 8,8 %** ; une étude cite **11,8 milliards USD d’ici 2030**. Le marché « trading cards » au sens large (incluant Pokémon) est projeté à **58,2 milliards USD d’ici 2034** (CAGR ~13 %). Les cartes Pokémon pèsent fortement : elles représentent environ **30 % du marché des trading cards en 2024** et, en volume de cartes gradées, le TCG (presque tout Pokémon) dépasse le sport (16,8 M vs 10 M cartes gradées en 2025). L’impact économique passe par les ventes primaires (The Pokémon Company, détaillants), le marché secondaire (eBay, enchères, revendeurs) et les services (grading, authentification).

_Sources : [PR Newswire / Market Decipher](https://www.prnewswire.com/news-releases/trading-cards-market--pokemon-cards-a-gamechanger-in-a-21-4-billion-industry-in-2024-market-decipher-302116452.html), [ResearchAndMarkets](https://www.businesswire.com/news/home/20250605058619/en/), [Cognitive Market Research](https://www.cognitivemarketresearch.com/trading-card-games-market-report), [Yahoo / grading 2025](https://sports.yahoo.com/articles/major-authenticators-graded-more-26-051500958.html)._

### Market Dynamics and Growth

**Moteurs de croissance :** popularité du jeu compétitif et de l’esport, communautés de collectionneurs (ventes de cartes gradées en forte hausse), nostalgie (Millennials / Gen Z), influence des célébrités et des réseaux sociaux, et accessibilité des plateformes en ligne. La pandémie et les stimulus ont temporairement accéléré les dépenses sur les cartes. Le segment digital (ex. Pokémon TCG Pocket) génère des revenus importants et renforce l’écosystème.

**Freins / risques :** saturation et surproduction récentes qui pèsent sur les prix ; investissement spéculatif qui augmente la volatilité. La dépendance aux tendances et à l’actualité (sorties, annonces) crée des cycles.

**Cycles :** le marché est sensible aux sorties de sets, aux anniversaires de licence et aux phénomènes médiatiques (ex. Logan Paul). Une part croissante des acheteurs est orientée investissement plutôt que jeu ou collection simple.

**Maturité :** le marché TCG est en phase de croissance et de professionnalisation (grading, authentification, places de marché structurées), avec une forte composante numérique et hybride.

_Sources : [BlockApps](https://blockapps.net/blog/market-trends-identifying-cards-with-strong-growth-potential/), [NPR](https://www.npr.org/2023/08/08/1192404827/mitg-pokemon-game-card-collecting), [SI Collectibles](https://www.si.com/collectibles/over-26-million-cards-graded-in-2025-how-the-market-exploded), [The Athletic](https://www.nytimes.com/athletic/6327056/2025/05/01/pokemon-sports-cards/)._

### Market Structure and Segmentation

**Segments principaux :** (1) **Par type de produit** : cartes physiques (boosters, sets scellés, singles), cartes gradées, digital / hybrid (TCG Pocket, TCG Live). (2) **Par profil** : joueurs compétitifs, collectionneurs, investisseurs. (3) **Par type de carte** : personnages / créatures (cœur du TCG, ~45 % du segment en valeur dans une étude), autres types. (4) **Par canal** : vente au détail (magasins, grandes surfaces), en ligne (eBay, marketplaces, sites spécialisés), enchères (Goldin, etc.), direct éditeur / précommandes.

**Répartition géographique :** Amérique du Nord domine (env. 40–46 % des revenus), suivie de l’Europe et de l’Asie-Pacifique (croissance la plus rapide, CAGR ~12,5 %).

**Chaîne de valeur :** éditeurs (The Pokémon Company, licence) → fabricants / distribution → détaillants (physique et en ligne) → marché secondaire (places de marché, grading PSA/CGC/Beckett, authentification) → collectionneurs/joueurs.

_Sources : [Genezi](https://research.genezi.io/p/mastering-the-pokemon-tcg-market), [GM Insights](https://www.gminsights.com/industry-analysis/trading-card-games-market), [Straits Research](https://straitsresearch.com/report/collectible-card-games-market), [Intel Market Research](https://www.intelmarketresearch.com/tcg-cards-2025-2032-969-5699)._

### Industry Trends and Evolution

**Tendances actuelles :** (1) **Montée en puissance du grading** — plus de 26 M de cartes gradées en 2025 (+32 % vs 2024), PSA en tête ; authentification (eBay, CGC, etc.) devient la norme pour les cartes de valeur. (2) **Pokémon dépasse les cartes sport** en volume chez les gradeurs (ex. PSA) et structure l’offre en salons et marketplaces. (3) **Digital et hybride** — TCG Pocket, TCG Live, intégration mobile et in-app. (4) **Professionnalisation** — investissement, cotes, données de prix et comparateurs.

**Évolution récente :** renouveau porté par les Millennials, effet célébrités et réseaux sociaux, expansion des garanties d’authenticité (eBay, Canada, etc.). Nouveaux produits ciblant les débutants (ex. « My First Battle ») et renforcement de l’écosystème digital.

**Perspective :** poursuite de la croissance du TCG, importance accrue des données de prix et des outils de comparaison (magasins, marketplaces, bases de cotes) pour acheteurs et revendeurs.

_Sources : [Toybook / Pokémon Company](https://toybook.com/state-of-the-industry-2024-pokemon), [Business Insider](https://www.businessinsider.com/millennials-pokemon-renaissance-dethroned-baseball-cards-trading-psa-grading-2024-7), [LA Times](https://www.latimes.com/socal/daily-pilot/news/story/2024-05-18/bigger-than-baseball-pokemon-cards-are-rocking-the-collectibles-industry), [Mashable](https://me.mashable.com/digital-culture/46489/in-2024-pokemania-is-evolving)._

### Competitive Dynamics

**Concentration du marché du grading :** Collectors (PSA, SGC, Beckett) détient une part très majoritaire (~80 %) ; PSA a gradé 19,26 M de cartes en 2025 (env. 72 % du volume total, ~69 % en TCG). CGC Cards est le deuxième acteur (env. 4,92 M cartes, ~25 % du TCG, +121 % en glissement annuel).

**Place de marché secondaire :** eBay reste la principale plateforme (ex. >290 M USD de ventes de cartes en septembre 2025, Pokémon en forte croissance). Autres acteurs : Fanatics Collect, Goldin Auctions, Alt, plus des sites spécialisés et magasins.

**Éditeurs / licence :** The Pokémon Company (Pokémon TCG), Hasbro (Magic), Bandai Namco (autres TCG) dominent le segment TCG. Barrières à l’entrée : licence, notoriété, réseau de distribution et écosystème (tournois, digital).

**Pression à l’innovation :** attente forte sur les données de prix, l’agrégation multi-magasins et les comparateurs (alignement avec l’objectif d’une app de prix par magasin Suisse/France puis monde).

_Sources : [Yahoo / grading](https://sports.yahoo.com/articles/major-authenticators-graded-more-26-051500958.html), [Cllct / eBay](https://www.cllct.com/sports-collectibles/sports-cards/sports-pokemon-cards-drive-collectibles-growth-for-e-bay-in-q3), [Memento Research](https://mementoresearch.com/the-state-of-pokemon-rwa-tcg), [Market Decipher](https://www.prnewswire.com/news-releases/trading-cards-market--pokemon-cards-a-gamechanger-in-a-21-4-billion-industry-in-2024-market-decipher-302116452.html)._

---

## Competitive Landscape

### Key Players and Market Leaders

**Éditeurs / licence TCG :** The Pokémon Company domine le segment TCG ; les cinq plus grands éditeurs de cartes détenaient ensemble environ 62,25 % des revenus du marché en 2023, avec Pokémon en tête. Autres acteurs majeurs : Hasbro (Magic), Bandai Namco, Konami (Yu-Gi-Oh!), Panini, Wizards of the Coast.

**Grading / authentification :** PSA (Collectors) est le leader avec environ 76 % du volume en fin 2024 (1,22 M cartes en décembre), et le TCG représente ~46 % du volume PSA (forte part Pokémon). CGC est le deuxième (221 k cartes, +84 % en glissement annuel) ; SGC et Beckett complètent le paysage (Beckett en recul).

**Places de marché secondaire :** eBay domine au niveau mondial (ventes de cartes >290 M USD en septembre 2025). En Europe, **Cardmarket** est la référence (« plus grande place de marché TCG en Europe », >500 M d’offres, >2 M d’utilisateurs, ~7,5 M de visites/mois). TCGPlayer est le leader aux États-Unis.

**Apps / comparateurs de prix :** PokeCompare.eu (produits scellés, multi-retailers EU), PokeScope (scan, TCGPlayer + CardMarket, mises à jour horaires), PriceCharting (eBay + autres, scan, alertes), Kardex (Pokémon, eBay/TCGPlayer/CardMarket), TCGdex (API prix Cardmarket + TCGPlayer). TCGPlayer app limitée aux USA pour l’achat/vente.

_Sources : [ResearchAndMarkets](https://www.businesswire.com/news/home/20250605058619/en/), [GM Insights](https://www.gminsights.com/industry-analysis/trading-card-games-market), [PokeCompare](https://www.pokecompare.eu/), [TCGdex](https://tcgdex.dev/fr/markets-prices), [GemRate](https://www.gemrate.com/december-2024-recap), [OMR / Cardmarket](https://omr.com/en/daily/cardmarket-trading-card-platform)._

### Market Share and Competitive Positioning

**Répartition des parts de marché (éditeurs) :** concentration élevée ; Pokémon en tête du TCG, suivi de Magic (Hasbro/WotC) et des autres licences (Yu-Gi-Oh!, etc.).

**Positionnement :** Cardmarket = référence européenne (prix en EUR, mise à jour quotidienne, tournois Cardmarket Series). eBay = global, multi-catégories. TCGPlayer = ciblé USA. Les apps (PokeScope, PriceCharting, Kardex) se positionnent sur le suivi de collection, le scan et l’agrégation de prix ; PokeCompare.eu sur la comparaison multi-retailers pour le scellé en Europe. **Angle encore peu couvert : agrégation des prix par magasin physique / détaillants (Suisse, France)**, aligné avec votre objectif d’app.

**Segments de clientèle :** joueurs, collectionneurs, investisseurs ; B2C (acheteurs finaux) et revendeurs ; Europe (Cardmarket, PokeCompare) vs USA (TCGPlayer, eBay US).

_Sources : [PokeCompare](https://www.pokecompare.eu/), [TCGdex](https://tcgdex.dev/fr/markets-prices), [OMR](https://omr.com/en/daily/omr-podcast-cardmarket), [Deep Market Insights](https://deepmarketinsights.com/vista/insights/trading-card-game-market/europe)._

### Competitive Strategies and Differentiation

**Stratégies par acteur :** (1) **Places de marché** — volume et liquidité (eBay), spécialisation TCG et prix de référence (Cardmarket, TCGPlayer). (2) **Grading** — confiance et notoriété (PSA), montée en puissance (CGC, partenariats ex. Fanatics). (3) **Apps / données** — différenciation par UX (scan, alertes), périmètre géographique (EU vs US) et sources (retailers vs marketplaces). PokeCompare se différencie sur le **scellé multi-retailers EU** ; les APIs (CardMarket API, Pokemon TCG API) ciblent les développeurs avec données temps réel (Cardmarket + TCGPlayer, pays EU).

**Innovation :** APIs payantes (free tier ~100 req/jour, plans 9,90–49,50 USD/mois), intégration graded (PSA, Beckett, CGC), tendances historiques ; côté app, scan et comparaison multi-sources.

_Sources : [cardmarket-api.com](https://cardmarket-api.com/), [pokemon-api.com](https://pokemon-api.com/), [PokeScope](https://pokescope.app/), [PriceCharting](https://apps.apple.com/us/app/pricecharting-tcg-games/id6452190948), [GemRate](https://www.gemrate.com/december-2024-recap)._

### Business Models and Value Propositions

**Modèles principaux :** (1) **Marketplaces** — commissions sur ventes (eBay, Cardmarket, TCGPlayer). (2) **Grading** — frais par carte (PSA, CGC, etc.). (3) **Apps / comparateurs** — freemium, abonnements, parfois affiliation. (4) **APIs** — abonnements développeurs (accès prix, images, tendances). (5) **Détaillants** — marge sur produit neuf (magasins, e-commerce).

**Chaîne de valeur :** éditeur → distribution / retail → marché secondaire (marketplaces, gradeurs) → outils (apps, APIs). Les comparateurs de prix créent de la valeur en agrégation et en transparence ; la **comparaison par magasin (détaillants Suisse/France)** reste un créneau peu couvert par les acteurs actuels.

_Sources : [Cardmarket](https://cardmarket.com/), [OMR](https://omr.com/en/daily/cardmarket-trading-card-platform), [GM Insights](https://www.gminsights.com/industry-analysis/trading-card-games-market)._

### Competitive Dynamics and Entry Barriers

**Barrières à l’entrée :** (1) **Licence / contenu** — pas nécessaire pour une app de prix (données publiques, scrapers, APIs). (2) **Données** — accès aux prix (Cardmarket, TCGPlayer, détaillants) via APIs ou partenariats ; coût et mise à jour. (3) **Effets de réseau** — marketplaces et gradeurs bénéficient de la liquidité ; les comparateurs de la couverture et de la fraîcheur des données. (4) **Notoriété** — confiance des utilisateurs pour les prix et la couverture magasins.

**Intensité concurrentielle :** forte sur les marketplaces et le grading ; modérée sur les apps de prix, avec une **opportunité sur l’agrégation prix détaillants (Suisse/France)**.

**Consolidation :** Collectors (PSA, SGC, Beckett) domine le grading ; peu de fusion récente côté comparateurs. Tendance à l’intégration (marketplace + grading, app + API).

_Sources : [ResearchAndMarkets](https://www.businesswire.com/news/home/20250605058619/en/), [GemRate](https://www.gemrate.com/december-2024-recap), [cardmarket-api.com](https://cardmarket-api.com/)._

### Ecosystem and Partnership Analysis

**Partenariats clés :** Cardmarket = référence prix et ventes en Europe ; TCGdex et APIs (CardMarket API, Pokemon TCG API) agrègent Cardmarket + TCGPlayer. PokeCompare s’appuie sur les détaillants EU. PSA/CGC partenariats (eBay, Whatnot, Fanatics) pour l’authentification.

**Canaux de distribution :** vente physique (magasins spécialisés, grande distribution) encore majoritaire en valeur (~55 % du marché TCG en 2025) ; en ligne (sites retailers, marketplaces). Une **app de prix par magasin** doit s’appuyer sur des sources détaillants (sites, partenariats, ou collecte) en plus des marketplaces.

**Contrôle de la chaîne :** les prix de référence sont largement dictés par Cardmarket (EU) et TCGPlayer (US) ; les détaillants ont leurs propres prix, d’où l’intérêt d’une agrégation dédiée pour Suisse/France.

_Sources : [TCGdex](https://tcgdex.dev/fr/markets-prices), [PokeCompare](https://www.pokecompare.eu/), [OMR](https://omr.com/en/daily/omr-podcast-cardmarket), [GM Insights](https://www.gminsights.com/industry-analysis/trading-card-games-market)._

---

## Regulatory Requirements

### Applicable Regulations

**Vente et revente de biens (UE) :** La directive 2019/771 harmonise les contrats de vente de biens et les garanties pour les consommateurs dans l’UE ; elle s’applique aux ventes en ligne de cartes à collectionner (détaillants, marketplaces). En France et en Suisse, le droit national de la consommation et des contrats s’applique (obligations d’information, droit de rétractation selon le cas, garantie des vices cachés).

**Contrefaçon et propriété intellectuelle (UE) :** La contrefaçon de cartes (marques, œuvres) est couverte par le droit des marques et le droit d’auteur. En 2022, plus de 86 millions d’articles contrefaits ont été retenus aux frontières de l’UE (valeur >2 Md €) ; jeux, emballages et jouets représentaient plus de 72 % des produits. Les États membres et l’EUIPO renforcent l’application des droits de PI ; une app de comparaison de prix n’est pas vendeuse mais doit éviter de faciliter la vente de contrefaçons (ex. liens vers offres manifestement illicites).

**TVA (UE) :** La directive 94/5/EC concerne la TVA sur les biens d’occasion, œuvres d’art et objets de collection ; l’application aux cartes TCG varie selon les États. Pour une app purement informative (prix affichés), la TVA relève des vendeurs et des plateformes, pas de l’éditeur de l’app.

_Sources : [EUR-Lex 2019/771](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32019L0771), [EUIPO 2022](https://www.euipo.europa.eu/en/publications/eu-enforcement-of-iprs-results-at-the-eu-border-and-in-the-eu-internal-market-2022-november-2023), [Commission counterfeiting](https://home-affairs.ec.europa.eu/policies/internal-security/organised-crime/counterfeiting_en), [EUR-Lex 94/5](https://eur-lex.europa.eu/eli/dir/1994/5/oj/eng)._

### Industry Standards and Best Practices

**Authentification et grading :** Les acteurs du secteur (PSA, CGC, Beckett, eBay Authenticity Guarantee) définissent des standards de facto pour l’authentification et la notation ; une app qui affiche des prix peut indiquer la source (graded vs non graded, marketplace vs détaillant) pour clarifier la comparaison.

**Transparence des prix :** Les comparateurs établis (PokeCompare, TCGdex, etc.) affichent source et date des prix ; bonne pratique pour une app « prix par magasin » : indiquer l’origine des données (site marchand, partenaire, API) et la fraîcheur des mises à jour.

**Contrefaçon :** Guides et communautés aident à identifier les faux (qualité d’impression, matériau, hologrammes, dos de carte) ; les marketplaces et gradeurs offrent des recours (réclamation, authentification). Une app peut renvoyer vers ces bonnes pratiques sans garantir l’authenticité des offres listées.

_Sources : [Sundo Cards](https://sundocards.com/resources/guide-to-identifying-fake-pokemon-cards/), [EU counterfeiting toolbox](https://single-market-economy.ec.europa.eu/document/download/f8eb913a-46e8-4c76-93fb-843d4649ad53_en?filename=Factsheet_counterfeiting+toolbox-final.pdf)._

### Compliance Frameworks

**Consommateurs (UE/France) :** Respect des règles d’information précontractuelle, transparence des offres et des prix, loyauté des pratiques commerciales. Si l’app génère du trafic vers des vendeurs (liens affiliés, redirections), les obligations de mention publicitaire et de loyauté s’appliquent.

**Données personnelles :** Voir section « Data Protection and Privacy » ; conformité RGPD (UE/France) et nLPD (Suisse) pour tout traitement de données personnelles (comptes, préférences, localisation, analytics).

**Propriété intellectuelle :** Ne pas reproduire sans droit des bases de données ou contenus protégés (marques, textes, images) ; privilégier APIs et partenariats pour les données de prix lorsque possible.

_Sources : [Commission data protection](https://commission.europa.eu/law/law-topic/data-protection_en), [GDPR](https://gdpr.eu/what-is-gdpr), [CNIL scraping](https://www.cnil.fr/en/legal-basis-legitimate-interests-focus-sheet-measures-implement-case-data-collection-web-scraping)._

### Data Protection and Privacy

**RGPD (UE / France) :** Toute app traitant des données personnelles de personnes dans l’UE doit respecter le RGPD : base légale du traitement, information claire et accessible, droits d’accès, de rectification, d’effacement, de limitation, de portabilité ; registre des traitements, sécurité, notification des violations. Les comparateurs de prix doivent expliquer quelles données sont collectées (ex. recherche, favoris, compte) et pour quelles finalités. Amendes possibles jusqu’à des dizaines de millions d’euros en cas de manquement.

**nLPD (Suisse, entrée en vigueur 1er septembre 2023) :** La loi révisée sur la protection des données (nLPD) s’aligne en grande partie sur le RGPD : protection des données des personnes physiques, privacy by design/default, information préalable, registre des traitements (avec exceptions), notification des violations au Préposé fédéral, régulation du profilage. Une app ciblant la Suisse et la France doit donc prévoir la conformité RGPD + nLPD.

**Recommandations pour une app de comparaison :** Politique de confidentialité lisible, consentement ou autre base légale pour les traitements (ex. intérêt légitime pour analytics), minimisation des données, durées de conservation définies, sécurisation des accès et des données.

_Sources : [GDPR.eu](https://gdpr.eu/data-privacy), [EUR-Lex RGPD](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32016R0679), [FIDAM nLPD](https://www.fidam.ch/en/switzerland-introduces-a-new-law-to-better-protect-the-data-of-its-residents-companies-in-the-country-must-comply-starting-from-september-1-2023/), [BJ Suisse](https://www.bj.admin.ch/bj/en/home/staat/datenschutz/rechtsgrundlagen.html), [dataprotection.ch](https://www.dataprotection.ch/dpa/introduction)._

### Licensing and Certification

**Licence d’éditeur / marque Pokémon :** Pas de licence The Pokémon Company nécessaire pour une app purement informative (affichage de prix, comparaison) qui n’utilise pas illégalement marques ou œuvres (logos, images de cartes) au-delà de ce qui est autorisé (nominatif, information sur les produits). L’utilisation massive d’images ou de bases de cartes peut relever du droit des marques et du droit d’auteur ; l’usage des APIs officielles ou de données agrégées avec attribution réduit le risque.

**Certification :** Aucune certification sectorielle obligatoire pour une app de comparaison de prix. Les exigences applicables sont le droit des contrats, la protection des consommateurs et la protection des données (RGPD/nLPD), pas un agrément spécifique « cartes Pokémon ».

_Sources : Bonnes pratiques sectorielles et cadre général PI/consommation ; pas de source unique dédiée « licence app prix Pokémon » identifiée._

### Implementation Considerations

**Collecte des prix :** (1) **APIs et partenariats** — privilégier les APIs (Cardmarket, TCGPlayer, détaillants) et accords avec les marchands pour des données structurées et des conditions d’utilisation claires. (2) **Scraping** — en UE, le scraping est encadré : respect des conditions d’utilisation des sites (qui interdisent souvent le scraping), base légale RGPD si des données personnelles sont collectées, respect des droits sur les bases de données et du droit d’auteur. La CNIL (France) a publié une fiche sur l’intérêt légitime pour le scraping ; des mesures de proportionnalité et de sécurité sont requises. (3) **Suisse** — mêmes précautions (nLPD, conditions des sites).

**Périmètre France / Suisse :** Prévoir une politique de confidentialité et des mentions légales adaptées aux deux juridictions (RGPD + nLPD), et éventuellement un représentant en UE si traitement à grande échelle.

**Risques principaux :** Non-conformité RGPD/nLPD (sanctions, plaintes) ; violation des conditions d’utilisation ou du droit des bases de données en cas de scraping non autorisé ; contenu trompeur si les prix affichés sont obsolètes ou mal sourcés.

_Sources : [IAPP scraping EU](https://iapp.org/news/a/the-state-of-web-scraping-in-the-eu), [CNIL legitimate interest scraping](https://www.cnil.fr/en/legal-basis-legitimate-interests-focus-sheet-measures-implement-case-data-collection-web-scraping), [Lexology scrapers](https://www.lexology.com/library/detail.aspx?g=aa5eb784-32b4-4bf3-8406-823f32c68444), [LexGo contractual restrictions](https://www.lexgo.be/en/news-and-articles/2656-websites-can-contractually-restrict-third-party-scraping-of-their-data)._

### Risk Assessment

| Risque | Niveau | Mitigation |
|--------|--------|------------|
| Non-conformité RGPD / nLPD | Élevé si non traité | Politique de confidentialité, bases légales, droits des personnes, registre, sécurité |
| Scraping sans base légale ou en violation des CGU | Moyen à élevé | Privilégier APIs/partenariats ; si scraping, analyse juridique (droit des bases, CGU, CNIL) |
| Utilisation illicite de marques/images | Moyen | Usage informatif, attribution, APIs officielles ou données autorisées |
| Contenu trompeur (prix faux ou périmés) | Moyen | Indication des sources et dates, mises à jour régulières, disclaimer si besoin |
| Contrefaçons via liens sortants | Faible à moyen | Ne pas promouvoir des offres connues comme contrefaisantes ; modération / signalement |

_Sources : Synthèse des références réglementaires ci-dessus._

---

## Technical Trends and Innovation

### Emerging Technologies

**APIs de prix en temps réel :** Plusieurs fournisseurs agrègent les prix TCG (Pokémon, Magic, Lorcana) à partir de TCGPlayer, Cardmarket et eBay : mises à jour horaires à quotidiennes, historiques pluriannuels, valorisation des cartes gradées (PSA, BGS, CGC). Exemples : PokemonPriceTracker, CardMarket API (RapidAPI), PokéWallet (beta, accès gratuit). Offres typiques : tier gratuit ~100 requêtes/jour, formules payantes jusqu’à des dizaines de milliers de requêtes/jour.

**Scan et identification par IA :** Des apps (TCG Scanner, MonPrice, Ludex, Dexipedia) utilisent vision par ordinateur et ML pour identifier une carte à partir d’une photo (taux de précision annoncés 95–99 %), puis afficher prix et variantes. Agrégation multi-sources (TCGPlayer, CardMarket, détaillants) avec rafraîchissement quotidien ou en temps réel.

**Données structurées et bulk :** Requêtes par set, par carte, par grade ; alertes et webhooks pour seuils de prix ; valorisation de decks et de collections. Ces briques permettent de construire des comparateurs « prix par magasin » en s’appuyant sur des APIs plutôt que sur du scraping non autorisé.

_Sources : [PokemonPriceTracker API](https://www.pokemonpricetracker.com/pokemon-card-pricing-api), [cardmarket-api.com](https://cardmarket-api.com/), [PokéWallet](https://www.pokewallet.io/), [TCG Scanner](https://www.tcgscannerapp.com/), [MonPrice](https://monprice.app/), [Ludex](https://www.ludex.com/features/), [Dexipedia](https://www.dexipedia.com/)._

### Digital Transformation

**Hybride physique / digital :** Pokémon TCG Pocket renforce le lien entre physique et digital (échanges limités en 2025, partage de cartes, nouveaux boosters et sets). Le physique reste central (tournois, collection, sealed) ; le digital sert de complément et d’entrée pour de nouveaux joueurs.

**Marketplaces et données :** Cardmarket (EU) et TCGPlayer (US) sont les références prix ; des APIs tierces unifient ces sources (CardMarket API, Pokemon TCG API). TCGPlayer ne délivre plus de nouveaux accès API ; les alternatives (CardMarket API, PokéWallet, PokemonPriceTracker) restent disponibles. L’API native Cardmarket (MKM API 2.0) permet gestion de compte, catalogue et commandes (OAuth, XML/JSON).

**Expérience utilisateur :** Scan → identification → prix → collection / alertes ; intégration à des marketplaces (ex. liste eBay depuis l’app). Une app « prix par magasin » s’inscrit dans cette tendance en ajoutant la dimension **détaillants (Suisse/France)** peu couverte aujourd’hui.

_Sources : [Pokemon.com TCG Pocket](https://www.pokemon.com/us/pokemon-news/read-the-pokemon-tcg-pocket-october-2025-producer-letter), [Polygon](https://polygon.com/gaming/478922/pokemon-tcg-pocket-trading-new-booster-packs-coming), [TCGPlayer docs](https://docs.tcgplayer.com/docs/getting-started), [MKM API](https://api.cardmarket.com/ws/documentation/API_2.0:Main_Page)._

### Innovation Patterns

**Modèle « données + UX » :** Les acteurs combinent (1) agrégation de prix multi-sources, (2) identification rapide (scan IA ou recherche), (3) gestion de collection et alertes. La différenciation se fait par périmètre géographique (EU vs US), par type de produit (singles vs scellé), et par source (marketplaces vs détaillants).

**Ouverture partielle :** APIs payantes avec paliers d’usage ; TCGPlayer fermé aux nouveaux développeurs ; Cardmarket ouvert (API native + APIs tierces). Les comparateurs détaillants (ex. PokeCompare pour le scellé EU) montrent qu’une **agrégation prix magasins** est techniquement et commercialement viable.

**Privacy et performance :** Certaines apps mettent en avant le respect de la vie privée et des temps de réponse courts ; les APIs annoncent des SLA (ex. 99,9 % uptime, <200 ms). Pour une app France/Suisse, conformité RGPD et nLPD et performance perçue sont des leviers de différenciation.

_Sources : [PokeCompare](https://www.pokecompare.eu/), [CardMarket API](https://cardmarket-api.com/), [The Cardboard Chronicles](https://www.thecardboardchronicles.com/post/the-future-of-the-pokemon-tcg-the-past-present-and-where-it-s-headed)._

### Future Outlook

**Court terme (2025–2026) :** TCG Pocket étend l’échange et le partage ; mise à jour majeure du Card Dex prévue après l’été 2026. Le physique reste le socle (tournois, sealed, collection) ; scalping et power creep restent des enjeux.

**Données et outils :** Poursuite de la professionnalisation : APIs, historiques, graded, alertes. La demande pour des comparateurs fiables (prix, magasins, disponibilité) devrait rester forte. **Créneau « prix par magasin Suisse/France »** encore peu saturé.

**Techno :** IA (identification, recommandations), APIs unifiées EU/US, et possiblement davantage de données « retail » (partenariats ou sources structurées) pour compléter les marketplaces.

_Sources : [Pokemon Meta](https://www.pokemonmeta.com/articles/news/2025/october/upcoming-updates-dex), [The Verge](https://theverge.com/2025/1/16/24345484/pokemon-tcg-pocket-trading-january-launch), [The Cardboard Chronicles](https://www.thecardboardchronicles.com/post/the-future-of-the-pokemon-tcg-the-past-present-and-where-it-s-headed)._

### Implementation Opportunities

**Pour une app « prix par magasin » (Suisse/France) :** (1) **APIs existantes** — CardMarket API, PokemonPriceTracker, PokéWallet pour les prix marketplaces (référence) ; (2) **Partenariats détaillants** — accords pour flux de prix ou widgets (meilleure base juridique que le scraping) ; (3) **Scraping encadré** — si nécessaire, après analyse juridique (CGU, RGPD/nLPD, droit des bases) et mesures de proportionnalité (CNIL, jurisprudence) ; (4) **Scan optionnel** — réutilisation de briques type MonPrice/Ludex (ou API tierce) pour identifier la carte puis afficher les prix par source (marketplaces + magasins).

**Stack technique :** Backend (agrégation, cache, jobs de mise à jour), app mobile ou PWA (recherche, scan, comparaison, favoris), conformité données (consentement, politique de confidentialité, registre).

_Sources : Synthèse des tendances et des APIs ci-dessus._

### Challenges and Risks

**Accès aux données détaillants :** Pas d’API standardisée pour les prix des magasins physiques ou e-commerce Suisse/France ; dépendance à des partenariats ou au scraping (risque juridique et stabilité). **Mitigation :** prioriser partenariats et flux officiels ; si scraping, cadre juridique strict et taux de requêtes raisonnable.

**Coût et disponibilité des APIs :** Tiers payants au-delà du free tier ; TCGPlayer fermé aux nouveaux. **Mitigation :** combiner plusieurs fournisseurs (CardMarket API, PokéWallet, etc.) et dimensionner les paliers selon le trafic.

**Maintenance et fraîcheur :** Prix et catalogues évoluent (nouveaux sets, ruptures). **Mitigation :** pipelines de mise à jour réguliers, indicateurs de fraîcheur (date de dernière mise à jour par source), alertes techniques.

_Sources : Synthèse des sections techniques et réglementaires._

---

## Recommendations

### Technology Adoption Strategy

- **Phase 1 (MVP) :** S’appuyer sur une ou deux APIs de prix (ex. CardMarket API ou PokéWallet) pour les prix de référence (marketplaces EU/US) ; ajouter une première liste de magasins Suisse/France avec prix obtenus par partenariat ou source clairement autorisée. Livrer une comparaison « marketplace + quelques détaillants » avec indication des sources et des dates.
- **Phase 2 :** Élargir le panel de détaillants (partenariats, flux officiels) ; ajouter optionnellement le scan (intégration SDK ou API d’identification) ; alertes et favoris.
- **Phase 3 :** Extension géographique (autres pays) et enrichissement (historiques, tendances, sealed) en restant conforme RGPD/nLPD et aux CGU des sources.

### Innovation Roadmap

- **Court terme :** Intégration APIs prix, design « prix par magasin » (filtres pays/région, type de produit), politique de confidentialité et mentions légales (FR/CH).
- **Moyen terme :** Partenariats détaillants, qualité et fraîcheur des données, UX (recherche, comparaison, partage).
- **Long terme :** Fonctions avancées (historique, alertes, scan), extension à d’autres TCG ou catégories si aligné avec la stratégie produit.

### Risk Mitigation

- **Données :** Privilégier APIs et partenariats ; si scraping, avis juridique et respect strict CGU + RGPD/nLPD.
- **Conformité :** Registre des traitements, information des utilisateurs, droits (accès, rectification, effacement), sécurité et notification des violations (RGPD/nLPD).
- **Contenu :** Ne pas utiliser marques/images au-delà de l’usage informatif autorisé ; sourcer les prix et indiquer les limites (pas de garantie sur l’authenticité des offres listées).

---

## 6. Synthèse stratégique et opportunités

**Convergence marché–technologie :** La demande de transparence des prix (marketplaces + détaillants) s’appuie sur des APIs et des briques techniques matures ; la différenciation passe par la couverture des magasins (Suisse/France) et la qualité des données (source, date).

**Alignement réglementaire :** Une stratégie « APIs et partenariats d’abord » réduit les risques juridiques (CGU, bases de données, RGPD/nLPD) et renforce la crédibilité auprès des utilisateurs et des partenaires.

**Opportunités de positionnement :** (1) **Marché** — occuper le créneau « prix par magasin » pour la Suisse et la France. (2) **Technologie** — combiner APIs de référence (Cardmarket, TCGPlayer via tiers) et flux détaillants. (3) **Partenariats** — nouer des accords avec des détaillants pour des flux de prix ou des widgets.

---

## 7. Mise en œuvre et gestion des risques

**Cadre de mise en œuvre :** Phaser le déploiement (MVP avec APIs + premiers magasins → extension partenariats → scan/alertes → extension géographique). Prévoir les ressources pour l’intégration des APIs, la conformité données et la maintenance des sources.

**Risques principaux et mitigation :** Non-conformité RGPD/nLPD (→ politique de confidentialité, bases légales, registre) ; collecte de prix non autorisée (→ privilégier APIs et partenariats) ; données obsolètes (→ indicateurs de fraîcheur, pipelines de mise à jour). Voir section Regulatory Requirements et Technical Trends pour le détail.

---

## 8. Perspectives et planification

**Court terme (1–2 ans) :** Consolidation de TCG Pocket et du physique ; poursuite de la professionnalisation des données (APIs, comparateurs). Fenêtre favorable pour lancer une app « prix par magasin » sur la base des recommandations ci-dessus.

**Moyen et long terme :** Extension à d’autres pays et, si pertinent, à d’autres TCG ou catégories ; renforcement des fonctionnalités (historiques, alertes, scan) en restant conforme au cadre réglementaire et aux bonnes pratiques identifiées.

---

## 9. Méthodologie et vérification des sources

**Sources utilisées :** Études de marché (PR Newswire/Market Decipher, ResearchAndMarkets, GM Insights, Cognitive Market Research, Straits Research, etc.), sites institutionnels (EUR-Lex, Commission européenne, EUIPO, CNIL, BJ/OFPDT, dataprotection.ch), acteurs du secteur (Cardmarket, TCGPlayer, APIs cardmarket-api.com, pokemon-api.com, PokemonPriceTracker, PokéWallet), apps et comparateurs (PokeCompare, PokeScope, PriceCharting, Ludex, MonPrice, TCGdex), et articles spécialisés (GemRate, OMR, Cllct, etc.).

**Qualité :** Les affirmations chiffrées et réglementaires ont été recoupées avec plusieurs sources lorsque possible ; les limites (périmètres variables des études, évolution des APIs) sont signalées dans le corps du rapport.

**Limites :** Données marché parfois divergentes selon les périmètres (TCG seuls vs. trading cards global) ; cadre juridique du scraping et des CGU susceptible d’évoluer ; liste des acteurs et APIs non exhaustive.

---

## 10. Annexes et ressources complémentaires

**Ressources réglementaires :** [EUR-Lex](https://eur-lex.europa.eu/), [CNIL](https://www.cnil.fr/), [Préposé fédéral à la protection des données (Suisse)](https://www.edoeb.admin.ch/), [GDPR.eu](https://gdpr.eu/).

**Marché et acteurs :** [Cardmarket](https://cardmarket.com/), [TCGPlayer](https://www.tcgplayer.com/), [PokeCompare](https://www.pokecompare.eu/), [TCGdex](https://tcgdex.dev/).

**APIs et développeurs :** [CardMarket API (RapidAPI)](https://cardmarket-api.com/), [Pokemon TCG API](https://pokemon-api.com/), [PokemonPriceTracker](https://www.pokemonpricetracker.com/), [MKM API](https://api.cardmarket.com/ws/documentation/API_2.0:Main_Page), [TCGPlayer Docs](https://docs.tcgplayer.com/docs).

---

## Conclusion de la recherche

**Résumé des constats :** Le domaine TCG Pokémon (collection, cotes, marché achat/revente) est porteur ; les outils d’agrégation de prix existent pour les marketplaces, mais l’**agrégation des prix par magasin (détaillants) en Suisse et en France** reste une opportunité. Les exigences réglementaires (RGPD, nLPD) et techniques (APIs, partenariats, éventuel scraping encadré) sont documentées et peuvent être intégrées dès la conception.

**Impact stratégique :** Ce document sert de base pour les décisions de produit (MVP, périmètre, conformité) et pour les échanges avec des partenaires ou des investisseurs.

**Prochaines étapes suggérées :** (1) Valider le positionnement « prix par magasin » et la liste cible de détaillants Suisse/France. (2) Choisir les APIs de prix et définir le modèle de données (sources, fraîcheur). (3) Cadrer la conformité (RGPD/nLPD) et les mentions légales. (4) Itérer sur le MVP (comparaison marketplace + premiers magasins) puis étendre selon la roadmap recommandée.

---

**Date de finalisation de la recherche :** 2025-02-05  
**Vérification des sources :** Les faits cités sont rattachés à des sources ; les liens sont indiqués dans chaque section.  
**Niveau de confiance :** Élevé pour les tendances et le cadre général ; variable pour certains chiffres selon les périmètres des études.

*Ce document constitue une référence de recherche domaine pour le projet d’app de comparaison des prix des cartes Pokémon TCG (Suisse/France puis extension) et pour les décisions stratégiques associées.*

---

<!-- Content will be appended sequentially through research workflow steps -->
