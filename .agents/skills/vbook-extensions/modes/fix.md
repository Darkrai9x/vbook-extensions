# FIX mode

Repair one existing extension. Read `reference/runtime.md` and relevant API/type sections
before editing; read `reference/cli.md` and `reference/verify-checklist.md` before tests.
Reproduce before changing code.

## 1. Reproduce and classify

Run one failing script with a known-good real input:

- Request/DNS/timeout failure → connectivity or domain.
- Success with empty, partial, or garbled data → selector/parser.
- Returned URLs use another host → silent domain move.
- Syntax/config load failure or legacy fields → contract/config migration.

Do not classify from the symptom description alone.

## 2. Apply the narrow fix

### Domain move

Confirm the host serving real links, then update `metadata.source`, DOMAIN default, and
the whole-URL regexp (retain old-host matching when existing library links need it).
For real mirrors use a select config. Confirm the new host serves directly.

### Selector/parser

Fetch the exact failing page and compare it with current selectors. Change only the
broken extraction/request logic; preserve unrelated response shape and scripts.

### Old contract

Remove obsolete CONFIG_URL shims, convert user-facing config to current objects while
preserving documented bare keys, migrate detail fields to the current contract, and add
type/format. Add optional features only when requested and supported.

## 3. Verify dependencies

Retest every touched script against live data, then its dependents in chain order. A
`code:0` result with wrong/empty data is still failure. After repeated no-progress
attempts, re-fetch and reconsider the diagnosis rather than broadening the edit.

## 4. Finish

Bump `metadata.version` once, summarize cause and repair, and ask before build/install.
Do not refactor unrelated code.

Done means the reported behavior and dependent chain pass with verified data.
