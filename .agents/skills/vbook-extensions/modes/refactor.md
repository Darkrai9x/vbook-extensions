# REFACTOR mode

Standard procedure for aligning an existing, working extension to the current template style **without changing what it does**. Behavior-preserving only — every script must return the same data before and after. Not for fixing bugs (use FIX) or adding features.

The point is consistency: config.js/`BASE_URL`/`normalizeUrl` conventions, `plugin.json` shape (`encrypt`, config-key names, field contract), stripped teaching comments, `native`→`auto`→`webview` track order — so the ext matches `templates/<type>/` and the constraints in `SKILL.md`.

## Phase 0 — baseline (capture current behavior)

1. Get the extension's `plugin.json` + `src/` and its `type`.
2. **Run the full test chain FIRST and save the outputs** — this is the reference the refactor must not break. Use TEST mode's chain (`modes/test.md`): search → detail → toc → chap/page → track (video: chap→track), plus home/genre/explore/gen/comments as declared.
3. Record each script's `data` (or a summary: field set, first item's `link`/`cover`, array counts). Any script already broken → note it; refactor won't fix it, but must not make it worse (hand off to FIX after if needed).

## Phase 1 — diff against the template

Compare the ext against `templates/<type>/` and `SKILL.md` constraints. Build a checklist of style gaps — do NOT touch behavior:

- **config.js**: present for novel/comic/video? Hardcodes the site URL as `let BASE_URL = "https://...";`, then overrides via `try { if (DOMAIN) BASE_URL = DOMAIN; } catch {}` + `normalizeUrl`? A top-level `let BASE_URL = DOMAIN;` (throws if `DOMAIN` absent) or an old-contract `CONFIG_URL` shim should become this hardcode-then-override form (keep the same effective URL).
- **`BASE_URL` vs `DOMAIN`**: scripts should `load('config.js')` and use `BASE_URL`, never `DOMAIN` directly (novel/comic/video). `plugin.json.config` key stays `DOMAIN`.
- **`config.DOMAIN.default` == `metadata.source`** (same URL).
- **normalizeUrl**: every `url`-receiving script (`detail`/`toc`/`chap`/`page`/`track`) calls `url = normalizeUrl(url)` first — one shared function in config.js, not an inline regex per file.
- **response.ok**: every `fetch()` is guarded before `.html()`/`.json()`/etc.
- **next-page token**: `data2` is a string (`.toString()`), `""` for no-more.
- **detail.js fields**: `tags/genres/suggests/reviews/comments` (not old `genres/suggests/comments`); `type`/`format` present.
- **video chap→track**: `chap.js` lists servers `[{title,data}]`, `track.js` resolves; track fallback order `native` → `auto` → `webview` (not `webview` first).
- **plugin.json**: `metadata.encrypt: true`; `script` keys match the files present; no dangling key without a file, no file that should be declared but isn't.
- **teaching comments**: none of the template's placeholder/explainer comments left in (this is a real ext).
- **Rhino/jsoup constraints** (`SKILL.md`): no arrow functions/template literals/`?.`/`??`/spread if the ext used them — but only rewrite these if they're actually present; don't churn working code for pure taste.

## Phase 2 — apply, one concern at a time

Work through the checklist in small, isolated edits. After **each** change that touches a script's runtime path, re-run that script (Phase 3) before moving on — a refactor that silently breaks output is worse than no refactor.

- Prefer mechanical, provably-equivalent edits: extracting the domain-normalize regex into `normalizeUrl`, aliasing `DOMAIN`→`BASE_URL`, renaming detail fields, adding `encrypt`.
- Do NOT change selectors, request URLs, pagination logic, or response shape unless a template-contract field is genuinely missing (e.g. `avatar`/`replies` a real site supports but the ext omits — adding is a feature, ask first).
- If a site-specific script legitimately diverges from the template (custom player resolve, ajax pagination, signed requests), **keep its logic** — only align the surrounding conventions (config load, BASE_URL, response.ok). Don't force it into the template shape.

## Phase 3 — verify parity (before == after)

For every script touched:

1. Re-run `vbook.js test <ext-dir> <script>.js <same args as Phase 0>`.
2. **Compare against the Phase 0 baseline** — same field set, same/equivalent values, same array counts, same `link`/`cover`/`url` hosts. `code:0` alone is not a pass; the data must match what it produced before (the field-rigor bar is the shared standard in `reference/verify-checklist.md`, but here parity with baseline is the pass condition, not just validity).
3. Any divergence from baseline that isn't an intended contract fix → revert that edit, it changed behavior.
4. Re-run dependent scripts too (a config.js change touches every script that loads it — re-test the whole chain, not just the edited file).

## Phase 4 — close out

1. Bump `plugin.json.metadata.version` by 1.
2. Summarize the style changes made and confirm behavior is unchanged (baseline matched).
3. Ask before `vbook.js build`/`install`.

## Done criteria

Every script's output matches its Phase 0 baseline (behavior unchanged), the ext follows the `templates/<type>/` conventions and `SKILL.md` constraints, teaching comments stripped, `version` bumped.
