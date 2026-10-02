# Verify checklist — `code:0` alone is not a pass

Shared verification standard for CREATE / FIX / TEST / REFACTOR modes. After a script returns `code:0`, check its `data` against `reference/extension-api.md`'s field table for that script:

- **Every documented field present, right type.** No field silently empty/null that shouldn't be.
- **`link`/`url`/`cover` are real usable URLs** — absolute, or a `host` field set; not `undefined`, not a lazy-load stub.
- **Values match the live page** — `name` matches the real title, `cover` points to the real image, list order is correct, `description`/`detail` is real content, not nav/ad boilerplate.
- **Arrays have the expected count** — 1 item when the page lists 20 is still a failure.
- **No silent domain move** — if `link`/`cover`/`href` come back on a **different host** than `plugin.json.metadata.source`, the site has moved even though the request returned `code:0`. Flag it even on an otherwise-passing script (see FIX mode's Domain swap).

All hold → the script passes. Any fail → read `log`, fix precisely, re-test. After ~3 fix/retest cycles without progress, re-fetch the live page and re-diff selectors before changing anything else.
