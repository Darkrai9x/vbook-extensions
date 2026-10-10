---
name: vbook-extensions
description: Create, fix, test, audit, refactor, build, or install vBook extensions against the current engine API and ScriptExecutor runtime. Use for extension source, plugin.json, vBook REST testing, packaging, or installation.
---

# vBook extensions

Canonical, vendor-neutral skill for this repository. Resolve every linked path relative
to this file. `.claude/skills/vbook-extensions/SKILL.md` is only a compatibility pointer;
never duplicate this skill there.

## Route the task

Read exactly one matching mode when source work or testing is requested:

- New extension or bare source URL → [CREATE](modes/create.md).
- Repair, domain/selector change, API migration, or feature change → [FIX](modes/fix.md).
- Read-only test of one extension/script → [TEST](modes/test.md).
- Repo-wide or named-subset health scan → [AUDIT](modes/audit.md).
- Behavior-preserving template alignment → [REFACTOR](modes/refactor.md).

Build/install-only requests need no mode: read [CLI](reference/cli.md), inspect the
target manifest, then perform only the requested operation. If the request is ambiguous
and the choice would change behavior, ask.

## Load only what the task needs

- Before creating or editing JavaScript/`plugin.json`, read
  [Runtime rules](reference/runtime.md) and the relevant portions of
  [extension-api.md](reference/extension-api.md).
- For type-specific fields/chains, read [Type contracts](reference/type-contracts.md).
- Before any test/build/install, read [CLI](reference/cli.md).
- When judging script output, use [Verify checklist](reference/verify-checklist.md).
- Templates live under `templates/<type>/`; use only the selected type. Replace all
  placeholders and remove teaching comments before shipping.

The repo-root `extension-api.md` and `reference/extension-api.md` are the same current
contract. Keep them identical; when the contract changes, update both, then the
affected guidance and templates.

## Non-negotiable invariants

- Test, build, and install only through `scripts/vbook.js`; do not use MCP endpoints or
  hand-built REST payloads.
- Never infer permission to build, install, commit, push, delete, or publish from a
  request limited to review, docs, testing, or source edits.
- Reproduce before fixing. Verify returned data, not merely `code:0`.
- Use real URLs and live responses; do not guess selectors, hosts, IDs, or chained
  inputs.
- Preserve unrelated working-tree changes. Keep fixes scoped and refactors
  behavior-preserving.
- Scripts sit directly under `src/`; each runnable script exposes exactly one `execute`
  function. A script is at most 10 MB, `plugin.json` at most 2 MB, and an optional icon
  at most 5 MB.
- The current contract is authoritative. Do not copy patterns from known old-contract
  extensions such as `wikidich/` or `truyenqq/` without migrating them.

## Resources

- `templates/novel`, `comic`, `audio`, `video`, `tts`, `translate`, `ai`: complete
  scaffolds for each supported type.
- `scripts/vbook.js`: connection-aware REST CLI.
- `scripts/servers.example.json`: local server-list example; `servers.json` is
  per-machine and ignored.

Completion criteria and required verification are defined by the selected mode.
