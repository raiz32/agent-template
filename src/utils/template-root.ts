import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
/**
 * คืนค่า Root Directory ของ Agent Framework
 *
 * โครงสร้างหลัง build:
 *
 * dist/
 *   cli.js
 *   commands/
 *   utils/
 *
 * จึงย้อนขึ้นมา 2 ชั้น
 */
export function getTemplateRoot(): string {
    const currentFile = fileURLToPath(import.meta.url);
    return resolve(dirname(currentFile), '..', '..');
}