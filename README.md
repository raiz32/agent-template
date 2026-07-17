# Agent Template

CLI สำหรับติดตั้งชุดเอกสารและ workflow ของ AI coding agent ลงใน project ของคุณ

หลังติดตั้งแบบปกติ คุณจะได้รับ:

- `AGENTS.md` และ `CLAUDE.md`
- `ai-doc/` สำหรับ preferences, handbook และ project context
- `scripts/build-check.mjs`
- script `build:check` ใน `package.json`

## Requirements

- Node.js (พร้อม npm/npx)
- Git สำหรับดาวน์โหลด package จาก GitHub

## ติดตั้งลง Node.js project

target project ต้องมี `package.json` และควรมี script `build`

```bash
npx --yes --allow-git=all github:raiz32/agent-template install ../my-project
```

คำสั่งนี้จะ copy template ทั้งหมด รวม `scripts/build-check.mjs` และเพิ่ม `build:check` หากยังไม่มี

## อัปเดต template

ใช้กับ project ที่เคยติดตั้งแล้ว:

```bash
npx --yes --allow-git=all github:raiz32/agent-template update ../my-project
```

`update` จะ backup `AGENTS.md` เป็น `AGENTS.md.bak` และ `CLAUDE.md` เป็น `CLAUDE.md.bak` ก่อน update (หากมีไฟล์อยู่) และไม่ทับ `ai-doc/preferences/` หรือ `ai-doc/project/`

## ติดตั้งเฉพาะเอกสาร

หาก target เป็น folder ทั่วไปที่ไม่มี `package.json` ให้ใช้ `--template-only`:

```bash
npx --yes --allow-git=all github:raiz32/agent-template install ../my-folder --template-only
```

mode นี้ copy เฉพาะ `AGENTS.md`, `CLAUDE.md` และ `ai-doc/` โดยไม่ copy `scripts/` และไม่แก้ไข `package.json`

## Help และ version pinning

```bash
npx --yes --allow-git=all github:raiz32/agent-template --help
```

เมื่อมี release tag ให้ pin version สำหรับใช้งานจริง:

```bash
npx --yes --allow-git=all github:raiz32/agent-template#v0.1.0 install ../my-project
```
