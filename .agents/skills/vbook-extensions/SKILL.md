---
name: vbook-extensions
description: Create, fix, test, audit, refactor, build, or install vBook extensions (source, plugin.json, REST testing, packaging) against the current engine API and ScriptExecutor runtime.
---

# vBook extensions

Canonical, vendor-neutral skill. Resolve links relative to this file.
`.claude/skills/vbook-extensions/SKILL.md` is only a compatibility pointer; never duplicate this skill there.

## Route (read exactly one mode)

| Request | Mode |
|---|---|
| New extension or bare source URL | [CREATE](modes/create.md) |
| Repair, domain/selector change, API migration, feature change | [FIX](modes/fix.md) |
| Read-only test of one extension/script | [TEST](modes/test.md) |
| Repo-wide or named-subset health scan | [AUDIT](modes/audit.md) |
| Behavior-preserving template alignment | [REFACTOR](modes/refactor.md) |

Build/install only → no mode: read [CLI](reference/cli.md), inspect the target manifest, do only the requested operation. Ambiguous and the choice changes behavior → ask.

## Load only what the task needs

| When | Read |
|---|---|
| Before editing JS/`plugin.json` (CREATE, FIX, REFACTOR) | [Runtime rules](reference/runtime.md) + relevant [extension-api.md](reference/extension-api.md) sections |
| Type-specific fields/chains (CREATE, REFACTOR; FIX/TEST as relevant) | [Type contracts](reference/type-contracts.md) |
| Before any test/build/install | [CLI](reference/cli.md) |
| Judging script output | [Verify checklist](reference/verify-checklist.md) |
| CREATE, REFACTOR | the selected `templates/<type>/` only |

Repo-root `extension-api.md` and `reference/extension-api.md` are the same current contract: keep identical; on contract change update both, then affected guidance and templates.

## Non-negotiable invariants

- Test/build/install only via `scripts/vbook.js`; no MCP endpoints or hand-built REST payloads.
- Never infer permission to build, install, commit, push, delete, or publish from a request limited to review, docs, testing, or source edits.
- Reproduce before fixing. Verify returned data, not merely `code:0`.
- Real URLs and live responses only; never guess selectors, hosts, IDs, or chained inputs.
- Preserve unrelated working-tree changes. Fixes scoped; refactors behavior-preserving.
- Layout: `plugin.json` (+ optional `icon.png`) at extension root; scripts directly under `src/` (sub-folders ignored); each runnable script exposes exactly one `execute`. Limits: script ≤ 10 MB, `plugin.json` ≤ 2 MB, icon ≤ 5 MB.
- Current contract is authoritative. Don't copy patterns from old-contract extensions (e.g. `wikidich/`, `truyenqq/`) without migrating them.

## Resources

- `templates/<type>/` (`novel`, `comic`, `audio`, `video`, `news`, `forum`, `tts`, `translate`, `ai`): complete scaffolds laid out as an extension (`plugin.json` + `src/*.js`).
- `scripts/vbook.js`: connection-aware REST CLI.
- `scripts/servers.example.json`: server-list example; `servers.json` is per-machine and ignored.

Completion criteria: see the selected mode.
