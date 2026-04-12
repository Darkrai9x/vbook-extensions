"use strict";

const vscode = require("vscode");
const fs = require("fs/promises");
const fsSync = require("fs");
const path = require("path");
const net = require("net");
const http = require("http");
const os = require("os");

let legacyServer = null;

const STATE_KEY = "vbookTester.state";
const HISTORY_KEY = "vbookTester.history";
const FORM_CACHE_KEY = "vbookTester.formCache";
function getMaxHistory() {
  const config = vscode.workspace.getConfiguration("vbookTester");
  return config.get("maxHistory", 30);
}

class TerminalLogger {
  constructor() {
    this.writeEmitter = new vscode.EventEmitter();
    this.closeEmitter = new vscode.EventEmitter();
    this.onDidWrite = this.writeEmitter.event;
    this.onDidClose = this.closeEmitter.event;
    this.terminal = null; // Lazy-init: không tạo terminal cho đến khi cần
    this._isOpen = false;
    this._queue = [];
  }

  _ensureTerminal() {
    if (!this.terminal) {
      this.terminal = vscode.window.createTerminal({
        name: "vBook Test",
        pty: this
      });
      
      // Auto-clean reference if user kills the terminal panel manually
      if (!this._terminalCloseDisposable) {
        this._terminalCloseDisposable = vscode.window.onDidCloseTerminal((t) => {
          if (t === this.terminal) {
            this.terminal = null;
            this._isOpen = false;
          }
        });
      }
    }
  }

  open() {
    this._isOpen = true;
    if (this._queue.length > 0) {
      this.writeEmitter.fire(this._queue.join(""));
      this._queue = [];
    }
  }

  close() {
    this._isOpen = false;
  }

  handleInput() { }

  show() {
    this._ensureTerminal();
    this.terminal.show(); // Focus terminal
    setTimeout(() => {
      vscode.commands.executeCommand("workbench.action.terminal.focus");
    }, 50);
  }

  clear() {
    this._ensureTerminal();
    if (this._isOpen) {
      this.writeEmitter.fire("\x1b[2J\x1b[3J\x1b[H");
    } else {
      this._queue = [];
    }
  }

  log(value) {
    this._ensureTerminal();
    const text = normalizeTerminalText(value);
    if (this._isOpen) {
      this.writeEmitter.fire(text);
    } else {
      this._queue.push(text);
    }
  }

  dispose() {
    this.writeEmitter.dispose();
    this.closeEmitter.dispose();
    if (this._terminalCloseDisposable) {
      this._terminalCloseDisposable.dispose();
    }
    if (this.terminal) {
      this.terminal.dispose();
    }
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
    if (output.length >= getMaxHistory()) {
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
    apiMode: "new",
    folderPath: "",
    script: "",
    argsText: "",
    argsValues: [],
    showTerminal: config.get("showTerminalOnRun", false)
  };
}

function getStoredState(context) {
  const defaults = getDefaultState(context);
  const stored = context.globalState.get(STATE_KEY) || {};
  return {
    ...defaults,
    ...stored,
    serverUrl: stored.serverUrl || defaults.serverUrl
  };
}

function getStoredHistory(context) {
  const history = context.globalState.get(HISTORY_KEY) || {};
  return {
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

function parseStoredArgsValues(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item ?? ""));
  }
  return [];
}

function getCachedArgsValues(context, folderPath, script) {
  if (!folderPath || !script) {
    return [];
  }

  const cache = getStoredFormCache(context);
  const entry = cache[createFormCacheKey(folderPath, script)];
  return entry ? parseStoredArgsValues(entry.argsValues) : [];
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
  let newRuns = current.recentRuns;
  if (patch.runRecords) {
    newRuns = [...patch.runRecords, ...newRuns];
  } else if (patch.runRecord) {
    newRuns = [patch.runRecord, ...newRuns];
  }
  const seen = new Set();
  newRuns = newRuns.filter((r) => {
    const key = (r.folderPath || "") + "::" + (r.script || "");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  const next = {
    recentRuns: uniqRecent(newRuns)
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

// Cache kết quả scan để tránh quét lại mỗi khi đổi tab
let _folderCache = null;
let _folderCacheTimer = null;

function invalidateFolderCache() {
  _folderCache = null;
  if (_folderCacheTimer) {
    clearTimeout(_folderCacheTimer);
    _folderCacheTimer = null;
  }
}

async function collectExtensionFolders() {
  if (_folderCache) {
    return _folderCache;
  }

  const folders = [];
  
  if (!vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length === 0) {
    return folders;
  }

  const pluginUris = await vscode.workspace.findFiles("**/plugin.json", "**/{node_modules,.git,dist,build,.vscode,out,target,vendor}/**");
  
  for (const uri of pluginUris) {
    const dir = path.dirname(uri.fsPath);
    if (await isExtensionFolder(dir)) {
      const pluginInfo = await readPluginInfo(dir);
      folders.push({
        path: dir,
        name: path.basename(dir),
        label: pluginInfo.displayName || path.basename(dir),
        scripts: pluginInfo.scripts,
        scriptParams: {}
      });
    }
  }

  folders.sort((a, b) => a.name.localeCompare(b.name));

  _folderCache = folders;
  _folderCacheTimer = setTimeout(invalidateFolderCache, 60_000);

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
    scriptParams: {}
  };
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

async function collectScriptParams(srcDir) {
  try {
    const entries = await fs.readdir(srcDir, { withFileTypes: true });
    const output = {};
    for (const entry of entries) {
      if (entry.isDirectory()) { continue; }
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
      if (char === quote && prev !== "\\") { quote = ""; }
      continue;
    }
    if (char === "'" || char === '"' || char === "`") { quote = char; current += char; continue; }
    if (char === "(") { depthParen += 1; current += char; continue; }
    if (char === ")") { depthParen = Math.max(0, depthParen - 1); current += char; continue; }
    if (char === "{") { depthBrace += 1; current += char; continue; }
    if (char === "}") { depthBrace = Math.max(0, depthBrace - 1); current += char; continue; }
    if (char === "[") { depthBracket += 1; current += char; continue; }
    if (char === "]") { depthBracket = Math.max(0, depthBracket - 1); current += char; continue; }
    if (char === "," && depthParen === 0 && depthBrace === 0 && depthBracket === 0) {
      parts.push(current.trim());
      current = "";
      continue;
    }
    current += char;
  }
  if (current.trim()) { parts.push(current.trim()); }
  return parts;
}

function normalizeParamName(rawParam, index) {
  const withoutDefault = rawParam.split("=")[0].trim();
  const withoutRest = withoutDefault.replace(/^\.\.\./, "").trim();
  const matched = withoutRest.match(/[A-Za-z_$][\w$]*/);
  if (matched) { return matched[0]; }
  return `arg${index + 1}`;
}

function extractExecuteParams(source) {
  let textToScan = source;
  if (source && source.length > 4000) {
    const head = source.substring(0, 2000);
    const tail = source.substring(source.length - 2000);
    textToScan = head + "\n" + tail;
  }
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
    const matched = textToScan.match(pattern);
    if (!matched) { continue; }
    return splitTopLevelParams(matched[1]).filter(Boolean).map((param, index) => normalizeParamName(param, index));
  }
  return [];
}

async function createPayload(folderPath) {
  const pluginPath = path.join(folderPath, "plugin.json");
  const iconPath = path.join(folderPath, "icon.png");
  const srcPath = path.join(folderPath, "src");

  if (!(await isExtensionFolder(folderPath))) {
    throw new Error(`Folder is not a valid extension: ${folderPath}`);
  }

  const pluginStr = await fs.readFile(pluginPath, "utf8");
  let pluginObj;
  try {
    pluginObj = JSON.parse(pluginStr);
  } catch (e) {
    throw new Error("Invalid format in plugin.json");
  }

  if (!pluginObj.metadata) pluginObj.metadata = {};

  const src = await readSourceMap(srcPath);
  let icon = "";
  if (await pathExists(iconPath)) {
    const iconBuf = await fs.readFile(iconPath);
    icon = `data:image/*;base64,${iconBuf.toString("base64")}`;
    pluginObj.metadata.icon = icon;
  }

  return {
    plugin: JSON.stringify(pluginObj),
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

function normalizeTestInputArg(value) {
  const text = String(value ?? "");
  if (!/^https?:\/\//i.test(text)) { return text; }
  return text.replace(/\/+$/, "");
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
    if (url.endsWith("/test")) {
      return json;
    }
    const message = json.message || `HTTP ${response.status}`;
    throw new Error(message);
  }

  return json;
}

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  const preferred = ["Wi-Fi", "Ethernet"];
  for (const name of preferred) {
    const ifaces = interfaces[name];
    if (ifaces) {
      for (const iface of ifaces) {
        if (iface.family === "IPv4" && !iface.internal) {
          return iface.address;
        }
      }
    }
  }
  for (const name of Object.keys(interfaces)) {
    const ifaces = interfaces[name];
    if (ifaces) {
      for (const iface of ifaces) {
        if (iface.family === "IPv4" && !iface.internal) {
          return iface.address;
        }
      }
    }
  }
  return "127.0.0.1";
}

function parseHostPort(input, defaultPort) {
  const trimmed = input.trim();
  const lastColon = trimmed.lastIndexOf(":");
  if (lastColon > 0 && lastColon < trimmed.length - 1) {
    const host = trimmed.slice(0, lastColon);
    const port = Number(trimmed.slice(lastColon + 1));
    if (Number.isFinite(port) && port > 0 && port <= 65535) {
      return { host, port };
    }
  }
  return { host: trimmed, port: defaultPort };
}

async function ensureLegacyServer(srcRootPath, logger) {
  if (legacyServer) {
    await new Promise((resolve, reject) => {
      legacyServer.close((err) => (err ? reject(err) : resolve()));
    });
    legacyServer = null;
  }
  const localIP = getLocalIP();
  const localPort = 8080;
  legacyServer = http.createServer((req, res) => {
    const url = new URL(req.url || "/", `http://${req.headers.host}`);
    const file = url.searchParams.get("file");
    const root = url.searchParams.get("root");
    if (!file || !root) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("Missing file or root");
      return;
    }
    const filePath = path.join(srcRootPath, root, file);
    fsSync.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Error reading file");
        return;
      }
      const b64 = Buffer.from(data).toString("base64");
      res.writeHead(200, { "Content-Length": b64.length, "Content-Type": "text/plain" });
      res.end(b64);
    });
  });
  await new Promise((resolve) => {
    legacyServer.listen(localPort, localIP, () => {
      logger.log(`[SERVER] http://${localIP}:${localPort}`);
      resolve();
    });
  });
  return { localIP, localPort };
}

function createLegacyHeaders(data, host, port) {
  const b64 = Buffer.from(JSON.stringify(data)).toString("base64");
  return (
    `GET /test HTTP/1.1\r\n` +
    `Host: ${host}:${port}\r\n` +
    `Connection: keep-alive\r\n` +
    `User-Agent: okhttp/3.12.6\r\n` +
    `Accept-Encoding: gzip\r\n` +
    `data: ${b64}\r\n\r\n`
  );
}

function createLegacyInstallHeaders(data, host, port) {
  const b64 = Buffer.from(JSON.stringify(data)).toString("base64");
  return (
    `GET /install HTTP/1.1\r\n` +
    `Host: ${host}:${port}\r\n` +
    `Connection: close\r\n` +
    `data: ${b64}\r\n\r\n`
  );
}

async function sendLegacyRequest(host, port, headers, logger) {
  return new Promise((resolve, reject) => {
    const client = new net.Socket();
    let responseData = "";
    client.connect(port, host, () => {
      logger.log("[CONNECT] Connected via TCP");
      client.write(headers);
    });
    client.on("data", (data) => { responseData += data.toString(); });
    client.on("end", () => {
      try {
        const idx = responseData.indexOf("{") - 1;
        if (idx < 0) { throw new Error("No JSON in response"); }
        const body = responseData.substring(idx);
        const json = JSON.parse(body);
        if (json.result) {
          try {
            const parsed = JSON.parse(json.result);
            resolve({ log: json.log || "", exception: json.exception || "", data: parsed });
          } catch {
            resolve({ log: json.log || "", exception: json.exception || "", data: json.result });
          }
        } else {
          resolve({ log: json.log || "", exception: json.exception || "", data: json });
        }
      } catch (e) {
        logger.log("[ERROR] Parse failed: " + e.message);
        reject(e);
      }
    });
    client.on("error", (e) => { logger.log("[ERROR] " + e.message); reject(e); });
    client.setTimeout(15000, () => { client.destroy(); reject(new Error("Timeout")); });
  });
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

function splitArgsTextHost(argsText) {
  return String(argsText || "").replace(/\r?\n/g, "\n").split("\n");
}

function shouldShowTerminal() {
  const config = vscode.workspace.getConfiguration("vbookTester");
  return config.get("showTerminalOnRun", false);
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
  <meta charset="UTF-8"/>
  <meta http-equiv="Content-Security-Policy" content="${csp}"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>vBook Tester</title>
  <style>
    :root { color-scheme: light dark; }
    html, body { height: 100%; margin: 0; padding: 0; }
    * { box-sizing: border-box; }

    body {
      display: flex; flex-direction: column;
      font-family: var(--vscode-font-family);
      font-size: var(--vscode-font-size);
      font-weight: var(--vscode-font-weight);
      line-height: 1.4;
      background: var(--vscode-sideBar-background);
      color: var(--vscode-foreground);
      overflow: hidden;
    }

    /* ─── Layout ─────────────────────────────── */
    .panel { display: flex; flex-direction: column; height: 100%; }

    .formScroll {
      flex: 1; min-height: 0;
      overflow-y: auto; overflow-x: hidden;
      overscroll-behavior: contain;
      padding: 10px 11px 4px;
    }
    .formScroll::-webkit-scrollbar { width: 5px; }
    .formScroll::-webkit-scrollbar-track { background: transparent; }
    .formScroll::-webkit-scrollbar-thumb {
      background: var(--vscode-scrollbarSlider-background);
      border-radius: 3px;
    }

    /* ─── Header ─────────────────────────────── */
    .topBar {
      flex-shrink: 0;
      display: flex; align-items: center; gap: 6px;
      padding: 8px 11px 7px;
      border-bottom: 1px solid var(--vscode-panel-border, rgba(128,128,128,0.18));
    }
    .logo {
      width: 20px; height: 20px; flex-shrink: 0; border-radius: 4px;
      background: var(--vscode-button-background);
      display: flex; align-items: center; justify-content: center;
    }
    .logo svg { width: 11px; height: 11px; fill: var(--vscode-button-foreground); }
    .logoText { flex: 1; min-width: 0; }
    .logoText h1 {
      margin: 0; font-size: 11.5px; font-weight: 700;
      letter-spacing: 0.02em; line-height: 1.2;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .logoText .sub {
      margin: 0; font-size: 10px; line-height: 1.2;
      color: var(--vscode-descriptionForeground);
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .chips { display: flex; gap: 3px; flex-shrink: 0; }

    /* ─── Chip toggles ───────────────────────── */
    .chip-group {
      display: inline-flex;
      border: 1px solid var(--vscode-input-border, rgba(128,128,128,0.28));
      border-radius: 4px; overflow: hidden;
      background: var(--vscode-input-background);
    }
    .chip-group button {
      border: none; border-right: 1px solid var(--vscode-input-border, rgba(128,128,128,0.28));
      border-radius: 0;
      padding: 0 7px; height: 20px;
      font: inherit; font-size: 10px; font-weight: 700; letter-spacing: 0.04em;
      cursor: pointer;
      background: transparent;
      color: var(--vscode-foreground);
      opacity: 0.45;
      transition: background 0.1s, opacity 0.1s;
      white-space: nowrap;
    }
    .chip-group button:last-child { border-right: none; }
    .chip-group button:hover { opacity: 0.85; background: var(--vscode-toolbar-hoverBackground); }
    .chip-group button.active {
      background: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
      opacity: 1;
    }

    /* ─── Field groups ───────────────────────── */
    .group { margin-bottom: 9px; }
    .group-label {
      display: flex; align-items: center; gap: 5px;
      font-size: 9.5px; font-weight: 700; letter-spacing: 0.09em;
      text-transform: uppercase;
      color: var(--vscode-descriptionForeground);
      opacity: 0.65;
      margin-bottom: 5px;
    }
    .group-label::after {
      content: ""; flex: 1; height: 1px;
      background: var(--vscode-panel-border, rgba(128,128,128,0.18));
    }

    .field { margin-bottom: 6px; }
    .field label {
      display: block; margin-bottom: 2px;
      font-size: 10px; font-weight: 600;
      text-transform: uppercase; letter-spacing: 0.07em;
      color: var(--vscode-descriptionForeground);
      opacity: 0.8;
    }

    /* two-col grid with bottom-aligned labels */
    .row2 {
      display: grid; grid-template-columns: 1fr 1fr; gap: 6px;
      align-items: end;
    }
    .row2 .field { margin-bottom: 0; display: flex; flex-direction: column; }
    .row2 .field label { margin-top: auto; }

    /* ─── Inputs & selects ───────────────────── */
    input, select {
      width: 100%; height: 25px;
      border: 1px solid var(--vscode-input-border, rgba(128,128,128,0.28));
      background: var(--vscode-input-background);
      color: var(--vscode-input-foreground);
      border-radius: 3px;
      padding: 0 7px;
      font: inherit; font-size: calc(var(--vscode-font-size) * 0.95);
      appearance: none; -webkit-appearance: none;
      transition: border-color 0.12s, box-shadow 0.12s;
    }
    select {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='7' height='4' viewBox='0 0 7 4'%3E%3Cpath fill='%23808080' d='M0 0l3.5 4L7 0z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 7px center;
      padding-right: 20px;
      cursor: pointer;
    }
    input:focus, select:focus {
      outline: none;
      border-color: var(--vscode-focusBorder);
      box-shadow: 0 0 0 1px var(--vscode-focusBorder);
    }

    .argsGrid { display: grid; gap: 5px; }
    .hint {
      margin-top: 3px; font-size: 10px;
      color: var(--vscode-descriptionForeground); opacity: 0.65;
    }

    /* ─── Action bar (sticky) ────────────────── */
    .actionBar {
      flex-shrink: 0;
      display: flex; align-items: center; gap: 5px;
      padding: 7px 11px;
      border-top: 1px solid var(--vscode-panel-border, rgba(128,128,128,0.18));
      background: var(--vscode-sideBar-background);
    }

    /* base button */
    button {
      display: inline-flex; align-items: center; justify-content: center;
      gap: 4px; height: 25px; padding: 0 9px;
      border: 1px solid transparent; border-radius: 3px;
      font: inherit; font-size: 11px; cursor: pointer;
      background: var(--vscode-button-secondaryBackground, var(--vscode-input-background));
      color: var(--vscode-button-secondaryForeground, var(--vscode-foreground));
      transition: background 0.1s, border-color 0.1s, opacity 0.1s;
      white-space: nowrap; flex-shrink: 0;
    }
    button:hover { background: var(--vscode-button-secondaryHoverBackground, var(--vscode-toolbar-hoverBackground)); }
    button:disabled { opacity: 0.38; cursor: default; pointer-events: none; }

    /* icon buttons (secondary) */
    .btn-icon {
      border-color: var(--vscode-input-border, rgba(128,128,128,0.28));
      background: var(--vscode-input-background);
      color: var(--vscode-foreground);
      font-weight: 500;
    }
    .btn-icon:hover { border-color: var(--vscode-focusBorder); background: var(--vscode-toolbar-hoverBackground); }
    .btn-icon svg, .btn-icon .spin { width: 12px; height: 12px; flex-shrink: 0; }
    .btn-icon svg { fill: currentColor; }
    .btn-icon .spin {
      border: 1.5px solid rgba(128,128,128,0.3);
      border-top-color: currentColor;
      border-radius: 50%; display: none;
      animation: rot 0.65s linear infinite;
    }
    .btn-icon.busy svg { display: none; }
    .btn-icon.busy .spin { display: block; }
    .btn-icon.busy .lbl { opacity: 0.55; }

    /* primary run button — fixed width so it doesn't stretch */
    .btn-run {
      background: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
      border-color: transparent;
      font-weight: 600;
      min-width: 64px;
      flex: 1; max-width: 120px;
    }
    .btn-run:hover { background: var(--vscode-button-hoverBackground); }

    /* TestAll accent */
    #oneclickBtn { color: #c9961a; border-color: rgba(201,150,26,0.35); }
    #oneclickBtn:hover { background: rgba(201,150,26,0.1); border-color: rgba(201,150,26,0.55); color: #e0ab2a; }

    .lbl { font-size: 11px; line-height: 1; }
    @keyframes rot { to { transform: rotate(360deg); } }

    /* ─── Response pane ──────────────────────── */
    .responsePane {
      flex-shrink: 0; display: flex; flex-direction: column;
      border-top: 2px solid var(--vscode-panel-border, rgba(128,128,128,0.18));
      height: 42%; min-height: 80px;
    }
    .respHeader {
      flex-shrink: 0; display: flex; align-items: center;
      padding: 4px 11px 3px;
      gap: 6px;
    }
    #responseTitle {
      font-size: 9.5px; font-weight: 700; letter-spacing: 0.09em;
      text-transform: uppercase;
      color: var(--vscode-descriptionForeground); opacity: 0.65;
    }
    .result {
      flex: 1; min-height: 0;
      padding: 6px 11px 8px;
      overflow: auto; overscroll-behavior: contain;
      white-space: pre-wrap; word-break: break-word;
      font-family: var(--vscode-editor-font-family, monospace);
      font-size: calc(var(--vscode-editor-font-size, 12px) * 1px);
      line-height: 1.5;
      color: var(--vscode-editor-foreground);
    }
    .result::-webkit-scrollbar { width: 5px; }
    .result::-webkit-scrollbar-track { background: transparent; }
    .result::-webkit-scrollbar-thumb { background: var(--vscode-scrollbarSlider-background); border-radius: 3px; }
  </style>
</head>
<body>
<div class="panel">

  <!-- Top bar: logo + chip toggles -->
  <div class="topBar">
    <div class="logo">
      <svg viewBox="0 0 16 16"><path d="M3 2.5v11l9-5.5-9-5.5Z"/></svg>
    </div>
    <div class="logoText">
      <h1 id="titleText">vBook Test</h1>
      <p id="subText" class="sub">Chạy script và xem phản hồi.</p>
    </div>
    <div class="chips">
      <div class="chip-group">
        <button id="languageViBtn" type="button">VI</button>
        <button id="languageEnBtn" type="button">EN</button>
      </div>
      <div class="chip-group">
        <button id="apiModeOldBtn" type="button">Cũ</button>
        <button id="apiModeNewBtn" type="button">Mới</button>
      </div>
      <div class="chip-group">
        <button id="showTermOnBtn" type="button" title="Terminal On">T.On</button>
        <button id="showTermOffBtn" type="button" title="Terminal Off">T.Off</button>
      </div>
    </div>
  </div>

  <!-- Scrollable form body -->
  <div class="formScroll">

    <div class="group">
      <div class="group-label">Kết nối</div>
      <div class="field">
        <label id="serverUrlLabel" for="serverUrl">Server</label>
        <input id="serverUrl" autocomplete="off" placeholder="http://127.0.0.1:8080"/>
      </div>
    </div>

    <div class="group">
      <div class="group-label">Extension</div>
      <div class="row2">
        <div class="field">
          <label id="folderPathLabel" for="folderPath">Thư mục</label>
          <select id="folderPath"></select>
        </div>
        <div class="field">
          <label id="scriptLabel" for="script">Script</label>
          <select id="script"></select>
        </div>
      </div>
    </div>

    <div class="group">
      <div class="group-label">Tham số</div>
      <div id="argsContainer" class="argsGrid"></div>
      <div id="argsTextHint" class="hint">Tự động tạo theo hàm execute(...).</div>
    </div>

    <div class="group">
      <div class="group-label">Lịch sử</div>
      <div class="field">
        <select id="recentRun">
          <option value="">Chọn input đã dùng...</option>
        </select>
      </div>
    </div>

  </div><!-- /formScroll -->

  <!-- Sticky action bar -->
  <div class="actionBar">
    <button id="terminalBtn" class="btn-icon" type="button" title="Mở Terminal" aria-label="Mở Terminal">
      <svg viewBox="0 0 16 16"><path d="M1 3v10h14V3H1Zm13 9H2V6h12v6ZM3 7l2 2-2 2 .7.7L6.4 9 3.7 6.3 3 7Z"/></svg>
      <span class="spin" aria-hidden="true"></span>
      <span class="lbl" id="termLbl">Term</span>
    </button>
    <button id="oneclickBtn" class="btn-icon" type="button" title="TestAll" aria-label="TestAll">
      <svg viewBox="0 0 16 16"><path d="M9.2 1 3 9h4.5L6.8 15 13 7H8.5L9.2 1Z"/></svg>
      <span class="spin" aria-hidden="true"></span>
      <span class="lbl">TestAll</span>
    </button>
    <button id="buildBtn" class="btn-icon" type="button" title="Đóng gói" aria-label="Đóng gói">
      <svg viewBox="0 0 16 16"><path d="M6.5 1 1 4v8l5.5 3 5.5-3V4L6.5 1Zm0 1.4L10.4 4 6.5 5.98 2.6 4 6.5 2.4Zm-4 3 3.5 1.9v4.3l-3.5-1.9V5.4Zm8 4.3-3.5 1.9V7.3l3.5-1.9v4.3Z"/></svg>
      <span class="spin" aria-hidden="true"></span>
      <span class="lbl">Gói</span>
    </button>
    <button id="installBtn" class="btn-icon" type="button" title="Cài đặt" aria-label="Cài đặt">
      <svg viewBox="0 0 16 16"><path d="M8.75 1.5v6.19l2.22-2.22 1.03 1.06L8 10.5 4 6.53l1.03-1.06 2.22 2.22V1.5h1.5ZM2 11h12v3H2v-3Z"/></svg>
      <span class="spin" aria-hidden="true"></span>
      <span class="lbl">Cài</span>
    </button>
    <button id="runBtn" class="btn-icon btn-run" type="button" title="Chạy" aria-label="Chạy">
      <svg viewBox="0 0 16 16"><path d="M3 2.5v11l9-5.5-9-5.5Z"/></svg>
      <span class="spin" aria-hidden="true"></span>
      <span class="lbl">Chạy</span>
    </button>
  </div>

  <!-- Response pane -->
  <div class="responsePane">
    <div class="respHeader">
      <span id="responseTitle">Phản hồi</span>
    </div>
    <div id="responseResult" class="result">Chưa có phản hồi.</div>
  </div>

</div><!-- /panel -->

  <script nonce="${nonce}">
    const vscode = acquireVsCodeApi();
    const state = { folders: [], history: { recentRuns: [] }, showTerminal: false };

    const serverUrlEl = document.getElementById("serverUrl");
    const languageViBtn = document.getElementById("languageViBtn");
    const languageEnBtn = document.getElementById("languageEnBtn");
    const apiModeOldBtn = document.getElementById("apiModeOldBtn");
    const apiModeNewBtn = document.getElementById("apiModeNewBtn");
    const showTermOnBtn = document.getElementById("showTermOnBtn");
    const showTermOffBtn = document.getElementById("showTermOffBtn");
    const folderPathEl = document.getElementById("folderPath");
    const scriptEl = document.getElementById("script");
    const argsContainerEl = document.getElementById("argsContainer");
    const recentRunEl = document.getElementById("recentRun");
    const responseResultEl = document.getElementById("responseResult");
    const terminalBtn = document.getElementById("terminalBtn");
    const oneclickBtn = document.getElementById("oneclickBtn");
    const runBtn = document.getElementById("runBtn");
    const buildBtn = document.getElementById("buildBtn");
    const installBtn = document.getElementById("installBtn");
    const actionButtons = { oneclick: oneclickBtn, run: runBtn, build: buildBtn, install: installBtn, term: terminalBtn };
    const recentRunDefaultOption = recentRunEl.querySelector('option[value=""]');
    const i18n = {
      vi: {
        title: "vBook Test", subtitle: "Chạy script và xem phản hồi.",
        serverUrl: "Server", language: "Ngôn ngữ", folderPath: "Thư mục",
        script: "Script", args: "Tham số", argsPlaceholder: "Nhập giá trị",
        argsHint: "Tự động tạo theo hàm execute(...).", recentRun: "Lịch sử",
        recentRunPlaceholder: "Chọn input đã dùng...", response: "Phản hồi",
        run: "Chạy", oneclick: "TestAll", build: "Gói", install: "Cài", term: "Term",
        apiModeOld: "Cũ", apiModeNew: "Mới", noResponse: "Chưa có phản hồi.",
        showTermOnHover: "Tự động hiện Terminal", showTermOffHover: "Chạy ngầm Terminal"
      },
      en: {
        title: "vBook Test", subtitle: "Run script and inspect response.",
        serverUrl: "Server", language: "Language", folderPath: "Folder",
        script: "Script", args: "Arguments", argsPlaceholder: "Enter value",
        argsHint: "Generated from the execute(...) signature.", recentRun: "History",
        recentRunPlaceholder: "Select recent input...", response: "Response",
        run: "Run", oneclick: "TestAll", build: "Build", install: "Install", term: "Term",
        apiModeOld: "Old", apiModeNew: "New", noResponse: "No response yet.",
        showTermOnHover: "Auto show Terminal", showTermOffHover: "Hide Terminal run"
      }
    };

    function splitArgsText(argsText) {
      return String(argsText || "").replaceAll(String.fromCharCode(13), "").split(String.fromCharCode(10));
    }

    function normalizeSlash(str) {
      return String(str || "").split(String.fromCharCode(92)).join("/");
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
        serverUrl: serverUrlEl.value.trim(), language: state.language || "vi",
        apiMode: state.apiMode || "new", folderPath: folderPathEl.value,
        script: scriptEl.value, argsText: argsValues.join(String.fromCharCode(10)),
        argsValues, showTerminal: state.showTerminal
      };
    }

    function setBusy(action) {
      const busy = Boolean(action);
      Object.entries(actionButtons).forEach(([key, button]) => {
        button.disabled = busy;
        button.classList.toggle("busy", key === action);
      });
    }

    function setActionButtonText(button, text) {
      button.title = text; button.setAttribute("aria-label", text);
      const label = button.querySelector(".lbl");
      if (label) label.textContent = text;
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
      if (!scriptEl.value && scripts.length > 0) scriptEl.value = scripts[0];
      renderArgsInputs(getCurrentParamNames(), []);
    }

    function fillArgsFromHistory(folderPath, script) {
      if (!folderPath || !script) return;
      if (state.formCache) {
        const cacheKey = folderPath + "::" + script;
        const cached = state.formCache[cacheKey];
        if (cached) {
          const vals = Array.isArray(cached.argsValues) && cached.argsValues.length > 0
            ? cached.argsValues : splitArgsText(cached.argsText);
          if (vals.some(v => v)) { renderArgsInputs(getCurrentParamNames(), vals); return; }
        }
      }
      if (state.history && state.history.recentRuns) {
        const normalizedPath = normalizeSlash(folderPath).toLowerCase();
        const match = state.history.recentRuns.find((r) => {
          const rPath = normalizeSlash(r.folderPath).toLowerCase();
          return rPath === normalizedPath && r.script === script;
        });
        if (match) {
          const vals = Array.isArray(match.argsValues) && match.argsValues.length > 0
            ? match.argsValues : splitArgsText(match.argsText);
          if (vals.some(v => v)) { renderArgsInputs(getCurrentParamNames(), vals); }
        }
      }
    }

    function renderArgsInputs(paramNames, values) {
      const names = Array.isArray(paramNames) ? paramNames : [];
      const nextValues = Array.isArray(values) ? values : [];
      const count = Math.max(names.length, nextValues.length);
      if (count === 0) { argsContainerEl.innerHTML = ""; return; }
      argsContainerEl.innerHTML = Array.from({ length: count }, (_, index) => {
        const label = names[index] || ('arg' + (index + 1));
        const value = nextValues[index] || "";
        return '<input data-arg-index="' + index + '" placeholder="' + escapeAttr(label) + '" value="' + escapeAttr(value) + '" />';
      }).join("");
    }

    function renderRecentRuns(items) {
      recentRunEl.innerHTML = '<option value=""></option>' + items.map((item, index) => {
        const safeFolderPath = normalizeSlash(item.folderPath);
        const folderName = safeFolderPath ? safeFolderPath.split("/").pop() : "-";
        // Format: detail.js | TruyenFull | https://truyenfull...
        const argsRaw = Array.isArray(item.argsValues) && item.argsValues.some(v => v)
          ? item.argsValues.filter(v => v).join(", ")
          : splitArgsText(item.argsText).filter(Boolean).join(", ");
        const shortArgs = argsRaw.length > 40 ? argsRaw.slice(0, 40) + "\u2026" : (argsRaw || "-");
        const label = [item.script || "-", folderName, shortArgs].join(" | ");
        return '<option value="' + index + '">' + escapeHtml(label) + "</option>";
      }).join("");
      applyLanguage(state.language || "vi");
    }

    function escapeAttr(value) { return String(value).replace(/"/g, "&quot;"); }
    function escapeHtml(value) {
      return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    function applyRun(run) {
      if (!run) return;
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
      document.getElementById("argsTextHint").textContent = dict.argsHint;
      document.getElementById("responseTitle").textContent = dict.response;
      Array.from(argsContainerEl.querySelectorAll("input[data-arg-index]")).forEach((input) => {
        if (!input.placeholder) input.placeholder = dict.argsPlaceholder;
      });
      setActionButtonText(runBtn, dict.run);
      setActionButtonText(oneclickBtn, dict.oneclick);
      setActionButtonText(buildBtn, dict.build);
      setActionButtonText(installBtn, dict.install);
      setActionButtonText(terminalBtn, dict.term);
      showTermOnBtn.title = dict.showTermOnHover;
      showTermOffBtn.title = dict.showTermOffHover;
      /* chip labels stay fixed (Cũ/Mới, VI/EN) — do NOT overwrite from i18n */
      languageViBtn.classList.toggle("active", language === "vi");
      languageEnBtn.classList.toggle("active", language === "en");
      if (recentRunDefaultOption) recentRunDefaultOption.textContent = dict.recentRunPlaceholder;
      if (!responseResultEl.textContent || responseResultEl.textContent === i18n.vi.noResponse || responseResultEl.textContent === i18n.en.noResponse) {
        responseResultEl.textContent = dict.noResponse;
      }
    }

    // Lưu URL server mới làm default khi user thay đổi
    serverUrlEl.addEventListener("change", () => {
      vscode.postMessage({ type: "saveState", form: currentForm() });
    });

    function applyShowTerminal(show) {
      state.showTerminal = show;
      showTermOnBtn.classList.toggle("active", show === true);
      showTermOffBtn.classList.toggle("active", show === false);
    }

    function handleShowTermChange(show) {
      applyShowTerminal(show); vscode.postMessage({ type: "saveState", form: currentForm() });
    }

    showTermOnBtn.addEventListener("click", () => handleShowTermChange(true));
    showTermOffBtn.addEventListener("click", () => handleShowTermChange(false));

    window.addEventListener("message", (event) => {
      const message = event.data;
      if (message.type === "init") {
        state.history = message.history; state.formCache = message.formCache || {};
        serverUrlEl.value = message.state.serverUrl || "http://127.0.0.1:8080";
        state.language = message.state.language || "vi"; state.apiMode = message.state.apiMode || "new";
        state.showTerminal = Boolean(message.state.showTerminal);
        applyShowTerminal(state.showTerminal);
        renderFolders(message.folders || [], message.state.folderPath || "");
        renderScripts(folderPathEl.value, message.state.script || "");
        const initArgs = Array.isArray(message.state.argsValues) && message.state.argsValues.some(v => v)
          ? message.state.argsValues
          : null;
        if (initArgs) {
          renderArgsInputs(getCurrentParamNames(), initArgs);
        } else {
          fillArgsFromHistory(folderPathEl.value, message.state.script || "");
        }
        renderRecentRuns(message.history.recentRuns || []);
        applyLanguage(state.language); applyApiMode(state.apiMode);
        const noRespTexts = [i18n.vi.noResponse, i18n.en.noResponse];
        if (!responseResultEl.innerHTML || noRespTexts.includes(responseResultEl.textContent)) {
          responseResultEl.textContent = (i18n[state.language] || i18n.vi).noResponse;
        }
        vscode.setState(message.state);
        vscode.postMessage({ type: "loadParams", folderPath: folderPathEl.value });
        return;
      }

      function syntaxHighlight(str) {
        if (!str) return "";
        let escaped = escapeHtml(str);
        if (!str.trim().startsWith("{") && !str.trim().startsWith("[")) return escaped;
        return escaped.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            let color = 'var(--vscode-editor-foreground)';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) { color = '#9cdcfe'; }
                else { color = '#ce9178'; }
            } else if (/true|false|null/.test(match)) { color = '#569cd6'; }
            else { color = '#b5cea8'; }
            return '<span style="color:' + color + '">' + match + '</span>';
        });
      }

      function renderAccordion(title, contentStr, logStr, exceptionStr, open = true) {
        let html = '';
        if (title) {
          html += '<details ' + (open ? 'open' : '') + ' style="margin-bottom: 10px; border:1px solid var(--vscode-panel-border, var(--vscode-input-border)); border-radius: 4px; overflow: hidden;"><summary style="cursor:pointer; padding:8px 10px; font-weight:700; font-size:11px; text-transform:uppercase; letter-spacing:0.05em; color: var(--vscode-descriptionForeground); background:var(--vscode-editorGroupHeader-tabsBackground); outline:none; border-bottom:1px solid var(--vscode-panel-border, var(--vscode-input-border)); user-select:none;">' + escapeHtml(title) + '</summary><div style="padding:10px; background: var(--vscode-editor-background);">';
        }
        if (logStr) {
          html += '<details style="margin-bottom:10px;"><summary style="cursor:pointer; font-weight:600; font-size:11px; text-transform:uppercase; letter-spacing:0.05em; color:var(--vscode-descriptionForeground); user-select:none;">Logs</summary><div style="margin-top:6px; padding:10px; font-size:12px; font-family:var(--vscode-editor-font-family); white-space:pre-wrap; word-wrap:break-word; background:var(--vscode-textCodeBlock-background); border-radius:4px; border:1px solid var(--vscode-panel-border, var(--vscode-input-border));">' + escapeHtml(logStr) + '</div></details>';
        }
        if (exceptionStr) {
          html += '<div style="background:var(--vscode-inputValidation-errorBackground); color:var(--vscode-inputValidation-errorForeground); padding:10px; margin-bottom:10px; border-radius:4px; border:1px solid var(--vscode-inputValidation-errorBorder); font-family:var(--vscode-editor-font-family); font-size:12px;"><strong>EXCEPTION:</strong><br/><span style="opacity:0.9">' + escapeHtml(exceptionStr) + '</span></div>';
        }
        if (contentStr) {
          const formattedContent = syntaxHighlight(contentStr);
          html += '<details open><summary style="cursor:pointer; font-weight:600; font-size:11px; text-transform:uppercase; letter-spacing:0.05em; color:var(--vscode-descriptionForeground); user-select:none;">Data</summary><div style="margin-top:6px; font-family:var(--vscode-editor-font-family); font-size:12px; padding:12px; line-height:1.5; white-space:pre-wrap; word-wrap:break-word; background:var(--vscode-textCodeBlock-background); border-radius:4px; border:1px solid var(--vscode-panel-border, var(--vscode-input-border));">' + formattedContent + '</div></details>';
        }
        if (title) html += '</div></details>';
        return html;
      }

      if (message.type === "result") {
        setBusy(null); let res = message.responseObj; if (!res) res = { data: message.responseText };
        const exc = res.exception || (res.code && res.code !== 200 ? res.message : "");
        let payloadStr = res.data !== undefined ? (typeof res.data === "object" ? JSON.stringify(res.data, null, 2) : String(res.data)) : "";
        if (res.code && res.code !== 200 && (!payloadStr || payloadStr === "{}")) payloadStr = JSON.stringify(res, null, 2);
        responseResultEl.innerHTML = renderAccordion(null, payloadStr, res.log, exc);
        return;
      }

      if (message.type === "oneclickProgress") {
        const loadingStr = "Đang xử lý...";
        if (responseResultEl.innerHTML.includes(loadingStr)) responseResultEl.innerHTML = "";
        let res = message.responseObj;
        const payloadStr = typeof res.data === "object" ? JSON.stringify(res.data, null, 2) : res.data;
        responseResultEl.innerHTML += renderAccordion(message.step + ".js", payloadStr, res.log, res.exception, false);
        return;
      }

      if (message.type === "oneclickDone") {
        setBusy(null); const loadingStr = "Đang xử lý...";
        if (responseResultEl.innerHTML.includes(loadingStr) || responseResultEl.innerHTML === "") {
          responseResultEl.innerHTML = renderAccordion("Lỗi", "Không có dữ liệu trả về", "", "", false);
        }
        return;
      }

      if (message.type === "historyUpdated") {
        state.history = message.history;
        renderRecentRuns(message.history.recentRuns || []);
        return;
      }

      if (message.type === "error") {
        setBusy(null); const loadingStr = "Đang xử lý...";
        if (responseResultEl.innerHTML.indexOf(loadingStr) !== -1) responseResultEl.innerHTML = "";
        if (responseResultEl.innerHTML.trim() === "") responseResultEl.innerHTML = renderAccordion("Lỗi", "", "", message.text);
        else responseResultEl.innerHTML += renderAccordion("Lỗi", "", "", message.text);
      }

      if (message.type === "updateParams") {
        const folder = state.folders.find(f => f.path === message.folderPath);
        if (folder) {
           folder.scriptParams = message.params;
           if (folderPathEl.value === message.folderPath) {
             const currentVals = getArgsValues();
             if (currentVals.length > 0 && currentVals.some(v => v)) {
               renderArgsInputs(getCurrentParamNames(), currentVals);
             } else {
               renderArgsInputs(getCurrentParamNames(), []);
               fillArgsFromHistory(folderPathEl.value, scriptEl.value);
             }
           }
        }
        return;
      }
    });

    folderPathEl.addEventListener("change", () => {
      renderScripts(folderPathEl.value, ""); fillArgsFromHistory(folderPathEl.value, scriptEl.value);
      vscode.postMessage({ type: "saveState", form: currentForm() });
      vscode.postMessage({ type: "loadParams", folderPath: folderPathEl.value });
    });

    scriptEl.addEventListener("change", () => {
      renderArgsInputs(getCurrentParamNames(), []); fillArgsFromHistory(folderPathEl.value, scriptEl.value);
      vscode.postMessage({ type: "saveState", form: currentForm() });
    });

    function handleLanguageChange(language) {
      applyLanguage(language); vscode.postMessage({ type: "saveState", form: currentForm() });
    }

    languageViBtn.addEventListener("click", () => handleLanguageChange("vi"));
    languageEnBtn.addEventListener("click", () => handleLanguageChange("en"));

    function applyApiMode(mode) {
      state.apiMode = mode;
      apiModeOldBtn.classList.toggle("active", mode === "old");
      apiModeNewBtn.classList.toggle("active", mode === "new");
    }

    function handleApiModeChange(mode) {
      applyApiMode(mode); vscode.postMessage({ type: "saveState", form: currentForm() });
    }

    apiModeOldBtn.addEventListener("click", () => handleApiModeChange("old"));
    apiModeNewBtn.addEventListener("click", () => handleApiModeChange("new"));

    recentRunEl.addEventListener("change", () => {
      const index = Number(recentRunEl.value); const run = state.history.recentRuns[index]; applyRun(run);
    });

    argsContainerEl.addEventListener("input", () => { vscode.postMessage({ type: "cacheArgs", form: currentForm() }); });

    terminalBtn.addEventListener("click", () => {
      vscode.postMessage({ type: "showTerminal" });
    });

    function send(action) {
      setBusy(action);
      responseResultEl.innerHTML = '<div style="padding:8px; color:var(--vscode-descriptionForeground);">\u0110ang x\u1eed l\u00fd...</div>';
      vscode.postMessage({ type: action, form: currentForm() });
    }

    oneclickBtn.addEventListener("click", () => send("oneclick"));
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
  if (form.showTerminal) logger.show();
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

async function validatePluginJson(folderPath, language) {
  const pluginPath = path.join(folderPath, "plugin.json");
  let plugin;
  try {
    plugin = JSON.parse(await fs.readFile(pluginPath, "utf8"));
  } catch (e) {
    throw new Error("Không thể đọc plugin.json (Invalid JSON)");
  }
  const meta = plugin.metadata || plugin;
  const requiredFields = ["name", "author", "version", "source", "type"];

  // If type is novel, comic, or chinese_novel, require regexp, language, locale
  const specialTypes = ["novel", "comic", "chinese_novel"];
  if (specialTypes.includes(meta.type)) {
    requiredFields.push("regexp", "language", "locale");
  }

  const missing = [];
  for (const field of requiredFields) {
    if (!meta[field]) {
      missing.push(field);
    }
  }
  if (missing.length > 0) {
    const text = language === "en"
      ? `plugin.json is missing required fields: ${missing.join(", ")}`
      : `plugin.json thiếu các trường bắt buộc: ${missing.join(", ")}`;
    throw new Error(text);
  }
}

async function buildExtension(form, logger) {
  await validatePluginJson(form.folderPath, form.language);
  const text = getRuntimeText(form.language);
  if (form.showTerminal) logger.show();
  logger.clear();

  const zipPath = path.join(form.folderPath, "plugin.zip");
  logger.log(`[BUILD] Đóng gói cục bộ -> ${zipPath}`);

  if (await pathExists(zipPath)) {
    await fs.unlink(zipPath);
  }

  const zlib = require("zlib");

  function crc32(buf) {
    let table = crc32.table;
    if (!table) {
      table = crc32.table = new Uint32Array(256);
      for (let i = 0; i < 256; i++) {
        let c = i;
        for (let j = 0; j < 8; j++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
        table[i] = c;
      }
    }
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
    return (crc ^ 0xFFFFFFFF) >>> 0;
  }

  function dosTime(d) {
    const time = ((d.getHours() & 0x1F) << 11) | ((d.getMinutes() & 0x3F) << 5) | ((d.getSeconds() >> 1) & 0x1F);
    const date = (((d.getFullYear() - 1980) & 0x7F) << 9) | (((d.getMonth() + 1) & 0xF) << 5) | (d.getDate() & 0x1F);
    return { time, date };
  }

  const files = [];

  const pluginStr = await fs.readFile(path.join(form.folderPath, "plugin.json"), "utf8");
  const pluginJson = JSON.parse(pluginStr);
  if (pluginJson.metadata && pluginJson.metadata.encrypt) {
    delete pluginJson.metadata.encrypt;
    logger.log(`[BUILD] (Bỏ qua thuộc tính encrypt=true)`);
  }
  files.push({ name: "plugin.json", data: Buffer.from(JSON.stringify(pluginJson, null, 2), "utf8") });

  const iconPath = path.join(form.folderPath, "icon.png");
  if (fsSync.existsSync(iconPath)) {
    files.push({ name: "icon.png", data: fsSync.readFileSync(iconPath) });
  }

  const srcDir = path.join(form.folderPath, "src");
  if (fsSync.existsSync(srcDir)) {
    const srcFiles = fsSync.readdirSync(srcDir);
    for (const f of srcFiles) {
      const fp = path.join(srcDir, f);
      const stat = fsSync.statSync(fp);
      if (stat.isFile()) {
        files.push({ name: "src/" + f, data: fsSync.readFileSync(fp) });
      }
    }
  }

  const entries = [];
  let offset = 0;
  const now = new Date();
  const { time: dosT, date: dosD } = dosTime(now);
  const chunks = [];

  for (const file of files) {
    const nameBuffer = Buffer.from(file.name, "utf8");
    const uncompressed = file.data;
    const compressed = zlib.deflateRawSync(uncompressed, { level: 9 });
    const crcVal = crc32(uncompressed);

    const localHeader = Buffer.alloc(30 + nameBuffer.length);
    localHeader.writeUInt32LE(0x04034b50, 0);
    localHeader.writeUInt16LE(20, 4);
    localHeader.writeUInt16LE(0, 6);
    localHeader.writeUInt16LE(8, 8);
    localHeader.writeUInt16LE(dosT, 10);
    localHeader.writeUInt16LE(dosD, 12);
    localHeader.writeUInt32LE(crcVal, 14);
    localHeader.writeUInt32LE(compressed.length, 18);
    localHeader.writeUInt32LE(uncompressed.length, 22);
    localHeader.writeUInt16LE(nameBuffer.length, 26);
    localHeader.writeUInt16LE(0, 28);
    nameBuffer.copy(localHeader, 30);

    entries.push({ nameBuffer, compressed, uncompressed, crcVal, headerOffset: offset });
    chunks.push(localHeader, compressed);
    offset += localHeader.length + compressed.length;
  }

  const centralStart = offset;
  for (const entry of entries) {
    const cdHeader = Buffer.alloc(46 + entry.nameBuffer.length);
    cdHeader.writeUInt32LE(0x02014b50, 0);
    cdHeader.writeUInt16LE(20, 4);
    cdHeader.writeUInt16LE(20, 6);
    cdHeader.writeUInt16LE(0, 8);
    cdHeader.writeUInt16LE(8, 10);
    cdHeader.writeUInt16LE(dosT, 12);
    cdHeader.writeUInt16LE(dosD, 14);
    cdHeader.writeUInt32LE(entry.crcVal, 16);
    cdHeader.writeUInt32LE(entry.compressed.length, 20);
    cdHeader.writeUInt32LE(entry.uncompressed.length, 24);
    cdHeader.writeUInt16LE(entry.nameBuffer.length, 28);
    cdHeader.writeUInt16LE(0, 30);
    cdHeader.writeUInt16LE(0, 32);
    cdHeader.writeUInt16LE(0, 34);
    cdHeader.writeUInt16LE(0, 36);
    cdHeader.writeUInt32LE(0, 38);
    cdHeader.writeUInt32LE(entry.headerOffset, 42);
    entry.nameBuffer.copy(cdHeader, 46);
    chunks.push(cdHeader);
    offset += cdHeader.length;
  }

  const centralSize = offset - centralStart;

  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(entries.length, 8);
  eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(centralSize, 12);
  eocd.writeUInt32LE(centralStart, 16);
  eocd.writeUInt16LE(0, 20);
  chunks.push(eocd);

  const zipBuffer = Buffer.concat(chunks);
  await fs.writeFile(zipPath, zipBuffer);

  const sizeKb = (zipBuffer.length / 1024).toFixed(2);
  const message = text.buildSaved(zipPath);
  logger.log(`[BUILD] ${message} (${sizeKb} KB)`);
  const displayZipPath = zipPath.replace(/\\/g, '/');
  return {
    request: { action: "Local ZIP Build", folder: form.folderPath },
    response: {
      data: { status: form.language === "en" ? "✅ Build succeeded." : "✅ Đóng gói thành công.", savedFile: displayZipPath, size: `${sizeKb} KB` }
    }
  };
}

async function installExtension(form, logger) {
  await validatePluginJson(form.folderPath, form.language);
  const payload = await createPayload(form.folderPath);
  const url = new URL("/extension/install", form.serverUrl).toString();
  const text = getRuntimeText(form.language);
  if (shouldShowTerminal()) logger.show();
  logger.clear();
  await checkConnection(form.serverUrl, logger, form.language);
  logger.log(`[INSTALL] ${url}`);
  const result = await postJson(url, payload);
  let finalData = { ...result };
  if (result && result.code === 200) {
    finalData = { "Status": form.language === "en" ? "✅ Install succeeded." : "✅ Cài đặt thành công.", "Code": 200 };
    logger.log(`[INSTALL] ${text.installSucceeded}`);
  } else {
    finalData["Status"] = form.language === "en" ? "❌ Install failed." : "❌ Cài đặt thất bại.";
  }
  return {
    request: { url, body: payload },
    response: { ...result, data: finalData }
  };
}

async function runLegacyTest(form, logger) {
  if (shouldShowTerminal()) logger.show();
  logger.clear();
  const pluginName = path.basename(form.folderPath);
  const srcRootPath = path.resolve(form.folderPath, "../");
  const remote = parseHostPort(form.serverUrl.replace(/^https?:\/\//, ""), 8080);
  const { localIP, localPort } = await ensureLegacyServer(srcRootPath, logger);
  const scriptPath = path.join(form.folderPath, "src", form.script);
  const scriptContent = await fs.readFile(scriptPath, "utf8");
  const inputArgs = parseArgsText(form.argsText);
  const data = {
    input: inputArgs,
    ip: `http://${localIP}:${localPort}`,
    root: `${pluginName}\\src`,
    language: "javascript",
    script: scriptContent
  };
  logger.log(`[RUN-LEGACY] ${form.script}`);
  logger.log(`[INPUT] ${JSON.stringify(inputArgs)}`);
  const result = await sendLegacyRequest(remote.host, remote.port, createLegacyHeaders(data, remote.host, remote.port), logger);
  logger.log(formatResult("[RESULT]", result));
  return { request: data, response: result };
}

async function runLegacyInstall(form, logger) {
  await validatePluginJson(form.folderPath, form.language);
  if (shouldShowTerminal()) logger.show();
  logger.clear();
  const pluginName = path.basename(form.folderPath);
  const remote = parseHostPort(form.serverUrl.replace(/^https?:\/\//, ""), 8080);
  const pluginJsonPath = path.join(form.folderPath, "plugin.json");
  const iconPath = path.join(form.folderPath, "icon.png");
  const pluginDetail = JSON.parse(await fs.readFile(pluginJsonPath, "utf8"));
  const meta = { ...pluginDetail.metadata };
  if (meta.encrypt) { delete meta.encrypt; }
  const data = {
    ...meta,
    ...(pluginDetail.script || {}),
    ip: "",
    root: "",
    language: "javascript",
    id: "debug-" + pluginDetail.metadata.source,
    icon: "",
    enabled: true,
    debug: true,
    data: {}
  };
  if (await pathExists(iconPath)) {
    const iconBuf = await fs.readFile(iconPath);
    data.icon = `data:image/*;base64,${iconBuf.toString("base64")}`;
  }
  const srcDir = path.join(form.folderPath, "src");
  const entries = await fs.readdir(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory() && entry.name.endsWith(".js")) {
      data.data[entry.name] = await fs.readFile(path.join(srcDir, entry.name), "utf8");
    }
  }
  data.data = JSON.stringify(data.data);
  logger.log(`[INSTALL-LEGACY] ${data.name || pluginName}`);
  const result = await sendLegacyRequest(remote.host, remote.port, createLegacyInstallHeaders(data, remote.host, remote.port), logger);
  logger.log("[INSTALL-LEGACY] Done");
  const succMsg = form.language === "en" ? "✅ Install succeeded." : "✅ Cài đặt thành công.";
  let finalData = (result && result.data) ? (typeof result.data === 'object' ? { ...result.data } : { raw: result.data }) : {};
  if (finalData.status === 0) {
    finalData = { "Status": succMsg, "Code": 200 };
  } else if (finalData.status !== undefined) {
    finalData["Status"] = form.language === "en" ? "❌ Install failed." : "❌ Cài đặt thất bại.";
  }
  return { request: data, response: { ...result, data: finalData } };
}

async function runLegacyScript(scriptName, input, form, logger, localIP, localPort, remote) {
  const pluginName = path.basename(form.folderPath);
  const scriptPath = path.join(form.folderPath, "src", scriptName);
  const scriptContent = await fs.readFile(scriptPath, "utf8");
  const data = {
    input: input,
    ip: `http://${localIP}:${localPort}`,
    root: `${pluginName}\\src`,
    language: "javascript",
    script: scriptContent
  };
  return await sendLegacyRequest(remote.host, remote.port, createLegacyHeaders(data, remote.host, remote.port), logger);
}

async function runModernScript(scriptName, input, form, logger) {
  const url = new URL("/extension/test", form.serverUrl).toString();
  const payload = await createPayload(form.folderPath);
  const body = {
    ...payload,
    input: JSON.stringify({ script: scriptName, vararg: input })
  };
  const res = await postJson(url, body);
  return {
    log: res.log || "",
    exception: res.exception || (res.code && res.code !== 200 ? res.message : ""),
    data: res.data ? res.data : res
  };
}

async function runOneclickTest(form, logger, onProgress) {
  if (form.showTerminal) logger.show();
  logger.clear();
  const isLegacy = form.apiMode === "old";
  let remote, localIP, localPort;

  if (isLegacy) {
    const srcRootPath = path.resolve(form.folderPath, "../");
    remote = parseHostPort(form.serverUrl.replace(/^https?:\/\//, ""), 8080);
    const srv = await ensureLegacyServer(srcRootPath, logger);
    localIP = srv.localIP;
    localPort = srv.localPort;
  } else {
    await checkConnection(form.serverUrl, logger, form.language);
  }

  async function exec(scriptName, input) {
    if (isLegacy) {
      return await runLegacyScript(scriptName, input, form, logger, localIP, localPort, remote);
    } else {
      return await runModernScript(scriptName, input, form, logger);
    }
  }

  const runRecords = [];
  const addRecord = (sName, inputStr) => {
    runRecords.push({
      serverUrl: form.serverUrl,
      folderPath: form.folderPath,
      script: sName,
      argsText: inputStr,
      at: new Date().toISOString()
    });
  };

  const errOut = (dict) => {
    logger.log(`[EXCEPTION] Oneclick aborted`);
    return { response: dict, runRecords: runRecords.reverse() };
  };

  logger.log("=== home.js ===");
  addRecord("home.js", "");
  const homeWrap = await exec("home.js", []);
  if (onProgress) await onProgress("home", homeWrap);
  if (homeWrap.log) { logger.log("[LOG] " + homeWrap.log); }
  if (homeWrap.exception) { return errOut({ home: homeWrap }); }
  const homeResult = homeWrap.data;
  if (!homeResult || !homeResult.data || homeResult.data.length === 0) {
    throw new Error("home.js: No data");
  }
  logger.log(formatResult("[home.js]", homeResult));

  const nextScript = homeResult.data[0].script || "gen.js";
  const homeInput = homeResult.data[0].input;
  if (!homeInput) { throw new Error("home.js: No input in first item"); }
  logger.log(`=== ${nextScript} ===`);
  addRecord(nextScript, homeInput);
  const genWrap = await exec(nextScript, [homeInput]);
  if (onProgress) await onProgress(nextScript.replace('.js', ''), genWrap);
  if (genWrap.log) { logger.log("[LOG] " + genWrap.log); }
  if (genWrap.exception) { return errOut({ home: homeWrap, gen: genWrap }); }
  const genResult = genWrap.data;
  if (!genResult || !genResult.data || genResult.data.length === 0) {
    throw new Error(`${nextScript}: No data`);
  }
  logger.log(formatResult(`[${nextScript}]`, genResult));

  const firstGen = genResult.data[0];
  let detailInput = typeof firstGen === "string" ? firstGen : (firstGen.url || firstGen.link);
  if (firstGen && firstGen.host && typeof detailInput === "string" && !detailInput.startsWith("http")) {
    detailInput = `${firstGen.host}/${detailInput.startsWith("/") ? detailInput.substring(1) : detailInput}`;
  }
  logger.log("=== detail.js ===");
  addRecord("detail.js", detailInput);
  const detailWrap = await exec("detail.js", [detailInput]);
  if (onProgress) await onProgress("detail", detailWrap);
  if (detailWrap.log) { logger.log("[LOG] " + detailWrap.log); }
  if (detailWrap.exception) { return errOut({ home: homeWrap, gen: genWrap, detail: detailWrap }); }
  const detailResult = detailWrap.data;
  if (!detailResult || !detailResult.data) {
    throw new Error("detail.js: No data");
  }
  logger.log(formatResult("[detail.js]", detailResult));

  let tocInput = detailInput;
  const pageJsPath = path.join(form.folderPath, "src", "page.js");
  let pageWrap = null;
  if (await pathExists(pageJsPath)) {
    logger.log("=== page.js ===");
    addRecord("page.js", detailInput);
    pageWrap = await exec("page.js", [detailInput]);
    if (onProgress) await onProgress("page", pageWrap);
    if (pageWrap.log) { logger.log("[LOG] " + pageWrap.log); }
    if (pageWrap.exception) { return errOut({ home: homeWrap, gen: genWrap, detail: detailWrap, page: pageWrap }); }
    const pageResult = pageWrap.data;
    if (!pageResult || !pageResult.data || pageResult.data.length === 0) {
      throw new Error("page.js: No data");
    }
    logger.log(formatResult("[page.js]", pageResult));
    const firstPage = pageResult.data[0];
    tocInput = typeof firstPage === "string" ? firstPage : (firstPage.url || firstPage.link || detailInput);
  }

  logger.log("=== toc.js ===");
  addRecord("toc.js", tocInput);
  const tocWrap = await exec("toc.js", [tocInput]);
  if (onProgress) await onProgress("toc", tocWrap);
  if (tocWrap.log) { logger.log("[LOG] " + tocWrap.log); }
  if (tocWrap.exception) { return errOut({ home: homeWrap, gen: genWrap, detail: detailWrap, page: pageWrap, toc: tocWrap }); }
  const tocResult = tocWrap.data;
  if (!tocResult || !tocResult.data || tocResult.data.length === 0) {
    throw new Error("toc.js: No data");
  }
  logger.log(formatResult("[toc.js]", tocResult));

  const firstToc = tocResult.data[0];
  let chapInput = typeof firstToc === "string" ? firstToc : (firstToc.url || firstToc.link);
  if (firstToc && firstToc.host && typeof chapInput === "string" && !chapInput.startsWith("http")) {
    chapInput = `${firstToc.host}/${chapInput.startsWith("/") ? chapInput.substring(1) : chapInput}`;
  }
  logger.log("=== chap.js ===");
  addRecord("chap.js", chapInput);
  const chapWrap = await exec("chap.js", [chapInput]);
  if (onProgress) await onProgress("chap", chapWrap);
  if (chapWrap.log) { logger.log("[LOG] " + chapWrap.log); }
  if (chapWrap.exception) { return errOut({ home: homeWrap, gen: genWrap, detail: detailWrap, page: pageWrap, toc: tocWrap, chap: chapWrap }); }
  const chapResult = chapWrap.data;
  if (!chapResult || !chapResult.data) {
    throw new Error("chap.js: No data");
  }
  logger.log(formatResult("[chap.js]", chapResult));

  logger.log("=== Test All Complete ===");
  return {
    response: { home: homeWrap, gen: genWrap, detail: detailWrap, page: pageWrap, toc: tocWrap, chap: chapWrap },
    runRecords: runRecords.reverse()
  };
}

class VbookTesterViewProvider {
  constructor(context, logger) {
    this.context = context;
    this.logger = logger;
    this._view = undefined;
  }

  resolveWebviewView(webviewView, context, _token) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.context.extensionUri]
    };

    webviewView.webview.html = getWebviewHtml(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (message) => {
      await this.handleMessage(message);
    });

    void this.postInit();
  }

  async handleMessage(message) {
    if (!this._view) {
      return;
    }

    const form = message.form || {};
    try {
      if (message.type === "showTerminal") {
        this.logger.show();
        return;
      }

      if (message.type === "saveState") {
        await saveState(this.context, form);
        return;
      }

      if (message.type === "cacheArgs") {
        await saveState(this.context, form);
        await saveArgsCache(this.context, form);
        return;
      }

      if (message.type === "loadParams") {
        try {
          const srcPath = path.join(message.folderPath, "src");
          const params = await collectScriptParams(srcPath);
          if (this._view) {
            await this._view.webview.postMessage({
              type: "updateParams",
              folderPath: message.folderPath,
              params
            });
          }
        } catch { }
        return;
      }

      validateForm(message.type, form);
      await saveState(this.context, form);
      await saveArgsCache(this.context, form);

      if (message.type === "run") {
        const isLegacy = form.apiMode === "old";
        const result = isLegacy
          ? await runLegacyTest(form, this.logger)
          : await runTest(form, this.logger);
        const history = await pushHistory(this.context, {
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
          folderPath: form.folderPath
        });
        await this.postHistoryUpdated(history);
        await this.postResult(result.response);
        return;
      }

      if (message.type === "install") {
        const isLegacy = form.apiMode === "old";
        const result = isLegacy
          ? await runLegacyInstall(form, this.logger)
          : await installExtension(form, this.logger);
        const history = await pushHistory(this.context, {
          folderPath: form.folderPath
        });
        await this.postHistoryUpdated(history);
        await this.postResult(result.response);
        return;
      }

      if (message.type === "oneclick") {
        const result = await runOneclickTest(form, this.logger, async (step, res) => {
          if (!this._view) return;
          await this._view.webview.postMessage({
            type: "oneclickProgress",
            step,
            responseObj: res
          });
        });
        const history = await pushHistory(this.context, {
          folderPath: form.folderPath,
          runRecords: result.runRecords
        });
        await this.postHistoryUpdated(history);
        if (this._view) {
          await this._view.webview.postMessage({ type: "oneclickDone" });
        }
        return;
      }
    } catch (error) {
      const text = error instanceof Error ? error.message : String(error);
      this.logger.show();
      this.logger.log(`[ERROR] ${text}`);
      if (this._view) {
        this._view.webview.postMessage({ type: "error", text });
      }
    }
  }

  async postResult(response, isOneclick = false) {
    if (!this._view) {
      return;
    }

    if (isOneclick) {
      await this._view.webview.postMessage({
        type: "oneclickResult",
        responseObj: response
      });
    } else {
      await this._view.webview.postMessage({
        type: "result",
        responseObj: response,
        responseText: JSON.stringify(response, null, 2)
      });
    }
  }

  async postHistoryUpdated(history) {
    if (!this._view) {
      return;
    }

    await this._view.webview.postMessage({ type: "historyUpdated", history });
  }

  async postInit() {
    if (!this._view) {
      return;
    }

    const savedState = getStoredState(this.context);
    const history = getStoredHistory(this.context);
    const formCache = getStoredFormCache(this.context);
    const cachedFolders = this.context.workspaceState.get("vbookTester.foldersCache") || [];

    // Gửi ngay data cũ để webview render khung nhanh
    await this._view.webview.postMessage({
      type: "init",
      state: savedState,
      history,
      folders: cachedFolders,
      formCache
    });

    // Chạy ngầm: Quét thư mục
    const folders = await collectExtensionFolders();
    await this.context.workspaceState.update("vbookTester.foldersCache", folders);

    const detectedFolder = await detectCurrentExtensionFolder();
    const folderPath = detectedFolder && folders.some((item) => item.path === detectedFolder)
      ? detectedFolder
      : folders.some((item) => item.path === savedState.folderPath)
        ? savedState.folderPath
        : (folders[0] ? folders[0].path : "");
    const selectedFolder = folders.find((item) => item.path === folderPath);
    
    // Tải thông số script của folder đang chọn
    if (selectedFolder) {
      try {
        const srcPath = path.join(selectedFolder.path, "src");
        selectedFolder.scriptParams = await collectScriptParams(srcPath);
      } catch {}
    }

    const detectedScript = selectedFolder
      ? detectCurrentScriptForFolder(selectedFolder.path, selectedFolder.scripts)
      : "";
    const script = detectedScript
      || (selectedFolder && selectedFolder.scripts.includes(savedState.script) ? savedState.script : "")
      || (selectedFolder && selectedFolder.scripts[0])
      || "";
    const argsValues = getCachedArgsValues(this.context, folderPath, script);
    let argsText = getCachedArgsText(this.context, folderPath, script);
    let nextArgsValues = argsValues.length > 0 ? argsValues : [];

    if (nextArgsValues.length === 0) {
      if (savedState.folderPath === folderPath && savedState.script === script) {
        nextArgsValues = parseStoredArgsValues(savedState.argsValues);
        if (!argsText) argsText = String(savedState.argsText || "");
      }
    }

    if (nextArgsValues.length === 0) {
      const historyState = getStoredHistory(this.context);
      const normalizedPath = folderPath.toLowerCase().replace(/\\\\/g, "/");
      const match = historyState.recentRuns.find((r) => {
        const rPath = (r.folderPath || "").toLowerCase().replace(/\\\\/g, "/");
        return rPath === normalizedPath && r.script === script;
      });
      if (match) {
        nextArgsValues = parseStoredArgsValues(match.argsValues);
        if (!argsText) argsText = String(match.argsText || "");
      }
    }

    const finalState = await saveState(this.context, {
      folderPath,
      script,
      argsText,
      argsValues: nextArgsValues
    });

    await this._view.webview.postMessage({
      type: "init",
      state: finalState,
      history: getStoredHistory(this.context),
      folders,
      formCache: getStoredFormCache(this.context)
    });
  }

  async syncToActiveEditor() {
    if (!this._view) {
      return;
    }

    await this.postInit();
  }
}

function activate(context) {
  const logger = new TerminalLogger();
  context.subscriptions.push(logger);

  const provider = new VbookTesterViewProvider(context, logger);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("vbook-tester-view", provider)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("vbookTester.openPanel", async () => {
      // Dẫn hướng tới view container và tập trung vào view
      await vscode.commands.executeCommand("vbook-tester-view.focus");
    })
  );

  // Xoá cache khi workspace hoặc file thay đổi
  context.subscriptions.push(
    vscode.workspace.onDidChangeWorkspaceFolders(() => {
      invalidateFolderCache();
    })
  );
  context.subscriptions.push(
    vscode.workspace.onDidCreateFiles(() => { invalidateFolderCache(); })
  );
  context.subscriptions.push(
    vscode.workspace.onDidDeleteFiles(() => { invalidateFolderCache(); })
  );
  context.subscriptions.push(
    vscode.workspace.onDidRenameFiles(() => { invalidateFolderCache(); })
  );

  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(() => {
      void provider.syncToActiveEditor();
    })
  );
}

function deactivate() { }

module.exports = {
  activate,
  deactivate
};