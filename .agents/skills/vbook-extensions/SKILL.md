---
name: vbook-extensions
description: Create, fix, test, or refactor vBook extensions against the current engine API (extension-api.md + the real ScriptExecutor runtime) — novel/comic/audio/video/tts/translate/ai types, explore sections, richer detail/config schema. Tests, builds, and installs via the `scripts/vbook.js` CLI against the vBook local REST API. Trigger when the user wants a new extension built, an existing one fixed/updated, audited/tested for which script is failing, or refactored to the current template style, and mentions the vBook server / extension-api.md / newer script fields (explore, tags, format, track).
---

# vBook extensions (current engine, REST-API-driven)

This is the canonical, vendor-neutral Agent Skill for this repository. It follows the
open Agent Skills layout and is discovered from `.agents/skills/` by Codex, Gemini CLI,
Cursor, and GitHub Copilot. Claude Code reaches the same skill through the compatibility
entry under `.claude/skills/`.

Resolve `reference/`, `modes/`, `templates/`, and `scripts/` relative to the directory
containing this `SKILL.md`. Do not assume the skill was installed under a vendor-specific
folder when reading bundled resources. The commands below use the repository's canonical
path because they are run from the repo root.

Read before writing any script:

- **`reference/extension-api.md`** — field/script contract, `plugin.json` shape, JS API surface. Copy of the repo-root `extension-api.md` — re-copy if it changes.

The Constraints and JS engine/HTML parser sections below are distilled from the engine's `ScriptExecutor.kt` and Rhino/jsoup setup directly — treat them as verified ground truth, not guesses.

A prior engine version used a different contract (flat `code:200/403`, no `explore`, no video/tts/translate, `let BASE_URL = ...; try { if (CONFIG_URL) ... }` config override, `detail.js` fields named `genres/suggests/comments` instead of `tags/genres/suggests/reviews/comments`). Repo-root folders like `wikidich/`, `truyenqq/` are old-contract examples — never mix that contract into a new extension.

## Constraints

1. **`load('file.js')`** — literal string only, exactly `load('name.js');`. Not recursive: a loaded library must not itself contain a `load(...)` call. `crypto.js` is reserved — always resolves to the bundled CryptoJS, ignoring any `src/crypto.js`.

2. **Never declare a variable with the same name as an injected static `plugin.json.config` key** (`let DOMAIN = ...`). Static setting keys and bare connection keys are injected as string constants before the script runs; redeclaring one is a `SyntaxError`. Parse injected values yourself: `parseInt(PAGE_SIZE, 10)`, `IS_TOGGLE === "true"`. Dynamic `config.js` values and `mode: "database"` entries are not injected; read dynamic values with `localConfig` and database values with `localDatabase`.
   - `thread_num`, `delay`, and `ignore` are valid only as bare JSON number/boolean values under `config`; the app reads them as connection limits/default incognito and also injects their string form. `timeout` is not a connection setting; set `fetch(..., { timeout: ms })` instead.

3. **Every positional argument passed to `execute(...)` is a string.** Scripts with no parameters (`config`, `action`, `home`, etc.) read their context from the bridged APIs such as `localBook`, `localConfig`, and `localDatabase`. Guard optional positional parameters with `param || default`, parse with `parseInt`/string-compare — never assume a real number or boolean.

4. **The next-page token (`data2` in `Response.success(items, next)`) must be a string.** Convert with `.toString()` if computed as a number. `""` means no more pages — never `null`/`0`/a bare number.

5. **Uncaught JS exceptions kill the whole call, not `Response.error`.** Check `.isEmpty()`/`.size()` before chaining `.attr()`/`.text()` into a selector that might not match. Use explicit `Response.error("...")` for expected failure paths.

6. **One script file = one `execute` function.** No multi-function exports.

7. **Normal app execution strips a trailing `/` from HTTP(S) URL arguments** passed to `detail`/`page`/`toc`/`chap`/`track` and the first argument of list scripts. Re-add it if the site needs it. The developer server's `/extension/test` passes arguments unchanged.

8. **Normalize the incoming `url`'s host to `BASE_URL` before fetching, in every URL-receiving content script** (`detail`/`page`/`toc`/`chap`): `url = normalizeUrl(url);` — the function lives once in `config.js` (`load('config.js');` required), not repeated per script. The incoming URL may carry an old/mirror/www-prefixed host; rewriting its host keeps requests on the configured domain. Treat opaque `track(data)` payloads separately: normalize only when `data` is actually a site URL, not JSON or a direct third-party stream.

9. **`metadata.regexp` is a whole-string match.** Test it against a real full detail URL. A host-only pattern such as `example\\.com` never matches; use a pattern that covers the scheme/path, e.g. `(https?://)?(www\\.)?example\\.com/.+`.

## JS engine & HTML parser (Rhino / jsoup)

Engine: Rhino `1.8.1`, `languageVersion = Context.VERSION_ES6`, `initSafeStandardObjects()`. HTML: jsoup `Document`/`Elements`/`Element` behind `Html`/`fetch(...).html()`.

**Rhino:**

- Do not use: `async`/`await`, `?.`, `??`, object/array spread (`{...obj}`), `Array.prototype.flat`/`flatMap`, numeric separators (`1_000`).
- Use instead: sequential calls, `obj && obj.prop`, `x || default`, `Object.assign`/`.concat()`/`for` loops.
- Write `function (el) { ... }` + `+` concatenation — not arrow functions, not template literals.
- No Java interop: `java.*`, `Packages.*`, `importClass`/`importPackage` unavailable. Only the bridged surface in `reference/extension-api.md` exists.
- On iOS, a failing bridged native call may return `undefined` instead of throwing. Check return values when failure matters; WebSocket binary messages are not usable there and actions cannot be interrupted mid-run.
- Coerce host-returned values explicitly: `String(x)`, `parseInt(x, 10)`, `Number(x)`. Never branch on `typeof` across the JS/host boundary.
- Regex: no named capture groups `(?<name>...)`, no lookbehind `(?<=...)`/`(?<!...)`. Plain capture groups only.

**jsoup:**

- Selectors are jsoup's own dialect (`:contains()`, `:has()`, `a[href^=http]`), not `document.querySelector` — no `:visible`, no XPath.
- jsoup inserts implied tags (e.g. `<tbody>`) and auto-closes unclosed ones — if a selector matching raw view-source doesn't match `.select(...)`, log `doc.html()` and check the parsed structure.
- `Element.attr("name")` returns `""` when missing — never `null`/`undefined`.
- `Elements.first()` on an empty selection returns `null` — guard with `.isEmpty()`/`.size()` before chaining.
- `.attr()` on an `Elements` collection reads the first element; `.text()` on the same collection concatenates every matched element's text. Add `.first()` explicitly for one element.
- `.attr("href")` returns the raw value, not absolute — resolve it against `BASE_URL`, or use `.absUrl("href")` when the parsed document has a base URI.

## Hard rule: jsoup first, regex only when the DOM can't reach it

**Always try a jsoup selector before reaching for a regex over the raw response text.** Selectors survive whitespace, attribute reordering, and markup churn; regexes over HTML break on all three. Write `doc.select(...)` and only fall back to `response.text()` + regex when the data genuinely isn't in the parsed DOM.

Legitimate regex cases — the value is not a DOM node at all:

- **Data embedded in a script/JSON blob**: Next.js RSC payloads (`self.__next_f.push`), `__NEXT_DATA__`, `window.__INITIAL_STATE__`, inline config objects. Client-rendered lists often exist *only* here (a `BAILOUT_TO_CLIENT_SIDE_RENDERING` marker is the giveaway) — the visible anchors on such a page usually belong to the sidebar, not the list you want.
- **Values inside an attribute or text node** (an id in a `style="url(...)"`, a stream link inside an inline `<script>`), after selecting that node with jsoup.
- **A stream URL scraped from a player page** that never becomes markup.

Rules when you do use regex:

- Select the smallest node you can with jsoup first, then regex *its* `html()`/`text()` — don't regex the whole document.
- Escaped payloads need unescaping once (`text.replace(/\\"/g, '"')`) before matching; do it in one shared helper in `config.js`, not per script.
- **Mixing is normal and correct**: e.g. take a list's items from the JSON payload but its labels from the rendered nav, when only the nav carries them.
- Note *why* the regex is there in a one-line comment, so the next edit doesn't "fix" it back into a selector that can't work.

## Hard rule: always check `response.ok`

`fetch()`/`Http.get()` never throws on HTTP error status. Never call `.html()`/`.json()`/`.text()`/`.base64()` before checking `.ok`:

```js
let response = fetch(url);
if (!response.ok) return Response.error("HTTP " + response.status);
let doc = response.html();
```

## Templates

`templates/<type>/` — starter scripts for the content type. `SELECTOR_*` placeholders get filled from real fetched HTML. Cross-check `extension-api.md`'s "Required scripts per type" table: keep required scripts, and keep optional scripts only when the source supports them.

Package invariants: scripts must sit directly under `src/` (subfolders are ignored), each script must be at most 10 MB, and `plugin.json` must be at most 2 MB. An extension needs at least one readable script. The icon is optional and capped at 5 MB.

**Strip the template's teaching comments when shipping a real extension.** The `//` comments in template files (the file-header explainer in `config.js`, `page.js`, `chap.js`, `comments.js`, the inline `// browsing a tab: ...` / `// Many comic sites lazy-load ...` notes, etc.) exist to guide you while filling the template — they are not part of a finished extension. Remove them from every script before build/install; keep only comments that document genuinely non-obvious site-specific logic you added yourself.

- `templates/novel/` — config, home, explore, genre, search, detail, page, toc, chap, similar, comments
- `templates/comic/` — config, home, explore, genre, search, detail, page, toc, chap, similar, comments
- **`page` (all four content types)** — optional table-of-contents pagination. It receives the book URL and returns at least one absolute TOC-page URL; the app calls `toc` for each. Delete it and omit the script key when the source has one TOC page. Comic images always come from `chap`, never `page`.
- `templates/video/` — config, home, explore, genre, search, detail, page, toc, chap, track, similar, comments — video playback is a required `chap`→`track` chain: `chap.js` lists an episode's servers `[{title, data}]`, `track.js` resolves a chosen `data` to the stream. Formats are `series`, `stream`, and `short`. List/explore items may use `type: "stream"` to open the player directly or `type: "short"` to enter the vertical feed; short cards should use section `shape: "short"`. If the site provides bullet comments, return optional `danmaku` sources in the `track.js` result; see `reference/extension-api.md` for accepted data and formats.
- `templates/audio/` — config, home, explore, genre, search, detail, page, toc, chap, track, similar, comments — music/audiobook/podcast sources. Same required `chap`→`track` chain as video, but there is **no source picker** (the first non-blank `chap` entry wins) and `track` must resolve to a real media URL (`native`) — `auto`/`webview` don't work for audio. A bare URL as the entire `chap` result is unsafe; wrap the track in an array/object. `detail.js`'s `format` is `"album"` (playlist) or `"audio"` (single track). Lyrics go in `track.js`'s **`lyrics`** field (LRC / VTT / plain text, or raw text inline) — **not** `subtitles`, which audio never reads. See the audio-chain notes in `reference/extension-api.md`.
- `templates/tts/` — voice, tts. Engine controls such as `preload_size`, `preload_parallel`, and `max_length` are bare JSON number/boolean values, not setting objects; set `max_length > 0` or the app splits every character into a request.
- `templates/translate/` — language, translate. `support_auto_detect`, `max_line`, and `max_length` are bare JSON values; a provider API key is a separate ordinary `input` setting injected into the script.
- `templates/ai/` — `chatStream`; provider URL, API key, and model belong to the extension config. Stream with `fetch(..., { stream: true })`, `response.readLine()`, and `ai.emitToken(...)`, or return one complete string for a non-streaming provider.

Actions may be static (`plugin.json.actions`) or dynamic (`script.action`). They open a run sheet and start only when the user presses **Start**. For long-running actions, `Log.log(...)` or `console.log(...)` updates the sheet live; return `Response.success("message")` or `Response.error("message")` for the final status. Android/JVM can interrupt a running action; on iOS Stop only closes the sheet while the script continues in the background. Book-scoped actions read context through `localBook`; they do not receive a positional book argument. See the action contract in `reference/extension-api.md`.

`novel`/`comic`/`audio`/`video` only: `config.js` hardcodes the current site URL as `let BASE_URL = "https://...";`, then overrides it with the `DOMAIN` config key inside a `try/catch` (`if (DOMAIN) BASE_URL = DOMAIN;`). This order is deliberate — the hardcoded default keeps `BASE_URL` valid even if the app doesn't inject `DOMAIN` (the `ReferenceError` on the bare `DOMAIN` read is caught, `BASE_URL` stays the hardcode); if `DOMAIN` is injected, it wins. Never write `let BASE_URL = DOMAIN;` at top level — that throws an uncaught `ReferenceError` and kills the script when `DOMAIN` is absent. Scripts that need the site's base URL do `load('config.js');` and use `BASE_URL`, never `DOMAIN` directly. Safe under constraint 2 because the name (`BASE_URL`) differs from the config key (`DOMAIN`) it aliases — no redeclaration collision. `tts`/`translate` templates use a hardcoded engine URL directly, no alias, no shim.

`similar.js`/`comments.js` aren't in `plugin.json.script` — referenced dynamically from `detail.js`'s `genres`/`suggests`/`reviews`/`comments` fields by filename. `search.js` doubles as the target for `home.js`/`genre.js` tabs (branches on whether `query` looks like a path/URL vs. a keyword) — a real site's tabs may need dedicated listing scripts if their endpoints don't fit that branch.

## Pick the mode

Read only the file for the mode you're in.

- **CREATE** — new extension from a story/video/comic-site URL. Read `modes/create.md`.
- **FIX** — update an existing extension (domain change, broken selector, old→new contract migration). Read `modes/fix.md`.
- **TEST** — check one existing extension, read-only, no edits. Test all its scripts (full chain report) or test one (single named script). Read `modes/test.md`.
- **AUDIT** — repo-wide: test **every** extension (or a named subset) with one probe each, classify status (work/moved/dead/auth), report. Breadth not depth. Read `modes/audit.md`.
- **REFACTOR** — align an existing, working extension to the current template style (config.js/BASE_URL/normalizeUrl, encrypt, field contract, comment stripping) **without changing behavior**. Read `modes/refactor.md`.

If unclear, ask. Bare URL with no verb → assume CREATE. "Test all extensions" / "which are dead" / "audit repo" → AUDIT (many exts); "test this extension" / "what's broken in X" → TEST (one ext).

## Test / build / install — always via `scripts/vbook.js` (REST API, no MCP)

**Do not use MCP tools. Always use this CLI.** It talks to the vBook local REST API (`extension_docs.md`: `POST /extension/{test,build,install}`), reading `plugin.json` + `src/*.js` from disk itself so you never paste the ~20KB src map into a tool call. Run from the repo root:

```
node .agents/skills/vbook-extensions/scripts/vbook.js connect
node .agents/skills/vbook-extensions/scripts/vbook.js install <ext-dir> [--no-icon]
node .agents/skills/vbook-extensions/scripts/vbook.js test    <ext-dir> <script.js> [arg1 arg2 ...]
node .agents/skills/vbook-extensions/scripts/vbook.js build   <ext-dir> [out.zip]
node .agents/skills/vbook-extensions/scripts/vbook.js testall [ext...] [--query <kw>] [--timeout <ms>] [--json <file>]
```

`testall` is the repo-wide audit (AUDIT mode, `modes/audit.md`): with no ext args it probes every on-disk ext (each dir with `plugin.json`+`src/`), else just the named ones. Per ext it runs `search.js` with `--query` (default `tien`; falls back to `home.js`/first script if no `search`), unwraps the nested `Response` payload, and prints one status line + a grouped summary: **WORK** / **MOVED** (host≠source) / **AUTH/MSG** (`code:1`) / **EMPTY** (`code:0`, 0 items) / **CRASH** (JS error) / **UNREACHABLE** (timeout, auto-retried once). `--json` also writes machine-readable rows. Statuses are one-keyword triage, not proof — never delete on EMPTY/CRASH/UNREACHABLE without a direct dead-site confirmation (see AUDIT mode).

`<ext-dir>` is repo-relative (e.g. `hhtqvietsub`). Args after the script name map to `vararg` (detail/page/toc/chap → `[url]`, search → `[query, page]`, track → `[data]`, tts → `[text, voiceId]`, translate → `[text, from, to, source, model, style]`, chatStream → `[messagesJson, selectedModel]`). If `<ext-dir>/icon.png` exists the CLI includes it; the app accepts any decodable image up to 5 MB and scales it to fit 200x200. `--no-icon` deliberately omits the optional icon.

**Server URL:** the CLI picks a server in this order:
1. `--server <url>` (explicit, single, no probing)
2. env `VBOOK_SERVER` (explicit, single)
3. `scripts/servers.json` — `{ "servers": ["http://ip:port", ...] }`, each probed via `/connect`, **first that answers is used** (prints `(skipped N unreachable)` if it fell through). This file is gitignored/per-machine — copy `scripts/servers.example.json` to `scripts/servers.json` and put the real dev-server URL(s) in it.

Failure messages tell the user what to fix:
- **no server configured** (servers.json missing, no `--server`/env) → copy the example file and fill it in.
- **none responded** (all servers in the list unreachable) → the CLI lists each URL + error; tell the user to open the vBook app and turn ON debug/dev mode (that starts the server) and confirm the IP:port matches `servers.json`.
- **explicit server unreachable** → same dev-mode hint, re-run with the right `--server http://<ip>:<port>`.

Don't guess other hosts — only what's in `servers.json`/`--server`/`VBOOK_SERVER`.

**`/connect` runs first, every time.** Before any test/build/install the CLI calls `GET /connect` and prints `[connect] device: <name>` — always eyeball which device you're about to hit (e.g. installing to the wrong phone). Run `connect` alone to just check. `/connect` returns `{"code":200,"data":"<deviceName>"}`.

**`test` logs input and output.** It prints `[test] input=<the exact {script,vararg} JSON>`, then the server `log`, then `[test] output=<data>` and `[test] code=`. `code:0` in the output is the success marker for the script itself (not the HTTP status). Keep these logs when reporting — they make a run reproducible.

Since the CLI reads from disk, **save edits before running it**. For a throwaway probe, write it into the ext's `src/` dir, run, then revert.

## Done criteria

See "Done criteria" in whichever `modes/*.md` file you followed.
