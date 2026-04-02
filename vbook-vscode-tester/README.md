# vBook VSCode Tester

VS Code extension for testing, building, and installing a vBook extension against a local vBook server.

## Features

- Open the tester from the editor title bar when the active file is `js`, `jsx`, `ts`, or `tsx`
- Show the tester in a panel beside the current editor
- Auto-detect the current vBook extension folder from the active file
- Auto-select the current script when the active file is inside `src/`
- Cache arguments by `extension + script`, so switching files restores the matching input
- Keep recent server URLs and recent runs
- Send requests to `/extension/test`, `/extension/build`, and `/extension/install`
- Print connection status, logs, and results to a dedicated VS Code terminal

## How It Works

The tester treats a folder as a valid vBook extension when it contains:

- `plugin.json`
- `src/`

When the panel is open and you switch to another file, the tester refreshes automatically:

- the extension folder changes with the active file
- the script changes with the active file in `src/`
- the cached argument list changes with that `extension + script`

## Run Locally

1. Open [vbook-extensions](D:/Projects/vbook-extensions) or [vbook-vscode-tester](D:/Projects/vbook-extensions/vbook-vscode-tester) in VS Code.
2. Press `F5` to launch an Extension Development Host.
3. In the new window, open a workspace that contains one or more vBook extension folders.
4. Open a `js`, `jsx`, `ts`, or `tsx` file inside the target extension.
5. Click the `vBook Test` icon in the editor title bar.
6. Use the panel on the right to run, build, or install the extension.

## Package Locally

Build a local `.vsix` package with:

```powershell
npx @vscode/vsce package --allow-missing-repository --no-rewrite-relative-links --skip-license
```

Then install it from:

- `Extensions: Install from VSIX...`

## Notes

- `icon.png` is optional and is sent when present in the target extension folder.
- Build output is saved as `plugin.zip` inside the selected extension folder.
