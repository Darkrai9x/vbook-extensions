# vBook Extension API Docs

## `GET /extension/docs`

Returns this markdown document.

Response:

```text
markdown content
```

## `POST /extension/test`

Runs one script from an extension payload without installing it.

Request body:

```json
{
  "plugin": "string",
  "icon": "string",
  "src": "string",
  "input": "string"
}
```

Request fields:

- `plugin`: stringified `plugin.json`.
- `icon`: base64 icon data. Optional.
- `src`: stringified JSON object of source files. The server parses this string into JSON before reading script files.
- `input`: stringified JSON object containing `script` and `vararg`.
- `input.script`: script file name passed directly to the executor.
- `input.vararg`: string array used as vararg arguments.

Sample request:

```json
{
  "plugin": "{\"metadata\":{\"id\":\"demo\",\"name\":\"Demo\",\"author\":\"dev\",\"version\":\"1\",\"source\":\"https://example.com\",\"regexp\":\"https://example\\\\.com/.*\",\"locale\":\"global\",\"type\":\"comic\",\"description\":\"demo\"},\"script\":{\"detail\":\"detail.js\"},\"config\":{}}",
  "icon": "",
  "src": "{\"detail.js\":\"function execute(url){ return JSON.stringify({ url: url }); }\"}",
  "input": "{\"script\":\"detail.js\",\"vararg\":[\"https://example.com/book/1\"]}"
}
```

Response body:

```json
{
  "code": 200,
  "log": "string",
  "data": {}
}
```

Error response:

```json
{
  "code": 403,
  "log": "string",
  "message": "string"
}
```

## `POST /extension/build`

Builds a zip package from the extension payload.

Request body:

```json
{
  "plugin": "string",
  "icon": "string",
  "src": "string"
}
```

Request fields:

- `plugin`: stringified `plugin.json`.
- `icon`: base64 icon data. Optional.
- `src`: stringified JSON object of source files. The server parses this string into JSON before reading script files.

Sample request:

```json
{
  "plugin": "{\"metadata\":{\"id\":\"demo\",\"name\":\"Demo\",\"author\":\"dev\",\"version\":\"1\",\"source\":\"https://example.com\",\"regexp\":\"https://example\\\\.com/.*\",\"locale\":\"global\",\"type\":\"comic\",\"description\":\"demo\"},\"script\":{\"detail\":\"detail.js\"},\"config\":{}}",
  "icon": "",
  "src": "{\"detail.js\":\"function execute(url){ return JSON.stringify({ url: url }); }\"}"
}
```

Response body:

```json
{
  "code": 200,
  "data": "string"
}
```

Response fields:

- `data`: base64 zip content.

Error response:

```json
{
  "code": 403,
  "message": "string"
}
```

## `POST /extension/install`

Installs the extension into the local database.

Request body:

```json
{
  "plugin": "string",
  "icon": "string",
  "src": "string"
}
```

Request fields:

- `plugin`: stringified `plugin.json`.
- `icon`: base64 icon data. Optional.
- `src`: stringified JSON object of source files. The server parses this string into JSON before reading script files.

Sample request:

```json
{
  "plugin": "{\"metadata\":{\"id\":\"demo\",\"name\":\"Demo\",\"author\":\"dev\",\"version\":\"1\",\"source\":\"https://example.com\",\"regexp\":\"https://example\\\\.com/.*\",\"locale\":\"global\",\"type\":\"comic\",\"description\":\"demo\"},\"script\":{\"detail\":\"detail.js\"},\"config\":{}}",
  "icon": "",
  "src": "{\"detail.js\":\"function execute(url){ return JSON.stringify({ url: url }); }\"}"
}
```

Response body:

```json
{
  "code": 200
}
```

Error response:

```json
{
  "code": 403,
  "message": "string"
}
```
