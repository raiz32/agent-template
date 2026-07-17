import { copyFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import type { CopyItem, UpdateCommandOptions } from '../types/index.js';
import {
    AGENTS_MD_BACKUP_FILE,
    AGENTS_MD_FILE,
    CLAUDE_MD_BACKUP_FILE,
    CLAUDE_MD_FILE,
    TEMPLATE_ONLY_UPDATE_ITEMS,
    UPDATE_ITEMS,
} from '../utils/constants.js';
import { copyTemplateItem } from '../utils/copy.js';
import { isDirectory, pathExists } from '../utils/fs.js';
import { logger } from '../utils/logger.js';
import {
    addBuildCheckScript,
    readPackageJson,
    writePackageJson,
} from '../utils/package-json.js';
import { getTemplateRoot } from '../utils/template-root.js';

// อัปเดต agent framework ใน target path โดยไม่ทับ preferences/project
export async function updateCommand(options: UpdateCommandOptions): Promise<void> {
    const templateRootPath = getTemplateRoot();
    const targetRootPath = resolve(options.targetPath);

    logger.info(`Updating Agent Template in ${targetRootPath}`);
    await validateTargetDirectory(targetRootPath);
    await ensureInstalled(targetRootPath);

    const packageJsonExists = await pathExists(join(targetRootPath, 'package.json'));
    const updateItems = packageJsonExists ? UPDATE_ITEMS : TEMPLATE_ONLY_UPDATE_ITEMS;

    if (!packageJsonExists) {
        logger.warn('package.json not found; updated instructions and documentation only');
    }

    await backupInstructionFiles(targetRootPath);
    await copyUpdateFiles(templateRootPath, targetRootPath, updateItems);
    if (packageJsonExists) {
        await setupPackageJson(targetRootPath);
    }
    logger.success('Agent Template updated successfully');
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

// ตรวจว่าเคย install แล้ว (มี AGENTS.md)
async function ensureInstalled(targetRootPath: string): Promise<void> {
    const agentsMdPath = join(targetRootPath, AGENTS_MD_FILE);
    const agentsMdExists = await pathExists(agentsMdPath);

    if (!agentsMdExists) {
        throw new Error(
            `AGENTS.md not found in target project. Run install first: myagent install ${targetRootPath}`,
        );
    }
}

// backup instruction files ที่มีอยู่ก่อน overwrite
async function backupInstructionFiles(targetRootPath: string): Promise<void> {
    const instructionFiles = [
        {
            fileName: AGENTS_MD_FILE,
            backupFileName: AGENTS_MD_BACKUP_FILE,
        },
        {
            fileName: CLAUDE_MD_FILE,
            backupFileName: CLAUDE_MD_BACKUP_FILE,
        },
    ];

    for (const instructionFile of instructionFiles) {
        const filePath = join(targetRootPath, instructionFile.fileName);
        const fileExists = await pathExists(filePath);

        if (!fileExists) {
            continue;
        }

        const backupPath = join(targetRootPath, instructionFile.backupFileName);
        await copyFile(filePath, backupPath);
        logger.success(`Backed up ${instructionFile.fileName} to ${instructionFile.backupFileName}`);
    }
}

// copy เฉพาะ UPDATE_ITEMS ไปยัง target
async function copyUpdateFiles(
    templateRootPath: string,
    targetRootPath: string,
    updateItems: readonly CopyItem[],
): Promise<void> {
    for (const updateItem of updateItems) {
        const copyItem: CopyItem = {
            sourcePath: join(templateRootPath, updateItem.sourcePath),
            targetPath: join(targetRootPath, updateItem.targetPath),
            type: updateItem.type,
        };

        await copyTemplateItem(copyItem);
        logger.success(`Updated ${updateItem.targetPath}`);
    }
}

// เพิ่ม build:check script ลงใน package.json ถ้ายังไม่มี
async function setupPackageJson(targetRootPath: string): Promise<void> {
    const packageJson = await readPackageJson(targetRootPath);
    const addedBuildCheckScript = addBuildCheckScript(packageJson);

    if (!addedBuildCheckScript) {
        logger.warn('build:check already exists, skipped package.json update');
        return;
    }

    await writePackageJson(targetRootPath, packageJson);
    logger.success('Added build:check to package.json');
}
