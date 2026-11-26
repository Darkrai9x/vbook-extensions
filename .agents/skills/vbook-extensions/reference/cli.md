# vBook CLI

Only `.agents/skills/vbook-extensions/scripts/vbook.js` for device connection, testing, building, installation. Run from the repository root:

```text
node .agents/skills/vbook-extensions/scripts/vbook.js connect
node .agents/skills/vbook-extensions/scripts/vbook.js test <ext-dir> <script.js> [args...]
node .agents/skills/vbook-extensions/scripts/vbook.js testall [ext...] [--query kw] [--timeout ms] [--json file]
node .agents/skills/vbook-extensions/scripts/vbook.js build <ext-dir> [out.zip]
node .agents/skills/vbook-extensions/scripts/vbook.js install <ext-dir> [--no-icon]
```

CLI reads `plugin.json` and `src/*.js` from disk → save edits first. A temporary probe goes in the extension's `src/` only for the test; remove it afterward.

## Server resolution

Order: 1. `--server <url>` 2. `VBOOK_SERVER` 3. `scripts/servers.json` (`{"servers":[...]}`), first responding server.

- Don't guess hosts. Missing config → copy `servers.example.json`, fill the device URL.
- No server responds + target is the desktop app on this machine → `vBook dev start` (macOS: `/Applications/vBook.app/Contents/MacOS/vBook dev start`; Windows: `start /wait vBook.exe dev start` from the install folder, since `vBook.exe` is a GUI program); `vBook dev stop` when done. Otherwise ask the user to enable vBook dev mode and verify its IP/port.
- Every command calls `/connect` first and prints the device; verify it before a mutating build/install.

## Test arguments and results

Arguments after the script name become string `vararg` values:

| Script | Arguments |
|--------|-----------|
| detail, page, toc, chap, article | URL |
| posts | URL, page (`""` first) |
| search | query, page |
| list scripts (`type: "list"`, home/genre tabs) and explore section scripts | input, page (section first page: `""`) |
| explore-page script (`type: "explore"`) | input |
| comment sources (`comments`/`comment`/`<comment>`) | input, next |
| track | data |
| cover.js | cover URL without its `#` fragment |
| tts | text, voice ID |
| translate | text, from, to, source, model, style |
| chatStream | messages JSON, model |

- `test` prints exact input, logs, output, response code. Success = output `code:0` (not HTTP 200) and still requires the verify checklist.
- `testall` = triage: probes search (or home/first script), retries one timeout, classifies WORK, MOVED, AUTH/MSG, EMPTY, CRASH, UNREACHABLE, or configuration errors (follow-ups: AUDIT mode). Statuses are not permission to delete: re-probe transient failures, directly confirm a dead source before proposing removal.
- Batch ends with consecutive UNREACHABLE → let the device server recover, rerun only those extensions, merge results.
- Icons optional: CLI includes `icon.png` when present; `--no-icon` omits it.
