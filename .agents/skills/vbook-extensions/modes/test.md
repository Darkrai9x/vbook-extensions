# TEST mode

Read-only verification of one extension. Reads: see SKILL.md › Load. Don't edit; report failures, hand repairs to FIX.

## Scope

- Named script / "just check X" → test one.
- "Test this extension" / "what is broken" → test all declared scripts.
- Ask only when scope materially changes the work.

## Test one

Real input from the user or the smallest upstream chain → run target → verify data → report PASS or failure class with the triggering log/field.

## Test all

Chain real outputs; never invent inputs (arguments: cli.md › Test arguments and results):

1. home/genre where declared
2. search → real detail link (news/forum: real list item `link`)
3. detail → canonical URL and dynamic-field inputs
4. optional page → toc → real chapter/episode
5. chap; chap→track for audio/video. News: `article(link)`; forum: `posts(link, "")`, then the returned `data2` (+ a jump page when `total_pages` is set)
6. explore, each section `script` (its `input`, page `""`), dynamically referenced scripts
7. `#script=cover.js` covers: run `cover.js` with the cover URL minus its fragment; decode the base64, check it is an image
8. provider chains for TTS/translate/AI

One chain blocked → continue independent scripts. No real downstream input → UNTESTED, don't guess.

## Report

Every declared script PASS, FAIL, or UNTESTED. Group failures: connectivity, silent domain move, selector/parser, config/load, contract mismatch, image (referrer/cover script), with exact evidence. Recommend the matching FIX path; don't apply it.

Done = the selected script, or every declared script, has an evidence-backed status.
