import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import type { SkillCommandOptions } from '../types/index.js';
import {
    CLAUDE_COMMANDS_DIR,
    CODEX_FRONTMATTER_ALLOWED_KEYS,
    CODEX_PROMPTS_DIR,
    CURSOR_COMMANDS_DIR,
    CURSOR_FRONTMATTER_ALLOWED_KEYS,
    SKILLS_SOURCE_DIR,
} from '../utils/constants.js';
import { buildSkillFile, parseFrontmatter } from '../utils/frontmatter.js';
import { ensureDirectory, isDirectory, pathExists } from '../utils/fs.js';
import { logger } from '../utils/logger.js';

const SKILL_FILE_EXTENSION = '.md';

interface SkillDestination {
    label: string;
    directory: string;
    allowedKeys?: readonly string[];
}

// ปลายทางทั้ง 3 agent ต่อ 1 skill; allowedKeys undefined = เก็บ frontmatter ทุก key (Claude Code)
const SKILL_DESTINATIONS: readonly SkillDestination[] = [
    { label: 'Claude Code', directory: CLAUDE_COMMANDS_DIR },
    { label: 'Codex', directory: CODEX_PROMPTS_DIR, allowedKeys: CODEX_FRONTMATTER_ALLOWED_KEYS },
    { label: 'Cursor', directory: CURSOR_COMMANDS_DIR, allowedKeys: CURSOR_FRONTMATTER_ALLOWED_KEYS },
];

// แปลง skill กลางใน <target>/skills เป็น slash command ของ Claude Code, Codex, Cursor
export async function skillCommand(options: SkillCommandOptions): Promise<void> {
    const targetRootPath = resolve(options.targetPath);
    await validateTargetDirectory(targetRootPath);

    const skillsSourcePath = join(targetRootPath, SKILLS_SOURCE_DIR);
    await validateSkillsDirectory(skillsSourcePath);

    const skillNames = options.name
        ? [await resolveSingleSkill(skillsSourcePath, options.name)]
        : await resolveAllSkills(skillsSourcePath);

    for (const skillName of skillNames) {
        await installSkill(targetRootPath, skillsSourcePath, skillName);
    }

    logger.success(`Installed ${skillNames.length} skill(s) to Claude Code, Codex, and Cursor`);
}

// ตรวจสอบ target path เป็นโฟลเดอร์จริง
async function validateTargetDirectory(targetRootPath: string): Promise<void> {
    const targetExists = await pathExists(targetRootPath);
    if (!targetExists) {
        throw new Error(`Target path does not exist: ${targetRootPath}`);
    }

    const targetIsDirectory = await isDirectory(targetRootPath);
    if (!targetIsDirectory) {
        throw new Error(`Target path is not a directory: ${targetRootPath}`);
    }
}

// ตรวจสอบว่ามี skills/ อยู่จริงใน target
async function validateSkillsDirectory(skillsSourcePath: string): Promise<void> {
    const skillsDirectoryExists = await isDirectory(skillsSourcePath);
    if (!skillsDirectoryExists) {
        throw new Error(`skills directory not found: ${skillsSourcePath}`);
    }
}

// resolve ชื่อ skill เดียว พร้อม error ที่แสดงรายชื่อ skill ที่มีจริงถ้าไม่พบ
async function resolveSingleSkill(skillsSourcePath: string, name: string): Promise<string> {
    const skillFilePath = join(skillsSourcePath, `${name}${SKILL_FILE_EXTENSION}`);
    const skillFileExists = await pathExists(skillFilePath);

    if (!skillFileExists) {
        const availableSkills = await resolveAllSkills(skillsSourcePath);
        throw new Error(
            `Skill "${name}" not found in ${skillsSourcePath}. Available skills: ${availableSkills.join(', ') || 'none'}`,
        );
    }

    return name;
}

// resolve ชื่อ skill ทั้งหมดจากไฟล์ .md ใน skills/
async function resolveAllSkills(skillsSourcePath: string): Promise<string[]> {
    const entries = await readdir(skillsSourcePath, { withFileTypes: true });

    return entries
        .filter((entry) => entry.isFile() && entry.name.endsWith(SKILL_FILE_EXTENSION))
        .map((entry) => entry.name.slice(0, -SKILL_FILE_EXTENSION.length))
        .sort();
}

// แปลง skill 1 ตัวแล้วเขียนทับปลายทางทั้ง 3 agent เสมอ
async function installSkill(
    targetRootPath: string,
    skillsSourcePath: string,
    skillName: string,
): Promise<void> {
    const skillFilePath = join(skillsSourcePath, `${skillName}${SKILL_FILE_EXTENSION}`);
    const rawSkillFile = await readFile(skillFilePath, 'utf-8');
    const parsedSkillFile = parseFrontmatter(rawSkillFile);

    for (const destination of SKILL_DESTINATIONS) {
        const destinationDirectory = join(targetRootPath, destination.directory);
        const destinationFileName = `${skillName}${SKILL_FILE_EXTENSION}`;
        const destinationFilePath = join(destinationDirectory, destinationFileName);

        await ensureDirectory(destinationDirectory);
        await writeFile(destinationFilePath, buildSkillFile(parsedSkillFile, destination.allowedKeys));
        logger.success(`${destination.label}: ${join(destination.directory, destinationFileName)}`);
    }
}
