
## Render — Suppression du cold start

### Option 1 : Plan payant ($7/mois, recommandé)
1. Aller sur https://dashboard.render.com
2. Cliquer sur le service `mecanova-backend`
3. `Settings` → `Instance Type` → `Edit`
4. Passer de `Free` à `Starter` ($7/mois)
5. Confirmer

Avantages : plus de cold start, meilleures performances, pas de limitation de bande passante.

### Option 2 : Keep-alive gratuit (UptimeRobot)
Tant que le plan est gratuit, Render met le service en veille après 15 min d'inactivité.

1. Créer un compte sur https://uptimerobot.com (gratuit, 50 moniteurs)
2. Ajouter un monitor HTTP(s) :
   - URL : `https://mecanova.onrender.com/api/health`
   - Interval : 5 minutes
   - Timeout : 30 secondes
3. Activer le monitor

Le ping toutes les 5 minutes empêche Render de s'endormir.

### Option 3 : Keep-alive avec GitHub Actions (si tu ne veux pas UptimeRobot)
Un workflow GitHub Actions peut pinger toutes les 10 minutes (minimum autorisé par GitHub est ~1h pour les free, donc pas fiable seul).

## Mock DB (`backend/src/db/pool.ts`)

### UPDATE handler with COALESCE
- `parseUpdate()` splits SET pairs by comma. Must use depth-aware split (`splitTopLevelCommas`) to handle commas inside COALESCE(...).
- `resolveSetValue()` must handle `COALESCE($1, col_name)`: extract args via `splitTopLevelCommas`, try each arg, skip column-name references (bare `\w+`), return first resolved value.
- Column-name fallbacks in COALESCE return `undefined` when no param is bound (preserves existing value).

### Common bugs
- `matchRow()`: regex `(\w+\.)?(\w+)` — `match[1]` may be undefined; use `(match[1] || '') + match[2]`.
- `parseUpdate()`: regex `.` doesn't match `\n`; use `[\s\S]+?`.
- UPDATE WHERE params: use full `params` array, not `params.slice(setCols.length)`.
