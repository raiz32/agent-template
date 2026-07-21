# Agent Template

CLI สำหรับติดตั้งชุดเอกสารและ workflow ของ AI coding agent ลงใน project หรือ folder ใดก็ได้ โดยรองรับ JavaScript และ TypeScript frontend project เช่น Vue, React, Nuxt, Next และ Vite

ทุก target จะได้รับ:

- `AGENTS.md` และ `CLAUDE.md`
- `ai-doc/` สำหรับให้ AI เข้าใจรูปแบบการทำงานและบริบทของ project
- `skills/` ชุด skill กลางที่มากับ template (copy เฉพาะตอน `install`, ไม่ sync ตอน `update` เพื่อไม่ทับ skill ที่ target แก้ไขเอง) — ดู [Skill](#skill)

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

เขียน skill กลางไว้ที่เดียว แล้วแปลงให้ **Claude Code**, **Codex** และ **Cursor** ใช้งานได้พร้อมกัน โดยแต่ละ agent เรียกใช้ต่างกันตามกลไกของตัวเอง (ดูตารางด้านล่าง)

### Quick start

1. สร้างไฟล์ต้นทางที่ `<target>/skills/<name>.md` เป็น flat YAML frontmatter (บรรทัดละ `key: value`, ไม่รองรับ nested) ตามด้วย markdown body:
  ```markdown
    ---
    description: Commit staged changes with a conventional message
    argument-hint: [message]
    ---

    # Commit

    ...
  ```
2. รันคำสั่งแปลง:
  ```bash
    npx @raiz32/agent-template skill ../my-project           # แปลงทุกไฟล์ .md ใน skills/
    npx @raiz32/agent-template skill ../my-project commit     # แปลงเฉพาะ skills/commit.md
  ```
    ระบุชื่อที่ไม่มีไฟล์อยู่จริง คำสั่งจะแสดง error พร้อมรายชื่อ skill ที่มีอยู่จริงให้เลือก
3. ถ้า target ยังไม่มีโฟลเดอร์ `skills/` เลย คำสั่งจะ copy ชุด `skills/` กลางที่มากับ template นี้ไปติดตั้งให้ก่อนอัตโนมัติ (เทียบเท่ากับที่ `install`/`update` ทำอยู่แล้ว — ใช้กรณี target ติดตั้งไว้ก่อนที่ `skills/` จะถูกเพิ่มเข้ามา หรือ `skills/` ถูกลบไปเอง) แล้วค่อยแปลงต่อให้เลย ไม่ต้องสร้างโฟลเดอร์เอง

`skill` เขียนทับไฟล์ปลายทางเดิมเสมอ ปลอดภัยที่จะรันซ้ำได้ทุกครั้งที่แก้ไขไฟล์ต้นทาง

### ปลายทางแต่ละ agent


| Agent       | ไฟล์ปลายทาง                               | Frontmatter ที่เก็บ                                | วิธีเรียกใช้                                                                |
| ----------- | ----------------------------------------- | -------------------------------------------------- | --------------------------------------------------------------------------- |
| Claude Code | `<target>/.claude/commands/<name>.md`     | ทุก key จากต้นทาง                                  | พิมพ์ `/<name>` เอง (slash command)                                         |
| Codex       | `<target>/.codex/skills/<name>/SKILL.md`  | `description` + `name: <name>` (เพิ่มให้อัตโนมัติ) | Codex เรียกใช้เองอัตโนมัติตามความเกี่ยวข้อง — ไม่มี slash command ให้พิมพ์  |
| Cursor      | `<target>/.cursor/skills/<name>/SKILL.md` | `description` + `name: <name>` (เพิ่มให้อัตโนมัติ) | Cursor เรียกใช้เองอัตโนมัติตามความเกี่ยวข้อง — ไม่มี slash command ให้พิมพ์ |


## Publish

package นี้ใช้ [MIT License](LICENSE)