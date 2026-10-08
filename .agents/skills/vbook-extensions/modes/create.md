# CREATE mode

Create and verify one extension end to end. Before editing, read
`reference/runtime.md`, `reference/type-contracts.md`, the relevant API sections, and
the selected `templates/<type>/`. Before testing, read `reference/cli.md` and
`reference/verify-checklist.md`.

## 1. Scope

1. Fetch the target and determine its type.
2. Obtain a real detail URL and a reachable chapter/episode URL. Provider engines need
   no content pages. If only a homepage is given, follow it to a real detail page or ask.
3. Identify required and genuinely-supported optional scripts from the API contract.

## 2. Scaffold

1. Copy only `templates/<type>/` to the target directory.
2. Fill metadata with real values. Verify `metadata.regexp` against a complete detail
   URL. For content sources, keep `config.DOMAIN.default == metadata.source`.
3. Remove unsupported optional scripts; keep `page` only for paginated TOCs.
4. Use a real provider/site icon when supplied and keep it decodable and under 5 MB.

## 3. Implement and test incrementally

Use live responses and real chained inputs. Typical order:

1. detail
2. optional page → toc
3. chap; then track for audio/video
4. search
5. home, genre, explore
6. dynamically referenced similar/comments
7. provider chain: voice→tts, language/model/style→translate, or chatStream

For each script: write from observed markup/API data, save, run `vbook.js test`, and
verify the returned shape and content. Do not move on while it fails. After roughly
three unproductive cycles, re-fetch the page, check trailing-slash behavior and
client-rendering, then reassess instead of stacking speculative fixes.

## 4. Finish

Strip template teaching comments, verify all retained scripts and dependent chains, and
summarize supported/unsupported behavior. Ask before build or install.

Done means every declared script passes with correct live data and all runtime/type
contracts hold.
