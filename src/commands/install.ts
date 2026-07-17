import { join, resolve } from 'node:path';
import type { CopyItem, InstallCommandOptions } from '../types/index.js';
import { TEMPLATE_ITEMS, TEMPLATE_ONLY_ITEMS } from '../utils/constants.js';
import { copyTemplateItem } from '../utils/copy.js';
import { isDirectory, pathExists } from '../utils/fs.js';
import { logger } from '../utils/logger.js';
import {
    addBuildCheckScript,
    readPackageJson,
    writePackageJson,
} from '../utils/package-json.js';
import { getTemplateRoot } from '../utils/template-root.js';

// ติดตั้ง agent framework ลง target path
export async function installCommand(options: InstallCommandOptions): Promise<void> {
    const templateRootPath = getTemplateRoot()
    const targetRootPath = resolve(options.targetPath);
    const templateItems = options.templateOnly ? TEMPLATE_ONLY_ITEMS : TEMPLATE_ITEMS;

    logger.info(`Installing Agent Template to ${targetRootPath}`)
    if (options.templateOnly) {
        await validateTargetDirectory(targetRootPath);
    } else {
        await validateTargetProject(targetRootPath);
    }
    await copyTemplateFiles(templateRootPath, targetRootPath, templateItems);
    if (!options.templateOnly) {
        await setupPackageJson(targetRootPath);
    }
    logger.success('Agent Template installed successfully');
}

// ตรวจสอบ target path เป็นโฟลเดอร์จริง
async function validateTargetDirectory(targetRootPath: string): Promise<void> {
    const targetExists = await pathExists(targetRootPath);
    if (!targetExists) {
        throw new Error(`Target path does not exist: ${targetRootPath}`)
    }

    const targetIsDirectory = await isDirectory(targetRootPath);
    if (!targetIsDirectory) {
        throw new Error(`Target path is not a directory: ${targetRootPath}`)
    }
}

// ตรวจสอบ target path เป็นโฟลเดอร์โปรเจคจริง
async function validateTargetProject(targetRootPath: string): Promise<void> {
    await validateTargetDirectory(targetRootPath);

    const packageJsonExists = await pathExists(join(targetRootPath, 'package.json'));
    if (!packageJsonExists) {
        throw new Error(`package.json not found in target project: ${targetRootPath}`);
    }
}

// copy file , directory ของ agent template ไปยัง target path
async function copyTemplateFiles(
    templateRootPath: string,
    targetRootPath: string,
    templateItems: readonly CopyItem[],
): Promise<void> {
    for (const templateItem of templateItems) {
        const copyItem: CopyItem = {
            sourcePath: join(templateRootPath, templateItem.sourcePath),
            targetPath: join(targetRootPath, templateItem.targetPath),
            type: templateItem.type,
        }

        await copyTemplateItem(copyItem);
        logger.success(`Copied ${templateItem.targetPath}`);
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
