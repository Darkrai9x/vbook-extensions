# CREATE mode

Standard procedure for writing, testing, and fixing one extension end to end. Follow phases in order.

## Phase 0 — scope the site

1. Fetch the target URL (WebFetch or `curl`).
2. Determine `type`: `novel` / `comic` / `audio` / `video` / `tts` / `translate`.
3. Collect real sample pages: one real **detail** page URL, one real **chapter/episode** page URL reachable from it. `tts`/`translate` need none.
4. If only given a homepage, ask for a detail-page URL, or fetch the homepage and click through to one yourself.

## Phase 1 — scaffold

1. Copy `templates/<type>/` into the extension's target folder.
2. Fill `plugin.json.metadata`: `name`, `source`, `regexp` (must match the real detail-page URL), `locale`, `type`, `nsfw`.
3. Set `config.DOMAIN.default` to the **exact same URL** as `metadata.source` (`BASE_URL` in `config.js` traces back to this value) — the two must never diverge.
4. Cross-check `reference/extension-api.md`'s "Required scripts per type" table. Drop any `plugin.json.script` key (and file) the site genuinely can't support. Keep everything else, including optional ones.
   - **Per-chapter content is always `chap.js`** (novel → HTML string, comic → image URL array; video/audio → `chap`→`track`). Putting content in `page` renders a blank chapter — the app reads chapter content from `chap`/`track`, never `page`.
   - **`page.js` is optional TOC pagination**, any content type: only needed when a title's chapter/episode list spans multiple table-of-contents pages (`page` enumerates the TOC pages, each fed back to `toc`). Most sites' lists fit one `toc` call → delete `page.js` and drop the `plugin.json.script` key.
5. `icon.png` — **mandatory, every extension ships one**. Real site logo/favicon, not a placeholder. Prefer apple-touch-icon/og:image/logo asset over favicon.ico. Resize to exactly **200x200**, compress (tinypng or equivalent). The file must exist at `<ext-dir>/icon.png` before the final install — an install without it (or run with `--no-icon`) leaves the extension iconless in the app.

## Phase 2 — write → test → fix, one script at a time

Order:

1. `detail.js` (or the type's primary script)
2. `toc.js`
3. per-chapter content: `chap.js` (or `track.js` for video/audio). `page.js` is TOC pagination, not content — write it only if the chapter list is paginated (step 1's note).
   - **video/audio is a `chap`→`track` chain** (see `reference/extension-api.md`). `chap.js(episodeUrl)` returns the episode's server list `[{title, data}]` (one entry per source button; single-server sites return a one-element list). `track.js(data)` then resolves the chosen `data` to the playback object. Test both: `chap` first (get a real server `data`), then `track` with that `data`.
   - **audio differs from video on five points** — `chap` is required (not optional), only the first `chap` entry is ever used (no source picker), `chap` must return an array/object not a bare URL string, `track` must resolve `native` (no `auto`/`webview` path), and `detail.js`'s `format` must be `"album"` (playlist) or `"audio"` (single track). Lyrics ride on `track.js`'s `lyrics` field (prefer an LRC url so the pane syncs), never `subtitles`. Read the audio-chain section of `reference/extension-api.md` before writing one.
   - `track.js`: **always try to resolve the real direct stream first** (`.m3u8`/`.mp4`) and return `type: "native"`. If `data` is a 3rd-party embed URL, fetch it and grab the stream from the page (regex the `.m3u8`/`.mp4`, or the `file:`/`sources:` key). When direct resolution is genuinely too hard (obfuscated/JS-built links, DRM, per-request tokens), fall back to **`type: "auto"`** (pass the embed URL as `data`, let the app sniff the stream) — prefer `auto` over `webview`. Only use `type: "webview"` (resolve in a headless page) if `auto` also can't play it. Order: `native` → `auto` → `webview`.
4. `search.js`
5. `home.js`, `genre.js`, `explore.js`
6. `similar.js`, `comments.js` (if `detail.js` references them)
7. `tts`: `voice.js` then `tts.js`. `translate`: `language.js` then `translate.js`.

For each script:

1. **Write** selectors from the real fetched HTML — never guess a class/id. Apply every constraint in `SKILL.md`. Save the file before testing (the CLI reads from disk).
2. **Run** `node .agents/skills/vbook-extensions/scripts/vbook.js test <ext-dir> <script>.js <arg1> <arg2> ...` (args in documented order, all strings). It calls `/connect` first (prints the target device), then logs the input and the `{code,log,data}` output. See the CLI section in `SKILL.md`.
4. **Verify `data` against the shared standard in `reference/verify-checklist.md`** — `code:0` alone is not a pass. All checks hold → script done, move to the next. Any fail → read `log`, fix precisely, re-run step 2.
5. **Escalate after ~3 fix/retest cycles without progress**:
   - For a `url`-receiving script: check for the trailing-`/`-stripped case (constraint 7 in `SKILL.md`).
   - Re-fetch the live page, re-diff selectors.
   - Check if content is JS-rendered — switch to `Engine.newBrowser()`.
   - Check if the site needs a Cloudflare-style bypass — see `bypass.js` pattern in `truyenqq/src/bypass.js` at repo root.

Do not move to the next script while the current one fails.

## Phase 3 — package

Once every mandatory and kept-optional script passes:

1. Strip the template's teaching comments from every script (see the Templates section in `SKILL.md`) — keep only comments documenting non-obvious site-specific logic you added.
2. Summarize what was built and what was dropped as unsupported.
3. Confirm `<ext-dir>/icon.png` exists (200x200) — the final install must carry it. Never ship the final install with `--no-icon`; that flag is for fast iteration probes only.
4. Ask before running `vbook.js build` and/or `vbook.js install`.

## Done criteria

Every script in the final `plugin.json.script` passes `vbook.js test` with correctly-shaped, verified data. No script violates a `SKILL.md` constraint. `<ext-dir>/icon.png` (200x200) exists and the final install was run **without** `--no-icon`.
