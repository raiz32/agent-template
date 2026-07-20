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

`update` ใช้ได้กับ target ที่เคยติดตั้ง template แล้ว: หากมี `package.json` จะ update `scripts/build-check.mjs` และ `build:check`; หากไม่มี จะ update เฉพาะ instruction และ documentation

## Doctor

ตรวจสอบความพร้อมของ Agent Template ใน target project โดยไม่แก้ไขไฟล์ใด ๆ:

```bash
npx @raiz32/agent-template doctor .
npx @raiz32/agent-template doctor ../my-project
```

`doctor` ตรวจ `AGENTS.md`, `CLAUDE.md` และ `ai-doc/` เสมอ หาก target มี `package.json` จะตรวจเพิ่มว่า `scripts/build-check.mjs` และ script `build:check` ถูกตั้งค่าเป็น `node scripts/build-check.mjs` หรือไม่

- พบไฟล์หลักไม่ครบ: แสดง `FAIL` และคืน exit code `1`
- Node.js integration ไม่ครบ: แสดง `WARN` แต่คืน exit code `0`
- ตรวจครบ: แสดง `PASS` และคืน exit code `0`

ดูคำสั่งทั้งหมด:

```bash
npx @raiz32/agent-template --help
```

## Skill

แปลงไฟล์ skill กลางใน `skills/<name>.md` ของ target project ให้เป็น slash command สำหรับ Claude Code, Codex และ Cursor:

```bash
npx @raiz32/agent-template skill ../my-project
npx @raiz32/agent-template skill ../my-project commit
```

ไม่ระบุชื่อ skill จะแปลงทุกไฟล์ `.md` ใน `skills/`; ระบุชื่อ (เช่น `commit` ที่มาจาก `skills/commit.md`) จะแปลงเฉพาะ skill นั้น หากระบุชื่อที่ไม่มีไฟล์อยู่จริง หรือ target ไม่มีโฟลเดอร์ `skills/` เลย คำสั่งจะแสดง error

ไฟล์ต้นทางที่ `skills/<name>.md` เป็น flat YAML frontmatter (บรรทัดละ `key: value`, ไม่รองรับ nested) ตามด้วย markdown body เช่น

```markdown
---
description: Commit staged changes with a conventional message
argument-hint: [message]
---

# Commit

...
```

`skill` จะเขียนไฟล์ปลายทางทั้ง 3 ที่เสมอ (เขียนทับไฟล์เดิมถ้ามีอยู่แล้ว) โดยกรอง frontmatter ต่างกันตามปลายทาง:

- `.claude/commands/<name>.md` — เก็บ frontmatter ทุก key
- `.codex/prompts/<name>.md` — เก็บเฉพาะ key `description` และ `argument-hint`
- `.cursor/commands/<name>.md` — ตัด frontmatter ทิ้งทั้งหมด เหลือเฉพาะ markdown body

## Publish

package นี้ใช้ [MIT License](LICENSE)
