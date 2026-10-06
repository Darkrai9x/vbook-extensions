# FIX mode

Standard procedure for diagnosing and repairing one existing extension. Follow phases in order — reproduce before editing.

## Phase 0 — triage

1. Get the extension's current `plugin.json` + `src/`.
2. Identify the symptom class:
   - **Dead/changed domain** — requests fail outright (timeouts, DNS errors, redirect to new host).
   - **Broken selector** — requests succeed but `detail`/`toc`/`chap`/`search`/etc. return empty, wrong, or partially-missing fields.
   - **Old-contract extension** — written against the prior engine (see `wikidich/`, `truyenqq/` at repo root for examples): legacy flat UI `config` values, old detail fields, or a `CONFIG_URL` override block. Do not misclassify the documented bare connection/TTS/translate engine keys as legacy config.
   - Multiple classes can apply at once — handle in the order below regardless.
3. If unclear, reproduce first (Phase 1).

## Phase 1 — reproduce

1. Pick one broken script and a known-good input for it.
2. Run `node .agents/skills/vbook-extensions/scripts/vbook.js test <ext-dir> <script>.js <args...>` (see the CLI section in `SKILL.md`; it checks `/connect` and logs input/output).
3. Read the result:
   - Connection-level failure → domain/connectivity issue.
   - `code:0` but `data` empty/missing/garbled → selector issue.
   - `code:0` with good data but `link`/`cover`/`href` on a **different host** than `plugin.json` → silent domain move (see Domain swap); the old host still 200s via redirect but the site really lives on the new host.
   - `SyntaxError` or config-related crash on load → old-contract config collision.
4. Confirm the class from this result — don't guess from the symptom description.

## Phase 2 — apply the fix

### Domain swap

A "silent" domain move is easy to miss: the old host still returns 200 because it transparently redirects/proxies to the new one, so fetches succeed and nothing errors. Detect it in Phase 1 — if `link`/`cover`/`href` values in the test result come back on a **different host** than the one in `plugin.json`, the site has moved. Swap to the new host even though the old one still "works"; relying on the redirect breaks the moment the old host is retired.

1. Confirm the new domain (the host the live page actually serves links/covers from, not just whatever still returns 200).
2. Update `plugin.json.metadata.source`, the `DOMAIN` config's `default` (or the `BASE_URL` constant in an old-contract `config.js`), and widen `metadata.regexp` to whole-match full URLs on both hosts (e.g. `(https?://)?(www\\.)?hhtq\\.(hair|today)/.+`) so existing library links still resolve. For multiple mirrors, use a `mode:"select"` config entry with `values` (see `reference/extension-api.md`) instead of hardcoding one.
3. Re-test with the new host set as base — confirm the new host serves directly (200 + correct data), not only via the old host's redirect.
4. Move to Phase 3.

### Broken selector

1. Fetch the live page tied to the failing script, diff its markup against the script's `.select(...)` chains.
2. Fix only the changed selectors — no rewrites of surrounding logic, response shape, or unrelated scripts.
3. Move to Phase 3.

### Old → new contract migration

1. Remove any `let X = ...; try { if (CONFIG_URL) ... } catch {}` config-override block.
2. Convert legacy flat user-facing `plugin.json.config` entries to the object form (`title`/`mode`/`format`/`default`). Preserve recognized bare connection keys and TTS/translate engine keys in the exact number/boolean form documented by the API.
3. In every `detail.js`: rename `genres`/`suggests`/`comments` to `tags`/`genres`/`suggests`/`reviews`/`comments`, add `type`/`format`.
4. Add `home`/`explore`/`genre` only if the site supports them and the user wants them.
5. Move to Phase 3 for every script, not just the one that first failed.

## Phase 3 — verify → fix → retest loop

`code:0` alone is not a pass:

1. Run `vbook.js test` for the script(s) touched in Phase 2.
2. Verify `data` against the shared standard in `reference/verify-checklist.md` (fields present + right type, no silent empty/null, real usable URLs, values match the live page, expected array counts, no silent domain move).
3. Fail → read `log`, fix precisely, re-test. After ~3 cycles without progress, re-fetch the live page before changing anything else.
4. Once directly-touched scripts pass, re-test dependent scripts in dependency order (e.g. `detail` → `toc` → `chap`), applying the same verification.

## Phase 4 — close out

1. Bump `plugin.json.metadata.version` by 1.
2. Summarize what changed and why. Scope stays to the reported problem — no drive-by refactors.
3. Ask before running `vbook.js build`/`install`.

## Done criteria

The specific broken behavior passes `vbook.js test` with correctly-shaped, verified data. Every dependent script still passes. `version` bumped. No unrelated script touched.
