import type { CopyItem } from "../types/index.js";
// script ที่ต้องเพิ่มลงใน package.json
export const BUILD_CHECK_SCRIPT_NAME = "build:check"
// คำสั่งของ build:check
export const BUILD_CHECK_SCRIPT_COMMAND = 'node scripts/build-check.mjs'
// รายชื่อไฟล์ที่จะถูก copy และทำ type safety โดยเอา CopyItem มาใช้จาก types/index.ts
export const TEMPLATE_ITEMS: readonly CopyItem[] = [
    {
        sourcePath: 'AGENTS.md',
        targetPath: 'AGENTS.md',
        type: 'file',
    },
    {
        sourcePath: 'CLAUDE.md',
        targetPath: 'CLAUDE.md',
        type: 'file',
    },
    {
        sourcePath: 'ai-doc',
        targetPath: 'ai-doc',
        type: 'directory',
    },
    {
        sourcePath: 'scripts/build-check.mjs',
        targetPath: 'scripts/build-check.mjs',
        type: 'file',
    },
] as const
// รายชื่อไฟล์ template สำหรับ folder ที่ไม่ใช่ Node.js project
export const TEMPLATE_ONLY_ITEMS: readonly CopyItem[] = [
    {
        sourcePath: 'AGENTS.md',
        targetPath: 'AGENTS.md',
        type: 'file',
    },
    {
        sourcePath: 'CLAUDE.md',
        targetPath: 'CLAUDE.md',
        type: 'file',
    },
    {
        sourcePath: 'ai-doc',
        targetPath: 'ai-doc',
        type: 'directory',
    },
] as const
// รายชื่อไฟล์ที่ update จะ sync (ไม่ทับทั้ง ai-doc/)
export const UPDATE_ITEMS: readonly CopyItem[] = [
    {
        sourcePath: 'AGENTS.md',
        targetPath: 'AGENTS.md',
        type: 'file',
    },
    {
        sourcePath: 'CLAUDE.md',
        targetPath: 'CLAUDE.md',
        type: 'file',
    },
    {
        sourcePath: 'scripts/build-check.mjs',
        targetPath: 'scripts/build-check.mjs',
        type: 'file',
    },
    {
        sourcePath: 'ai-doc/handbook',
        targetPath: 'ai-doc/handbook',
        type: 'directory',
    },
] as const
export const PACKAGE_JSON_FILE = 'package.json'
export const AGENTS_MD_FILE = 'AGENTS.md'
export const AGENTS_MD_BACKUP_FILE = 'AGENTS.md.bak'
