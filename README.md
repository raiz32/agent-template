# Agent Template

CLI สำหรับติดตั้งชุดเอกสารและ workflow ของ AI coding agent ลงใน project หรือ folder ใดก็ได้ โดยรองรับ JavaScript และ TypeScript frontend project เช่น Vue, React, Nuxt, Next และ Vite

ทุก target จะได้รับ:

- `AGENTS.md` และ `CLAUDE.md`
- `ai-doc/` สำหรับให้ AI เข้าใจรูปแบบการทำงานและบริบทของ project

หาก target มี `package.json` จะได้รับเพิ่ม:

- `scripts/build-check.mjs`
- script `build:check` ใน `package.json`

## Installation

ต้องใช้ Node.js 20 หรือใหม่กว่า โดยไม่จำเป็นต้องมี `package.json`

ติดตั้งลง project ปัจจุบัน:

```bash
npx @raiz32/agent-template install .
```

หรือใช้ pnpm:

```bash
pnpm dlx @raiz32/agent-template install .
```

## Usage

ระบุ target path ได้โดยตรง:

```bash
npx @raiz32/agent-template install ../my-project
npx @raiz32/agent-template update ../my-project
```

`install` จะตรวจ `package.json` ให้อัตโนมัติ: หากพบ จะ copy `scripts/build-check.mjs` และเพิ่ม `build:check` หากยังไม่มี; หากไม่พบ จะติดตั้งเฉพาะ instruction และ documentation โดยไม่เกิด error

ใช้ `--template-only` เมื่อต้องการติดตั้งเฉพาะ instruction และ documentation แม้ target จะมี `package.json`:

```bash
npx @raiz32/agent-template install ../my-folder --template-only
```

`update` ใช้กับ Node.js project ที่ติดตั้ง template แบบปกติแล้ว เพราะจะ update `scripts/build-check.mjs` และตรวจ `package.json`

ดูคำสั่งทั้งหมด:

```bash
npx @raiz32/agent-template --help
```

## Publish

package นี้ใช้ [MIT License](LICENSE)
