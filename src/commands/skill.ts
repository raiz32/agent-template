import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import type { SkillCommandOptions } from '../types/index.js';
import {
    AGENT_SKILL_FILE_NAME,
    AGENT_SKILL_FRONTMATTER_ALLOWED_KEYS,
    CLAUDE_COMMANDS_DIR,
    CODEX_SKILLS_DIR,
    CURSOR_SKILLS_DIR,
    SKILLS_SOURCE_DIR,
} from '../utils/constants.js';
import { copyTemplateItem } from '../utils/copy.js';
import { buildSkillFile, parseFrontmatter } from '../utils/frontmatter.js';
import { ensureDirectory, isDirectory, pathExists } from '../utils/fs.js';
import { logger } from '../utils/logger.js';
import { getTemplateRoot } from '../utils/template-root.js';

const SKILL_FILE_EXTENSION = '.md';

interface SkillDestination {
    label: string;
    directory: string;
    allowedKeys?: readonly string[];
    // ชื่อไฟล์ปลายทางเทียบกับ directory; ค่าเริ่มต้นคือ `<skillName>.md` (Claude Code)
    // Codex/Cursor Agent Skills ต้องเป็น `<skillName>/SKILL.md` ตาม spec (ชื่อโฟลเดอร์ต้องตรงกับ frontmatter `name`)
    resolveFileName?: (skillName: string) => string;
    // key:value เพิ่มเติมที่ปลายทางต้องใส่เอง เพราะไม่มีในไฟล์ต้นทาง (เช่น `name:` ของ Agent Skills)
    resolveExtraFrontmatterLines?: (skillName: string) => readonly string[];
}

// ปลายทางทั้ง 3 agent ต่อ 1 skill เขียนไว้ใน target project เสมอ (project-level ทั้งหมด)
// Codex และ Cursor ใช้ Agent Skills open standard เดียวกัน (name+description, auto-invoked)
// allowedKeys undefined = เก็บ frontmatter ทุก key (Claude Code)
const AGENT_SKILL_RESOLVE_FILE_NAME = (skillName: string): string => join(skillName, AGENT_SKILL_FILE_NAME);
const AGENT_SKILL_RESOLVE_EXTRA_FRONTMATTER_LINES = (skillName: string): readonly string[] => [`name: ${skillName}`];

const SKILL_DESTINATIONS: readonly SkillDestination[] = [
    { label: 'Claude Code', directory: CLAUDE_COMMANDS_DIR },
    {
        label: 'Codex',
        directory: CODEX_SKILLS_DIR,
        allowedKeys: AGENT_SKILL_FRONTMATTER_ALLOWED_KEYS,
        resolveFileName: AGENT_SKILL_RESOLVE_FILE_NAME,
        resolveExtraFrontmatterLines: AGENT_SKILL_RESOLVE_EXTRA_FRONTMATTER_LINES,
    },
    {
        label: 'Cursor',
        directory: CURSOR_SKILLS_DIR,
        allowedKeys: AGENT_SKILL_FRONTMATTER_ALLOWED_KEYS,
        resolveFileName: AGENT_SKILL_RESOLVE_FILE_NAME,
        resolveExtraFrontmatterLines: AGENT_SKILL_RESOLVE_EXTRA_FRONTMATTER_LINES,
    },
];

// แปลง skill กลางใน <target>/skills เป็น slash command ของ Claude Code, Codex, Cursor
export async function skillCommand(options: SkillCommandOptions): Promise<void> {
    const targetRootPath = resolve(options.targetPath);
    await validateTargetDirectory(targetRootPath);

    const skillsSourcePath = join(targetRootPath, SKILLS_SOURCE_DIR);
    await ensureSkillsDirectory(skillsSourcePath);

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

// ตรวจสอบว่ามี skills/ อยู่จริงใน target ถ้ายังไม่มีให้ copy ชุด skills/ กลางจาก template นี้ไปติดตั้งให้ก่อน
async function ensureSkillsDirectory(skillsSourcePath: string): Promise<void> {
    const skillsDirectoryExists = await isDirectory(skillsSourcePath);
    if (skillsDirectoryExists) {
        return;
    }

    const templateSkillsPath = join(getTemplateRoot(), SKILLS_SOURCE_DIR);
    const templateSkillsExists = await isDirectory(templateSkillsPath);
    if (!templateSkillsExists) {
        throw new Error(`skills directory not found: ${skillsSourcePath}`);
    }

    await copyTemplateItem({ sourcePath: templateSkillsPath, targetPath: skillsSourcePath, type: 'directory' });
    logger.success(`Copied skills/ template to ${skillsSourcePath}`);
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
        const destinationFileName = destination.resolveFileName
            ? destination.resolveFileName(skillName)
            : `${skillName}${SKILL_FILE_EXTENSION}`;
        const destinationFilePath = join(targetRootPath, destination.directory, destinationFileName);
        const extraFrontmatterLines = destination.resolveExtraFrontmatterLines?.(skillName);

        await ensureDirectory(join(destinationFilePath, '..'));
        await writeFile(
            destinationFilePath,
            buildSkillFile(parsedSkillFile, destination.allowedKeys, extraFrontmatterLines),
        );
        logger.success(`${destination.label}: ${join(destination.directory, destinationFileName)}`);
    }
}
