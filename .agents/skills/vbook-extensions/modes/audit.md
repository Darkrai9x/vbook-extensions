# AUDIT mode

Breadth-first repo health scan, not a deep script audit. Read `reference/cli.md` before
running `testall`.

## Run

Audit all on-disk extension directories or the named subset:

```text
node .agents/skills/vbook-extensions/scripts/vbook.js testall [ext...] [--query tien] [--timeout 45000] [--json report.json]
```

Record the CLI class and follow-up for every extension. The root registries describe the
published set; on-disk directories describe the testable set. Compare them only when the
request includes registry coverage.

## Interpret conservatively

- WORK: no follow-up.
- MOVED: verify the direct new host, then hand to FIX/domain move.
- AUTH/MSG: report the access requirement; do not treat it as dead.
- EMPTY: retry a relevant query/listing and inspect the script contract.
- CRASH: hand to FIX/config-selector diagnosis.
- UNREACHABLE: let the device recover and re-run the affected subset.
- UNKNOWN/NO_SCRIPT/BAD_PLUGIN: inspect manually.

Never delete from one probe. For EMPTY, CRASH, or UNREACHABLE, directly confirm the
source is genuinely dead/parked before proposing removal, and obtain user approval for
directory plus registry deletion.

Done means every target has a recorded class and specific next action; ambiguous states
remain flagged for confirmation rather than acted upon.
