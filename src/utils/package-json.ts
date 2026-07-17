import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import {
    BUILD_CHECK_SCRIPT_NAME,
    BUILD_CHECK_SCRIPT_COMMAND,
    PACKAGE_JSON_FILE,
} from './constants.js'

interface PackageJson {
    scripts?: Record<string, string>
    [key: string]: unknown
}

// อ่าน package.json
export async function readPackageJson(targetPath: string): Promise<PackageJson> {
    const packageJsonPath = join(targetPath, PACKAGE_JSON_FILE)
    const fileContent = await readFile(packageJsonPath, 'utf-8')
    return JSON.parse(fileContent) as PackageJson
}
// เขียน package.json แบบ pretty format
export async function writePackageJson(targetPath: string, packageJson: PackageJson): Promise<void> {
    const packageJsonPath = join(targetPath, PACKAGE_JSON_FILE);
    const formattedJson = `${JSON.stringify(packageJson, null, 2)}\n`;
    await writeFile(packageJsonPath, formattedJson, 'utf-8');
}
// เพิ่ม script build:check ถ้าไม่มี
export function addBuildCheckScript(packageJson: PackageJson): boolean {
    packageJson.scripts ??= {};
    if (packageJson.scripts[BUILD_CHECK_SCRIPT_NAME]) {
        return false;
    }

    packageJson.scripts[BUILD_CHECK_SCRIPT_NAME] = BUILD_CHECK_SCRIPT_COMMAND;
    return true;
}