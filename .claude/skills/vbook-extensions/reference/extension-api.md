# vBook Extension JS API

Extensions are JavaScript files that tell vBook how to fetch content from websites. Each extension defines a set of named scripts (functions) that vBook calls at specific points. Every script must define an `execute` function that receives input arguments and returns a JSON response.

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

## Extension Structure

An extension is a ZIP file containing:
```
extension.zip
  plugin.json       <- manifest
  icon.png          <- extension icon (200x200, optional)
  src/
    search.js       <- script files
    detail.js
    toc.js
    chap.js
    ...
```

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
    "regexp": "example\\.com",
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
    "page": "page.js",
  },
  "config": {
    "DOMAIN": {
      "title": "Domain",
      "subtitle": "Select mirror",
      "default": "https://example.com",
      "values": ["https://example.com", "https://mirror.example.com"],
      "mode": "select",
      "format": "single"
    },
    "thread_num": {
      "title": "Threads",
      "default": "3",
      "mode": "input",
      "format": "number"
    }
  }
}
```

### metadata

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | yes | Extension display name |
| `author` | string | yes | Author name |
| `version` | int | yes | Version number (increment on update) |
| `source` | string | yes | Base URL of the website |
| `description` | string | yes | Short description |
| `locale` | string | yes | Language tag: `vi`, `en`, `zh-CN`, `global` |
| `regexp` | string | yes | Regex pattern for URL matching |
| `type` | string | yes | Content type (see values below) |
| `nsfw` | boolean | no | Adult content flag (default: false) |
| `encrypt` | boolean | no | Script encryption flag |

**`type` values:**

| Value | Description |
|-------|-------------|
| `novel` | Text-based books (novel, light novel, web novel) |
| `comic` | Image-based comics (manga, manhwa, manhua) |
| `video` | Video content (series, anime). Playable formats: `series`, `stream` |
| `audio` | Audio content — **parsed but not yet playable** (no audio player) |
| `tts` | Text-to-speech engine |
| `translate` | Translation engine |

### script

Maps function names to JS filenames in `src/`. Each script's `execute` receives
the listed parameters positionally:

| Key | Purpose | `execute(...)` signature |
|-----|---------|--------------------------|
| `config` | Dynamic setting schema | `execute()` |
| `action` | Dynamic action list (see [Actions](#actions)) | `execute()` |
| `home` | Home page tabs | `execute()` |
| `explore` | Explore page sections | `execute()` |
| `genre` | Genre/tag list | `execute()` |
| `search` | Search items | `execute(query, page)` |
| `detail` | Item detail page | `execute(url)` |
| `toc` | Chapter list | `execute(url)` |
| `chap` | Chapter content | `execute(url)` |
| `track` | Video track | `execute(data)` |
| `page` | Comic page list | `execute(url)` |
| `voice` | TTS voice + language list | `execute()` |
| `tts` | TTS synthesis | `execute(text, voiceId)` |
| `language` | Translate language list | `execute()` |
| `model` | Optional translate model list | `execute()` |
| `style` | Optional translate style list | `execute()` |
| `translate` | Translate text | `execute(text, from, to, source, model, style)` |

All parameters arrive as **strings**; each script section below explains its own.
Guard optionals with `param || defaultValue`.

#### Required scripts per `type`

`✓` = required, `○` = optional, `—` = not used. Any script listed in
`plugin.json` must exist in `src/`; scripts the app never calls for a type can be
omitted from both.

| Script | `novel` | `comic` | `audio` | `video` | `tts` | `translate` |
|--------|:------:|:------:|:------:|:------:|:----:|:----------:|
| `search` (+ the scripts it references) | ✓ | ✓ | ✓ | ✓ | — | — |
| `detail` | ✓ | ✓ | ✓ | ✓ | — | — |
| `toc` | ✓ | ✓ | ✓ | ✓ | — | — |
| `chap` | ✓ | ○¹ | ○ | ○ | — | — |
| `page` | — | ○¹ | — | — | — | — |
| `track` | — | — | ✓ | ✓ | — | — |
| `home` | ○ | ○ | ○ | ○ | — | — |
| `explore` | ○ | ○ | ○ | ○ | — | — |
| `genre` | ○ | ○ | ○ | ○ | — | — |
| `voice` | — | — | — | — | ✓ | — |
| `tts` | — | — | — | — | ✓ | — |
| `language` | — | — | — | — | — | ✓ |
| `model` | — | — | — | — | — | ○ |
| `style` | — | — | — | — | — | ○ |
| `translate` | — | — | — | — | — | ✓ |

¹ **comic** needs *either* `page` (dedicated image list) *or* `chap` returning an
array. Declare at least one; if both are omitted the raw chapter URL is used as a
single page.

- **Content types** (`novel`, `comic`, `audio`, `video`): required core `search`,
  `detail`, `toc` + the per-chapter content script (`chap` / `page` / `track`).
  Optional discovery `home`, `explore`, `genre` — omit them and the app just hides
  those sections. `search` is still required (it powers lists and search).
- **`tts`** (engine, not a content source): required `voice` (voice + language
  list) and `tts` (synthesize a sentence → base64 audio in `data`). It does **not**
  use the fetch scripts (`search`/`detail`/`toc`/…).
- **`translate`** (engine): required `language` (from/to language list) and
  `translate` (translate text → string or `{ segments }`). Optional `model` and
  `style` scripts expose selectors whose chosen IDs are passed to `translate`.
  Also skips the fetch scripts.

The per-chapter content script by type:

| `type` | Chapter list | Per-chapter content | Notes |
|--------|-------------|---------------------|-------|
| `novel` | `toc` | `chap` → HTML string (+ title in `data2`) | Text is rendered as styled HTML |
| `comic` | `toc` | `page` → array of image URLs; falls back to `chap` if `page` is not declared | If both are absent the chapter URL is used as the single page |
| `video` | `toc` | `track` → playback object (see `track.js`) | Each TOC entry is an episode. Formats: `series`, `stream` |
| `audio` | `toc` | `track` | Parsed but **not yet playable** — no audio player wired |
| `tts` | `voice` → voices/languages | `tts` → base64 audio | Engine, not a content source |
| `translate` | `language` → from/to list; optional `model` / `style` selectors | `translate` → text/segments | Engine, not a content source |

`chap` accepts any of three `data` shapes and the app dispatches on the runtime
value, not on the declared `type`:

- **string** → treated as HTML novel content (`data2` = title)
- **array** → treated as a comic page list (image URLs)
- **object** → passed through as-is (e.g. structured audio/video payloads)

So a `comic` source may implement either `page` (dedicated image list) or return
an array from `chap` — both work.

### Static config

User-configurable settings. Each key becomes a JS constant injected at runtime.

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Setting label shown to user |
| `subtitle` | string | Description/hint |
| `default` | string | Default value |
| `values` | array | Options (for `select` mode) |
| `mode` | string | Input mode (see values below) |
| `format` | string | Value format (see values below) |

**`mode` + `format` combinations:**

| mode | format | Description |
|------|--------|-------------|
| `input` | `text` | Free text input field |
| `input` | `number` | Numeric input field |
| `select` | `single` | Dropdown, pick one from `values` |
| `select` | `multiple` | Multi-select, pick multiple from `values` (comma-separated) |
| `toggle` | _(ignored)_ | On/off switch (value is `"true"` / `"false"`) |
| `list` | _(ignored)_ | User adds/removes free-text rows; value is a JSON array string `["a","b"]` |
| `database` | _(ignored)_ | Declares a `localDatabase` table named after the key (see [Local database](#local-database)). Not injected as a constant; the settings UI shows the title + row count and opens a list screen with add/edit/delete |

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
            format: "single",
        },
        [scope + "_domain"]: {
            title: "Domain",
            subtitle: "The script chooses the key used for each scope",
            default: "https://example.com",
            mode: "input",
            format: "text",
        },
    });
}
```

Dynamic values are stored in a separate extension-setting table. The script
owns the key namespace, so it can distinguish global, source, or other scopes
without a native `bookId` field. After a value changes, the app executes
`config.js` again so dependent fields can change.

Static `plugin.json.config` remains supported and continues to be injected as
JS constants. It is not exposed through `localConfig`. If a dynamic item uses
the same key as a static item, the dynamic schema and value take precedence in
the settings UI.

**Built-in connection settings** (recognized by app):

| Key | Description | Default |
|-----|-------------|---------|
| `thread_num` | Max concurrent requests | `"3"` |
| `timeout` | Request timeout in ms | `"30000"` |
| `delay` | Delay between requests in ms | `"0"` |

### Actions

Actions are buttons in the extension detail screen that run one of the extension's
scripts on demand (rebuild an index, clear a cache, sync data…). When the detail
screen was opened from a book, the action runs with that book as context
(`localBook`, the `bookId` of `localDatabase` calls).

Each action is `key -> { name, description?, script }`, where `script` is a file in
`src/` whose `execute()` is run. An entry without `script` is ignored.

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
  (last 500 lines kept).
- Return `Response.success("message")` to finish with a success status and show the
  message; `Response.error("message")` finishes as failed. A thrown error also shows
  as failed with its message. Any other return value counts as success.
- The user can stop a running action; the script is interrupted.

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

### home.js

Returns a list of tabs. Each tab has a title and a search script.

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
            action: {
                type: "search",
                script: "latest.js",
                input: "",
                data: "",
            }
        },
    ]);
}
```

**Section fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | yes | Layout type (see below). Empty = skipped |
| `title` | string | no | Section header text |
| `subtitle` | string | no | Section subtitle text |
| `id` | string | no | Unique ID (auto-generated from `type` + index if empty) |
| `items` | array | no | List of explore items |
| `action` | object | no | "See more" action on section header |

**Section `type` values:**

| Value | Description |
|-------|-------------|
| `banner` | Full-width image carousel/slideshow |
| `horizontal_list` | Horizontal scrollable item list |
| `grid` | Multi-column grid layout |
| `list` | Vertical list layout |
| `ranking` | Numbered ranking list |
| `chip` | Tag/chip buttons row |

**Action fields** (used in both section `action` and item `action`):

| Field | Type | Description |
|-------|------|-------------|
| `type` | string | Action type (see below) |
| `script` | string | JS filename to execute (e.g. `latest.js`) |
| `input` | string | Input data passed as `args[0]` to the script |
| `data` | string | Extra data passed as `args[1]` |

**Action `type` values:**

| Value | Description |
|-------|-------------|
| `list` | Open a paginated item list (script is called to fetch items). Used for "See all" |
| `detail` | Open book/item detail page. `input` is the item URL |

**Explore item fields:**

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Item title |
| `cover` | string | Cover image URL |
| `link` | string | Item URL. If no `action`, auto-creates `detail` action pointing to this URL |
| `description` | string | Short description |
| `tag` | string | Tag text |
| `host` | string | Override base URL for relative links |
| `action` | object | Custom action (same format as above). Overrides default `link` → detail behavior |

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
| `name` | string | yes | Item title |
| `cover` | string | no | Cover image URL |
| `link` | string | yes | URL to the detail page |
| `description` | string | no | Short description or latest chapter |
| `tag` | string | no | Tag text (e.g. "Completed", "Hot") |
| `host` | string | no | Override base URL for relative links |

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
        type: "novel",       // "novel", "comic", "video"
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
| `cover` | string | Cover image URL |
| `description` | string | HTML description (rendered as styled text) |
| `detail` | string | HTML detail info |
| `url` | string | Canonical URL. Defaults to the requested URL if omitted |
| `type` | string | Content type: `novel`, `comic`, `video`, `ebook`. Defaults to the extension's declared `type` |
| `format` | string | Content format (see table below). Defaults per type when omitted |
| `ongoing` | boolean | `true` if ongoing, `false` if completed. Default `true` |
| `nsfw` | boolean | Adult content flag. Default `false` |
| `locale` | string | ISO language code |
| `tags` | array | List of `{ title, input, script }` |
| `genres` | array | List of `{ title, input, script }` |
| `suggests` | array | Similar items `{ title, input, script }` |
| `reviews` | array | Review items `{ title, input, script }` |
| `comment` | object | A single comment source `{ title, input, script }` |
| `comments` | array | Comment sources `{ title, input, script }` |
| `download_links` | array | Ebook download entries `{ title, type, link }`. `type` is `direct` or `browser`. When present with `type: "ebook"`, the TOC / shelf / follow UI is hidden and only these download buttons show |

**`format` values by `type`:**

| Type | Format | Description |
|------|--------|-------------|
| novel | `novel` | Web novel (HTML chapters) |
| novel | `epub` | EPUB file |
| novel | `mobi` | MOBI/AZW/AZW3/PRC file |
| novel | `txt` | Plain text file |
| novel | `html` | HTML/XHTML file |
| novel | `docx` | DOCX file |
| novel | `fb2` | FB2 file |
| novel | `zip` | ZIP archive |
| novel | `umd` | UMD file |
| comic | `comic` | Web comic (image list per chapter) |
| comic | `cbz` | CBZ archive |
| comic | `pdf` | PDF file |
| video | `series` | TV series (episodes as chapters) |
| video | `stream` | Live stream |

### toc.js

Returns the table of contents (chapter list).

**Parameters:**

| Param | Description |
|-------|-------------|
| `url` | The item URL (usually the same one `detail` received) |

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
| `type` | string | `"chapter"` (default) or `"section"` (group header) |
| `host` | string | Override base URL |

### chap.js

Returns chapter content. For novels, return HTML text. For comics, return a JSON array of image URLs.

**Parameters:**

| Param | Description |
|-------|-------------|
| `url` | The chapter URL — the `url` a TOC entry pointed to |

The same `url` is passed to `page` (comic image list) when that script is
declared.

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

### track.js (Video)

Returns playback track info for a video episode. (Called for `video` sources;
`audio` sources are parsed the same way but have no player yet.)

**Parameters:**

| Param | Description |
|-------|-------------|
| `data` | The episode identifier from the TOC entry's `url` — resolve it to a playable stream |

```js
function execute(data) {
    let doc = fetch(data).html();
    let videoUrl = doc.select("video source").attr("src");

    return Response.success({
        type: "native",         // resolver: "native" = direct URL, "auto" = auto-detect, "webview" = resolve in webview
        data: videoUrl,         // the URL to resolve (or page URL for "webview")
        host: "",               // base URL for relative links; default = source
        mimeType: "application/x-mpegURL",  // MIME hint; inferred from URL when empty
        headers: {                          // request headers for the stream
            "Referer": "https://example.com"
        },
        timeSkip: [                         // optional intro/outro skip ranges (ms)
            { fromTime: 0, toTime: 90000 }
        ],
        subtitles: [
            {
                data: "https://example.com/sub.vtt",  // subtitle URL (required)
                type: "vtt",                          // "vtt" | "srt" | …
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

**Track fields:**

| Field | Type | Description |
|-------|------|-------------|
| `type` | string | Resolver: `native` (direct URL), `auto` (auto-detect), `webview` (resolve in headless page). Required |
| `data` | string | URL to resolve/play. Required |
| `host` | string | Base URL for relative links (default = source) |
| `mimeType` | string | MIME hint; the resolver's inferred type wins if it has one |
| `headers` | object | Request headers applied to the stream |
| `timeSkip` | array | Skip ranges `{ fromTime, toTime }` in ms (intro/outro) |
| `subtitles` | array | `{ data, type, label, language }` — `data` required |
| `audios` | array | Alternate audio tracks `{ data, type, label, language, headers }` — `data` required |
| `danmaku` | array | Danmaku (bullet comment) sources `{ data, type, label }` — `data` required. A bare string (or an array of strings) is also accepted |

**Danmaku sources** are read like subtitles: `data` is an `http(s)` URL (fetched with
the track's `headers`), a `data:…;base64,…` URI, or the comment file's content itself.
Gzip / zlib / raw-deflate payloads are decompressed automatically (Bilibili serves
deflated XML). Danmaku loads after playback starts, so a large file never delays the
video. Supported `type` values — leave it empty to auto-detect:

| `type` | Format |
|--------|--------|
| `bilibili` | XML `<d p="time,mode,size,color,…">text</d>` |
| `bilibili-proto` | Protobuf `DmSegMobileReply` (`seg.so`) |
| `dandanplay` | JSON `{ comments: [ { p: "time,mode,color,uid", m: "text" } ] }` |
| `acfun` | JSON `[ [ { c: "time,color,mode,size,…", m: "text" } ] ]` |
| `niconico` | XML `<chat vpos mail>` or JSON `[ { chat: { vpos, content, mail } } ]` |
| `dplayer` | JSON `{ data: [ [time, type, color, author, text] ] }` (DPlayer / Artplayer) |
| `ass` | ASS with `\move` / `\pos` (Danmaku2ASS output) |
| `json` | JSON `[ { time, text, color, mode } ]` — `time` in seconds (or `timeMs`), `color` `#RRGGBB` or int, `mode` `scroll` / `top` / `bottom` |

Comments are normalised to scrolling / top / bottom lines; scripted effects (Bilibili
mode 7+, Niconico commands beyond position and colour) are skipped. At most 20,000
comments per source are kept, thinned evenly across the episode.

Legacy single-value fields are still accepted: `audio` (string), `subtitle` +
`subtitleType` (strings). Prefer the `audios` / `subtitles` arrays.

---

## Available JS APIs

### fetch (HTTP)

```js
let response = fetch(url, {
    method: "POST",          // "GET" (default), "POST"
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),       // string body
    queries: { "page": "1" },        // URL query parameters
    timeout: 30000,                  // timeout in ms
});

// Response properties:
response.status;             // HTTP status code (int)
response.statusText;         // status text
response.ok;                 // true if status 2xx
response.url;                // final URL (after redirects)
response.headers;            // all headers as object
response.header("key");      // single header value

// Response body methods:
response.text();             // body as string
response.text("gbk");       // body with specific charset
response.json();             // body parsed as JSON object
response.html();             // body parsed as HtmlElement
response.html("gbk");       // parsed with charset
response.base64();           // body as base64 string
response.blob();             // body as Blob { size, type, base64() }
response.readLine();         // next body line (streaming, e.g. SSE); null at end of stream

// Original request info:
response.request.url;
response.request.headers;
```

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

// POST with custom headers
let text = fetch(url, {
    method: "POST",
    headers: { "Referer": "https://example.com", "X-Token": "abc" },
    body: "key=value",
}).text();
```

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
let attr = element.attr("href");     // attribute value
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
elements.attr("href");               // attribute of the first match
elements.remove();                   // remove all from DOM

// Chain selects
let nested = elements.select(".sub-item");
```

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

// Extension settings (read-only to scripts, configured by user)
let setting = localConfig.getItem("settingKey");

// Cookies for the extension's source domain
localCookie.setCookie("name=value; path=/");
let cookie = localCookie.getCookie();
```

### Local database

Per-extension tables keyed by book. Declare each table in `config` with
`"mode": "database"`; the config key is the table name:

```json
"config": {
    "characters": { "title": "Characters", "subtitle": "Names collected per book", "mode": "database" }
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
localDatabase.get(bookId, table, key);                   // value string or null
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

Available when the script runs with a book context (reader / download). The book is
fixed by the session — scripts cannot target another book.

```js
localBook.getInfo();                  // book metadata or null
localBook.getTableOfContent();        // [{ id, title, path, parentId, position }]
localBook.getChapterContent(position);// { bookId, position, content: { engineId: text } } or null
                                      //   (content key "" = original text; only locally saved chapters)

// Book-private dictionaries (apply only to this book)
localBook.getNames();                 // { word: replace }
localBook.addName(word, replace, ignoreCase);   // add/overwrite a name word
localBook.getQtNames();               // { word: trans }
localBook.addQtName(word, trans);     // add/overwrite a QT Name
localBook.getQtVietPhrases();         // { word: trans }
localBook.addQtVietPhrase(word, trans);
```

`getInfo()` returns `{ id, name, author, cover, type, format, language, path, source,
extensionId, status, description, totalChapter, lastReadChapterIndex,
lastReadChapterName }` where `name` / `author` / `description` are maps keyed by
translate engine id (`raw` = original text).

### Browser (Headless WebView)

For sites that require JavaScript rendering:

```js
let browser = Engine.newBrowser();

// Load URL and wait for page to render
let doc = browser.launch("https://example.com", 10000);

// Or load async and interact
browser.launchAsync("https://example.com");
browser.waitUrl(["api.example.com/data"], 15000);  // wait for network request
let doc2 = browser.html(5000);

// Execute JS in the page
let result = browser.callJs("document.title", 5000);

// Block URLs (ad blocking)
browser.block(["ads.example.com", "tracker.js"]);

// Get intercepted network URLs
let urls = browser.urls();

// Get JS variable value
let token = browser.getVariable("window.__TOKEN__");

// Load raw HTML with a base URL
browser.loadHtml("https://example.com", "<html>...</html>");

// Override the user agent (default: UserAgent.system())
browser.setUserAgent(UserAgent.chrome());

browser.close();
```

### Graphics (Image manipulation)

```js
let canvas = Graphics.createCanvas(800, 600);
let image = Graphics.createImage(base64String);
image.width;  image.height;                              // source image size

canvas.drawImage(image, 0, 0);                           // draw at position
canvas.drawImage(image, 0, 0, 400, 300);                 // draw with size
canvas.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh); // draw with source crop

let resultBase64 = canvas.capture();
```

### WebSocket

```js
let ws = WebSocket("wss://example.com/ws", { "Origin": "https://example.com" });
ws.connect();
ws.send("hello");          // string -> text frame, otherwise binary
ws.sendText("hello");
ws.sendBuffer(data);
let frame = ws.message();  // blocking receive (alias: ws.receive())
// frame.type = "text" or "binary"
// frame.data = message content
ws.readyState;             // ws.CONNECTING / OPEN / CLOSING / CLOSED (0..3)
ws.close();
```

### Translation (Quick Translator)

Uses the built-in QT dictionary engine for offline Chinese → Vietnamese translation.

```js
// Basic translate
let result = Qt.translate("你好世界", "vi");
// result = {
//   translateText: "Xin chào thế giới",
//   segments: [
//     { srcStart: 0, srcLen: 2, transStart: 0, transLen: 8, type: 1 },
//     ...
//   ]
// }

// With extras
let title = Qt.translate("第一章 新的开始", "vi", {
    chapter_name: true,
    first_capitalize: true,
});

// Translate a person name
let name = Qt.translate("张三", "vp", {
    person_name: true,
    first_capitalize: false,
});
```

**`Qt.translate(text, to, extras)`**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `text` | string | yes | Source text (Chinese) |
| `to` | string | yes | Translation mode (see below) |
| `extras` | object | no | Translation options (all fields optional, see below) |

**`to` values:**

| Value | Description |
|-------|-------------|
| `"vp"` | VietPhrase — full translation with name/phrase dictionary |
| `"hv"` | Hán Việt — Sino-Vietnamese phonetic transliteration |

**`extras` fields** (all optional):

| Key | Type | Description |
|-----|------|-------------|
| `chapter_name` | boolean | Treat text as chapter name (title-style translation) |
| `first_line_chapter_name` | boolean | Treat first line as chapter name, rest as body |
| `first_capitalize` | boolean | Capitalize first letter of result |
| `convert_simplified` | boolean | Convert Traditional → Simplified Chinese before translating |
| `person_name` | boolean | Treat text as person name |
| `ner` | int | Named Entity Recognition mode |

**Return value:**

```js
{
    translateText: "translated string",
    segments: [          // undefined if not available
        {
            srcStart: 0,    // start index in source text
            srcLen: 2,      // length in source text
            transStart: 0,  // start index in translated text
            transLen: 5,    // length in translated text
            type: 1,        // word type (0=None, 1=Name, 2=VietPhrase, etc.)
        }
    ]
}
```

### Utilities

```js
// Logging
Log.log("debug message");
console.log("debug message");

// Sleep
sleep(1000);  // milliseconds

// Execute another extension script
let result = Script.execute("scriptName", "functionName", "input");

// User agent strings
let ua = UserAgent.system();
let chrome = UserAgent.chrome();
let android = UserAgent.android();
let ios = UserAgent.ios();
```

### Crypto

Available via `load('crypto.js');` at the top of your script:

```js
load('crypto.js');
// Provides CryptoJS with AES, MD5, SHA256, Base64, etc.
```

**AES-GCM** (authenticated encryption — beyond the stock CryptoJS shim):

```js
// Encrypt -> { ciphertext, tag } (both WordArray-like, .toString(enc) supported)
const r = CryptoJS.AES.encryptGcm("plaintext", keyHex, {
    iv: ivHex,          // recommended 12 bytes; hex or WordArray
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

Key accepts a 32/48/64-char hex string (AES-128/192/256) or a UTF-8 passphrase
(zero-padded to the nearest AES size). The tag is 128-bit.

---

## Extension Settings

Settings declared in `config` of `plugin.json` are injected as JS constants at script load time:

```js
// If config has key "DOMAIN" with value "https://example.com":
const DOMAIN = "https://example.com";
```

Access static settings directly through the injected constant. `localConfig`
only reads values belonging to the dynamic `script.config` settings.

---

## Loading External Scripts

Use `load()` to include shared JS libraries:

```js
load('crypto.js');    // Built-in crypto library
load('utils.js');     // Your custom shared script (must be in extension package)
```

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
`format: "comic"`. `toc.js` is identical to the novel one. The difference is the
per-chapter script — declare `page` in `plugin.json` and return the image URLs:

**page.js:**
```js
function execute(url) {
    let doc = fetch(url).html();

    let images = doc.select(".reader img.page-img").map(function(el) {
        // Many comic sites lazy-load — prefer data-src over src.
        return el.attr("data-src") || el.attr("src");
    });

    return Response.success(images);
}
```

Alternatively, skip `page` and return the array straight from `chap.js`:

```js
function execute(url) {
    let doc = fetch(url).html();
    let images = doc.select(".reader img").map(function(el) {
        return el.attr("data-src") || el.attr("src");
    });
    return Response.success(images);   // array → comic pages
}
```

---

## Complete Example: Video Extension

`plugin.json` metadata `"type": "video"`. `detail.js` returns `type: "video"`
with `format: "series"` (or `"stream"` — those are the only playable video
formats). `toc.js` lists episodes (each TOC entry is an episode). The player
pulls the stream from `track.js`:

**track.js** (all fields shown — see the Track fields table above for which are
optional):
```js
function execute(episodeUrl) {
    let doc = fetch(episodeUrl).html();

    // Resolve the direct playable URL (m3u8/mp4).
    let source = doc.select("video source").attr("src");

    return Response.success({
        type: "native",                      // "native" | "auto" | "webview"
        data: source,
        host: "",
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

---

## Complete Example: TTS Engine

`plugin.json` metadata `"type": "tts"`. Declare two scripts — `voice` and `tts`.
Engine-specific `config` keys the app reads:

| Key | Description | Default |
|-----|-------------|---------|
| `preload_size` | Sentences to pre-synthesize ahead | `"0"` |
| `preload_parallel` | Preload in parallel (`"true"`/`"false"`) | `"false"` |
| `max_length` | Max characters per synthesis request | `"0"` |
| `required_api_key` | Engine needs a user API key | `"false"` |
| `support_url` | Help/how-to URL shown in the UI | `""` |

**voice.js** — return the available voices; each voice's `language` is a BCP-47 tag:
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

Engine-specific `config` keys:

| Key | Description | Default |
|-----|-------------|---------|
| `support_auto_detect` | Offer an "auto" source language | `"false"` |
| `max_line` | Max lines per request | unlimited |
| `max_length` | Max characters per request | unlimited |
| `required_api_key` | Engine needs a user API key | `"false"` |
| `support_url` | Help/how-to URL | `""` |

**language.js** — return supported languages. `type` limits direction:
`"from"` = source only, `"to"` = target only, omitted = both:
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
| `id` | Yes | Stable value passed to `translate.js` as `model` |
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
| `from` | Source language `id` (from your `language` list), or `""`/`"auto"` when auto-detect is on |
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

```js
function execute(text, from, to, source, model, style) {
    from = from || "auto";
    model = model || "fast";
    style = style || "natural";

    let translated = fetch(DOMAIN + "/translate", {
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
    }).json();

    return Response.success(translated.text);   // or { translateText, segments: [...] }
}
```

## Complete Example: AI Assistant Engine

`plugin.json` metadata `"type": "ai"` (numeric type `7`). An AI extension is the
provider bridge for **all** AI features (chat, summarize, explain, translate-by-AI,
NER, similar books). The app never talks to Claude/OpenAI/Gemini directly — it hands
the extension a list of chat messages and the extension calls its own provider.

Declare in metadata:

| Key | Description | Required |
|-----|-------------|----------|
| `chat` | JS function name for a **blocking** completion | Yes |
| `chatStream` | JS function name for a **streaming** completion | No (falls back to `chat`) |

Provider `baseUrl` / `model` / API key are **owned by the script** (declare them
in `config` and read them as injected constants, or via `localConfig.getItem` for
dynamic config). The app only passes messages.

### chat (blocking)

`execute(messagesJson)` where `messagesJson` is a JSON array of
`[{ role: "system" | "user" | "assistant", content: "..." }]`. Return the model's
full text via `Response.success(text)` → `{ code: 0, data: "<text>" }`.

```js
function chat(messagesJson) {
    let messages = JSON.parse(messagesJson);
    let res = fetch(localConfig.getItem("base_url") + "/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localConfig.getItem("api_key"),
        },
        body: JSON.stringify({ model: localConfig.getItem("model"), messages: messages }),
    }).json();
    return Response.success(res.choices[0].message.content);
}
```

### chatStream (streaming)

Same input. Read the SSE response line-by-line with `response.readLine()` (returns
`null` at end of stream) and push each token back to the app with `ai.emitToken(token)`.
Return `Response.success("")` when done — the app assembles the streamed tokens.

```js
function chatStream(messagesJson) {
    let messages = JSON.parse(messagesJson);
    let res = fetch(localConfig.getItem("base_url") + "/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localConfig.getItem("api_key"),
        },
        body: JSON.stringify({
            model: localConfig.getItem("model"),
            messages: messages,
            stream: true,
        }),
    });
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

- Translate sessions get an empty tool list, so the model streams the translation directly.
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
| `error` | `code`, `message?` | `code` e.g. `"quota"`, `"key"` or an HTTP status |

The app localizes labels by `type`; send structured data, not translated text.

Plus every standard API (`fetch`, `cacheStorage`, `localStorage`, `localDatabase`, `localBook`, …).
The tool loop runs entirely inside the extension — the app does not orchestrate it.
