# TEST mode

Standard procedure for testing an existing extension. Read-only — do not edit any script in this mode. If the user wants fixes applied, hand off to `modes/fix.md` after reporting.

Two scopes:

- **Test all** — audit every declared script end to end, report pass/fail per script. Go to [Test all](#test-all).
- **Test one** — check a single named script, fast. Go to [Test one](#test-one).

If the user names a script (or says "just check X"), use **Test one**. If they say "test this extension" / "what's broken" with no script named, use **Test all**. If unclear, ask.

## Phase 0 — collect (both scopes)

1. Get the extension's `plugin.json` + `src/` (its repo-relative dir, e.g. `hhtqvietsub`).
2. Read `plugin.json.script` for the declared scripts and `metadata.type`.

---

## Test all

Scripts feed each other real values (a `search` result's `link` becomes `detail`'s `url`, `detail`'s `toc` url feeds `toc`, `toc`'s chapter url feeds `chap`/`page`/`track`). Testing each script in isolation with a made-up input produces false failures — chain real data forward:

1. If `home`/`genre` is declared: run it standalone (no args), take one real `{ input, script }` entry forward.
2. `search`: run with a real keyword (or the `input` from step 1 if it's a category tab), capture one real item `link`.
3. `detail`: run with that `link`, capture the canonical `url` (for `toc`) and every referenced `{ input, script }` in `tags`/`genres`/`suggests`/`reviews`/`comments`.
4. `toc`: run with `detail`'s url, capture one real chapter/episode url.
5. per-chapter content:
   - novel `chap` / comic `page`|`chap`: run with the chapter url.
   - video/audio: run `chap` with the episode url → capture one server entry's `data` → run `track` with that `data` (the `chap`→`track` chain).
6. `explore`: run standalone, no chained input needed.
7. Any script referenced from `detail`'s fields (e.g. `similar.js`, `comments.js`): run with the captured `input`.
8. `tts`: run `voice` first, capture a real `id`, then run `tts` with it. `translate`: run `language` first, capture a real `id`, then run `translate` with it.

If a script in the chain fails and blocks getting real data for the next one, ask the user for a direct sample input for the blocked script instead of guessing — keep testing every other script independently rather than stopping the whole audit.

Run and verify every script in the chain (procedure below), regardless of whether earlier ones failed, then produce the full report:

| Script | Status | Cause | Detail |
|---|---|---|---|

- Group failures by class (connectivity / silent domain move / selector / config / contract) so a single root cause (e.g. a domain change) doesn't read as N unrelated failures.
- Call out any script that couldn't be tested at all (blocked by an upstream failure with no user-supplied fallback input) as **UNTESTED**, not PASS or FAIL.
- End with one line per failure class naming which `modes/fix.md` path applies (domain swap / broken selector / migration) — don't apply the fix yourself in this mode.

**Done criteria (test all):** every script in `plugin.json.script` has a recorded PASS/FAIL/UNTESTED with a specific cause, delivered as a report. No script was edited.

## Test one

1. Identify the named script and what input it needs (`reference/extension-api.md`'s signature table).
2. Get a real input for it — from the user directly, or by running only the minimal upstream chain needed to produce one (e.g. testing `chap.js` needs a real chapter url: run `search` → `detail` → `toc` just far enough to get one). Don't run scripts unrelated to the target.
3. Run and verify (procedure below).
4. Report just that script: PASS, or FAIL with class + specific cause. No table needed for a single script.

**Done criteria (test one):** the named script has a recorded PASS/FAIL with a specific cause.

---

## Run-and-verify procedure (used by both scopes)

1. `node .agents/skills/vbook-extensions/scripts/vbook.js test <ext-dir> <script>.js <args...>` (see the CLI section in `SKILL.md`). It checks `/connect` first, then logs the exact input and the `{code,log,data}` output.
2. Verify `data` against the shared standard in `reference/verify-checklist.md` — same rigor as CREATE/FIX mode: fields present + right type, no silent empty/null, real usable URLs, values match a live fetch, expected array counts, and the silent-domain-move check.
3. Classify:
   - **PASS** — `code:0`, all checks above hold.
   - **FAIL: connectivity** — timeout, DNS error, non-2xx the script doesn't guard, or a domain that no longer resolves.
   - **FAIL: silent domain move** — `code:0` and fields present, but URLs resolve through a different host than declared.
   - **FAIL: selector** — `code:0` but a field is empty/wrong/garbled, or an exception on a `.attr()`/`.text()` chain into an empty selection.
   - **FAIL: config/load error** — `SyntaxError` or crash at script-load time (config-name collision, bad `load(...)`, missing shared file in `src`).
   - **FAIL: contract mismatch** — old-contract fields (`genres`/`suggests`/`comments` instead of `tags`/`genres`/`suggests`/`reviews`/`comments`), flat `config` values, or other prior-engine patterns still in place.
5. Record the exact `log` line or field that triggered the classification — the report must point at specifics, not "detail.js is broken."
