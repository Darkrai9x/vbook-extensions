# Repository agent guidance

## vBook extension work

For any task that creates, fixes, tests, audits, refactors, builds, or installs a vBook extension, use the `vbook-extensions` skill at `.agents/skills/vbook-extensions/SKILL.md`.

1. Read `SKILL.md` completely before changing an extension.
2. Read only the matching mode file under `.agents/skills/vbook-extensions/modes/` (`create`, `fix`, `test`, `audit`, or `refactor`).
3. Treat `extension-api.md` and `.agents/skills/vbook-extensions/reference/extension-api.md` as the current API contract. When the upstream file at `D:\Projects\vBook\docs\extension-api.md` changes, copy it byte-for-byte to both locations, then update the skill guidance and templates if the contract changed.
4. Test, build, and install only through `.agents/skills/vbook-extensions/scripts/vbook.js`; follow its connection and verification rules from the skill.
5. `.agents/skills/vbook-extensions` is the only canonical skill source. `.claude/skills/vbook-extensions/SKILL.md` is only a compatibility pointer that tells Claude Code to read the canonical skill; do not copy references, modes, templates, or scripts into `.claude`.

Do not infer permission to build, install, commit, or push from a request that only asks for review, documentation, or source edits.
