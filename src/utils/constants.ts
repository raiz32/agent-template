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
    {
        sourcePath: 'skills',
        targetPath: 'skills',
        type: 'directory',
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
    {
        sourcePath: 'skills',
        targetPath: 'skills',
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
// รายชื่อไฟล์ที่ update สำหรับ folder ที่ไม่มี package.json
export const TEMPLATE_ONLY_UPDATE_ITEMS: readonly CopyItem[] = [
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
        sourcePath: 'ai-doc/handbook',
        targetPath: 'ai-doc/handbook',
        type: 'directory',
    },
] as const
export const PACKAGE_JSON_FILE = 'package.json'
export const AGENTS_MD_FILE = 'AGENTS.md'
export const AGENTS_MD_BACKUP_FILE = 'AGENTS.md.bak'
export const CLAUDE_MD_FILE = 'CLAUDE.md'
export const CLAUDE_MD_BACKUP_FILE = 'CLAUDE.md.bak'
// โฟลเดอร์ skill กลางใน target project
export const SKILLS_SOURCE_DIR = 'skills'
// ชื่อไฟล์ตาม Agent Skills open standard (Codex, Cursor): <target>/.<agent>/skills/<name>/SKILL.md
export const AGENT_SKILL_FILE_NAME = 'SKILL.md'
// โฟลเดอร์ปลายทางของแต่ละ agent
export const CLAUDE_COMMANDS_DIR = '.claude/commands'
// Codex Agent Skills (project-level, auto-invoked): <target>/.codex/skills/<name>/SKILL.md
export const CODEX_SKILLS_DIR = '.codex/skills'
// Cursor Agent Skills (project-level, auto-invoked): <target>/.cursor/skills/<name>/SKILL.md
export const CURSOR_SKILLS_DIR = '.cursor/skills'
// key ที่ SKILL.md frontmatter รองรับตาม Agent Skills spec: name (inject จาก skill name) + description
export const AGENT_SKILL_FRONTMATTER_ALLOWED_KEYS: readonly string[] = ['description']
