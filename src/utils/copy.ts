import { copyFile, cp } from 'node:fs/promises';
import { dirname } from 'node:path';
import type { CopyItem } from '../types/index.js';
import { ensureDirectory } from './fs.js';

// copy item จาก template ไปยัง target path
export async function copyTemplateItem(item: CopyItem): Promise<void> {
    if (item.type === 'file') {
        await copyTemplateFile(item.sourcePath, item.targetPath);
        return;
    }

    await copyTemplateDirectory(item.sourcePath, item.targetPath);
}
// copy ไฟลเดี่ยว
async function copyTemplateFile(sourcePath: string, targetPath: string,): Promise<void> {
    const targetDirectory = dirname(targetPath);

    await ensureDirectory(targetDirectory);
    await copyFile(sourcePath, targetPath);
}
// copy ไดเรคทอรี่ แบบ recursive
async function copyTemplateDirectory(sourcePath: string, targetPath: string,): Promise<void> {
    await cp(sourcePath, targetPath, {
        recursive: true,
        force: true,
    });
}