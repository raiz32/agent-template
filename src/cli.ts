#!/usr/bin/env node
import { installCommand } from "./commands/install.js";
import { updateCommand } from "./commands/update.js";
import { doctorCommand } from "./commands/doctor.js";
import { skillCommand } from "./commands/skill.js";
import { logger } from "./utils/logger.js";

function printHelp() {
    console.log(`
        Agent Template CLI

        Usage:
          myagent install <target-path>
          myagent install <target-path> [--template-only]
          myagent install <target-path> [--skill]
          myagent update <target-path>
          myagent doctor <target-path>
          myagent skill <target-path> [name]

        Commands:
          install    Install Agent Framework into any target directory
                     --skill converts all skills/*.md into Claude Code, Codex, and Cursor slash commands right after install
          update     Update framework files in an installed target directory
          doctor     Check whether an installed target is complete and configured
          skill      Convert skills/<name>.md into Claude Code, Codex, and Cursor slash commands

        Examples:
          pnpm tsx src/cli.ts install ../my-project
          pnpm tsx src/cli.ts install ../my-project --skill
          pnpm tsx src/cli.ts update ../my-project
          pnpm tsx src/cli.ts doctor ../my-project
          pnpm tsx src/cli.ts skill ../my-project
          pnpm tsx src/cli.ts skill ../my-project commit
          node dist/cli.js install ../my-project
          node dist/cli.js update ../my-project
          node dist/cli.js doctor ../my-project
          node dist/cli.js skill ../my-project
        `);
}

async function main(): Promise<void> {
    const [, , commandName, targetPath, ...commandOptions] = process.argv;
    if (!commandName || commandName === '--help' || commandName === '-h') {
        printHelp()
        return
    }

    if (commandName !== 'install' && commandName !== 'update' && commandName !== 'doctor' && commandName !== 'skill') {
        throw new Error(`Unknown command: ${commandName}`);
    }
    if (!targetPath) {
        throw new Error(`Missing target path. Usage: myagent ${commandName} <target-path>`);
    }

    if (commandName === 'install') {
        await installCommand({
            targetPath,
            templateOnly: commandOptions.includes('--template-only'),
            skill: commandOptions.includes('--skill'),
        });
        return;
    }

    if (commandName === 'update') {
        await updateCommand({ targetPath });
        return;
    }

    if (commandName === 'skill') {
        await skillCommand({ targetPath, name: commandOptions[0] });
        return;
    }

    await doctorCommand({ targetPath });
}

main().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : 'Unknown error';

    logger.error(message);
    process.exitCode = 1;
});
