# AUDIT mode

Breadth-first repo health scan, not a deep script audit.

## Run

All on-disk extension directories or the named subset:

```text
node .agents/skills/vbook-extensions/scripts/vbook.js testall [ext...] [--query tien] [--timeout 45000] [--json report.json]
```

Record CLI class + follow-up per extension. Root registries = published set; on-disk directories = testable set. Compare them only when registry coverage is requested.

## Interpret conservatively

| Class | Follow-up |
|---|---|
| WORK | none |
| MOVED | verify the direct new host → FIX domain move |
| AUTH/MSG | report the access requirement; not dead |
| EMPTY | retry a relevant query/listing; inspect the script contract |
| CRASH | → FIX config/selector diagnosis |
| UNREACHABLE | let the device recover, re-run the affected subset (cli.md › Test arguments and results) |
| UNKNOWN/NO_SCRIPT/BAD_PLUGIN | inspect manually |

Never delete from one probe. EMPTY/CRASH/UNREACHABLE → directly confirm the source is genuinely dead/parked before proposing removal; get user approval for directory + registry deletion.

Done = every target has a recorded class and specific next action; ambiguous states stay flagged for confirmation, not acted on.
