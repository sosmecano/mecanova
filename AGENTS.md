
## Mock DB (`backend/src/db/pool.ts`)

### UPDATE handler with COALESCE
- `parseUpdate()` splits SET pairs by comma. Must use depth-aware split (`splitTopLevelCommas`) to handle commas inside COALESCE(...).
- `resolveSetValue()` must handle `COALESCE($1, col_name)`: extract args via `splitTopLevelCommas`, try each arg, skip column-name references (bare `\w+`), return first resolved value.
- Column-name fallbacks in COALESCE return `undefined` when no param is bound (preserves existing value).

### Common bugs
- `matchRow()`: regex `(\w+\.)?(\w+)` — `match[1]` may be undefined; use `(match[1] || '') + match[2]`.
- `parseUpdate()`: regex `.` doesn't match `\n`; use `[\s\S]+?`.
- UPDATE WHERE params: use full `params` array, not `params.slice(setCols.length)`.
