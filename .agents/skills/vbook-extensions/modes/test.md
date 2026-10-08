# TEST mode

Read-only verification of one extension. Read `reference/cli.md`,
`reference/verify-checklist.md`, and the relevant API/type contract. Do not edit; report
failures and hand requested repairs to FIX mode.

## Choose scope

- A named script or “just check X” → test one.
- “Test this extension” / “what is broken” → test all declared scripts.
- Ask only when scope materially changes the work.

## Test one

Obtain a real input from the user or the smallest upstream chain, run the target, verify
its data, and report PASS or a specific failure class with the triggering log/field.

## Test all

Chain real outputs rather than inventing inputs:

1. home/genre where declared
2. search → real detail link
3. detail → canonical URL and dynamic-field inputs
4. optional page → toc → real chapter/episode
5. chap; chap→track for audio/video
6. explore and dynamically referenced scripts
7. provider chains for TTS/translate/AI

Continue independent scripts when one chain is blocked. Without a real downstream input,
mark it UNTESTED rather than guessing.

Report every declared script as PASS, FAIL, or UNTESTED. Group failures as connectivity,
silent domain move, selector/parser, config/load, or contract mismatch, and cite exact
evidence. Recommend the matching FIX path; do not apply it in TEST mode.

Done means the selected script, or every declared script, has an evidence-backed status.
