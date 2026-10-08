# Type contracts

Use with the relevant field/signature sections of `extension-api.md`. Templates under
`templates/<type>/` are complete scaffolds; keep required scripts and only supported
optional scripts.

## Novel and comic

Both use detail → optional page → toc → chap. `page` is TOC pagination and returns one
or more absolute TOC-page URLs; omit it when the TOC is not paginated. Comic images come
from `chap`, never `page`; comic `chap` returns an image array.

## Video

Playback is a required `chap` → `track` chain. `chap(episodeUrl)` returns server entries
`[{title, data}]`; `track(data)` resolves the chosen entry. Prefer direct `native`
`.m3u8`/`.mp4`, then `auto` for sniffing an embed, then `webview` only when both fail.

Formats are `series`, `stream`, and `short`. Stream/short list items can bypass detail
with matching item types; short sections use `shape: "short"`. When available, return
episode-matched `danmaku` sources in `track` using the formats documented by the API.

## Audio

Audio also requires `chap` → `track`, but the app uses the first non-blank chap entry and
has no server picker. Wrap even a single source as `[{title, data}]`. `track` must resolve
to real `native` media; `auto` and `webview` do not work. Detail format is `album` or
`audio`. Lyrics belong in `track.lyrics` (LRC/VTT/plain text), never subtitles.

## TTS

Declare `voice` and `tts`. Voice language is a valid BCP-47 tag. Engine controls such as
`preload_size`, `preload_parallel`, and `max_length` are bare JSON values; set
`max_length > 0` to avoid per-character requests. Provider credentials are ordinary
input settings.

## Translate

Declare `language` and `translate`; `model` and `style` are optional. Language IDs follow
the API contract. `support_auto_detect`, `max_line`, and `max_length` are bare values.
Provider credentials are ordinary input settings.

## AI

Declare `chatStream`. Provider URL, key, and model belong in config. Stream with
`fetch(..., {stream:true})`, `readLine()`, and `ai.emitToken(...)`, or return one complete
non-empty response for a non-streaming provider.

## Shared navigation/detail notes

- Detail uses the current `tags`, `genres`, `suggests`, `reviews`, and `comments` fields,
  plus the documented `type` and `format`.
- `similar.js`/`comments.js` may be referenced dynamically from detail fields.
- `search.js` may serve home/genre tabs when its input contract supports both paths and
  keywords; otherwise use dedicated listing scripts.
- Explore section headers use `more`, list actions use `type: "list"`, and stream/short
  item types are only for navigation that intentionally bypasses detail.
