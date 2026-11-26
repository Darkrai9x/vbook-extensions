# REFACTOR mode

Align a working extension with current conventions without changing behavior. Reads: see SKILL.md › Load (incl. type contracts, CLI, verify checklist). Broken behavior → FIX.

## 1. Capture baseline

Run TEST mode's complete real-input chain first. Save each script's fields, representative values, hosts, array counts. Record pre-existing failures; don't silently repair them here.

## 2. Build a template diff

Compare with `templates/<type>/`; list only convention gaps (rules in runtime.md / type-contracts.md), e.g.:

- hardcoded fallback BASE_URL + optional DOMAIN override
- shared `normalizeUrl` on site-URL inputs (incl. `article`/`posts`)
- guarded fetch responses, string pagination tokens, explicit CryptoJS encoders
- current detail/type/format fields
- correct chap→track chain and playback order
- manifest/file consistency, `metadata.encrypt: true`, current config shapes
- Rhino compatibility; teaching comments removed

Keep legitimate site-specific request, selector, player, signing, pagination logic. New data/capability = feature → needs approval.

## 3. Change and prove parity

One concern at a time. After every runtime-path change rerun the same baseline input: fields, equivalent values, counts, URL hosts must match, except an explicit contract-only correction. Revert unintended divergence. Shared-config edit → retest the whole dependent chain.

## 4. Finish

Bump `metadata.version` once, summarize convention changes + baseline parity, ask before build/install.

Done = output matches baseline and current template/runtime conventions hold.
