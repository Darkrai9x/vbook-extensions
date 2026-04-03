"use strict";

const vscode = require("vscode");
const fs = require("fs/promises");
const path = require("path");

const STATE_KEY = "vbookTester.state";
const HISTORY_KEY = "vbookTester.history";
const FORM_CACHE_KEY = "vbookTester.formCache";
const MAX_HISTORY = 12;

class TerminalLogger {
  constructor() {
    this.writeEmitter = new vscode.EventEmitter();
    this.closeEmitter = new vscode.EventEmitter();
    this.onDidWrite = this.writeEmitter.event;
    this.onDidClose = this.closeEmitter.event;
    this.terminal = vscode.window.createTerminal({
      name: "vBook Test",
      pty: this
    });
  }

  open() {}

  close() {}

  handleInput() {}

  show() {
    this.terminal.show(true);
  }

  clear() {
    this.writeEmitter.fire("\x1b[2J\x1b[3J\x1b[H");
  }

  log(value) {
    this.writeEmitter.fire(normalizeTerminalText(value));
  }

  dispose() {
    this.writeEmitter.dispose();
    this.closeEmitter.dispose();
    this.terminal.dispose();
  }
}

function normalizeTerminalText(value) {
  const text = String(value ?? "");
  const lines = text.replace(/\r?\n/g, "\r\n");
  return lines.endsWith("\r\n") ? lines : `${lines}\r\n`;
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function uniqRecent(items) {
  const seen = new Set();
  const output = [];
  for (const item of items) {
    const key = JSON.stringify(item);
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    output.push(item);
    if (output.length >= MAX_HISTORY) {
      break;
    }
  }
  return output;
}

function getDefaultState(context) {
  const config = vscode.workspace.getConfiguration("vbookTester");
  return {
    serverUrl: config.get("defaultServerUrl", "http://127.0.0.1:8080"),
    language: "vi",
    folderPath: "",
    script: "",
    argsText: "",
    argsValues: []
  };
}

function getStoredState(context) {
  return {
    ...getDefaultState(context),
    ...(context.globalState.get(STATE_KEY) || {})
  };
}

function getStoredHistory(context) {
  const history = context.globalState.get(HISTORY_KEY) || {};
  return {
    serverUrls: asArray(history.serverUrls),
    folders: asArray(history.folders),
    argsTexts: asArray(history.argsTexts),
    recentRuns: asArray(history.recentRuns)
  };
}

function createFormCacheKey(folderPath, script) {
  return `${folderPath || ""}::${script || ""}`;
}

function getStoredFormCache(context) {
  const cache = context.globalState.get(FORM_CACHE_KEY);
  return cache && typeof cache === "object" ? cache : {};
}

function getCachedArgsText(context, folderPath, script) {
  if (!folderPath || !script) {
    return "";
  }

  const cache = getStoredFormCache(context);
  const entry = cache[createFormCacheKey(folderPath, script)];
  return entry ? String(entry.argsText || "") : "";
}

function getCachedArgsValues(context, folderPath, script) {
  if (!folderPath || !script) {
    return [];
  }

  const cache = getStoredFormCache(context);
  const entry = cache[createFormCacheKey(folderPath, script)];
  return entry ? parseStoredArgsValues(entry.argsValues) : [];
}

function parseStoredArgsValues(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item ?? ""));
  }
  return [];
}

async function saveState(context, patch) {
  const nextState = { ...getStoredState(context), ...patch };
  await context.globalState.update(STATE_KEY, nextState);
  return nextState;
}

async function saveArgsCache(context, form) {
  if (!form.folderPath || !form.script) {
    return getStoredFormCache(context);
  }

  const cache = getStoredFormCache(context);
  const nextCache = {
    ...cache,
    [createFormCacheKey(form.folderPath, form.script)]: {
      argsText: String(form.argsText || ""),
      argsValues: parseStoredArgsValues(form.argsValues)
    }
  };
  await context.globalState.update(FORM_CACHE_KEY, nextCache);
  return nextCache;
}

async function pushHistory(context, patch) {
  const current = getStoredHistory(context);
  const next = {
    serverUrls: patch.serverUrl ? uniqRecent([patch.serverUrl, ...current.serverUrls]) : current.serverUrls,
    folders: patch.folderPath ? uniqRecent([patch.folderPath, ...current.folders]) : current.folders,
    argsTexts: patch.argsText ? uniqRecent([patch.argsText, ...current.argsTexts]) : current.argsTexts,
    recentRuns: patch.runRecord ? uniqRecent([patch.runRecord, ...current.recentRuns]) : current.recentRuns
  };
  await context.globalState.update(HISTORY_KEY, next);
  return next;
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function isExtensionFolder(folderPath) {
  const pluginPath = path.join(folderPath, "plugin.json");
  const srcPath = path.join(folderPath, "src");
  return (await pathExists(pluginPath)) && (await pathExists(srcPath));
}

async function detectCurrentExtensionFolder() {
  const editor = vscode.window.activeTextEditor;
  if (!editor || editor.document.uri.scheme !== "file") {
    return "";
  }

  const workspaceFolder = vscode.workspace.getWorkspaceFolder(editor.document.uri);
  if (!workspaceFolder) {
    return "";
  }

  let current = path.dirname(editor.document.uri.fsPath);
  const root = workspaceFolder.uri.fsPath;
  while (current.startsWith(root)) {
    if (await isExtensionFolder(current)) {
      return current;
    }
    const parent = path.dirname(current);
    if (parent === current) {
      break;
    }
    current = parent;
  }

  return "";
}

function detectCurrentScriptForFolder(folderPath, availableScripts) {
  const editor = vscode.window.activeTextEditor;
  if (!editor || editor.document.uri.scheme !== "file") {
    return "";
  }

  const activePath = editor.document.uri.fsPath;
  const srcPath = path.join(folderPath, "src");
  const relativePath = path.relative(srcPath, activePath);
  if (!relativePath || relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    return "";
  }

  if (relativePath.includes(path.sep)) {
    return "";
  }

  return availableScripts.includes(relativePath) ? relativePath : "";
}

async function collectExtensionFolders() {
  const folders = [];
  for (const workspaceFolder of vscode.workspace.workspaceFolders || []) {
    const root = workspaceFolder.uri.fsPath;
    if (await isExtensionFolder(root)) {
      const pluginInfo = await readPluginInfo(root);
      folders.push({
        path: root,
        name: path.basename(root),
        label: pluginInfo.displayName || path.basename(root),
        scripts: pluginInfo.scripts,
        scriptParams: pluginInfo.scriptParams
      });
    }
    const entries = await fs.readdir(root, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) {
        continue;
      }
      const folderPath = path.join(root, entry.name);
      if (!(await isExtensionFolder(folderPath))) {
        continue;
      }
      const pluginInfo = await readPluginInfo(folderPath);
      folders.push({
        path: folderPath,
        name: entry.name,
        label: pluginInfo.displayName || entry.name,
        scripts: pluginInfo.scripts,
        scriptParams: pluginInfo.scriptParams
      });
    }
  }

  if (folders.length === 0 && (vscode.workspace.workspaceFolders || []).length === 1) {
    const workspaceRoot = vscode.workspace.workspaceFolders[0].uri.fsPath;
    const parentRoot = path.dirname(workspaceRoot);
    if (parentRoot && parentRoot !== workspaceRoot) {
      const entries = await fs.readdir(parentRoot, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isDirectory()) {
          continue;
        }

        const folderPath = path.join(parentRoot, entry.name);
        if (!(await isExtensionFolder(folderPath))) {
          continue;
        }

        const pluginInfo = await readPluginInfo(folderPath);
        folders.push({
          path: folderPath,
          name: entry.name,
          label: pluginInfo.displayName || entry.name,
          scripts: pluginInfo.scripts,
          scriptParams: pluginInfo.scriptParams
        });
      }
    }
  }

  folders.sort((a, b) => a.name.localeCompare(b.name));
  return folders;
}

async function readPluginInfo(folderPath) {
  const pluginPath = path.join(folderPath, "plugin.json");
  const srcPath = path.join(folderPath, "src");
  const raw = await fs.readFile(pluginPath, "utf8");
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = {};
  }

  return {
    displayName: parsed.metadata && parsed.metadata.name ? parsed.metadata.name : "",
    scripts: await collectScriptFiles(srcPath),
    scriptParams: await collectScriptParams(srcPath)
  };
}

async function collectScriptParams(srcDir) {
  try {
    const entries = await fs.readdir(srcDir, { withFileTypes: true });
    const output = {};

    for (const entry of entries) {
      if (entry.isDirectory()) {
        continue;
      }

      const filePath = path.join(srcDir, entry.name);
      try {
        const source = await fs.readFile(filePath, "utf8");
        output[entry.name] = extractExecuteParams(source);
      } catch {
        output[entry.name] = [];
      }
    }

    return output;
  } catch {
    return {};
  }
}

async function readSourceMap(srcDir, prefix = "") {
  const entries = await fs.readdir(srcDir, { withFileTypes: true });
  const output = {};

  for (const entry of entries) {
    const fullPath = path.join(srcDir, entry.name);
    const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      Object.assign(output, await readSourceMap(fullPath, relativePath));
      continue;
    }
    output[relativePath] = await fs.readFile(fullPath, "utf8");
  }

  return output;
}

async function collectScriptFiles(srcDir) {
  const entries = await fs.readdir(srcDir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      continue;
    }
    files.push(entry.name);
  }

  files.sort((a, b) => a.localeCompare(b));
  return files;
}

async function createPayload(folderPath) {
  const pluginPath = path.join(folderPath, "plugin.json");
  const iconPath = path.join(folderPath, "icon.png");
  const srcPath = path.join(folderPath, "src");

  if (!(await isExtensionFolder(folderPath))) {
    throw new Error(`Folder is not a valid extension: ${folderPath}`);
  }

  const plugin = await fs.readFile(pluginPath, "utf8");
  const src = await readSourceMap(srcPath);
  let icon = "";
  if (await pathExists(iconPath)) {
    icon = (await fs.readFile(iconPath)).toString("base64");
  }

  return {
    plugin,
    icon,
    src: JSON.stringify(src)
  };
}

async function saveBuildArtifact(folderPath, response) {
  if (!response || typeof response.data !== "string" || !response.data.trim()) {
    throw new Error("Build response does not contain base64 data.");
  }

  const zipPath = path.join(folderPath, "plugin.zip");
  const buffer = Buffer.from(response.data, "base64");

  if (!buffer.length) {
    throw new Error("Build response base64 data is empty.");
  }

  await fs.writeFile(zipPath, buffer);
  return zipPath;
}

function parseArgsText(argsText) {
  return String(argsText || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function splitTopLevelParams(paramsSource) {
  const parts = [];
  let current = "";
  let depthParen = 0;
  let depthBrace = 0;
  let depthBracket = 0;
  let quote = "";

  for (let index = 0; index < paramsSource.length; index += 1) {
    const char = paramsSource[index];
    const prev = paramsSource[index - 1];

    if (quote) {
      current += char;
      if (char === quote && prev !== "\\") {
        quote = "";
      }
      continue;
    }

    if (char === "'" || char === '"' || char === "`") {
      quote = char;
      current += char;
      continue;
    }

    if (char === "(") {
      depthParen += 1;
      current += char;
      continue;
    }
    if (char === ")") {
      depthParen = Math.max(0, depthParen - 1);
      current += char;
      continue;
    }
    if (char === "{") {
      depthBrace += 1;
      current += char;
      continue;
    }
    if (char === "}") {
      depthBrace = Math.max(0, depthBrace - 1);
      current += char;
      continue;
    }
    if (char === "[") {
      depthBracket += 1;
      current += char;
      continue;
    }
    if (char === "]") {
      depthBracket = Math.max(0, depthBracket - 1);
      current += char;
      continue;
    }

    if (char === "," && depthParen === 0 && depthBrace === 0 && depthBracket === 0) {
      parts.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  if (current.trim()) {
    parts.push(current.trim());
  }

  return parts;
}

function normalizeParamName(rawParam, index) {
  const withoutDefault = rawParam.split("=")[0].trim();
  const withoutRest = withoutDefault.replace(/^\.\.\./, "").trim();
  const matched = withoutRest.match(/[A-Za-z_$][\w$]*/);
  if (matched) {
    return matched[0];
  }
  return `arg${index + 1}`;
}

function extractExecuteParams(source) {
  const patterns = [
    /\basync\s+function\s+execute\s*\(([\s\S]*?)\)/,
    /\bfunction\s+execute\s*\(([\s\S]*?)\)/,
    /\b(?:const|let|var)\s+execute\s*=\s*async\s*\(([\s\S]*?)\)\s*=>/,
    /\b(?:const|let|var)\s+execute\s*=\s*\(([\s\S]*?)\)\s*=>/,
    /\b(?:module\.)?exports\.execute\s*=\s*async\s*function\s*\(([\s\S]*?)\)/,
    /\b(?:module\.)?exports\.execute\s*=\s*function\s*\(([\s\S]*?)\)/,
    /\b(?:module\.)?exports\.execute\s*=\s*async\s*\(([\s\S]*?)\)\s*=>/,
    /\b(?:module\.)?exports\.execute\s*=\s*\(([\s\S]*?)\)\s*=>/
  ];

  for (const pattern of patterns) {
    const matched = source.match(pattern);
    if (!matched) {
      continue;
    }

    return splitTopLevelParams(matched[1])
      .filter(Boolean)
      .map((param, index) => normalizeParamName(param, index));
  }

  return [];
}

function normalizeLogLines(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item ?? "")).filter(Boolean);
  }
  if (typeof value === "string") {
    return value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
  }
  return [];
}

function normalizeTestInputArg(value) {
  const text = String(value ?? "");
  if (!/^https?:\/\//i.test(text)) {
    return text;
  }
  return text.replace(/\/+$/, "");
}

function collectResponseLogs(result) {
  const candidates = [
    result && result.log,
    result && result.logs,
    result && result.data && result.data.log,
    result && result.data && result.data.logs
  ];

  for (const candidate of candidates) {
    const lines = normalizeLogLines(candidate);
    if (lines.length > 0) {
      return lines;
    }
  }

  return [];
}

async function postJson(url, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  const text = await response.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }

  if (!response.ok) {
    const message = json.message || `HTTP ${response.status}`;
    throw new Error(message);
  }

  return json;
}

function createRunRecord(form) {
  return {
    serverUrl: form.serverUrl,
    folderPath: form.folderPath,
    script: form.script,
    argsText: form.argsText,
    argsValues: parseStoredArgsValues(form.argsValues),
    at: new Date().toISOString()
  };
}

function formatResult(title, payload) {
  return `${title}\n${JSON.stringify(payload, null, 2)}`;
}

function getRuntimeText(language) {
  if (language === "en") {
    return {
      serverUrlRequired: "Server URL is required.",
      folderRequired: "Extension folder is required.",
      scriptRequired: "Script is required for test run.",
      buildSaved: (filePath) => `plugin.zip saved to ${filePath}`,
      installSucceeded: "Install succeeded.",
      connectFailed: (status, detail) => `Connection check failed at /connect with status ${status}.${detail ? ` ${detail}` : ""}`,
      connectRequestFailed: (message) => `Unable to call /connect.${message ? ` ${message}` : ""}`
    };
  }

  return {
    serverUrlRequired: "Bạn cần nhập Server URL.",
    folderRequired: "Bạn cần chọn thư mục extension.",
    scriptRequired: "Bạn cần chọn script để test.",
    buildSaved: (filePath) => `Đã lưu plugin.zip tại ${filePath}`,
    installSucceeded: "Cài đặt thành công.",
    connectFailed: (status, detail) => `Kiểm tra kết nối qua /connect thất bại với mã ${status}.${detail ? ` ${detail}` : ""}`,
    connectRequestFailed: (message) => `Không thể gọi /connect.${message ? ` ${message}` : ""}`
  };
}

function getNonce() {
  return Math.random().toString(36).slice(2);
}

function getWebviewHtml(webview) {
  const nonce = getNonce();
  const csp = [
    "default-src 'none'",
    `style-src ${webview.cspSource} 'unsafe-inline'`,
    `script-src 'nonce-${nonce}'`,
    "img-src data:"
  ].join("; ");

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="Content-Security-Policy" content="${csp}" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>vBook Tester</title>
  <style>
    :root {
      color-scheme: light dark;
    }
    html, body {
      height: 100%;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 12px;
      display: flex;
      font-family: var(--vscode-font-family);
      font-size: var(--vscode-font-size);
      font-weight: var(--vscode-font-weight);
      line-height: 1.4;
      background: var(--vscode-sideBar-background);
      color: var(--vscode-foreground);
      overflow: hidden;
    }
    .wrap {
      width: 100%;
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
    }
    .header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 8px;
      margin-bottom: 12px;
    }
    .headerMain {
      min-width: 0;
    }
    h1 {
      margin: 0 0 4px;
      font-size: 13px;
      font-weight: 600;
    }
    .sub {
      margin: 0;
      color: var(--vscode-descriptionForeground);
    }
    .field {
      margin-bottom: 10px;
    }
    label {
      display: block;
      margin-bottom: 4px;
      font-weight: 600;
    }
    input, select {
      width: 100%;
      border: 1px solid var(--vscode-input-border, transparent);
      background: var(--vscode-input-background);
      color: var(--vscode-input-foreground);
      border-radius: 2px;
      padding: 6px 8px;
      font: inherit;
    }
    input:focus, select:focus {
      outline: 1px solid var(--vscode-focusBorder);
      outline-offset: -1px;
    }
    .row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    .argsGrid {
      display: grid;
      gap: 8px;
    }
    .actions {
      display: flex;
      gap: 8px;
      margin: 12px 0;
      align-items: center;
    }
    button {
      border: 1px solid var(--vscode-button-border, transparent);
      border-radius: 2px;
      padding: 6px 12px;
      font: inherit;
      cursor: pointer;
      background: var(--vscode-button-secondaryBackground, var(--vscode-button-background));
      color: var(--vscode-button-secondaryForeground, var(--vscode-button-foreground));
    }
    button.primary {
      background: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
    }
    button:hover {
      background: var(--vscode-button-secondaryHoverBackground, var(--vscode-toolbar-hoverBackground));
    }
    button.primary:hover {
      background: var(--vscode-button-hoverBackground);
    }
    button:disabled {
      opacity: 0.65;
      cursor: default;
    }
    .toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin: 12px 0 8px;
    }
    .toolbarTitle {
      font-weight: 600;
      color: var(--vscode-foreground);
    }
    .toolbarActions {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }
    .iconButton {
      min-height: 30px;
      padding: 6px 10px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      white-space: nowrap;
    }
    .iconButton svg,
    .iconButton .spinner {
      width: 16px;
      height: 16px;
      flex: 0 0 16px;
    }
    .iconButton svg {
      fill: currentColor;
    }
    .iconButton .spinner {
      border: 2px solid var(--vscode-descriptionForeground);
      border-top-color: currentColor;
      border-radius: 50%;
      display: none;
      animation: spin 0.8s linear infinite;
    }
    .iconButton.loading svg {
      display: none;
    }
    .iconButton.loading .buttonLabel {
      opacity: 0.8;
    }
    .iconButton.loading .spinner {
      display: block;
    }
    .buttonLabel {
      line-height: 1;
    }
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
    .languageToggle {
      display: inline-flex;
      align-items: center;
      gap: 0;
      border: 1px solid var(--vscode-button-border, var(--vscode-input-border, transparent));
      border-radius: 2px;
      overflow: hidden;
      flex-shrink: 0;
    }
    .languageToggle button {
      border: 0;
      border-right: 1px solid var(--vscode-button-border, var(--vscode-input-border, transparent));
      border-radius: 0;
      padding: 3px 10px;
      background: var(--vscode-button-secondaryBackground, var(--vscode-editor-background));
      color: var(--vscode-button-secondaryForeground, var(--vscode-foreground));
    }
    .languageToggle button:last-child {
      border-right: 0;
    }
    .languageToggle button.active {
      background: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
    }
    .responseField {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      margin-bottom: 0;
    }
    .result {
      border: 1px solid var(--vscode-panel-border, var(--vscode-input-border, transparent));
      border-radius: 2px;
      background: var(--vscode-editor-background);
      color: var(--vscode-editor-foreground);
      padding: 8px;
      flex: 1;
      min-height: 0;
      white-space: pre-wrap;
      word-break: break-word;
      font-family: var(--vscode-editor-font-family);
      font-size: var(--vscode-editor-font-size);
      line-height: 1.5;
      overflow: auto;
      overscroll-behavior: contain;
    }
    .hint {
      margin-top: 4px;
      color: var(--vscode-descriptionForeground);
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <div class="headerMain">
        <h1 id="titleText">vBook Test</h1>
        <p id="subText" class="sub">Chạy một script và xem phản hồi trả về.</p>
      </div>
      <div class="languageToggle">
        <button id="languageViBtn" type="button" data-language="vi">VI</button>
        <button id="languageEnBtn" type="button" data-language="en">EN</button>
      </div>
    </div>

    <div class="field">
      <label id="serverUrlLabel" for="serverUrl">Địa chỉ server</label>
      <input id="serverUrl" list="serverHistory" placeholder="http://127.0.0.1:8080" />
      <datalist id="serverHistory"></datalist>
    </div>

    <div class="row">
      <div class="field">
        <label id="folderPathLabel" for="folderPath">Thư mục extension</label>
        <select id="folderPath"></select>
      </div>
      <div class="field">
        <label id="scriptLabel" for="script">Script</label>
        <select id="script"></select>
      </div>
    </div>

    <div class="field">
      <label id="argsTextLabel" for="argsContainer">Tham số</label>
      <div id="argsContainer" class="argsGrid"></div>
      <div id="argsTextHint" class="hint">Tự động tạo theo hàm execute(...).</div>
    </div>

    <div class="field">
      <label id="recentRunLabel" for="recentRun">Input gần đây</label>
      <select id="recentRun">
        <option value="">Chọn input đã dùng...</option>
      </select>
    </div>

    <div class="toolbar">
      <div id="responseTitle" class="toolbarTitle">Phản hồi</div>
      <div class="toolbarActions">
        <button id="runBtn" class="primary iconButton" type="button" title="Chạy" aria-label="Chạy">
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 2.5v11l9-5.5-9-5.5Z"></path></svg>
          <span class="spinner" aria-hidden="true"></span>
          <span class="buttonLabel">Chạy</span>
        </button>
        <button id="buildBtn" class="iconButton" type="button" title="Đóng gói" aria-label="Đóng gói">
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6.5 1 1 4v8l5.5 3 5.5-3V4L6.5 1Zm0 1.4L10.4 4 6.5 5.98 2.6 4 6.5 2.4Zm-4 3 3.5 1.9v4.3l-3.5-1.9V5.4Zm8 4.3-3.5 1.9V7.3l3.5-1.9v4.3Z"></path></svg>
          <span class="spinner" aria-hidden="true"></span>
          <span class="buttonLabel">Đóng gói</span>
        </button>
        <button id="installBtn" class="iconButton" type="button" title="Cài đặt" aria-label="Cài đặt">
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8.75 1.5v6.19l2.22-2.22 1.03 1.06L8 10.5 4 6.53l1.03-1.06 2.22 2.22V1.5h1.5ZM2 11h12v3H2v-3Z"></path></svg>
          <span class="spinner" aria-hidden="true"></span>
          <span class="buttonLabel">Cài đặt</span>
        </button>
      </div>
    </div>

    <div class="field responseField">
      <div id="responseResult" class="result">Chưa có phản hồi.</div>
    </div>
  </div>

  <script nonce="${nonce}">
    const vscode = acquireVsCodeApi();
    const state = {
      folders: [],
      history: { serverUrls: [], recentRuns: [] }
    };

    const serverUrlEl = document.getElementById("serverUrl");
    const serverHistoryEl = document.getElementById("serverHistory");
    const languageViBtn = document.getElementById("languageViBtn");
    const languageEnBtn = document.getElementById("languageEnBtn");
    const folderPathEl = document.getElementById("folderPath");
    const scriptEl = document.getElementById("script");
    const argsContainerEl = document.getElementById("argsContainer");
    const recentRunEl = document.getElementById("recentRun");
    const responseResultEl = document.getElementById("responseResult");
    const runBtn = document.getElementById("runBtn");
    const buildBtn = document.getElementById("buildBtn");
    const installBtn = document.getElementById("installBtn");
    const actionButtons = {
      run: runBtn,
      build: buildBtn,
      install: installBtn
    };
    const recentRunDefaultOption = recentRunEl.querySelector('option[value=""]');
    const i18n = {
      vi: {
        title: "vBook Test",
        subtitle: "Chạy một script và xem phản hồi trả về.",
        serverUrl: "Địa chỉ server",
        language: "Ngôn ngữ",
        folderPath: "Thư mục extension",
        script: "Script",
        args: "Tham số",
        argsPlaceholder: "Nhập giá trị",
        argsHint: "Tự động tạo theo hàm execute(...).",
        recentRun: "Input gần đây",
        recentRunPlaceholder: "Chọn input đã dùng...",
        response: "Phản hồi",
        run: "Chạy",
        build: "Đóng gói",
        install: "Cài đặt",
        noResponse: "Chưa có phản hồi."
      },
      en: {
        title: "vBook Test",
        subtitle: "Run one script and inspect the response.",
        serverUrl: "Server URL",
        language: "Language",
        folderPath: "Extension Folder",
        script: "Script",
        args: "Arguments",
        argsPlaceholder: "Enter value",
        argsHint: "Generated from the execute(...) signature.",
        recentRun: "Recent Inputs",
        recentRunPlaceholder: "Select recent input...",
        response: "Response",
        run: "Run",
        build: "Build",
        install: "Install",
        noResponse: "No response yet."
      }
    };

    function splitArgsText(argsText) {
      return String(argsText || "")
        .replaceAll(String.fromCharCode(13), "")
        .split(String.fromCharCode(10));
    }

    function getCurrentParamNames() {
      const folder = state.folders.find((item) => item.path === folderPathEl.value);
      const scriptParams = folder && folder.scriptParams ? folder.scriptParams : {};
      return Array.isArray(scriptParams[scriptEl.value]) ? scriptParams[scriptEl.value] : [];
    }

    function getArgsValues() {
      return Array.from(argsContainerEl.querySelectorAll("input[data-arg-index]")).map((input) => input.value);
    }

    function currentForm() {
      const argsValues = getArgsValues();
      return {
        serverUrl: serverUrlEl.value.trim(),
        language: state.language || "vi",
        folderPath: folderPathEl.value,
        script: scriptEl.value,
        argsText: argsValues.join(String.fromCharCode(10)),
        argsValues
      };
    }

    function setBusy(action) {
      const busy = Boolean(action);
      Object.entries(actionButtons).forEach(([key, button]) => {
        button.disabled = busy;
        button.classList.toggle("loading", key === action);
      });
    }

    function setActionButtonText(button, text) {
      button.title = text;
      button.setAttribute("aria-label", text);
      const label = button.querySelector(".buttonLabel");
      if (label) {
        label.textContent = text;
      }
    }

    function renderServerHistory(items) {
      serverHistoryEl.innerHTML = items.map((item) => '<option value="' + escapeAttr(item) + '"></option>').join("");
    }

    function renderFolders(folders, selectedPath) {
      state.folders = folders;
      folderPathEl.innerHTML = folders.map((folder) => {
        const selected = folder.path === selectedPath ? " selected" : "";
        return '<option value="' + escapeAttr(folder.path) + '"' + selected + '>' + escapeHtml(folder.label) + "</option>";
      }).join("");
      renderScripts(folderPathEl.value, "");
    }

    function renderScripts(folderPath, selectedScript) {
      const folder = state.folders.find((item) => item.path === folderPath);
      const scripts = folder ? folder.scripts : [];
      scriptEl.innerHTML = scripts.map((script) => {
        const selected = script === selectedScript ? " selected" : "";
        return '<option value="' + escapeAttr(script) + '"' + selected + ">" + escapeHtml(script) + "</option>";
      }).join("");
      if (!scriptEl.value && scripts.length > 0) {
        scriptEl.value = scripts[0];
      }
      renderArgsInputs(getCurrentParamNames(), []);
    }

    function renderArgsInputs(paramNames, values) {
      const names = Array.isArray(paramNames) ? paramNames : [];
      const nextValues = Array.isArray(values) ? values : [];
      const count = Math.max(names.length, nextValues.length);

      if (count === 0) {
        argsContainerEl.innerHTML = "";
        return;
      }

      argsContainerEl.innerHTML = Array.from({ length: count }, (_, index) => {
        const label = names[index] || ('arg' + (index + 1));
        const value = nextValues[index] || "";
        return '<input data-arg-index="' + index + '" placeholder="' + escapeAttr(label) + '" value="' + escapeAttr(value) + '" />';
      }).join("");
    }

    function renderRecentRuns(items) {
      recentRunEl.innerHTML = '<option value=""></option>' + items.map((item, index) => {
        const folderName = item.folderPath
          ? item.folderPath.replaceAll(String.fromCharCode(92), "/").split("/").pop()
          : "-";
        const label = [item.script || "-", folderName, item.serverUrl || "-"].join(" | ");
        return '<option value="' + index + '">' + escapeHtml(label) + "</option>";
      }).join("");
      applyLanguage(state.language || "vi");
    }

    function escapeAttr(value) {
      return String(value).replace(/"/g, "&quot;");
    }

    function escapeHtml(value) {
      return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }

    function applyRun(run) {
      if (!run) {
        return;
      }
      serverUrlEl.value = run.serverUrl || "";
      folderPathEl.value = run.folderPath || "";
      renderScripts(folderPathEl.value, run.script || "");
      renderArgsInputs(getCurrentParamNames(), Array.isArray(run.argsValues) ? run.argsValues : splitArgsText(run.argsText));
    }

    function applyLanguage(language) {
      state.language = language;
      const dict = i18n[language] || i18n.vi;
      document.getElementById("titleText").textContent = dict.title;
      document.getElementById("subText").textContent = dict.subtitle;
      document.getElementById("serverUrlLabel").textContent = dict.serverUrl;
      document.getElementById("folderPathLabel").textContent = dict.folderPath;
      document.getElementById("scriptLabel").textContent = dict.script;
      document.getElementById("argsTextLabel").textContent = dict.args;
      document.getElementById("argsTextHint").textContent = dict.argsHint;
      document.getElementById("recentRunLabel").textContent = dict.recentRun;
      document.getElementById("responseTitle").textContent = dict.response;
      Array.from(argsContainerEl.querySelectorAll("input[data-arg-index]")).forEach((input) => {
        if (!input.placeholder) {
          input.placeholder = dict.argsPlaceholder;
        }
      });
      setActionButtonText(runBtn, dict.run);
      setActionButtonText(buildBtn, dict.build);
      setActionButtonText(installBtn, dict.install);
      languageViBtn.classList.toggle("active", language === "vi");
      languageEnBtn.classList.toggle("active", language === "en");
      if (recentRunDefaultOption) {
        recentRunDefaultOption.textContent = dict.recentRunPlaceholder;
      }
      if (!responseResultEl.textContent || responseResultEl.textContent === i18n.vi.noResponse || responseResultEl.textContent === i18n.en.noResponse) {
        responseResultEl.textContent = dict.noResponse;
      }
    }

    window.addEventListener("message", (event) => {
      const message = event.data;
      if (message.type === "init") {
        state.history = message.history;
        serverUrlEl.value = message.state.serverUrl || "";
        state.language = message.state.language || "vi";
        renderServerHistory(message.history.serverUrls || []);
        renderFolders(message.folders || [], message.state.folderPath || "");
        renderScripts(folderPathEl.value, message.state.script || "");
        renderArgsInputs(getCurrentParamNames(), Array.isArray(message.state.argsValues) ? message.state.argsValues : splitArgsText(message.state.argsText));
        renderRecentRuns(message.history.recentRuns || []);
        applyLanguage(state.language);
        responseResultEl.textContent = (i18n[state.language] || i18n.vi).noResponse;
        vscode.setState(message.state);
        return;
      }

      if (message.type === "result") {
        setBusy(null);
        responseResultEl.textContent = message.responseText;
        return;
      }

      if (message.type === "historyUpdated") {
        state.history = message.history;
        renderServerHistory(message.history.serverUrls || []);
        renderRecentRuns(message.history.recentRuns || []);
        return;
      }

      if (message.type === "error") {
        setBusy(null);
        responseResultEl.textContent = message.text;
      }
    });

    folderPathEl.addEventListener("change", () => {
      renderScripts(folderPathEl.value, "");
      vscode.postMessage({
        type: "saveState",
        form: currentForm()
      });
    });

    scriptEl.addEventListener("change", () => {
      renderArgsInputs(getCurrentParamNames(), []);
      vscode.postMessage({
        type: "saveState",
        form: currentForm()
      });
    });

    function handleLanguageChange(language) {
      applyLanguage(language);
      vscode.postMessage({
        type: "saveState",
        form: currentForm()
      });
    }

    languageViBtn.addEventListener("click", () => handleLanguageChange("vi"));
    languageEnBtn.addEventListener("click", () => handleLanguageChange("en"));

    recentRunEl.addEventListener("change", () => {
      const index = Number(recentRunEl.value);
      const run = state.history.recentRuns[index];
      applyRun(run);
    });

    argsContainerEl.addEventListener("input", () => {
      vscode.postMessage({
        type: "cacheArgs",
        form: currentForm()
      });
    });

    function send(action) {
      setBusy(action);
      vscode.postMessage({
        type: action,
        form: currentForm()
      });
    }

    runBtn.addEventListener("click", () => send("run"));
    buildBtn.addEventListener("click", () => send("build"));
    installBtn.addEventListener("click", () => send("install"));
  </script>
</body>
</html>`;
}

function validateForm(action, form) {
  const text = getRuntimeText(form.language);
  if (!form.serverUrl) {
    throw new Error(text.serverUrlRequired);
  }
  if (!form.folderPath) {
    throw new Error(text.folderRequired);
  }
  if (action === "run" && !form.script) {
    throw new Error(text.scriptRequired);
  }
}

async function checkConnection(serverUrl, logger, language) {
  const url = new URL("/connect", serverUrl).toString();

  let response;
  try {
    response = await fetch(url);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.log(`[CONNECT] FAILED ${message}`);
    throw new Error(getRuntimeText(language).connectRequestFailed(message));
  }

  const responseText = (await response.text()).trim();
  let parsed;
  try {
    parsed = responseText ? JSON.parse(responseText) : null;
  } catch {
    parsed = null;
  }

  const detail = parsed && parsed.data
    ? String(parsed.data)
    : (parsed && parsed.message)
      ? String(parsed.message)
      : responseText;

  if (response.status !== 200) {
    logger.log(`[CONNECT] FAILED ${response.status}${detail ? ` ${detail}` : ""}`);
    throw new Error(getRuntimeText(language).connectFailed(response.status, detail));
  }

  logger.log(`[CONNECT] ${detail || "OK"}`);
}

async function runTest(form, logger) {
  const inputArgs = (parseStoredArgsValues(form.argsValues).length > 0
    ? parseStoredArgsValues(form.argsValues)
    : parseArgsText(form.argsText))
    .map(normalizeTestInputArg);
  const url = new URL("/extension/test", form.serverUrl).toString();
  logger.show();
  logger.clear();
  await checkConnection(form.serverUrl, logger, form.language);
  const payload = await createPayload(form.folderPath);
  const body = {
    ...payload,
    input: JSON.stringify({
      script: form.script,
      vararg: inputArgs
    })
  };
  logger.log(`[RUN] ${url}`);
  logger.log(`[SCRIPT] ${form.script}`);
  logger.log(`[INPUT] ${JSON.stringify(inputArgs)}`);
  const result = await postJson(url, body);
  const logs = collectResponseLogs(result);
  if (logs.length > 0) {
    logger.log("[LOG]");
    for (const line of logs) {
      logger.log(line);
    }
  }
  logger.log(formatResult("[RESULT]", result));
  return {
    request: { url, body },
    response: result
  };
}

async function buildExtension(form, logger) {
  const payload = await createPayload(form.folderPath);
  const url = new URL("/extension/build", form.serverUrl).toString();
  const text = getRuntimeText(form.language);
  logger.show();
  logger.clear();
  await checkConnection(form.serverUrl, logger, form.language);
  logger.log(`[BUILD] ${url}`);
  const result = await postJson(url, payload);
  const zipPath = await saveBuildArtifact(form.folderPath, result);
  const message = text.buildSaved(zipPath);
  logger.log(`[BUILD] ${message}`);
  return {
    request: { url, body: payload },
    response: {
      message,
      savedFile: zipPath
    }
  };
}

async function installExtension(form, logger) {
  const payload = await createPayload(form.folderPath);
  const url = new URL("/extension/install", form.serverUrl).toString();
  const text = getRuntimeText(form.language);
  logger.show();
  logger.clear();
  await checkConnection(form.serverUrl, logger, form.language);
  logger.log(`[INSTALL] ${url}`);
  const result = await postJson(url, payload);
  logger.log(`[INSTALL] ${text.installSucceeded}`);
  return {
    request: { url, body: payload },
    response: result
  };
}

class VbookTesterPanel {
  constructor(context, logger) {
    this.context = context;
    this.logger = logger;
    this.panel = undefined;
  }

  async lockPanelGroup() {
    if (!this.panel) {
      return;
    }

    try {
      await vscode.commands.executeCommand("workbench.action.lockEditorGroup");
    } catch (error) {
      this.logger.log(`[PANEL] Failed to lock editor group: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async open() {
    if (this.panel) {
      this.panel.reveal(vscode.ViewColumn.Beside, true);
      await this.lockPanelGroup();
      await this.syncToActiveEditor();
      return;
    }

    this.panel = vscode.window.createWebviewPanel(
      "vbookTester.panel",
      "vBook Test",
      {
        viewColumn: vscode.ViewColumn.Beside,
        preserveFocus: false
      },
      {
        enableScripts: true
      }
    );

    this.panel.webview.html = getWebviewHtml(this.panel.webview);
    await this.lockPanelGroup();
    this.panel.onDidDispose(() => {
      this.panel = undefined;
    });

    this.panel.webview.onDidReceiveMessage(async (message) => {
      await this.handleMessage(message);
    });

    await this.syncToActiveEditor();
  }

  async handleMessage(message) {
    if (!this.panel) {
      return;
    }

    const form = message.form || {};
    try {
      if (message.type === "saveState") {
        await saveState(this.context, form);
        return;
      }

      if (message.type === "cacheArgs") {
        await saveState(this.context, form);
        await saveArgsCache(this.context, form);
        return;
      }

      validateForm(message.type, form);
      await saveState(this.context, form);
      await saveArgsCache(this.context, form);

      if (message.type === "run") {
        const result = await runTest(form, this.logger);
        const history = await pushHistory(this.context, {
          serverUrl: form.serverUrl,
          folderPath: form.folderPath,
          argsText: form.argsText,
          runRecord: createRunRecord(form)
        });
        await this.postHistoryUpdated(history);
        await this.postResult(result.response);
        return;
      }

      if (message.type === "build") {
        const result = await buildExtension(form, this.logger);
        const history = await pushHistory(this.context, {
          serverUrl: form.serverUrl,
          folderPath: form.folderPath
        });
        await this.postHistoryUpdated(history);
        await this.postResult(result.response);
        return;
      }

      if (message.type === "install") {
        const result = await installExtension(form, this.logger);
        const history = await pushHistory(this.context, {
          serverUrl: form.serverUrl,
          folderPath: form.folderPath
        });
        await this.postHistoryUpdated(history);
        await this.postResult(result.response);
      }
    } catch (error) {
      const text = error instanceof Error ? error.message : String(error);
      this.logger.show();
      this.logger.log(`[ERROR] ${text}`);
      this.panel.webview.postMessage({ type: "error", text });
    }
  }

  async postResult(response) {
    if (!this.panel) {
      return;
    }

    await this.panel.webview.postMessage({
      type: "result",
      responseText: JSON.stringify(response, null, 2)
    });
  }

  async postHistoryUpdated(history) {
    if (!this.panel) {
      return;
    }

    await this.panel.webview.postMessage({ type: "historyUpdated", history });
  }

  async postInit() {
    if (!this.panel) {
      return;
    }

    const folders = await collectExtensionFolders();
    const detectedFolder = await detectCurrentExtensionFolder();
    const savedState = getStoredState(this.context);
    const folderPath = detectedFolder && folders.some((item) => item.path === detectedFolder)
      ? detectedFolder
      : folders.some((item) => item.path === savedState.folderPath)
        ? savedState.folderPath
        : (folders[0] ? folders[0].path : "");
    const selectedFolder = folders.find((item) => item.path === folderPath);
    const detectedScript = selectedFolder
      ? detectCurrentScriptForFolder(selectedFolder.path, selectedFolder.scripts)
      : "";
    const script = detectedScript
      || (selectedFolder && selectedFolder.scripts.includes(savedState.script) ? savedState.script : "")
      || (selectedFolder && selectedFolder.scripts[0])
      || "";
    const argsValues = getCachedArgsValues(this.context, folderPath, script);
    const argsText = getCachedArgsText(this.context, folderPath, script)
      || (savedState.folderPath === folderPath && savedState.script === script
        ? String(savedState.argsText || "")
        : "");
    const nextArgsValues = argsValues.length > 0
      ? argsValues
      : (savedState.folderPath === folderPath && savedState.script === script
        ? parseStoredArgsValues(savedState.argsValues)
        : []);

    const state = await saveState(this.context, {
      folderPath,
      script,
      argsText,
      argsValues: nextArgsValues
    });

    await this.panel.webview.postMessage({
      type: "init",
      state,
      history: getStoredHistory(this.context),
      folders
    });
  }

  async syncToActiveEditor() {
    if (!this.panel) {
      return;
    }

    await this.postInit();
  }
}

function activate(context) {
  const logger = new TerminalLogger();
  const panel = new VbookTesterPanel(context, logger);

  context.subscriptions.push(logger);
  context.subscriptions.push(
    vscode.commands.registerCommand("vbookTester.openPanel", async () => {
      await panel.open();
    })
  );
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(() => {
      void panel.syncToActiveEditor();
    })
  );
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
