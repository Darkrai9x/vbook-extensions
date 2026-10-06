# Verify checklist — `code:0` alone is not a pass

Shared verification standard for CREATE / FIX / TEST / REFACTOR modes. After a script returns `code:0`, check its `data` against `reference/extension-api.md`'s field table for that script:

- **Every documented field present, right type.** No field silently empty/null that shouldn't be.
- **`link`/`url`/`cover` are real usable URLs** — absolute, or a `host` field set; not `undefined`, not a lazy-load stub.
- **Values match the live page** — `name` matches the real title, `cover` points to the real image, list order is correct, `description`/`detail` is real content, not nav/ad boilerplate.
- **Arrays have the expected count** — 1 item when the page lists 20 is still a failure.
- **Routing and pagination are usable** — `metadata.regexp` matches a real full detail URL; when `page` is declared it returns at least one absolute TOC-page URL and `toc` returns chapters for every page tested.
- **Comic `chap` returns an image array** — every entry is a URL string or a valid image object with non-empty `link`; `page` is never used for comic images.
- **Audio/video `chap` returns valid tracks** — wrap even one source in an array/object, and give every non-blank `data` a unique non-empty title so server selection can be restored.
- **Video danmaku, when returned, has usable sources** — each `data` is a real URL, base64 data URI, or comment content; `type` matches the source format or is empty for auto-detection. Check that the source belongs to the same episode.
- **Explore/list navigation matches the declared behavior** — section headers use `more` (not the removed `action` field), list actions have `type: "list"`, and item `type: "stream"` / `"short"` is used only when tapping should bypass detail. Short-video sections use `shape: "short"` and contain real 9:16 items.
- **No silent domain move** — if `link`/`cover`/`href` come back on a **different host** than `plugin.json.metadata.source`, the site has moved even though the request returned `code:0`. Flag it even on an otherwise-passing script (see FIX mode's Domain swap).
- **AI streaming completes cleanly** — `chatStream` emits tokens (or returns one complete non-empty string), checks HTTP errors, and returns success after the stream ends.

All hold → the script passes. Any fail → read `log`, fix precisely, re-test. After ~3 fix/retest cycles without progress, re-fetch the live page and re-diff selectors before changing anything else.
