# AUDIT mode

Repo-wide health check: test **every** extension in the repo (or a named subset) with one probe each, classify its status, and produce a status report. This is breadth, not depth — one liveness/listing call per ext, not the full per-script chain (that's TEST mode's "test all" for a single ext).

Use when the user says "test all extensions", "which ones are dead / moved", "audit the repo", "report status of every ext". For a deep audit of one extension's scripts, use `modes/test.md` instead.

## Phase 0 — scope

- **All** (default): every repo-root dir with `plugin.json` + `src/`.
- **Subset**: only the ext dirs the user names.
- The root `plugin.json` (registry index) lists the *published* set; the ext dirs on disk are the *testable* set. They can differ (local-only or unpublished dirs). Audit the on-disk dirs; note any published-but-missing or present-but-unpublished mismatch if the user cares about the registry.

## Phase 1 — run the batch

```
node .agents/skills/vbook-extensions/scripts/vbook.js testall [ext1 ext2 ...] [--query tien] [--timeout 45000] [--json report.json]
```

- No ext args → audits all on-disk exts. Named args → just those.
- For each ext the CLI runs its `search.js` with `--query` (falls back to `home.js`/first script if no `search`), unwraps the `Response` payload, and classifies. It retries once on a transient timeout.
- `--json` writes the machine-readable rows; the console always prints the per-ext line + grouped summary.

The server drops under rapid back-to-back calls (observed): if a run ends with a block of `UNREACHABLE`, wait ~20s, re-run just those (`testall <those exts>`), and merge — `UNREACHABLE` means "couldn't reach", not "dead".

## Phase 2 — read the classes

`testall` emits one status per ext. What each means and the follow-up:

| Status | Meaning | Follow-up |
|---|---|---|
| **WORK** | items returned, first host == `metadata.source` host | none |
| **MOVED** | items returned, but host != source host | FIX mode → domain swap (verify the new host serves directly, then update config + plugin.json + regexp) |
| **AUTH/MSG** | `code:1` with a message (login wall, notice) | not broken — note it; can't auto-verify without creds |
| **EMPTY** | `code:0` but 0 items | ambiguous — bad keyword vs broken selector vs no-config. Recheck: try a different `--query`, or the ext's real listing path (home→gen), or inspect its `search.js` arg contract before concluding |
| **CRASH** | JS error / `ReferenceError` (e.g. missing `load('config.js')`, config collision) | FIX mode — usually a script/config bug, NOT a dead site. Confirm site liveness separately before deleting |
| **UNREACHABLE** | request timed out even after retry | transient (slow site / server drop) OR site down. Re-probe before judging |
| **UNKNOWN / NO_SCRIPT / BAD_PLUGIN** | odd response / no runnable script / unreadable plugin.json | inspect that ext by hand |

## Phase 3 — confirm before destructive follow-up

`testall` classifies from **one keyword search** — it is a triage signal, not proof. Before acting on the scary classes:

- **Never delete an ext on an EMPTY/CRASH/UNREACHABLE alone.** Those are usually fixable (bad query, missing config, slow site), not a dead site. Confirm the site is genuinely gone first: fetch its `metadata.source` directly (a throwaway `probe.js` in the ext's `src/` — `fetch(BASE_URL)`, check title/status; a parked domain shows an `nginx`/registrar default or a DNS failure). Delete only on that hard confirmation, and treat delete as an irreversible + registry-facing action (remove the dir **and** its root `plugin.json` entry) — confirm with the user.
- **MOVED** → hand to FIX mode; don't just rewrite the host blind (a rebrand often changes selectors too — re-test the chain after swapping).
- **AUTH/MSG** → leave alone.

## Done criteria

Every audited ext has a recorded status + a specific follow-up class. Scary classes (EMPTY/CRASH/UNREACHABLE/MOVED) are flagged for confirmation, not acted on blindly. No ext deleted without a direct-fetch dead-site confirmation and user sign-off. Report delivered (console + optional `--json`).
