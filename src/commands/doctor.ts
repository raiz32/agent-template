import { join, resolve } from 'node:path';
import type { DoctorCommandOptions } from '../types/index.js';
import {
    AGENTS_MD_FILE,
    BUILD_CHECK_SCRIPT_COMMAND,
    BUILD_CHECK_SCRIPT_NAME,
    CLAUDE_MD_FILE,
    PACKAGE_JSON_FILE,
} from '../utils/constants.js';
import { isDirectory, isFile, pathExists } from '../utils/fs.js';
import { logger } from '../utils/logger.js';
import { getPackageScript, readPackageJson } from '../utils/package-json.js';

const AI_DOC_DIRECTORY = 'ai-doc';
const BUILD_CHECK_FILE_PATH = 'scripts/build-check.mjs';

// ตรวจความพร้อมของ Agent Template โดยไม่แก้ไขไฟล์ใน target project
export async function doctorCommand(options: DoctorCommandOptions): Promise<void> {
    const targetRootPath = resolve(options.targetPath);
    await validateTargetDirectory(targetRootPath);

    logger.info(`Checking Agent Template in ${targetRootPath}`);

    let hasFailure = false;
    let hasWarning = false;

    hasFailure = !(await checkRequiredFile(targetRootPath, AGENTS_MD_FILE)) || hasFailure;
    hasFailure = !(await checkRequiredFile(targetRootPath, CLAUDE_MD_FILE)) || hasFailure;
    hasFailure = !(await checkRequiredDirectory(targetRootPath, AI_DOC_DIRECTORY)) || hasFailure;

    const packageJsonPath = join(targetRootPath, PACKAGE_JSON_FILE);
    const packageJsonExists = await pathExists(packageJsonPath);

    if (!packageJsonExists) {
        logger.info('package.json not found; checked template-only project');
    } else if (!(await isFile(packageJsonPath))) {
        logger.error('package.json exists but is not a file');
        hasFailure = true;
    } else {
        logger.success('package.json found');

        const packageJson = await readPackageJson(targetRootPath);
        const buildCheckFileExists = await isFile(join(targetRootPath, BUILD_CHECK_FILE_PATH));

        if (buildCheckFileExists) {
            logger.success(`${BUILD_CHECK_FILE_PATH} found`);
        } else {
            logger.warn(`${BUILD_CHECK_FILE_PATH} not found. Run: myagent update ${targetRootPath}`);
            hasWarning = true;
        }

        const buildCheckScript = getPackageScript(packageJson, BUILD_CHECK_SCRIPT_NAME);
        if (!buildCheckScript) {
            logger.warn(`${BUILD_CHECK_SCRIPT_NAME} is missing. Recommended: ${BUILD_CHECK_SCRIPT_COMMAND}`);
            hasWarning = true;
        } else if (buildCheckScript !== BUILD_CHECK_SCRIPT_COMMAND) {
            logger.warn(
                `${BUILD_CHECK_SCRIPT_NAME} is "${buildCheckScript}". Recommended: ${BUILD_CHECK_SCRIPT_COMMAND}`,
            );
            hasWarning = true;
        } else {
            logger.success(`${BUILD_CHECK_SCRIPT_NAME} is configured correctly`);
        }
    }

    if (hasFailure) {
        logger.error(`FAIL: Agent Template health check failed. Run: myagent install ${targetRootPath}`);
        process.exitCode = 1;
        return;
    }

    if (hasWarning) {
        logger.warn('WARN: Agent Template health check completed with warnings');
        return;
    }

    logger.success('PASS: Agent Template health check passed');
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

async function checkRequiredFile(targetRootPath: string, fileName: string): Promise<boolean> {
    const fileExists = await isFile(join(targetRootPath, fileName));
    if (fileExists) {
        logger.success(`${fileName} found`);
        return true;
    }

    logger.error(`${fileName} not found`);
    return false;
}

async function checkRequiredDirectory(targetRootPath: string, directoryName: string): Promise<boolean> {
    const directoryExists = await isDirectory(join(targetRootPath, directoryName));
    if (directoryExists) {
        logger.success(`${directoryName} found`);
        return true;
    }

    logger.error(`${directoryName} not found`);
    return false;
}
