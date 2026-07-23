# Review: Adversarial — Two Units, One Divergence

**Verdict: ✅ No holes found**

## Analysis

J'ai tenté de construire deux unités (backend dev + frontend dev, ou deux connecteurs, ou module scoring + module alerting) qui obéissent à tous les ADs mais construisent incompatibilité.

### Tentative 1 — Forme des événements SSE
Un développeur pourrait nommer ses événements `opportunity.new` tandis qu'un autre utilise `opportunity_created`. **Défendu par**: AD-18 (conventions de nommage) + Consistency Conventions table qui spécifie `domain.action`.

### Tentative 2 — Format des montants
Un module pourrait stocker en centimes (`i64`) tandis qu'un autre utilise des floats. **Défendu par**: AD-5 (centimes i64) + AD-18 (centimes i64).

### Tentative 3 — Qui possède le calcul de marge
Le frontend pourrait recalculer la marge pour affichage. **Défendu par**: AD-7 (calcul exclusivement Rust, pas de calcul TypeScript).

### Tentative 4 — Deux connecteurs implémentent le retry différemment
Un connecteur eBay avec retry linéaire, un Cardmarket avec exponential backoff sans jitter. **Défendu par**: AD-6 (runtime mutualise retry/jitter/backoff).

### Tentative 5 — Deferred: authentification multi-utilisateur anticipée
Un dev pourrait ajouter une table `users` « au cas où ». **Partiellement défendu**: AD-3 dit « Pas de table users », mais le Deferred ne l'interdit pas explicitement. Ce n'est pas un trou — c'est un choix conscient de ne pas anticiper.

### Tentative 6 — Migration SQLite concurrente
Deux workers pourraient tenter d'appliquer des migrations simultanément. **Pas explicitement défendu**. La spine dit « appliquées au démarrage » mais ne spécifie pas de lock. Étant donné que c'est un processus Rust unique avec un scheduler interne et pas de workers séparés pour les migrations, le risque est nul — mais mérite une clarification dans AD-5.

**Recommandation**: Ajouter à AD-5 que les migrations sont appliquées au démarrage du processus unique, avant que le scheduler et le serveur HTTP ne démarrent — ce qui est déjà implicite dans le flux mais pourrait être explicité.

## Summary
0 holes. 1 clarification mineure (migrations avant scheduler/HTTP).
