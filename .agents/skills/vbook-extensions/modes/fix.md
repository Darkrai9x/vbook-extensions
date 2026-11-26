# FIX mode

Repair one existing extension. Reads: see SKILL.md › Load. Reproduce before changing code.

## 1. Reproduce and classify

Run one failing script with a known-good real input. Never classify from the symptom description alone.

| Observation | Class |
|---|---|
| Request/DNS/timeout failure | connectivity or domain |
| Success with empty/partial/garbled data | selector/parser |
| Returned URLs on another host | silent domain move |
| Syntax/config load failure or legacy fields | old contract |
| Data correct, covers/comic images blank | image referrer — curl the image with page `Referer`, none, origin only |
| Image bytes scrambled/encrypted (curl returns non-image data) | cover script |

## 2. Apply the narrow fix

- **Domain move:** confirm the host serving real links → update `metadata.source`, DOMAIN default, whole-URL regexp (keep old-host matching when existing library links need it). Real mirrors → select config. Confirm the new host serves directly.
- **Selector/parser:** fetch the exact failing page, compare with current selectors, change only the broken extraction/request logic.
- **Image referrer:** set `referrerpolicy` to the value curl proved on the items/detail/image objects that need it; prefix protocol-relative `//` with `https:`; don't change selectors (runtime.md › Images and referrer).
- **Cover script:** add `#script=cover.js` to the cover URL + `src/cover.js` that fetches, undoes the site's transform, returns bare base64 (runtime.md › Images and referrer).
- **Slow explore:** `explore.js` slow/timing out from chained requests → move those sections to `script`/`input` (runtime.md › Explore section data); don't drop them.
- **Old contract:**
  - remove obsolete CONFIG_URL shims; convert user-facing config to current objects, preserving documented bare keys;
  - migrate detail fields to current contract; add `type`/`format`;
  - bare `CryptoJS...decrypt(...).toString()` (old shim returned text) → `.toString(CryptoJS.enc.Utf8)`;
  - add optional features only when requested and supported.

## 3. Verify dependencies

Retest every touched script on live data, then dependents in chain order (verify-checklist.md). No progress → re-fetch and reconsider the diagnosis; don't broaden the edit.

## 4. Finish

Bump `metadata.version` once, summarize cause + repair, ask before build/install. Don't refactor unrelated code.

Done = reported behavior and dependent chain pass with verified data.
