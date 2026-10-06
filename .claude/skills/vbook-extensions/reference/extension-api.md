# vBook Extension JS API

Extensions are JavaScript files that tell vBook how to fetch content from websites. Each extension defines a set of named scripts (functions) that vBook calls at specific points. Every script must define an `execute` function that receives input arguments and returns a JSON response.

## Contents

1. [Response format](#response-format)
2. [Extension package](#extension-package) — structure, `plugin.json`, `metadata`, `script`, required scripts
3. [Settings](#settings) — static config, dynamic `config.js`, connection limits, actions
4. [Script templates](#script-templates) — `home`, `explore`, `genre`, list scripts, `detail`, `page`, `toc`, `chap`, `track`
5. [Video & audio playback](#video--audio-playback) — pipeline, `chap` track list, resolvers (`native` / `auto` / `webview`)
6. [Available JS APIs](#available-js-apis) — fetch, HTML, storage, database, book, browser, graphics, WebSocket, QT, crypto, `load`
7. [Complete examples](#complete-example-novel-extension) — novel, comic, video (+ short feed), TTS, translate, AI
8. [Developer server](#developer-server) — `/extension/docs`, `/extension/test`, `/extension/build`, `/extension/install`
9. [Troubleshooting](#troubleshooting)

## Response Format

Every script must return a JSON string via the `Response` helper:

```js
// Success
return Response.success(data, data2);

// Error
return Response.error("error message");
```

The native app parses this as:
```json
{ "code": 0, "data": ..., "data2": ... }   // success
{ "code": 1, "data": "error message" }      // error
```

---

## Extension Package

An extension is a ZIP file containing:
```
extension.zip
  plugin.json       <- manifest
  icon.png          <- extension icon (optional)
  src/
    search.js       <- script files (top level of src/ only)
    detail.js
    toc.js
    chap.js
    ...
```

- `icon.png`: any image the platform can decode, up to 5 MB (larger files are
  skipped). It is scaled to fit 200x200 (aspect ratio kept) and stored as PNG.
- `src/`: the only hard requirement is at least one readable script there. Files in
  sub-folders are ignored; a script over 10 MB is skipped.
- `plugin.json` over 2 MB is read as `{}` — the extension installs with an empty name
  and type `novel`.

## plugin.json

```json
{
  "metadata": {
    "name": "Example Source",
    "author": "Author Name",
    "version": 1,
    "source": "https://example.com",
    "description": "Extension description",
    "locale": "vi",
    "regexp": "(https?://)?(www\\.)?example\\.com/.+",
    "type": "novel",
    "nsfw": false
  },
  "script": {
    "config": "config.js",
    "home": "home.js",
    "explore": "explore.js",
    "genre": "genre.js",
    "search": "search.js",
    "detail": "detail.js",
    "toc": "toc.js",
    "chap": "chap.js",
    "track": "track.js",
    "page": "page.js"
  },
  "config": {
    "DOMAIN": {
      "title": "Domain",
      "default": "https://example.com",
      "values": ["https://example.com", "https://mirror.example.com"],
      "mode": "select"
    },
    "thread_num": 2,
    "delay": 500
  }
}
```

### metadata

No field is validated: a missing field becomes `""` (or `0` for `version`). Every
field is still recommended — the app shows and matches on them.

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Extension display name |
| `author` | string | Author name |
| `version` | int | Version number (increment on update). Must be an integer — `"1.2"` reads as 0 |
| `source` | string | Base URL of the website; the base for relative links |
| `description` | string | Short description |
| `locale` | string | Language tag: `vi`, `en`, `zh-CN`, `global` |
| `regexp` | string | Regex matched against the **entire** URL (see below) |
| `type` | string | Extension type (see values below). Missing/unknown = `novel` |
| `nsfw` | boolean | Adult content flag (default: false). Legacy `"tag": "nsfw"` is also accepted |
| `encrypt` | boolean | Scripts in `src/` are encrypted (see below) |

**`regexp`** decides which extension opens a pasted/shared URL (only `novel`, `comic`,
`audio`, `video` extensions). It is a whole-string match (Kotlin `String.matches`),
tried on the URL as-is and on the URL without `http(s)://` and trailing `/`. So
`example\\.com` never matches anything — use
`(https?://)?(www\\.)?example\\.com/.+`. An invalid regex is silently skipped.

**`encrypt`**: when `true`, every script is decrypted at load with a key derived from
`source` + `author` (AES-256-CBC). Use the developer server's `/extension/build` to
produce encrypted scripts. A script that fails to decrypt is used as plain text.

**`type` values** (case-insensitive):

| Value | Description |
|-------|-------------|
| `novel` | Text-based books (novel, light novel, web novel) |
| `comic` | Image-based comics (manga, manhwa, manhua) |
| `video` | Video content (series, anime, short dramas). Playable formats: `series`, `stream`, `short` |
| `audio` | Audio content (music, audiobook, podcast). Playable formats: `audio` (single track), `album` (playlist) |
| `tts` | Text-to-speech engine |
| `translate` | Translation engine |
| `ai` | AI assistant provider (see [AI Assistant Engine](#complete-example-ai-assistant-engine)) |

`ebook` and `news` are not extension types — they are values of `detail`'s
[`type`](#detailjs) field.

### script

Maps function names to JS filenames in `src/`. Values must match the file name
exactly, including `.js`. Each script's `execute` receives the listed parameters
positionally:

| Key | Purpose | `execute(...)` signature |
|-----|---------|--------------------------|
| `config` | Dynamic setting schema | `execute()` |
| `action` | Dynamic action list (see [Actions](#actions)) | `execute()` |
| `home` | Home page tabs | `execute()` |
| `explore` | Explore page sections | `execute()` |
| `genre` | Genre/tag list | `execute()` |
| `search` | Search items | `execute(query, page)` |
| `detail` | Item detail page | `execute(url)` |
| `toc` | Chapter list (of one TOC page) | `execute(url)` |
| `chap` | Chapter content | `execute(url)` |
| `track` | Video / audio track | `execute(data)` |
| `page` | Optional TOC pagination: list of TOC page URLs | `execute(url)` |
| `voice` | TTS voice + language list | `execute()` |
| `tts` | TTS synthesis | `execute(text, voiceId)` |
| `language` | Translate language list | `execute()` |
| `model` | Optional translate model list | `execute()` |
| `style` | Optional translate style list | `execute()` |
| `translate` | Translate text | `execute(text, from, to, source, model, style)` |
| `chatStream` | AI assistant request (`ai` type) | `execute(messagesJson, selectedModel)` |

All parameters arrive as **strings**; each script section below explains its own.
Guard optionals with `param || defaultValue`.

**URL arguments:** the app trims a trailing `/` from `http(s)` URLs before passing
them as the `url` of `detail` / `page` / `toc` / `chap` / `track` and as the first
argument of list scripts. Other arguments (`page` tokens, comment/review inputs) are
passed unchanged.

#### Required scripts per `type`

`✓` = required, `○` = optional, `—` = not used. Any script listed in
`plugin.json` must exist in `src/`; scripts the app never calls for a type can be
omitted from both.

| Script | `novel` | `comic` | `audio` | `video` | `tts` | `translate` | `ai` |
|--------|:------:|:------:|:------:|:------:|:----:|:----------:|:--:|
| `search` (+ the scripts it references) | ✓ | ✓ | ✓ | ✓ | — | — | — |
| `detail` | ✓ | ✓ | ✓ | ✓ | — | — | — |
| `toc` | ✓ | ✓ | ✓ | ✓ | — | — | — |
| `chap` | ✓ | ✓ | ✓² | ✓² | — | — | — |
| `page` | ○¹ | ○¹ | ○¹ | ○¹ | — | — | — |
| `track` | — | — | ✓ | ✓ | — | — | — |
| `home` | ○ | ○ | ○ | ○ | — | — | — |
| `explore` | ○ | ○ | ○ | ○ | — | — | — |
| `genre` | ○ | ○ | ○ | ○ | — | — | — |
| `voice` | — | — | — | — | ✓ | — | — |
| `tts` | — | — | — | — | ✓ | — | — |
| `language` | — | — | — | — | — | ✓ | — |
| `model` | — | — | — | — | — | ○ | — |
| `style` | — | — | — | — | — | ○ | — |
| `translate` | — | — | — | — | — | ✓ | — |
| `chatStream` | — | — | — | — | — | — | ✓ |

¹ `page` paginates the table of contents, for sites that split the chapter list over
several pages. It receives the book URL and returns the TOC page URLs; `toc` is then
called once per page URL. Without `page`, `toc` gets the book URL itself.

² **audio / video** call `chap` for every episode/track entry to get its list of
playable tracks, then `track` to resolve the chosen one (see
[Video & audio playback](#video--audio-playback)).

- **Content types** (`novel`, `comic`, `audio`, `video`): required core `search`,
  `detail`, `toc` + the per-chapter content script `chap` (plus `track` for
  audio/video); optional `page` for a paginated TOC. Call order:
  `search` → `detail` → (`page`) → `toc` → `chap` (→ `track`).
  Optional discovery `home`, `explore`, `genre` — omit them and the app just hides
  those sections. If both `explore` and `home` are declared, `explore` wins and
  `home` is ignored. `search` powers search only (search screen, migration, the short
  feed); list screens run the `script` named by `home` / `genre` / `explore` entries.
- **`tts`** (engine, not a content source): required `voice` (voice + language
  list) and `tts` (synthesize a sentence → base64 audio in `data`). It does **not**
  use the fetch scripts (`search`/`detail`/`toc`/…).
- **`translate`** (engine): required `language` (from/to language list) and
  `translate` (translate text → string or `{ text, segments }`). Optional `model` and
  `style` scripts expose selectors whose chosen IDs are passed to `translate`.
  Also skips the fetch scripts.
- **`ai`** (engine): only `chatStream`.

The per-chapter content script by type:

| `type` | Chapter list (`page` → `toc`) | Per-chapter content | Notes |
|--------|-------------|---------------------|-------|
| `novel` | `toc` | `chap` → HTML string (+ title in `data2`) | Text is rendered as styled HTML |
| `comic` | `toc` | `chap` → array of images (URLs or image objects, see [chap.js](#chapjs)) | |
| `video` | `toc` | `chap` → track list, then `track` → playback object (see `track.js`) | Each TOC entry is an episode; the first track plays, others are switchable servers. Formats: `series`, `stream`, `short` |
| `audio` | `toc` | `chap` → track list, then `track` → playback object | Each TOC entry is one track of the playlist; plays `audios[0].data` when present, else `data`. Formats: `audio`, `album` |
| `tts` | `voice` → voices/languages | `tts` → base64 audio | Engine, not a content source |
| `translate` | `language` → from/to list; optional `model` / `style` selectors | `translate` → text/segments | Engine, not a content source |

What `chap` must return depends on the book's type (from `detail`'s `type`/`format`,
else the extension `type`):

- **novel** → HTML string (`data2` = chapter title)
- **comic** → array of images
- **audio / video** → the episode's track list (see [chap.js for audio / video](#chapjs-for-audio--video))

---

## Settings

### Static config

User-configurable settings declared in the `config` block of `plugin.json`.

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Setting label shown to user (falls back to the key) |
| `subtitle` | string | Hint — shown only for `toggle` and `list` |
| `default` | string | Default value. Write it as a string (also for `list`, see below) |
| `values` | array | Options (for `select` mode) |
| `mode` | string | Input mode (see values below). Unknown/missing mode renders nothing |
| `format` | string | `number` switches `input` to a numeric keyboard (no validation) |

**`mode` values** (case-sensitive):

| mode | Description |
|------|-------------|
| `input` | Free text field (`format: "number"` = numeric keyboard) |
| `select` | Pick one from `values`. A value not in `values` shows the first option. Multi-select is not supported |
| `toggle` | On/off switch (value is `"true"` / `"false"`) |
| `list` | User adds/removes free-text rows; value is a JSON array **string** `"[\"a\",\"b\"]"`. A `default` written as a real JSON array shows empty |
| `database` | Declares a `localDatabase` table named after the key (see [Local database](#local-database)). Not injected as a constant; the settings UI shows the title + row count and opens a list screen with add/edit/delete |

**Injection.** Every static key except `mode: "database"` entries is injected into
each script as a string constant before it runs:

```js
// config key "DOMAIN", user picked "https://mirror.example.com":
const DOMAIN = "https://mirror.example.com";
```

- The value is always a **string** (`"true"`, `"2"`, …) — the user's value if set,
  else `default`. Convert it yourself (`DOMAIN`, `parseInt(PAGE_SIZE)`, `FLAG === "true"`).
- Keys must be valid JS identifiers and must not clash with a `let`/`const` in your
  script — otherwise every script fails with a SyntaxError.
- Bare connection keys (`thread_num`, `delay`, `ignore`) are injected too.
- `localConfig.getItem` does **not** read static values.

A config entry must be an object (or a bare value for the connection keys below); a
JSON array as an entry breaks the whole extension.

### Dynamic config script

Declare `"config": "config.js"` inside the `script` object when the setting
schema must be generated at runtime. `config.js` returns the same object shape
as the static `plugin.json.config` block:

```js
function execute() {
    const scope = localConfig.getItem("scope") || "global";

    return Response.success({
        scope: {
            title: "Scope",
            default: scope,
            values: ["global", "source"],
            mode: "select",
        },
        [scope + "_domain"]: {
            title: "Domain",
            default: "https://example.com",
            mode: "input",
            format: "text",
        },
    });
}
```

Dynamic values are stored in a separate extension-setting table and are **not**
injected as constants — read them with `localConfig.getItem(key)` (`null` when the
user never set one; the `default` is not returned). The script owns the key
namespace, so it can distinguish global, source, or other scopes without a native
`bookId` field. `config.js` runs when the extension detail screen opens and again
after a **dynamic** value changes (debounced 300 ms) so dependent fields can change;
changing a static value does not re-run it.

If a dynamic item uses the same key as a static one, the settings UI shows the
dynamic item and saves into the dynamic table; the injected constant keeps the static
value.

### Connection limits

Three keys are read by the app as **bare JSON values directly under `config`**:

```json
"config": { "thread_num": 2, "delay": 500, "ignore": true }
```

| Key | Meaning | When absent |
|-----|---------|-------------|
| `thread_num` | Upper limit of concurrent downloads / update checks for this source. The user's thread setting is capped to it | No cap |
| `delay` | Minimum delay in ms between download requests. The user's delay setting can't go below it | No minimum |
| `ignore` | `true`/`false`: default incognito mode (don't save history) for this source | Global setting |

- Quoted values (`"2"`, `"true"`) are not read.
- Don't declare them as `{ title, default, mode }` setting objects — that turns them
  into regular settings whose stored value the app then misreads as a limit.
- `timeout` is not used; `fetch` has its own `timeout` option (default 120000 ms).
- The connection section is hidden for `tts` and `translate` extensions.

### Actions

Actions are buttons in the extension detail screen that run one of the extension's
scripts on demand (rebuild an index, clear a cache, sync data…). When the detail
screen was opened from a book, the action runs with that book as context
(`localBook`, the `bookId` of `localDatabase` calls).

Each action is `key -> { name?, description?, script }`, where `script` is a file in
`src/` whose `execute()` is run. `name` falls back to the key. An entry without
`script` is ignored.

**Static** — an `actions` block in `plugin.json`:

```json
"actions": {
    "rebuild_names": {
        "name": "Rebuild names",
        "description": "Scan saved chapters and refresh the name table",
        "script": "rebuild_names.js"
    }
}
```

**Dynamic** — declare `"action": "action.js"` inside `script` when the list depends
on runtime state (config values, the current book, stored data). `action.js`
returns the same object shape:

```js
function execute() {
    let actions = {};
    let book = localBook.getInfo();
    if (book) {
        actions.sync_book = {
            name: "Sync this book",
            description: book.name.raw || "",
            script: "sync_book.js",
        };
    }
    if (localConfig.getItem("debug") === "true") {
        actions.clear_cache = { name: "Clear cache", script: "clear_cache.js" };
    }
    return Response.success(actions);
}
```

- Static and dynamic actions are shown together; a dynamic action with the same key
  as a static one replaces it.
- `action.js` runs when the detail screen opens, again after a dynamic config value
  changes, and after any action finishes successfully — so the list can reflect
  what the action just did.

**Running an action:** tapping it opens a sheet with its name and description and a
**Start** button — nothing runs until the user presses it. The sheet then tracks the run:

- Every `Log.log(...)` / `console.log(...)` line appears live in the sheet's log view
  (last 500 lines kept). Only the first argument is logged — concatenate yourself.
- Return `Response.success("message")` to finish with a success status and show the
  message; `Response.error("message")` finishes as failed. A thrown error also shows
  as failed with its message. Any other return value (even non-JSON) counts as success.
- The user can stop a running action. On Android and desktop the script is
  interrupted; on iOS it runs to completion in the background.

```js
function execute() {
    let toc = localBook.getTableOfContent();
    toc.forEach(function (chapter, i) {
        Log.log("Scanning " + (i + 1) + "/" + toc.length);
        // ...
    });
    return Response.success("Scanned " + toc.length + " chapters");
}
```

---

## Script Templates

Relative URLs returned by scripts (`link`, `cover`, chapter `url`, …) are joined with
a host — the item's `host`, else the extension `source`. Anything starting with
`http` counts as absolute; protocol-relative `//cdn…` URLs are **not** recognised —
prefix them with `https:`.

### home.js

Returns a list of tabs. Each tab has a title and a list script (ignored when
`explore` is declared).

```js
function execute() {
    return Response.success([
        { title: "Latest", input: "", script: "latest.js" },
        { title: "Popular", input: "", script: "popular.js" },
        { title: "Completed", input: "", script: "completed.js" },
    ]);
}
```

### explore.js

Returns sections for the explore/discover page. Each section is rendered as a row on screen.

```js
function execute() {
    let doc = fetch("https://example.com").html();

    let latestItems = doc.select(".latest .book-item").map(function(el) {
        return {
            name: el.select(".title").text(),
            cover: el.select("img").attr("src"),
            link: el.select("a").attr("href"),
            description: el.select(".desc").text(),
            tag: el.select(".status").text(),
        };
    });

    let bannerItems = doc.select(".banner .slide").map(function(el) {
        return {
            name: el.select(".title").text(),
            cover: el.select("img").attr("src"),
            link: el.select("a").attr("href"),
        };
    });

    return Response.success([
        {
            id: "banner",
            title: "",
            subtitle: "",
            type: "banner",
            items: bannerItems,
        },
        {
            id: "latest",
            title: "Latest Updates",
            subtitle: "Recently updated books",
            type: "grid",
            items: latestItems,
            more: {                 // "See more" on the section header
                type: "list",
                name: "Latest Updates",
                script: "latest.js",
                input: "",
            }
        },
    ]);
}
```

**Section fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | yes | Layout type (see below, case-insensitive). Empty or unknown = skipped |
| `title` | string | no | Section header text |
| `subtitle` | string | no | Section subtitle text |
| `id` | string | no | Unique ID (auto-generated as `<type>_<index>` if empty) |
| `items` | array | no | List of explore items |
| `shape` | string | no | Card shape of the items: `book` (2:3, default), `square`, `circle`, `movie` (16:9), `short` (9:16) |
| `more` | object | no | "See more" action on the section header (an action, see below — normally `type: "list"`) |

**Section `type` values:**

| Value | Description |
|-------|-------------|
| `banner` | Full-width image carousel/slideshow |
| `horizontal_list` | Horizontal scrollable item list |
| `grid` | Multi-column grid layout |
| `list` | Vertical list layout |
| `ranking` | Numbered ranking list |
| `chip` | Tag/chip buttons row |

**Action fields** (used in both section `more` and item `action`):

| Field | Type | Description |
|-------|------|-------------|
| `type` | string | Action type (see below). Without it the action is dropped — an item then falls back to `link` → detail |
| `name` | string | Title of the list screen opened by a `list` action |
| `script` | string | JS filename to execute (e.g. `latest.js`) — `list` only |
| `input` | string | `list`: passed as `query` (`args[0]`) to the script, which is paged like `search.js`. `detail`: the item URL |

**Action `type` values:**

| Value | Description |
|-------|-------------|
| `list` | Open a paginated item list (script is called to fetch items). Used for "See all" |
| `detail` | Open book/item detail page. `input` is the item URL |

Unknown action types are ignored (the tap does nothing).

**Explore item fields:**

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Item title |
| `cover` | string | Cover image URL |
| `link` | string | Item URL. If no `action`, auto-creates `detail` action pointing to this URL |
| `description` | string | Short description |
| `tag` | string | Tag text |
| `host` | string | Base URL for a relative `link` / `cover` (default: extension `source`) |
| `type` | string | Content type of the item, see [Item `type`](#item-type) |
| `action` | object | Custom action (same format as above). Overrides default `link` → detail behavior |

Unlike list scripts, explore items are not filtered or de-duplicated — skip empty
names and duplicates yourself (a duplicated `short` item breaks the short feed).

### genre.js

Returns a list of genres/tags.

```js
function execute() {
    let doc = fetch("https://example.com/genres").html();
    let genres = doc.select(".genre-item").map(function(el) {
        return {
            title: el.text(),
            input: el.attr("href"),
            script: "genre_items.js",
        };
    });
    return Response.success(genres);
}
```

### search.js / latest.js / popular.js / genre_items.js

Returns a paginated list of items.

**Parameters:**

| Param | Description |
|-------|-------------|
| `query` | The search text, or a filter/category input (e.g. a genre URL passed as `input` from `genre`/`home`). Empty string when the user just browses a tab |
| `page` | Next-page token — whatever the previous call returned as `data2`. Empty on the first page. Opaque: use a page number, cursor, or full URL as you like |

Return the items as `data` and the **next** page token as `data2` (empty string
when there are no more pages).

```js
function execute(query, page) {
    query = query || "";
    page = page || "1";

    let url = "https://example.com/search?q=" + query + "&page=" + page;
    let doc = fetch(url).html();

    let items = doc.select(".book-item").map(function(el) {
        return {
            name: el.select(".title").text(),
            cover: el.select("img").attr("src"),
            link: el.select("a").attr("href"),
            description: el.select(".info").text(),
            tag: el.select(".tag").text(),
        };
    });

    let nextPage = parseInt(page) + 1;
    let hasNext = doc.select(".pagination .next").size() > 0;

    return Response.success(items, hasNext ? nextPage.toString() : "");
}
```

**Item fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | yes | Item title. Items with an empty name are dropped |
| `cover` | string | no | Cover image URL |
| `link` | string | yes | URL to the detail page. Items are de-duplicated by resolved link |
| `description` | string | no | Short description or latest chapter |
| `tag` | string | no | Tag text (e.g. "Completed", "Hot") |
| `host` | string | no | Base URL for a relative `link` / `cover` (default: extension `source`) |
| `type` | string | no | Content type of the item, see below |

#### Item `type`

Applies to list/search items and explore items alike (case-insensitive).

| Value | Tap opens |
|-------|-----------|
| *(empty or any other value)* | The detail page (`link` → `detail.js`) |
| `stream` | The video player directly, skipping detail. The book is saved to history first |
| `short` | The vertical **short-video feed** (TikTok style), starting at the tapped item. See [Short video feed](#short-video-feed) |

In explore, `stream` / `short` only take effect through a `detail` action — the
default one created from `link`, or an explicit `{ type: "detail" }`. Any other
action type overrides them.

### detail.js

Returns detailed info about a book/video.

**Parameters:**

| Param | Description |
|-------|-------------|
| `url` | The item URL — the `link` a search/explore item pointed to |

```js
function execute(url) {
    let doc = fetch(url).html();

    return Response.success({
        name: doc.select("h1.title").text(),
        author: doc.select(".author").text(),
        cover: doc.select(".cover img").attr("src"),
        description: doc.select(".description").html(),
        detail: doc.select(".info").html(),
        url: url,
        type: "novel",       // "novel", "comic", "audio", "video", "ebook", "news"
        format: "novel",     // see format table below
        ongoing: true,
        nsfw: false,
        locale: "vi",
        // Each of tags/genres/suggests/reviews/comments is { title, input, script }
        // where `script` is called with `input` as args[0] to fetch that list.
        tags: doc.select(".tag").map(function(el) {
            return {
                title: el.text(),
                input: el.attr("href"),
                script: "genre_items.js",
            };
        }),
        genres: [],
        suggests: [],
        reviews: [],
        comment: null,       // single comment source, or omit
        comments: [],        // additional comment sources
        // Ebook-download items: when type is "ebook" and download_links is
        // non-empty, the detail screen hides the table of content, "add to
        // shelf" and "follow" actions and only shows these download entries.
        download_links: [
            {
                title: "EPUB",
                type: "direct",   // "direct" or "browser"
                link: "https://.../book.epub",
            },
        ],
    });
}
```

**Detail fields:**

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Title |
| `author` | string | Author name |
| `cover` | string | Cover image URL (relative = joined with `source`) |
| `description` | string | Description. HTML is flattened to plain text |
| `detail` | string | Detail info. HTML is flattened to plain text |
| `url` | string | Canonical URL. Defaults to the requested URL when omitted or `null` (an empty string is kept as-is — don't send `""`) |
| `type` | string | `novel`, `comic`, `audio`, `video`, `ebook`, `news` (case-insensitive). Defaults to the extension's `type` |
| `format` | string | Content format (see table below, case-sensitive). Omitted/unknown = default for the type |
| `ongoing` | boolean | `true` if ongoing, `false` if completed. Default `true` |
| `nsfw` | boolean | Adult content flag. Default `false` |
| `locale` | string | ISO language code |
| `tags` | array | List of `{ title, input, script }` |
| `genres` | array | List of `{ title, input, script }` |
| `suggests` | array | Similar items `{ title, input, script }` |
| `reviews` | array | Review items `{ title, input, script }` |
| `comment` | object | A single comment source `{ title, input, script }` (shown before `comments`) |
| `comments` | array | Comment sources `{ title, input, script }` |
| `download_links` | array | Ebook download entries `{ title, type, link }`. Shown only when the detail `type` is `ebook`; the TOC / shelf / follow UI is then hidden |

- Every element of `tags` / `genres` / `suggests` / `reviews` / `comments` must be an
  object — a string element fails the whole detail.
- `download_links`: entries with an empty `link` are dropped, `link` is resolved
  against `source`, `type` is lower-cased; `browser` opens the in-app browser,
  anything else downloads directly.

**`format` values by `type`:**

| Type | Format | Description |
|------|--------|-------------|
| novel | `novel` | Web novel (HTML chapters) |
| novel | `epub` | EPUB file |
| novel | `mobi` | MOBI/AZW/AZW3/PRC file (aliases `prc`, `azw3`, `azw`) |
| novel | `txt` | Plain text file |
| novel | `html` | HTML/XHTML file (aliases `htm`, `xhtml`) |
| novel | `docx` | DOCX file |
| novel | `fb2` | FB2 file |
| novel | `zip` | ZIP archive |
| novel | `umd` | UMD file |
| comic | `comic` | Web comic (image list per chapter) |
| comic | `cbz` | CBZ archive |
| comic | `pdf` | PDF file |
| audio | `audio` | Single track (music, one-file audiobook) |
| audio | `album` | Playlist — each TOC entry is a track |
| video | `series` | TV series (episodes as chapters) |
| video | `stream` | Plays exactly like `series` (no live-specific handling) |
| video | `short` | Short drama — episodes play in the vertical short-video feed instead of the regular player |

When `format` is omitted or unknown it falls back to the default of the detail
`type` (novel → `novel`, comic → `comic`, audio → `audio`, video → `series`); for
`ebook` / `news` it uses the extension type's default. Write formats in lower case.

### page.js (optional)

Paginates the table of contents. Declare it only when a site splits the chapter
list over several pages.

| Param | Description |
|-------|-------------|
| `url` | The book URL (`detail`'s) |

Return an array of TOC page URLs; the app calls `toc` once for each, in order.

- URLs must be **absolute** — unlike `toc` entries they are not joined with a host.
- Return **at least one** page, and every page must yield chapters: an empty array,
  or a page whose `toc` comes back empty, fails the chapter list (for video it
  empties the episode list).
- The detail screen loads only the first page until the user taps "view all";
  the reader, downloads and refreshes (including video episode refresh) load every
  page. The short feed uses only the first page.

```js
function execute(url) {
    let doc = fetch(url).html();
    let last = parseInt(doc.select(".pagination a").last().text()) || 1;
    let pages = [];
    for (let i = 1; i <= last; i++) pages.push(url + "?page=" + i);
    return Response.success(pages);
}
```

### toc.js

Returns the table of contents (chapter list).

**Parameters:**

| Param | Description |
|-------|-------------|
| `url` | The book URL — or, when `page` is declared, one of the TOC page URLs it returned (`toc` runs once per page and the chapters are concatenated) |

```js
function execute(url) {
    let doc = fetch(url).html();

    let chapters = doc.select(".chapter-list a").map(function(el) {
        return {
            name: el.text(),
            url: el.attr("href"),
            description: "",
            lock: false,
            pay: false,
        };
    });

    return Response.success(chapters);
}
```

**Chapter fields:**

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Chapter title |
| `url` | string | Chapter URL |
| `description` | string | Optional description |
| `lock` | boolean | Locked chapter |
| `pay` | boolean | Paid chapter |
| `type` | string | `"chapter"` (default) or `"section"` (group header; exact lower case) |
| `host` | string | Base URL for a relative `url` (default: extension `source`). Omit it rather than sending `""` — an empty host is not replaced by `source` |

### chap.js

Returns chapter content. For novels, return HTML text. For comics, return an array of
images. For audio/video, return the track list (see
[chap.js for audio / video](#chapjs-for-audio--video)).

**Parameters:**

| Param | Description |
|-------|-------------|
| `url` | The chapter URL — the `url` a TOC entry pointed to |

**Novel:** `data` is the chapter HTML; a non-empty `data2` replaces the TOC title.

**Comic:** `data` must be an **array** (a string or object gives zero pages). Image
entries are URL strings, or objects for more control:

| Field | Type | Description |
|-------|------|-------------|
| `link` | string | Image URL (entries without it are dropped) |
| `fallback` | string[] | Alternative URLs tried when `link` fails |
| `width` / `height` | number | Known size, lets the reader lay out before loading |
| `script` | string | Script file (in `src/`) that loads this image: `execute(link)` returns the image bytes as a **bare base64 string** (not `Response`, no `data:` prefix) — e.g. to unscramble tiles. Used only for `http(s)` links |

```js
// Novel
function execute(url) {
    let doc = fetch(url).html();
    let content = doc.select(".chapter-content").html();
    let title = doc.select("h1.chapter-title").text();

    return Response.success(content, title);
}
```

```js
// Comic (return array of image URLs)
function execute(url) {
    let doc = fetch(url).html();
    let images = doc.select(".page-image img").map(function(el) {
        return el.attr("src");
    });
    return Response.success(images);
}
```

### track.js (Video & Audio)

Resolves one track returned by `chap` into something playable. Called for both
`video` and `audio` sources. See [Video & audio playback](#video--audio-playback) for
the full pipeline and the resolver types.

**Parameters:**

| Param | Description |
|-------|-------------|
| `data` | The `data` of one track from `chap.js`'s track list — resolve it to a playable stream |

```js
function execute(data) {
    let doc = fetch(data).html();
    let videoUrl = doc.select("video source").attr("src");

    return Response.success({
        type: "native",         // resolver: "native" | "auto" | "webview" (exact lower case)
        data: videoUrl,         // what the resolver gets (see Resolvers)
        host: "",               // fallback base URL, see Track fields
        mimeType: "application/x-mpegURL",  // used as-is; inferred from the URL when empty
        headers: {                          // request headers for the stream
            "Referer": "https://example.com"
        },
        timeSkip: [                         // optional intro/outro skip ranges (integer ms)
            { fromTime: 0, toTime: 90000 }
        ],
        subtitles: [
            {
                data: "https://example.com/sub.vtt",  // URL, data: URI or inline VTT/SRT (required)
                type: "vtt",                          // informational
                label: "Vietnamese",                  // display name
                language: "vi",                       // BCP-47 tag
            }
        ],
        audios: [                            // extra audio tracks (dubs)
            {
                data: "https://example.com/audio-en.m3u8", // audio URL (required)
                type: "",                                  // container/type hint
                label: "English",                          // display name
                language: "en",                            // BCP-47 tag
                headers: {},                               // request headers for this track
            }
        ],
        danmaku: [                           // bullet comments drawn over the video
            {
                data: "https://comment.bilibili.com/123456.xml", // URL, data: URI or raw content (required)
                type: "bilibili",                                // format, see below; "" = auto-detect
                label: "Bilibili",                               // display name
            }
        ],
    });
}
```

`Response.error(message)` from `track.js` stops playback and shows `message` in the
video player (the audio player shows a generic failure).

**Track fields:**

| Field | Type | Description |
|-------|------|-------------|
| `type` | string | Resolver: `native`, `auto`, `webview` — exact lower case. Missing/unknown = error |
| `data` | string | What the resolver gets (URL / HLS / HTML, see [Resolvers](#resolvers)). Required |
| `host` | string | Base URL used only when the resolver doesn't produce one: always for `native`, and for `webview` HTML without an absolute iframe. No default |
| `mimeType` | string | Used as-is when set; otherwise inferred from the URL's file extension (`data:` / `#EXTM3U` = HLS) |
| `headers` | object | Request headers. Merged over the resolver's headers (yours win, e.g. over `auto`'s `Referer`); also used to fetch subtitles, danmaku and audio tracks without their own headers |
| `timeSkip` | array | Skip ranges `{ fromTime, toTime }` in **integer** ms (intro/outro). Non-integer values drop the entry |
| `subtitles` | array | Array of objects `{ data, type, label, language }` — `data` required. `data` may be a URL, a `data:` URI or inline subtitle text; only VTT and SRT are parsed; `type` is informational |
| `audios` | array | Alternate audio tracks `{ data, type, label, language, headers }` — `data` required |
| `danmaku` | array | Danmaku (bullet comment) sources `{ data, type, label }` — `data` required. A single object, a bare string or an array of strings is also accepted; `danmakuType` (top level) gives the format of bare strings |
| `lyrics` | array | **Audio.** Lyric sources `{ data, type, label, language }` or bare strings (as array elements only). For a single string use `lyric` (+ `lyricType`). The format is detected from content |
| `drm` | object | ClearKey protection `{ scheme: "clearkey", keys }`; `keys` is EME JWK JSON or `kid:key` hex pairs (a string). Shorthand: `clearKey` / `clearkey: "<keys>"`. Only `clearkey` / `clear-key` is supported — any other scheme is ignored and the stream plays unprotected |

`kind` is computed by the resolver; a `kind` returned by the script is ignored.

Legacy single-value fields are still accepted: `audio` (string), `subtitle` +
`subtitleType` (strings). Prefer the `audios` / `subtitles` arrays.

**Danmaku sources** are read like subtitles: `data` is an `http(s)` URL (fetched with
the track's `headers`), a `data:…;base64,…` URI, or the comment file's content itself.
Gzip / zlib / raw-deflate payloads are decompressed automatically (Bilibili serves
deflated XML). Danmaku loads after playback starts, so a large file never delays the
video. Supported `type` values — leave it empty (or unknown) to auto-detect:

| `type` (aliases) | Format |
|--------|--------|
| `bilibili` (`xml`) | XML `<d p="time,mode,size,color,…">text</d>` |
| `bilibili-proto` (`proto`, `protobuf`) | Protobuf `DmSegMobileReply` (`seg.so`) |
| `dandanplay` (`dandan`) | JSON `{ comments: [ { p: "time,mode,color,uid", m: "text" } ] }` |
| `acfun` | JSON `[ [ { c: "time,color,mode,size,…", m: "text" } ] ]` |
| `niconico` (`nico`) | XML `<chat vpos mail>` or JSON `[ { chat: { vpos, content, mail } } ]` |
| `dplayer` (`artplayer`) | JSON `{ data: [ [time, type, color, author, text] ] }` (DPlayer / Artplayer) |
| `ass` (`ssa`) | ASS with `\move` / `\pos` (Danmaku2ASS output) |
| `json` | JSON `[ { time, text, color, mode } ]` — `time` in seconds (or `timeMs`), `color` `#RRGGBB` or int, `mode` `scroll` / `top` / `bottom` |

Comments are normalised to scrolling / top / bottom lines; scripted effects (Bilibili
mode 7+, Niconico commands beyond position and colour) are skipped. At most 20,000
comments per source are kept, thinned evenly across the episode.

---

## Video & Audio Playback

### Pipeline

For `video` (and `audio`) the scripts chain like this:

1. `detail.js` — `type: "video"`, `format: "series"` / `"stream"` / `"short"`.
2. (`page.js` →) `toc.js` — the episode list; each TOC entry is one episode.
3. User picks an episode → `chap.js(episodeUrl)` returns that episode's **track list**
   (servers / qualities / languages).
4. The app picks a track → `track.js(track.data)` resolves it into something the
   player can play.

`chap.js` does not return the final media URL — `track.js` is the resolver step. Each
track's `data` is an opaque string passed verbatim to `track.js`: an embed page URL, a
watch page URL, a direct media URL, or a JSON string your `chap.js` encoded for
`track.js` to parse.

- The player auto-plays the track whose title matches the one used last time, else
  the first. The other tracks are switchable servers (the position is kept). Give
  tracks **unique, non-empty titles** — the title is the track's identity.
- If a track fails there is no automatic fallback to the next one; the error is shown.
- The episode name comes from the TOC title; `data2` of `chap` is ignored for video.

### chap.js for audio / video

`data` is read as:

- an array of `{ data, title }` (recommended) — `url` / `link` are accepted for
  `data`, `name` / `label` for `title`; entries with blank `data` are dropped;
  bare strings in the array also work;
- a wrapper object `{ tracks: [...] }` or `{ data: [...] }`;
- a single track object.

A bare string as `data` is **not** safe: the app re-parses it as JSON, which fails
for a URL. Wrap it in an array: `Response.success([{ title: "Default", data: url }])`.
Other fields of a track entry are ignored.

```js
function execute(url) {
    let doc = fetch(url).html();
    let tracks = [];

    doc.select(".server-item").forEach(function (item) {
        let link = item.attr("data-url") || item.attr("href");
        if (link) tracks.push({ title: item.text().trim() || "Server " + (tracks.length + 1), data: link });
    });

    if (tracks.length === 0) {
        let src = doc.select("iframe").attr("src");
        if (src) tracks.push({ title: "Default", data: src });
    }

    return Response.success(tracks);
}
```

When `track.js` needs several values, encode them into `data`:

```js
tracks.push({
    title: "Default",
    data: JSON.stringify({ page: url, embed: embedUrl }),
});
// track.js: let payload = JSON.parse(data);
```

**Audio specifics:** only the first track with non-blank `data` is used (else the
chapter URL). From `track.js` the audio player reads only `data`, `headers`,
`audios[0]` (its `data` replaces the track's `data`; its `headers` replace the
track's if non-empty) and `lyrics`.

### Resolvers

`track.js` returns `{ type, data, ... }`; `type` picks the resolver.

#### `native`

`data` is already playable: an absolute `http(s)` media URL (`.m3u8`, `.mp4`, `.mkv`,
`.webm`, …), a `data:` URI of an HLS playlist (`mpegurl` in its header), or raw
`#EXTM3U` playlist text. Anything else (relative URL, DASH/MP4 `data:` URI) is an
error. Pass Referer/cookies in `headers`.

```js
function execute(data) {
    return Response.success({
        type: "native",
        data: "https://cdn.example.com/video/master.m3u8",
        headers: { "Referer": "https://example.com/" },
    });
}
```

#### `auto`

`data` is an absolute `http(s)` page URL (watch / embed page). The app loads it in a
headless WebView, sniffs the real media URL and plays it natively, adding
`Referer: <page URL>`. If no media is found it **fails** — there is no WebView
playback fallback. Usually the best choice for third-party embed pages.

```js
function execute(data) {
    return Response.success({ type: "auto", data: data });
}
```

#### `webview`

`data` is one of:

- a page URL;
- raw HTML — it must start with `<iframe` or `<html`, or contain `<body` or `<video`
  (a bare `<!DOCTYPE html>…` without `<body` is rejected);
- a JSON string `{ "data": "<html or URL>", "host": "https://example.com" }`.

The app first tries to extract a media URL (headless) and plays it natively; if that
fails it embeds the page — the absolute iframe `src` when there is one, else the raw
HTML. The JSON `host` is only the base URL for HTML without an absolute iframe; the
embedded page uses the top-level `host` as its base.

```js
function execute(data) {
    let payload = JSON.parse(data);   // encoded by chap.js
    return Response.success({
        type: "webview",
        data: '<html><body><iframe src="' + payload.embed + '"></iframe></body></html>',
        host: payload.page,
    });
}
```

Embedded (webview) playback has limits: `timeSkip`, `subtitles`, `audios` and `drm`
don't apply, danmaku is hidden, and only `User-Agent` and `Referer` reach the page.

**Choosing a resolver:** direct media URL → `native`; page/embed URL → `auto`; page that
must be rendered (custom HTML, injected iframe, or `auto` can't find the media) →
`webview`.

---

## Available JS APIs

Platform note: Android and desktop throw script errors from native calls into JS; on
**iOS** a failing native call returns `undefined` instead of throwing — check results
rather than relying on `try/catch`.

### fetch (HTTP)

```js
let response = fetch(url, {
    method: "POST",          // GET (default), POST, PUT, DELETE, PATCH, HEAD, OPTIONS
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),      // string | Blob | flat object (form-urlencoded)
    queries: { "page": "1" },        // URL query parameters
    timeout: 30000,                  // ms, default 120000
    stream: true,                    // don't buffer the body (for readLine / SSE)
});

// Response properties:
response.status;             // HTTP status code (int)
response.statusText;         // status text
response.ok;                 // true if status 2xx
response.url;                // final URL (after redirects)
response.headers;            // all headers as object (lower-cased keys, first value)
response.header("key");      // single header value (case-insensitive), "" if missing

// Response body methods:
response.text();             // body as string (charset from Content-Type, else UTF-8)
response.text("gbk");        // body with specific charset
response.json();             // body parsed as JSON object
response.html();             // body parsed as HtmlElement
response.html("gbk");        // parsed with charset
response.base64();           // body as base64 string
response.blob();             // body as Blob { size, type, base64() }
response.readLine();         // next body line (streaming, e.g. SSE); null at end of stream

// Original request info:
response.request.url;
response.request.headers;
```

- `body` is ignored for GET/HEAD. A Blob body sends raw bytes (its `type` becomes
  `Content-Type` unless you set one). An object body is sent form-urlencoded and must
  be flat (nested objects/arrays fail the request).
- The app adds a default User-Agent (`UserAgent.system()`) and
  `Accept-Encoding: identity` unless you set them, and uses the app's cookie jar (a
  `Cookie` header you pass is stored there; `Set-Cookie` responses are saved).
- `fetch` **never throws** on network errors (DNS, timeout, refused): you get
  `status: 504`, `ok: false`, `url: ""`, and `text()` returns nothing — so `json()`
  throws. Check `response.ok` before parsing.

**Examples:**

```js
// GET
let doc = fetch("https://example.com/page").html();

// GET with query params
let json = fetch("https://api.example.com/search", {
    queries: { q: "hello", page: "1" }
}).json();

// POST JSON
let result = fetch("https://api.example.com/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user: "admin", pass: "123" }),
}).json();

// POST form
let text = fetch(url, {
    method: "POST",
    headers: { "Referer": "https://example.com" },
    body: { key: "value", page: "2" },
}).text();
```

**Legacy `Http` builder** (kept for old extensions — prefer `fetch`):

```js
Http.get(url).headers({...}).params({...}).timeout(ms).string(charset);  // also .html(charset), .blob()
Http.post(url).headers({...}).queries({...}).body(data).string();         // .binary(base64, type) for a Blob body
```

`params` (GET only) is an alias of `queries`; there is no `json()` — use
`JSON.parse(... .string())`.

### Blob

```js
let blob = Blob.fromBase64(base64, "image/png");
blob.size;        // decoded byte length
blob.type;        // content type
blob.base64();    // base64 data
```

A `Blob` can be passed as `fetch` `body` to send binary data.

### HTML Parsing

```js
let doc = Html.parse("<html>...</html>");

// Select elements
let elements = doc.select("div.class > a");
let first = elements.first();
let last = elements.last();
let item = elements.get(0);

// Element methods
let text = element.text();           // inner text
let html = element.html();           // inner HTML
let attr = element.attr("href");     // attribute value ("" if missing)
let attrs = element.attributes();    // all attributes as object
element.remove();                    // remove from DOM
String(element);                     // same as element.html()

// Iterate
elements.forEach(function(el) { ... });
let arr = elements.map(function(el) { return el.text(); });
let count = elements.size();        // or elements.length
let empty = elements.isEmpty();

// Collection-level shortcuts (apply to all matched elements)
elements.text();                     // combined text
elements.html();                     // combined HTML
elements.attr("href");               // value from the first matched element that has it, or ""
elements.remove();                   // remove all from DOM

// Chain selects
let nested = elements.select(".sub-item");
```

`get` / `first` / `last` on an empty or too-short collection return an empty element
(its methods return `""`) instead of throwing.

### Storage

```js
// Persistent per-extension storage
localStorage.setItem("key", "value");
let val = localStorage.getItem("key");
localStorage.removeItem("key");
localStorage.clear();

// Cache storage (may be cleared by system)
cacheStorage.setItem("key", "value");
let cached = cacheStorage.getItem("key");
cacheStorage.removeItem("key");
cacheStorage.clear();

// Dynamic (config.js) setting values; null when unset. Static values are constants.
let setting = localConfig.getItem("settingKey");

// Cookies for the extension's source domain
localCookie.setCookie("name=value; path=/");
let cookie = localCookie.getCookie();
```

### Local database

Per-extension tables keyed by book. Any non-blank table name works. Declaring a table
in `config` with `"mode": "database"` (the config key is the table name) only adds it
to the settings UI, where the user can browse and edit its rows:

```json
"config": {
    "characters": { "title": "Characters", "mode": "database" }
}
```

Every row is `(bookId, table, key) -> value`. `bookId` is always the first
argument; an empty `bookId` (`""`) addresses the table's **shared** rows, not tied
to any book. `value` is always a string — the script decides its format
(plain text, JSON, …) when writing and parses it when reading.

```js
// Read
localDatabase.list(bookId, table);                       // all rows
localDatabase.list(bookId, table, offset, limit);        // paged
localDatabase.search(bookId, table, query);              // rows whose value contains query
localDatabase.search(bookId, table, query, offset, limit);
localDatabase.get(bookId, table, key);                   // value string, or null/undefined
localDatabase.count(bookId, table);                      // row count
localDatabase.count(bookId, table, query);               // count of search matches

// Write (insert or overwrite; createAt is kept on overwrite)
localDatabase.upsert(bookId, table, key, value);         // true if written
localDatabase.upsertAll(bookId, table, { k1: "v1", k2: "v2" });   // returns rows written
localDatabase.upsertAll(bookId, table, [{ key: "k1", value: "v1" }]);

// Delete
localDatabase.delete(bookId, table, key);
localDatabase.clear(bookId, table);                      // all rows of this book in the table
```

`list` / `search` return:

```js
[{ key: "k1", value: "v1", createAt: 1730000000000, updateAt: 1730000000000 }]
```

- Rows are ordered by `createAt` (oldest first).
- `search` is a substring match on `value` (SQL `LIKE`; case-insensitive for ASCII only).
- An empty `table` or `key` is rejected: reads return `[]` / `null` / `0`, writes return `false` / `0`.
- `upsertAll` writes in a single transaction.
- Data is removed when the extension is uninstalled.

```js
// Store JSON objects by stringifying them yourself
localDatabase.upsert(bookId, "characters", "张三", JSON.stringify({ name: "Trương Tam", gender: "m" }));
let row = JSON.parse(localDatabase.get(bookId, "characters", "张三") || "null");
```

### Local book

Available when the script runs with a book context: content scripts (reader /
download), translate, AI, config and action scripts. Not available to TTS scripts or
the developer server. The book is fixed by the session — scripts cannot target
another book.

```js
localBook.getInfo();                  // book metadata or null
localBook.getTableOfContent();        // [{ id, title: { engineId: text }, path?, parentId?, position }]
localBook.getChapterContent(position);// { bookId, position, content: { engineId: text } } or null

// Book-private dictionaries (apply only to this book)
localBook.getNames();                 // { word: replace }
localBook.addName(word, replace, ignoreCase);   // add/overwrite a name word
localBook.getQtNames();               // { word: trans }
localBook.addQtName(word, trans);     // add/overwrite a QT Name
localBook.getQtVietPhrases();         // { word: trans }
localBook.addQtVietPhrase(word, trans);
```

- Text maps (chapter `title`, chapter `content`, and `name` / `author` /
  `description` of `getInfo()`) are keyed by translate engine id; the original text is
  under `"raw"`.
- `path` / `parentId` are omitted when the chapter has none.
- `getChapterContent` never hits the network: it returns locally saved content, or
  the reader's cached copy of the chapter, else `null`.

`getInfo()` returns `{ id, name, author, cover, type, format, language, path, source,
extensionId, status, description, totalChapter, lastReadChapterIndex,
lastReadChapterName }`.

### Browser (Headless WebView)

For sites that require JavaScript rendering:

```js
let browser = Engine.newBrowser();       // user agent preset to UserAgent.system()

// Load URL and wait for the page to finish (timeout ms, default 30000), returns the DOM
let doc = browser.launch("https://example.com", 10000);

// Or load without waiting and interact
browser.launchAsync("https://example.com");
browser.waitUrl([".*api\\.example\\.com/data.*"], 15000);  // wait for a matching request
let doc2 = browser.html(2000);           // wait 2000 ms, then return the current DOM

// Execute JS in the page; the result (a string) comes back parsed as an HtmlElement
let title = browser.callJs("document.title", 5000).text();

// Block requests (ad blocking); replaces the previous list
browser.block([".*ads\\.example\\.com.*", ".*tracker\\.js.*"]);

// All URLs requested since the last launch / loadHtml
let urls = browser.urls();

// Load raw HTML with a base URL (waits for the page to finish)
browser.loadHtml("https://example.com", "<html>...</html>");

// Override the user agent
browser.setUserAgent(UserAgent.chrome());

browser.close();
```

- `waitUrl` / `block` patterns are **regexes matched against the full URL** —
  `"api.example.com"` alone never matches; use `".*api\\.example\\.com.*"`.
- `waitUrl` accepts one pattern string or an array. It returns immediately if a
  matching URL was already requested since the last launch, and silently returns on
  timeout (default 15000 ms) — check `urls()` afterwards if you need to know.
- `callJs` must evaluate to a string (stringify objects yourself; on Android a
  non-string result hangs until the timeout).

**Passing values out of the page — `getVariable`.** It does not read page globals;
it reads a store filled by `putVariable` calls from JS you run with `callJs`. The
store is cleared on every `launch` / `launchAsync` / `loadHtml`.

```js
browser.launch(url, 10000);
browser.callJs(
    "_callNativeFunction(JSON.stringify(['putVariable', 'token', String(window.__TOKEN__)])); ''",
    5000,
);
let token = browser.getVariable("token");   // undefined if never set
```

`_callNativeFunction` exists only inside `callJs` code (closures defined there keep
working, e.g. a hooked `XMLHttpRequest` that reports a response later).

### Graphics (Image manipulation)

```js
let canvas = Graphics.createCanvas(800, 600);
let image = Graphics.createImage(base64String);          // throws on invalid image data (iOS: undefined)
image.width;  image.height;                              // source image size in px

canvas.drawImage(image, dx, dy);                         // natural size at (dx, dy)
canvas.drawImage(image, dx, dy, dw, dh);                 // scaled into that rect
canvas.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh); // source crop → destination rect

let resultBase64 = canvas.capture();                     // PNG, base64
```

- Coordinates are rounded to whole pixels. A 6-argument call behaves like the
  5-argument one (the extra value is ignored); any other argument count draws nothing.
- `capture()` releases the canvas — create a new canvas for the next image.

### WebSocket

```js
let ws = WebSocket("wss://example.com/ws", { "Origin": "https://example.com" });
ws.connect();              // blocks until the handshake completes; throws if it fails
ws.send("hello");          // string -> text frame, otherwise binary
ws.sendText("hello");
ws.sendBuffer([1, 2, 255]); // array of byte values
let frame = ws.message();  // next frame, blocking (alias: ws.receive())
// frame.type = "text" | "binary" | "close" | "ping" | "pong"
// frame.data = raw frame bytes
ws.readyState;             // live: ws.CONNECTING / OPEN / CLOSING / CLOSED (0..3)
ws.url; ws.headers;
ws.close();
```

- Incoming frames are queued, so none are lost between `message()` calls.
- Once the socket is closed (by either side), `message()` returns a frame with
  `type: "close"` instead of blocking, and `readyState` reads `CLOSED`.
- `frame.data` is a byte array (signed values on Android/desktop); binary frames are
  not usable on iOS. On iOS a failed `connect()` does not throw — check
  `ws.readyState === ws.OPEN`.

### Translation (Quick Translator)

Uses the built-in QT dictionary engine for offline Chinese → Vietnamese translation.

```js
// Basic translate
let result = Qt.translate("你好世界", "vp");
// result = {
//   translateText: "Xin chào thế giới",
//   segments: [
//     { srcStart: 0, srcLen: 2, transStart: 0, transLen: 8, type: 1 },
//     ...
//   ]
// }

// Chapter title
let title = Qt.translate("第一章 新的开始", "vp", {
    chapter_name: true,
    first_capitalize: true,
});

// Person name (always Hán Việt)
let name = Qt.translate("张三", "vp", { person_name: true });
```

**`Qt.translate(text, to, extras)`**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `text` | string | yes | Source text (Chinese) |
| `to` | string | yes | `"hv"` = Hán Việt (Sino-Vietnamese transliteration); any other value = VietPhrase (full translation with name/phrase dictionaries) |
| `extras` | object | no | Translation options (all optional, see below) |

**`extras` fields:**

| Key | Type | Description |
|-----|------|-------------|
| `ner` | int | Named-entity mode `0`=PER, `1`=LOC, `2`=ORG, `3`=TIME. Any value turns NER mode on and overrides every other mode; a non-integer fails the call |
| `person_name` | boolean | Translate as a person name (always Hán Việt) |
| `chapter_name` | boolean | Translate the whole text as a chapter title |
| `first_line_chapter_name` | boolean | First line as chapter title, rest as body |
| `first_capitalize` | boolean | Capitalize the first word (default `false`). Words after `.?!:…` or a line break are always capitalized |
| `convert_simplified` | boolean | `true`: return only the text converted to Simplified Chinese — **no translation** (input unchanged if the app's auto-conversion setting is off). `false`: disable the automatic Traditional → Simplified conversion |

Mode precedence: `convert_simplified: true` → `ner` → `to: "hv"` → `person_name` →
`chapter_name` → `first_line_chapter_name` → VietPhrase.

**Return value:**

```js
{
    translateText: "translated string",
    segments: [          // missing for empty input / convert_simplified
        {
            srcStart: 0,    // start index in source text
            srcLen: 2,      // length in source text
            transStart: 0,  // start index in translated text
            transLen: 5,    // length in translated text
            type: 1,        // 0=None, 1=VietPhrase, 2=Name, 3=Hv, 4=Special, 5=Rule
        }
    ]
}
```

Empty input returns `{ translateText: "" }`; an engine failure returns `null`.

### Utilities

```js
// Logging (only the first argument is logged)
Log.log("debug message");
console.log("debug message");

// Sleep
sleep(1000);  // milliseconds

// Evaluate JS source in a separate, isolated engine and call one of its functions
let result = Script.execute("function run(x) { return x + '!'; }", "run", "input");

// User agent strings
let ua = UserAgent.system();   // Chrome (desktop) UA if the browser's desktop mode is on, else iOS UA on iOS, Android UA elsewhere
let chrome = UserAgent.chrome();
let android = UserAgent.android();
let ios = UserAgent.ios();
```

`Script.execute(sourceCode, functionName, input)` — the first argument is JS **source
code**, not a file name. It runs without the core helpers (`fetch`, `Html`,
`Response`, …); the function gets the single `input` argument and its return value
is passed back.

### Crypto

Available via `load('crypto.js');` at the top of your script (built in; it takes
priority over a `crypto.js` of your own):

```js
load('crypto.js');
let hash = CryptoJS.MD5("text").toString();
```

The `CryptoJS` shim provides:

- Hashes `MD5`, `SHA1`, `SHA256`, `SHA512`; `HmacMD5`, `HmacSHA1`, `HmacSHA256`,
  `HmacSHA512`.
- Ciphers `AES`, `DES`, `TripleDES`, `RC4` (`RC4Drop`); modes `CBC`, `ECB`, `CFB`,
  `OFB`, `CTR`; paddings `Pkcs7`, `NoPadding`, `ZeroPadding`. A string key is treated
  as an OpenSSL passphrase (`Salted__`), a WordArray key as raw bytes.
- KDFs `PBKDF2` (defaults: hasher SHA256, 250000 iterations, keySize 4) and `EvpKDF`
  (MD5, 1 iteration, keySize 4). Pass the hasher as `CryptoJS.algo.SHA1` etc.
- Encoders `enc.Hex`, `enc.Base64`, `enc.Utf8`, `enc.Latin1`, `enc.Utf16`,
  `enc.Utf16LE`.
- `Rabbit` throws "not supported".

WordArray keys, IVs and data are passed to the native side as text, so they only
round-trip correctly when every byte is < 0x80. For binary keys/IVs prefer hex
strings where the API accepts them.

**AES-GCM** (authenticated encryption — beyond the stock CryptoJS API):

```js
// Encrypt -> { ciphertext, tag } (both WordArray-like, .toString(enc) supported)
const r = CryptoJS.AES.encryptGcm("plaintext", keyHex, {
    iv: ivHex,          // recommended 12 bytes
    aad: "optional",    // additional authenticated data, optional
});
const ctBase64 = r.ciphertext.toString(CryptoJS.enc.Base64);
const tagBase64 = r.tag.toString(CryptoJS.enc.Base64);

// Decrypt -> throws if the tag doesn't verify (tampered data / wrong key)
const plain = CryptoJS.AES.decryptGcm(
    { ciphertext: r.ciphertext, tag: r.tag },
    keyHex,
    { iv: ivHex, aad: "optional" },
).toString(CryptoJS.enc.Utf8);
```

- Key: a 32/48/64-char hex string (AES-128/192/256) or a passphrase, zero-padded or
  truncated to 16/24/32 bytes.
- IV: an even-length hex string is decoded as hex, anything else is used as text
  (UTF-8); a WordArray IV works only if all bytes are < 0x80. Empty = 12 zero bytes.
- The tag is 128-bit. On iOS a failed tag check returns an empty string instead of
  throwing.

### Loading other scripts — `load()`

```js
load('crypto.js');    // built-in crypto library
load('utils.js');     // your shared script, at the top level of src/
```

`load('file.js')` is a **text substitution** done before the script runs, not a
function call: the line is replaced with the file's content.

- The argument must be a string literal (`load(name)` with a variable does nothing).
- The file must be at the top level of `src/`; a missing file is replaced by nothing.
- Loads inside a loaded file are not expanded.
- The pattern is matched anywhere in the text, including comments.

---

## Complete Example: Novel Extension

**search.js:**
```js
function execute(query, page) {
    page = page || "1";

    let doc = fetch(DOMAIN + "/search", {
        queries: { q: query, page: page }
    }).html();

    let items = doc.select(".story-item").map(function(el) {
        return {
            name: el.select(".story-title a").text(),
            cover: el.select("img").attr("data-src"),
            link: el.select(".story-title a").attr("href"),
            description: el.select(".chapter-latest").text(),
        };
    });

    let hasNext = !doc.select(".pagination .next").isEmpty();
    let nextPage = hasNext ? (parseInt(page) + 1).toString() : "";

    return Response.success(items, nextPage);
}
```

**detail.js:**
```js
function execute(url) {
    let doc = fetch(url).html();

    return Response.success({
        name: doc.select("h3.title").text(),
        author: doc.select(".info a[href*=author]").text(),
        cover: doc.select(".book-cover img").attr("src"),
        description: doc.select(".desc-text").html(),
        detail: doc.select(".info-item").html(),
        url: url,
        type: "novel",
        format: "novel",
        ongoing: doc.select(".info").text().indexOf("Ongoing") !== -1,
        tags: doc.select(".genre a").map(function(el) {
            return {
                title: el.text(),
                input: el.attr("href"),
                script: "genre_items.js",
            };
        }),
    });
}
```

**toc.js:**
```js
function execute(url) {
    let doc = fetch(url).html();

    let chapters = [];
    doc.select("#list-chapter a").forEach(function(el) {
        chapters.push({
            name: el.text(),
            url: el.attr("href"),
        });
    });

    return Response.success(chapters);
}
```

**chap.js:**
```js
function execute(url) {
    let doc = fetch(url).html();

    doc.select(".ads, script, .chapter-nav").forEach(function(el) {
        el.remove();
    });

    let title = doc.select(".chapter-title").text();
    let content = doc.select(".chapter-content").html();

    return Response.success(content, title);
}
```

---

## Complete Example: Comic Extension

`plugin.json` metadata `"type": "comic"`. `detail.js` returns `type: "comic"`,
`format: "comic"`. `toc.js` is identical to the novel one (add `page.js` if the
chapter list is paginated). The difference is `chap.js`, which returns the chapter's
images as an array:

**chap.js:**
```js
function execute(url) {
    let doc = fetch(url).html();
    let images = doc.select(".reader img.page-img").map(function(el) {
        // Many comic sites lazy-load — prefer data-src over src.
        return el.attr("data-src") || el.attr("src");
    });
    return Response.success(images);   // array → comic pages
}
```

---

## Complete Example: Video Extension

`plugin.json` metadata `"type": "video"`. `detail.js` returns `type: "video"`
with `format: "series"` (or `"stream"` / `"short"` — the playable video
formats). `toc.js` lists episodes (each TOC entry is an episode). `chap.js`
lists the playable tracks (servers) of an episode, and the player resolves the
chosen one through `track.js`:

**chap.js** — `execute(episodeUrl)`:
```js
function execute(episodeUrl) {
    let doc = fetch(episodeUrl).html();
    let tracks = doc.select(".server-list a").map(function(el) {
        return { title: el.text(), data: el.attr("href") };   // data → track.js
    });
    return Response.success(tracks);
}
```

**track.js** (all fields shown — see the Track fields table above for which are
optional):
```js
function execute(trackUrl) {
    let res = fetch(trackUrl);
    if (!res.ok) return Response.error("Server unavailable (" + res.status + ")");
    let doc = res.html();

    // Resolve the direct playable URL (m3u8/mp4).
    let source = doc.select("video source").attr("src");
    if (!source) return Response.success({ type: "auto", data: trackUrl });

    return Response.success({
        type: "native",
        data: source,
        mimeType: "application/x-mpegURL",
        headers: { "Referer": DOMAIN },
        timeSkip: [{ fromTime: 0, toTime: 85000 }],   // skip 85s intro
        subtitles: [
            { data: DOMAIN + "/sub/vi.vtt", type: "vtt", label: "Vietnamese", language: "vi" }
        ],
        audios: [
            { data: DOMAIN + "/audio/en.m3u8", type: "", label: "English", language: "en", headers: {} }
        ],
    });
}
```

### Short video feed

A full-screen vertical feed: one video per page, autoplay and loop, tap to pause,
double-tap to save to the shelf, swipe up for the next one. No new script is
needed — it is driven by the scripts above.

**Feed of items.** Give list/search/explore items `type: "short"`:

```js
// latest.js — a page of shorts
return Response.success(items.map(function (it) {
    return { name: it.title, cover: it.thumb, link: it.url, description: it.desc, type: "short" };
}), nextPage);
```

- Tapping one opens the feed at that item. Every `short` item of the same list is
  queued; when the user is within 3 items of the end, the app calls the same script
  again with `data2` and keeps only the new `short` items (de-duplicated by resolved
  link). Non-`short` items are skipped.
- From explore, a `short` item opens the feed through its default (`link`) or an
  explicit `detail` action; items with an empty `link` are left out. The feed queues
  the section's `short` items; if the section has a `more` action of `type: "list"`,
  the feed then continues through that list from its first page. Use
  `shape: "short"` for 9:16 cards, and keep links unique within a section.
- Each item is resolved without opening detail: first TOC page from `page` (if
  declared) → `toc` → `chap` of the first non-`section` episode → `track` of its
  **first** track. Keep these
  fast — they run for the next items while the user watches the current one.
- Nothing is written to the library while swiping. Saving (bookmark button or
  double-tap) runs `detail` and puts the book on the shelf; the info button opens
  the detail page.

**Short drama (multi-episode).** Return `type: "video", format: "short"` from
`detail.js`. Opening the book (shelf, history or detail) shows its episodes in the
feed — one episode per page, auto-advancing to the next episode at the end — and
resumes at the last watched episode and position.

`webview` tracks play too, but only once their page is on screen (no preloading).

---

## Complete Example: TTS Engine

`plugin.json` metadata `"type": "tts"`. Declare two scripts — `voice` and `tts`.
Engine-specific `config` keys the app reads. Write them as **bare JSON values**
(`"max_length": 300`, not `"300"` or a `{ title, default }` object — those read as 0):

| Key | Description | Default |
|-----|-------------|---------|
| `preload_size` | Sentences to pre-synthesize ahead | `0` |
| `preload_parallel` | Preload in parallel | `false` |
| `max_length` | Max characters per synthesis request. **Set it (> 0)**: 0 splits every character into its own request | — |

The app has no API-key field for TTS engines: a key the engine needs belongs in its
own `config` (as an `input` setting the user fills in, read as an injected constant).

```json
"config": { "preload_size": 2, "preload_parallel": true, "max_length": 300 }
```

**voice.js** — return the available voices. Each voice's `language` must be a valid
BCP-47 tag — a voice with an empty or invalid language can't be selected:
```js
function execute() {
    return Response.success([
        { id: "vi-VN-Standard-A", name: "Standard A", language: "vi-VN" },
        { id: "vi-VN-Wavenet-B",  name: "Wavenet B",  language: "vi-VN" },
        { id: "en-US-Standard-C", name: "Standard C", language: "en-US" },
    ]);
}
```

**tts.js** — `execute(text, voiceId)`; synthesize one sentence, return the audio
bytes **base64-encoded** in `data`.

| Param | Description |
|-------|-------------|
| `text` | One sentence to synthesize |
| `voiceId` | The selected voice's `id` (from your `voice` list) |

```js
function execute(text, voiceId) {
    let audioBase64 = fetch(DOMAIN + "/synthesize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text, voice: voiceId }),
    }).base64();

    return Response.success(audioBase64);   // base64 audio (mp3/wav/…)
}
```

- Speech rate and pitch are applied by the app to the returned audio; they are not
  passed to the script.
- An empty result or a failure counts as an empty clip; three in a row stop playback.

---

## Complete Example: Translate Engine

`plugin.json` metadata `"type": "translate"`. Declare `language` and `translate`.
You may also declare `model` and `style`; the app shows their selectors only when
the corresponding script returns a non-empty list.

```json
"script": {
  "language": "language.js",
  "model": "model.js",
  "style": "style.js",
  "translate": "translate.js"
}
```

Engine-specific `config` keys, as **bare JSON values** (`"max_line": 50`, not
`"50"` — a quoted value or a `{ title, default }` object is not read):

| Key | Description | Default |
|-----|-------------|---------|
| `support_auto_detect` | Offer an "auto" source language | `false` |
| `max_line` | Max lines per request | unlimited |
| `max_length` | Max characters per request (≤ 0 = no splitting at all, `max_line` included) | unlimited |

The app has no API-key field for translate engines: a key the engine needs belongs in
its own `config` (an `input` setting the user fills in, read as an injected constant).

**language.js** — return supported languages. `type` limits direction:
`"from"` = source only, `"to"` = target only, omitted = both. `name` is optional —
it defaults to the language's display name for `id`:
```js
function execute() {
    return Response.success([
        { id: "en", name: "English" },
        { id: "vi", name: "Vietnamese" },
        { id: "zh", name: "Chinese", type: "from" },
    ]);
}
```

**model.js** (optional) — return the backends/models that the user can choose:

```js
function execute() {
    return Response.success([
        {
            id: "fast",
            name: "Fast",
            description: "Lower latency",
            isNetworkRequired: true,
        },
        {
            id: "quality",
            name: "High quality",
            description: "Better translation quality",
            isNetworkRequired: true,
        },
    ]);
}
```

| Field | Required | Description |
|-------|:--------:|-------------|
| `id` | Yes | Stable value passed to `translate.js` as `model` (empty = entry dropped) |
| `name` | No | Label shown in the picker; falls back to `id` |
| `description` | No | Additional model description |
| `isNetworkRequired` | No | Whether this model needs network access; defaults to `true` |

**style.js** (optional) — return translation tones/styles. This picker is shown
beside the model picker:

```js
function execute() {
    return Response.success([
        { id: "natural", name: "Natural", description: "Fluent everyday wording" },
        { id: "literal", name: "Literal", description: "Stay close to the source" },
    ]);
}
```

| Field | Required | Description |
|-------|:--------:|-------------|
| `id` | Yes | Stable value passed to `translate.js` as `style` |
| `name` | No | Label shown in the picker; falls back to `id` |
| `description` | No | Additional style description |

The selected model and style are stored per engine. Translation settings may
override them globally, per book, or per extension.

**translate.js** — `execute(text, from, to, source, model, style)`. Return either
a plain string or an object with `segments` for word-level mapping.

| Param | Description |
|-------|-------------|
| `text` | The text block to translate |
| `from` | Source language `id` (from your `language` list), or `""` for the app's auto-detect entry |
| `to` | Target language `id` (from your `language` list) |
| `source` | Which part of the app asked (see values below). `""` when untagged — lets a script special-case each context |
| `model` | Selected model `id`, or `""` when the extension has no models |
| `style` | Selected style `id`, or `""` when the extension has no styles |

**`source` values:**

| Value | Requested when translating… |
|-------|-----------------------------|
| `chapterContent` | The body of a chapter being read |
| `tableOfContent` | Chapter / episode titles in the TOC |
| `detail` | Detail-page text: name, author, description, suggestions, comments |
| `discovery` | Discovery / genre / search listing text (item names, tags) |
| `""` | Untagged caller |

New sources may be added later — treat an unrecognized value as "translate
normally" rather than failing.

`model` and `style` are trailing parameters so existing four-parameter scripts
remain compatible. Treat unknown IDs like the default model/style rather than
failing, because an extension update may remove a previously saved option.

**Result** — `data` is either a plain string or:

```js
{
    text: "translated text",
    segments: [   // optional word-level mapping (snake_case keys; missing fields = 0/false)
        { src_start: 0, src_len: 2, trans_start: 0, trans_len: 8, type: 1, is_priv: false }
    ]
}
```

Any other shape is an error. `Response.error(message)` shows `message` to the user.
Non-empty results are cached (per extension, book, languages, source, model, style
and text); reloading a chapter bypasses the cache.

```js
function execute(text, from, to, source, model, style) {
    from = from || "auto";
    model = model || "fast";
    style = style || "natural";

    let res = fetch(DOMAIN + "/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            q: text,
            source: from,
            target: to,
            model: model,
            style: style,
            context: source,
        }),
    });
    if (!res.ok) return Response.error("HTTP " + res.status);

    return Response.success(res.json().text);   // or { text, segments: [...] }
}
```

## Complete Example: AI Assistant Engine

`plugin.json` metadata `"type": "ai"` (numeric type `7`). An AI extension is the
provider bridge for the AI assistant: the app never talks to Claude/OpenAI/Gemini
directly — it hands the extension the conversation and the extension calls its own
provider. Summaries, explanations and the like are just prompts sent through it.

Declare the entry script in the `script` block:

```json
{
  "metadata": { "name": "My AI", "type": "ai", "version": 1 },
  "script": { "chatStream": "chat_stream.js" },
  "config": {
    "base_url": { "title": "Base URL", "mode": "input", "default": "https://api.openai.com/v1" },
    "api_key": { "title": "API key", "mode": "input", "default": "" },
    "model": { "title": "Model", "mode": "input", "default": "gpt-4o-mini",
               "values": ["gpt-4o-mini", "gpt-4o"] }
  }
}
```

| `script` key | Description | Required |
|-----|-------------|----------|
| `chatStream` | File the app runs for every AI request (its `execute` function) | Yes |

Provider base URL / model / API key are **owned by the script**. Static `config`
values arrive as injected string constants (`base_url`, `api_key`, `model` above);
`localConfig.getItem` only reads values of a dynamic `config.js`. The chat's model
picker lists the `values` (array of model ids) of the `model` setting and saves
the pick as that setting's value; without `values` the picker is hidden.

### chatStream

`execute(messagesJson, selectedModel)`:

- `messagesJson` — JSON array `[{ role: "system" | "user" | "assistant", content: "..." }]`.
- `selectedModel` — model picked in the chat UI; empty = use the extension's default.

Read the SSE response line-by-line with `response.readLine()` (returns `null` at end
of stream; pass `stream: true` in the **fetch options** so lines arrive as they are
sent, otherwise the whole body is buffered first) and push each token to the app with
`ai.emitToken(token)`. Return `Response.success("")` when done — the app assembles the
streamed tokens.

- A provider without streaming can return the whole answer as
  `Response.success(text)` without emitting anything; the app shows it as one token.
- `Response.error(message)` fails the request. The chat shows a generic error with
  `message` as its detail. Write `message` as `"ai_error:<code>"` or
  `"ai_error:<code> - <detail>"` (`code` = `quota`, `key`, `no_key`, `bad_request`,
  `model_not_found`, `server`, `blocked`, `empty`) to show that error's localized
  label, with `<detail>` under it.

```js
// chat_stream.js
function execute(messagesJson, selectedModel) {
    let messages = JSON.parse(messagesJson);
    let res = fetch(base_url + "/chat/completions", {
        method: "POST",
        stream: true,
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + api_key,
        },
        body: JSON.stringify({
            model: selectedModel || model,
            messages: messages,
            stream: true,
        }),
    });
    if (!res.ok) return Response.error("HTTP " + res.status);
    let line;
    while ((line = res.readLine()) !== null) {
        if (line.indexOf("data: ") !== 0) continue;
        let payload = line.substring(6);
        if (payload === "[DONE]") break;
        let token = JSON.parse(payload).choices[0].delta.content;
        if (token) ai.emitToken(token);
    }
    return Response.success("");
}
```

### Tool functions (agent)

An AI extension can build its own tool/agent loop: send the provider the tool
schema, and when the model asks for a tool, run it through the app, feed the
result back, and continue. Tools (library, table of contents, chapter content,
book info, QT, …) are defined by the app; the user can enable/disable each one.

```js
ai.getToolList();              // [{ name, description, parameters }] — enabled tools only
                               // parameters: { type: "OBJECT", properties, required }
ai.executeTool(name, args);    // runs a tool, returns its JSON result (object)
```

- In plan mode, write tools are omitted; a write tool called without approval returns
  `{ "error": "plan_mode", ... }` — describe the change instead of retrying.

**Streaming status** (shown in the chat UI, never appended to the answer):

```js
ai.emitToken("partial answer text");
ai.emitStatus(JSON.stringify({ type: "thinking" }));
ai.emitStatus(JSON.stringify({ type: "tool_call", tool: "get_chapter_content", position: "42" }));
ai.emitStatus(JSON.stringify({ type: "generating" }));
ai.emitStatus(JSON.stringify({ type: "error", code: "quota", message: "..." }));
```

| `type` | Extra fields | Meaning |
|--------|--------------|---------|
| `thinking` | — | Model is thinking |
| `tool_call` | `tool` + tool args | A tool is running; the app builds a localized label |
| `generating` | — | Final answer generation started |
| `error` | `code`, `message?` | Shown only if no answer text arrived. A known `code` (`quota`, `key`, `no_key`, `bad_request`, `model_not_found`, `server`, `blocked`, `empty`) shows its localized label, `message` as the detail; any other code shows the generic label |

The app localizes labels by `type`; send structured data, not translated text.

Plus every standard API (`fetch`, `cacheStorage`, `localStorage`, `localDatabase`, `localBook`, …).
The tool loop runs entirely inside the extension — the app does not orchestrate it.

---

## Developer Server

The app's developer server (started from the app; it shows its `http://<ip>:<port>`
address) lets tools test, package and install an extension without building a ZIP by
hand. Every routed request answers HTTP 200 with a JSON body; the real result is the
body's `code` (`200` = ok, `403` = failure). Unknown routes answer HTTP 404.

### Payload

`POST` bodies are a JSON object whose fields are all **strings**:

| Field | Description |
|-------|-------------|
| `plugin` | The `plugin.json` text |
| `icon` | Base64 icon image (optional) |
| `src` | A JSON **string** of an object `{ "<file name>": "<script source>" }` |
| `input` | `/extension/test` only: a JSON **string** `{ "script": "<file name in src>", "vararg": ["arg1", ...] }` |

`src` and `input` must be stringified — sending them as real JSON objects fails.
`metadata.id` is ignored: the dev extension's id is `md5("<name>_<author>_debug")`, so
changing `name` or `author` creates a new extension.

```json
{
  "plugin": "{\"metadata\":{\"name\":\"Demo\",\"author\":\"dev\",\"version\":1,\"source\":\"https://example.com\",\"regexp\":\"(https?://)?example\\\\.com/.+\",\"locale\":\"global\",\"type\":\"comic\",\"description\":\"demo\"},\"script\":{\"detail\":\"detail.js\"},\"config\":{}}",
  "icon": "",
  "src": "{\"detail.js\":\"function execute(url){ return Response.success({ name: 'Demo', url: url }); }\"}",
  "input": "{\"script\":\"detail.js\",\"vararg\":[\"https://example.com/book/1\"]}"
}
```

### `GET /extension/docs`

Returns this document as raw markdown (on failure `{ "code": 404, "message" }`).

### `POST /extension/test`

Runs one script from the payload without installing it: `input.script` names the
file, `input.vararg` are the string arguments of `execute(...)` (passed as-is — no
trailing-slash trimming). Settings come from an installed dev copy with the same id,
if any.

```json
{ "code": 200, "log": "console output", "data": { "code": 0, "data": { ... }, "data2": null } }
```

- `data` is the whole object the script returned (the `Response` envelope), or `""`
  if the result isn't a JSON object. A `Response.error(...)` therefore still comes
  back as `code: 200` with `data.code: 1`.
- The script threw: `{ "code": 403, "log": "...", "message": "<error message>" }` —
  `log` keeps what was printed before the failure.
- The payload couldn't be parsed: `{ "code": 403, "message": "..." }` (no `log`).

### `POST /extension/build`

Packages `plugin.json`, `icon.png` and `src/` into a ZIP (`plugin` and `src` must be
non-empty). When `metadata.encrypt` is `true`, the scripts are encrypted.

```json
{ "code": 200, "data": "<base64 zip>" }
```

Error: `{ "code": 403, "message": "<ExceptionClass>: <message>" }`.

### `POST /extension/install`

Installs (or updates) the payload as a development extension. Existing settings of the
same dev extension are kept.

```json
{ "code": 200 }
```

Error: `{ "code": 403, "message": "<ExceptionClass>: <message>" }`.

### `GET /connect`

Health check: `{ "code": 200, "data": "<device name>" }`.

---

## Troubleshooting

**The extension never opens a shared URL** — `regexp` must match the whole URL; see
[metadata](#metadata).

**A setting has no effect** — static values are string constants (`"false"` is
truthy: compare with `=== "true"`); dynamic values are only in
`localConfig.getItem`; connection limits must be bare numbers.

**Every script fails with a SyntaxError** — a config key is not a valid JS identifier
or collides with a `let`/`const` in a script, or a `load()`ed file has a syntax error.

**Relative links are wrong** — set `host` on the item/chapter (not `""`), prefix
protocol-relative `//…` URLs with `https:`, and return absolute URLs from `page.js`.

**JSON parse errors after `fetch`** — the request failed (`status` 504, empty body).
Check `res.ok` first.

**Video / audio:**

- `chap.js` returns a bare string or HTML → wrap it: `[{ title, data }]`.
- Returning the final media URL from `chap.js` — `track.js` still runs on each
  track's `data`; make it return `{ type: "native", data }`.
- `type: "Native"` / missing `type` in `track.js` → error; use exact lower case.
- `native` with a page URL or relative URL → error; use `auto` / `webview`, or make it
  absolute.
- `auto` can fail on sites whose player needs a click or a real browser → use `webview`.
- `webview` HTML starting with `<!DOCTYPE` but without `<body` is rejected.
- Returning `data` as an object for `native` / `auto` — `data` must be a string.
- Duplicate or empty track titles → the app can't remember the chosen server.
- Fractional `timeSkip` values are dropped — use integer milliseconds.
- `subtitles` given as a string or single object are dropped — use an array of objects.
- For readable errors return `Response.error("…")` from `track.js`; the message is shown
  in the player.

**Short feed crashes or opens the wrong item** — duplicate `link`s among the `short`
items of a section/list; keep links unique.

**iOS-only failures** — native calls don't throw on iOS (they return `undefined`),
actions can't be stopped mid-run, WebSocket binary data is unusable, and a failed
AES-GCM tag returns `""`.
