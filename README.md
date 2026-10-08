# vBook Extensions

## AI skills

Skill phát triển extension vBook nằm tại
[`.agents/skills/vbook-extensions/`](.agents/skills/vbook-extensions/SKILL.md) theo chuẩn
Agent Skills. Đây là nguồn hướng dẫn chính cho việc tạo, sửa, kiểm thử, audit,
refactor, build và cài đặt extension.

Codex, Gemini CLI, Cursor và GitHub Copilot có thể tự nhận diện skill này. Claude
Code sử dụng entry tương thích tại
[`.claude/skills/vbook-extensions/SKILL.md`](.claude/skills/vbook-extensions/SKILL.md),
sau đó đọc cùng nguồn chuẩn trong `.agents`.

Có thể gọi trực tiếp bằng tên `vbook-extensions`, ví dụ:

```text
Dùng skill vbook-extensions để sửa extension mangadex.
```

API và contract hiện tại của extension được mô tả trong
[`extension-api.md`](extension-api.md).

## Extension tools

CLI dùng chung nằm tại
[`scripts/vbook.js`](.agents/skills/vbook-extensions/scripts/vbook.js). Công cụ kết
nối với vBook developer server để kiểm thử, build và cài đặt extension:

```bash
node .agents/skills/vbook-extensions/scripts/vbook.js connect
node .agents/skills/vbook-extensions/scripts/vbook.js test <extension> <script.js> [args...]
node .agents/skills/vbook-extensions/scripts/vbook.js testall [extension...]
node .agents/skills/vbook-extensions/scripts/vbook.js build <extension> [output.zip]
node .agents/skills/vbook-extensions/scripts/vbook.js install <extension>
```

Chi tiết REST API của developer server: [`extension_docs.md`](extension_docs.md).
