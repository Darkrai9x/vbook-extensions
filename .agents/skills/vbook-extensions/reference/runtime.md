# Runtime rules

Read before editing extension JS or `plugin.json`. Verified against the real Rhino/ScriptExecutor/jsoup runtime.

## Script and config contract

- `load('file.js')` = text substitution before the script runs (API "Loading other scripts — `load()`"): literal filename only; file at top level of `src/`; missing file → silently nothing (later code sees undefined names); not recursive (a loaded library must not `load`); matched anywhere, so a commented-out `load()` still expands.
- `crypto.js` always = bundled CryptoJS (crypto-js 4.2.0). WordArray `.toString()` is hex → always pass an encoder: `CryptoJS.enc.Utf8` for text, `CryptoJS.enc.Base64` for binary. Decrypting binary data with CryptoJS is fine.
- Two `config.js` meanings — never mix:
  - shared site library (`BASE_URL`, `normalizeUrl`) via `load('config.js')`;
  - dynamic settings script `plugin.json.script.config` → give it another filename (e.g. `settings.js`) when `config.js` is the shared library.
- Never declare a variable named like an injected static config key. Static settings and bare connection keys are injected as strings → parse explicitly.
- Dynamic setting values: `localConfig.getItem(key, defaultValue)` (not injected). `mode: "database"` uses `localDatabase`.
- `thread_num`, `delay`, `ignore` = bare number/boolean connection settings. `timeout` is not → `fetch(..., { timeout: ms })`.
- Every positional `execute(...)` argument is a string. Scripts without positional args read context from `localBook`, `localConfig`, `localDatabase`.
- `Response.success(items, next)`: `next` is a string; `""` ends paging — never `null`, `0`, or a number.
- Uncaught exception kills the call. Guard optional selections/bridge returns; `Response.error(...)` for expected failures.
- App strips a trailing `/` from URL arguments; `/extension/test` does not → restore it when the source requires it.
- `metadata.regexp` (novel/comic/audio/video only) matches the whole URL; test on a real detail URL. Bare host regex never routes.

## Rhino ES6 limits

Forbidden: `async`/`await`, arrow functions, template literals, optional chaining, nullish coalescing, object/array spread, `flat`/`flatMap`, numeric separators, named regex groups, lookbehind, Java interop. Use functions, string concatenation, loops, `Object.assign`, plain capture groups.

Coerce bridge values with `String`/`Number`/`parseInt`; don't rely on `typeof` across the host boundary. iOS: failing bridge may return `undefined`; no WebSocket binary messages; actions can't be interrupted.

## Fetching and parsing

Check `response.ok` before `.html()`/`.json()`/`.text()`/`.base64()`:

```js
let response = fetch(url);
if (!response.ok) return Response.error("HTTP " + response.status);
let doc = response.html();
```

jsoup selectors before regex. Regex only for values outside the DOM (embedded JSON/RSC state, inline scripts, encoded attributes, player stream URLs): select the smallest node first, unescape once in a shared helper, comment why.

jsoup:

- jsoup selectors, not browser CSS/XPath (`:visible` unsupported).
- Inserts implied elements, auto-closes markup → inspect `doc.html()` when unsure.
- `get`/`first`/`last` on empty selection → empty element (methods return `""`), never `null`: test `.size()`, `.attr()`, or `.text()`, not `!el`.
- `attr()` → `""` when absent. Collection `attr()` reads the first element that has it; `text()` concatenates all.
- `attr("href")` is raw → resolve it or `absUrl("href")` with a base URI.

## URLs and site config

Novel/comic/audio/video/news/forum:

- `config.js` (shared library): working hardcoded `BASE_URL` first, then optional override from injected `DOMAIN` inside `try/catch`. Never initialize `BASE_URL` directly from possibly-absent `DOMAIN`.
- One shared `normalizeUrl` in `config.js`. Every site-URL script (`detail`, `page`, `toc`, `chap`, `article`, `posts`) loads config and normalizes the incoming host before fetching. Normalize `track(data)` only when `data` is a site URL, never opaque JSON or a third-party stream.
- `config.DOMAIN.default == metadata.source`. Real mirrors → a select setting, not alternate hosts scattered through scripts.
- Returned URLs: relative → joined with `host`/`source`; protocol-relative `//cdn…` not resolved → prefix `https:`.

## Images and referrer

- Covers load with `Referer` = item `link` (or detail URL); comic images use the chapter URL.
- CDN rejects that (403, placeholder, hotlink image) → `referrerpolicy: "no-referrer"` or `"origin"` beside `cover` on explore/list/search items and detail, or on a comic image object (also covers `fallback`). Plain string URL → append `#referrerpolicy=no-referrer` (fragment never sent; attribute wins over fragment). Prove the accepted referrer with curl first; never proxy or re-host images.
- Bytes scrambled/encrypted (not an image until the site's JS undoes them) → cover URL `…#script=cover.js` (combine: `#referrerpolicy=no-referrer&script=cover.js`). App calls `cover.js` as `execute(url)` with the URL minus its fragment; expects a bare base64 string (not `Response`, no `data:` prefix); `null`/empty = cover fails. For covers and cover-like images (avatars), not chapter images (they have their own `script` field).

## Explore section data

Per section, by how the site serves it (static and dynamic mix freely):

- **Static `items`:** data already in the response `explore.js` fetched; no extra request.
- **Dynamic `script` (+ `input`):** data needs its own request. Script `fetch` calls are sequential → chaining in `explore.js` blocks the page; section scripts run in parallel (a few at a time, top first).

Rules:

- Section script = list script first page: `execute(input, "")`, items in `data`; `data2` ignored. Reuse the section's `more` list script when it takes the same input.
- Both set → `items` wins. Empty result hides the section; failure shows retry. Pull to refresh reruns `explore.js`, then section scripts.
- **Last** section + dynamic + top-to-bottom layout (`grid`, `list`, `news_hero`, `news_list`, `thread_list`, `board_list`) + non-empty `data2` → infinite scroll: `execute(input, data2)` until `data2` is empty or repeats. Stable `link` per item (duplicates drop).
- `home` tab or `genre` entry with `type: "explore"` opens an explore page: its `script` is `execute(input)`, returns sections like `explore.js`.

## Packaging and actions

- Files referenced dynamically from detail fields (`similar.js`, `comments.js`) need not be declared in `plugin.json.script`.
- Static/dynamic actions run only after the user presses Start. Log with `Log.log`/`console.log`; return a final `Response`. Book actions use `localBook` (no positional book argument).
- Strip template teaching comments before build/install; keep only comments explaining non-obvious source behavior.
