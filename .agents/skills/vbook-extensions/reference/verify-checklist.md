# Verify checklist — `code:0` alone is not a pass

Check each script's `data` against its field table in `reference/extension-api.md`; rules behind each check live in runtime.md / type-contracts.md.

- **Fields:** every documented field present, right type; none silently empty/null.
- **URLs:** `link`/`url`/`cover` absolute (or `host` set); not `undefined`, not a lazy-load stub; no protocol-relative `//…`.
- **Values match the live page:** real `name`, real cover image, correct list order, real `description`/`detail`/`content` (no nav/ad boilerplate).
- **Counts:** arrays match the page (1 item when the page lists 20 = fail).
- **Routing/pagination:** `metadata.regexp` matches a real full detail URL; declared `page` returns ≥1 absolute TOC-page URL; `toc` returns chapters for every page tested.
- **Comic `chap`:** image array; each entry a URL string or image object with non-empty `link`.
- **Audio/video `chap`:** tracks wrapped in an array/object; every non-blank `data` has a unique non-empty title (server selection restore).
- **Video danmaku (if returned):** each `data` a real URL, base64 data URI, or comment content; `type` matches the format or is empty (auto-detect); same episode.
- **News `article` / forum `posts`:** run with a real list item `link`; output meets type-contracts.md › News and forum (post `id`/`floor`, `user.name`, `{ posts, page, total_pages }` numeric tokens, `data2` `""` at end, embeds kept, unsupported iframes → links).
- **Explore/list navigation:** meets type-contracts.md › Shared navigation/detail (`more` headers, not removed `action`; valid action `type`; stream/short only to bypass detail); short sections `shape: "short"` with real 9:16 items; each `script` section tested with its `input` and page `""`, returning real items as `data`.
- **Image referrer:** image that loads only without `Referer` (or with origin only) has `referrerpolicy` or `#referrerpolicy=…`.
- **Cover script:** `#script=cover.js` cover returns bare base64 (no `data:`, not `Response`) decoding to a real image.
- **No silent domain move:** `link`/`cover`/`href` on a host other than `metadata.source` = site moved, even on an otherwise passing script (FIX › Domain move).
- **AI streaming:** `chatStream` emits tokens (or returns one complete non-empty string), checks HTTP errors, returns success after the stream ends.

All hold → pass. Any fail → read `log`, fix precisely, re-test. ~3 cycles without progress → re-fetch the live page, re-diff selectors, check trailing-slash behavior and client rendering, reconsider the diagnosis before changing anything else (don't broaden the edit).
