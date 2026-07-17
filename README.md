# Agent Template

CLI สำหรับติดตั้งชุดเอกสารและ workflow ของ AI coding agent ลงใน Node.js project โดยรองรับ JavaScript และ TypeScript frontend project เช่น Vue, React, Nuxt, Next และ Vite

หลังติดตั้งแบบปกติ คุณจะได้รับ:

- `AGENTS.md` และ `CLAUDE.md`
- `ai-doc/` สำหรับ preferences, handbook และ project context
- `scripts/build-check.mjs`
- script `build:check` ใน `package.json`

## Installation

ต้องใช้ Node.js 20 หรือใหม่กว่า และ target project สำหรับการติดตั้งแบบปกติต้องมี `package.json`

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

`install` จะ copy template ทั้งหมด รวม `scripts/build-check.mjs` และเพิ่ม `build:check` หากยังไม่มี ส่วน `update` จะ backup `AGENTS.md` และ `CLAUDE.md` ก่อน update และจะไม่ทับ `ai-doc/preferences/` หรือ `ai-doc/project/`

หาก target folder ไม่มี `package.json` ให้ติดตั้งเฉพาะเอกสาร:

```bash
npx @raiz32/agent-template install ../my-folder --template-only
```

ดูคำสั่งทั้งหมด:

```bash
npx @raiz32/agent-template --help
```

## Development

```bash
pnpm install
pnpm build
pnpm dev install ../my-project
pnpm start --help
```

`dist/` เป็น generated output และ `prepack` จะเรียก build ก่อนสร้าง npm package เพื่อให้ CLI ที่ publish ตรงกับ source ล่าสุด

## Publish

package นี้ใช้ [MIT License](LICENSE)

```bash
npm login
npm whoami
pnpm build
npm pack --dry-run
npm publish --access public
```

ตรวจให้แน่ใจว่า npm account มีสิทธิ์ใช้ scope `@raiz32` ก่อน publish ครั้งแรก และเพิ่ม version ทุกครั้งก่อน publish release ถัดไป
