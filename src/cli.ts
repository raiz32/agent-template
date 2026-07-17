#!/usr/bin/env node
import { installCommand } from "./commands/install.js";
import { updateCommand } from "./commands/update.js";
import { logger } from "./utils/logger.js";

function printHelp() {
    console.log(`
        Agent Template CLI
        
        Usage:
          myagent install <target-path>
          myagent install <target-path> [--template-only]
          myagent update <target-path>
        
        Commands:
          install    Install Agent Framework into any target directory
          update     Update framework files in an installed target directory
        
        Examples:
          pnpm tsx src/cli.ts install ../my-project
          pnpm tsx src/cli.ts update ../my-project
          node dist/cli.js install ../my-project
          node dist/cli.js update ../my-project
        `);
}

// main function ของ CLI 
// แยกเพื่อให้จัดการ async/await และ error handling
async function main(): Promise<void> {
    const [, , commandName, targetPath, ...commandOptions] = process.argv;
    if (!commandName || commandName === '--help' || commandName === '-h') {
        printHelp()
        return
    }

    if (commandName !== 'install' && commandName !== 'update') {
        throw new Error(`Unknown command: ${commandName}`);
    }
    if (!targetPath) {
        throw new Error(`Missing target path. Usage: myagent ${commandName} <target-path>`);
    }

    if (commandName === 'install') {
        await installCommand({
            targetPath,
            templateOnly: commandOptions.includes('--template-only'),
        });
        return;
    }

    await updateCommand({ targetPath });
}

main().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : 'Unknown error';

    logger.error(message);
    process.exitCode = 1;
});
