# Type contracts

Type-specific rules beyond `extension-api.md`. Templates (`templates/<type>/`) are complete scaffolds; keep required scripts + only supported optional ones.

## Novel and comic

- Chain: detail → optional page → toc → chap. `page` = TOC pagination returning ≥1 absolute TOC-page URL; omit when the TOC isn't paginated.
- Comic images come from `chap` (image array), never `page`.
- Novel `chap` may end a paragraph with `<comment count="N" input="..." script="x.js"></comment>` (comment bubble); `count`, `script` required; `script` = `execute(input, next)` returning comments like a detail `comments` source.

## Video

- Required `chap` → `track`. `chap(episodeUrl)` → `[{title, data}]`; `track(data)` resolves the chosen entry.
- Prefer `native` `.m3u8`/`.mp4`, then `auto` (sniffs an embed page; fails if no media, no webview fallback), `webview` only when both fail.
- Embed plays only in its own player (sniffed URLs 404 natively) → `webview` JSON with an `embed` page URL; app embeds it at once, skipping the headless attempt.
- Formats: `series`, `stream`, `short`. Stream/short list items may bypass detail via matching item types; short sections use `shape: "short"`.
- Return episode-matched `danmaku` sources in `track` when available (API formats).

## Audio

- Requires `chap` → `track`, but only the first entry with non-blank `data` is used (no server picker). Wrap even one source as `[{title, data}]`.
- Player reads only `data`, `headers`, `audios[0]`, `lyrics` from `track` (no resolver `type`) → `data` must be directly playable media.
- Detail format `album` or `audio`. Lyrics in `track.lyrics` (LRC/VTT/plain), never subtitles.

## News and forum

- Read-only; no `detail`/`toc`/`chap`: a list item opens the reader. Need ≥1 list source (`home`/`explore`/`genre`/`search`).
- `news`: `article(url)`, `url` = item `link`.
- `forum`: `posts(url, page)`, `page` = previous `data2` (`""` first). Returns one page of posts as `data`, next token as `data2` (`""` at end).
  - Page numbers/jump: `data` = `{ posts, page, total_pages }`, tokens are page numbers (`"1"`, `"2"`…; `""` = 1). No `total_pages` → sequential loading only.
  - Each post: stable `id` (else `floor`) — duplicates across pages drop; `user.name` required, other `user` fields optional.
- List items: usual fields + news/forum extras (`author`, `time`, `avatar`, `replies`, `views`, `board`, `last_post`, `pinned`/`locked`/`hot`, `threads`/`posts`): API "List item fields". Board `link`/`action` normally opens a thread list (`type: "list"`).
- Explore section types: `news_hero`, `news_list`, `board_list`, `thread_list` (`chip` etc. still work).
- Leave embeds in `content` as the site has them; unsupported iframes are dropped → turn them into links (API "Embeds").
- TTS reads `content` (forum thread one page at a time) → write real paragraphs.

## TTS

- Declare `voice` and `tts`. Voice language = valid BCP-47 tag.
- `preload_size`, `preload_parallel`, `max_length` are bare JSON values; set `max_length > 0` to avoid per-character requests. Credentials = ordinary input settings.
- Reader choices via reserved `localConfig` keys `tts_voice`, `tts_language`, `tts_speed`, `tts_pitch`, `tts_volume`; synthesis still uses the `voiceId` argument.

## Translate

- Declare `language` and `translate`; `model`, `style` optional. Language IDs per API.
- `support_auto_detect`, `max_line`, `max_length` are bare values. Credentials = ordinary input settings.
- User picks via reserved `localConfig` keys `translate_model`, `translate_style`, `translate_from_language`, `translate_to_language`; keep a fallback (unset → `null` or your `defaultValue`).

## AI

- Declare `chatStream`. Provider URL, key, model in config.
- Stream with `fetch(..., {stream:true})`, `readLine()`, `ai.emitToken(...)`, or return one complete non-empty response for a non-streaming provider.

## Shared navigation/detail

- Detail genre/tag links go in `genres` — the only one the detail screen renders (`tags` is translated, not shown).
- Detail fields: `genres`, `tags`, `suggests`, `reviews`, `comment` (single source `{title, input, script}`, shown before `comments`), `comments`, plus `type`, `format`. Every array element must be an object.
- `similar.js`/`comments.js` may be referenced dynamically from detail fields (runtime.md › Packaging).
- `search.js` may serve home/genre tabs only when its input contract handles both paths and keywords; else dedicated list scripts.
- Section headers use `more`. Action `type`: `list` (paged list), `explore` (explore page, `execute(input)`), `detail` (`input` = item URL); no `type` → action drops. Home tabs and genres may use `type: "explore"`.
- Stream/short item types only for navigation that intentionally bypasses detail.
- Static `items` vs dynamic `script`/`input`, and `referrerpolicy`: runtime.md.
