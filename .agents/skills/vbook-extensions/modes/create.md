# CREATE mode

Create and verify one extension end to end. Reads: see SKILL.md › Load.

## 1. Scope

1. Fetch the target; determine its type.
2. Get a real detail URL and a reachable chapter/episode URL (news/forum: a real list item `link`; provider engines: none). Homepage only → follow to a real page or ask.
3. Pick required + genuinely supported optional scripts from the API contract.

## 2. Scaffold

1. Copy the whole `templates/<type>/` folder to `<ext-dir>/` (`plugin.json` at root, scripts in `src/`; API "Extension Package"). `icon.png` at root if used.
2. Fill metadata with real values; replace all placeholders. Content sources: `metadata.regexp` and DOMAIN rules per runtime.md › Script and config contract / URLs and site config.
3. Remove unsupported optional scripts from `src/` and `plugin.json.script`; keep `page` only for paginated TOCs.
4. Real provider/site icon when supplied; decodable, < 5 MB.

## 3. Implement and test incrementally

Typical order, live responses, real chained inputs:

1. detail
2. optional page → toc
3. chap; then track for audio/video (news: article; forum: posts — replace 1–3)
4. search
5. home, genre, explore (per section static `items` or dynamic `script`/`input`: runtime.md › Explore section data)
6. dynamically referenced similar/comments; cover.js if covers are scrambled
7. provider chain: voice→tts, language/model/style→translate, or chatStream

Per script: write from observed markup/API data, save, `vbook.js test`, verify shape + content; don't move on while it fails. No progress → verify-checklist.md › final paragraph.

## 4. Finish

Strip teaching comments (runtime.md › Packaging), verify all retained scripts and chains, summarize supported/unsupported behavior. Ask before build/install.

Done = every declared script passes with correct live data and all runtime/type contracts hold.
