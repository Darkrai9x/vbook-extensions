# Type contracts

Use with the relevant field/signature sections of `extension-api.md`. Templates under
`templates/<type>/` are complete scaffolds; keep required scripts and only supported
optional scripts.

## Novel and comic

Both use detail → optional page → toc → chap. `page` is TOC pagination and returns one
or more absolute TOC-page URLs; omit it when the TOC is not paginated. Comic images come
from `chap`, never `page`; comic `chap` returns an image array.
A novel `chap` may end a paragraph with `<comment count="N" input="..." script="x.js"></comment>`
to show a comment bubble; `count` and `script` are required, and `script` is `execute(input, next)`
returning comments like a detail `comments` source.

## Video

Playback is a required `chap` → `track` chain. `chap(episodeUrl)` returns server entries
`[{title, data}]`; `track(data)` resolves the chosen entry. Prefer direct `native`
`.m3u8`/`.mp4`, then `auto` for sniffing an embed, then `webview` only when both fail.
When an embed plays only in its own player (sniffed media URLs 404 natively), return
`webview` JSON with an `embed` URL so current apps show it at once, and keep a `data`
that older apps can still play.

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
input settings. Scripts read the reader's choices through the reserved `localConfig` keys
`tts_voice`, `tts_language`, `tts_speed`, `tts_pitch`, and `tts_volume`; synthesis still
uses the `voiceId` argument.

## Translate

Declare `language` and `translate`; `model` and `style` are optional. Language IDs follow
the API contract. `support_auto_detect`, `max_line`, and `max_length` are bare values.
Provider credentials are ordinary input settings. Scripts and actions read the user's
picks through the reserved `localConfig` keys `translate_model`, `translate_style`,
`translate_from_language`, and `translate_to_language`; keep a fallback, since they can
be unset and older apps return `null`.

## AI

Declare `chatStream`. Provider URL, key, and model belong in config. Stream with
`fetch(..., {stream:true})`, `readLine()`, and `ai.emitToken(...)`, or return one complete
non-empty response for a non-streaming provider.

## Shared navigation/detail notes

- Detail genre/tag links go in `genres` — the only one of the two the detail screen
  renders (`tags` is translated but not shown). Detail uses the current `genres`, `tags`, `suggests`, `reviews`, and `comments` fields,
  plus the documented `type` and `format`.
- `similar.js`/`comments.js` may be referenced dynamically from detail fields.
- `search.js` may serve home/genre tabs when its input contract supports both paths and
  keywords; otherwise use dedicated listing scripts.
- Explore section headers use `more`, list actions use `type: "list"`, and stream/short
  item types are only for navigation that intentionally bypasses detail.
- Explore sections use static `items` or dynamic `script`/`input` to match the site, and
  image hosts that reject the default `Referer` need `referrerpolicy`; see
  `reference/runtime.md`.
