import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { skillCommand } from '../src/commands/skill.js';

async function createTempTarget(): Promise<string> {
    return mkdtemp(join(tmpdir(), 'agent-template-skill-'));
}

async function writeSkillFile(targetPath: string, name: string, content: string): Promise<void> {
    const skillsDir = join(targetPath, 'skills');
    await mkdir(skillsDir, { recursive: true });
    await writeFile(join(skillsDir, `${name}.md`), content);
}

const SAMPLE_SKILL = `---
description: Prep a branch, commit changes, and open a draft PR
argument-hint: [message]
allowed-tools: Bash(git add:*)
---

Create a git commit with message: $ARGUMENTS
`;

test('skillCommand installs a single named skill to all three agent destinations', async () => {
    const targetPath = await createTempTarget();
    try {
        await writeSkillFile(targetPath, 'commit', SAMPLE_SKILL);

        await skillCommand({ targetPath, name: 'commit' });

        const claudeOutput = await readFile(join(targetPath, '.claude/commands/commit.md'), 'utf-8');
        const codexOutput = await readFile(join(targetPath, '.codex/prompts/commit.md'), 'utf-8');
        const cursorOutput = await readFile(join(targetPath, '.cursor/commands/commit.md'), 'utf-8');

        assert.match(claudeOutput, /allowed-tools: Bash\(git add:\*\)/);
        assert.doesNotMatch(codexOutput, /allowed-tools/);
        assert.match(codexOutput, /argument-hint: \[message\]/);
        assert.doesNotMatch(cursorOutput, /---/);
        assert.match(cursorOutput, /Create a git commit with message: \$ARGUMENTS/);
    } finally {
        await rm(targetPath, { recursive: true, force: true });
    }
});

test('skillCommand installs every skill when name is omitted', async () => {
    const targetPath = await createTempTarget();
    try {
        await writeSkillFile(targetPath, 'commit', SAMPLE_SKILL);
        await writeSkillFile(targetPath, 'review', SAMPLE_SKILL);

        await skillCommand({ targetPath });

        const claudeCommit = await readFile(join(targetPath, '.claude/commands/commit.md'), 'utf-8');
        const claudeReview = await readFile(join(targetPath, '.claude/commands/review.md'), 'utf-8');

        assert.ok(claudeCommit.length > 0);
        assert.ok(claudeReview.length > 0);
    } finally {
        await rm(targetPath, { recursive: true, force: true });
    }
});

test('skillCommand overwrites an existing destination file', async () => {
    const targetPath = await createTempTarget();
    try {
        await writeSkillFile(targetPath, 'commit', SAMPLE_SKILL);
        const claudeCommandsDir = join(targetPath, '.claude/commands');
        await mkdir(claudeCommandsDir, { recursive: true });
        await writeFile(join(claudeCommandsDir, 'commit.md'), 'stale content');

        await skillCommand({ targetPath, name: 'commit' });

        const claudeOutput = await readFile(join(claudeCommandsDir, 'commit.md'), 'utf-8');
        assert.doesNotMatch(claudeOutput, /stale content/);
    } finally {
        await rm(targetPath, { recursive: true, force: true });
    }
});

test('skillCommand throws when the skills directory does not exist', async () => {
    const targetPath = await createTempTarget();
    try {
        await assert.rejects(
            () => skillCommand({ targetPath }),
            /skills directory not found/,
        );
    } finally {
        await rm(targetPath, { recursive: true, force: true });
    }
});

test('skillCommand throws and lists available skills when the named skill is missing', async () => {
    const targetPath = await createTempTarget();
    try {
        await writeSkillFile(targetPath, 'commit', SAMPLE_SKILL);

        await assert.rejects(
            () => skillCommand({ targetPath, name: 'missing' }),
            /Available skills: commit/,
        );
    } finally {
        await rm(targetPath, { recursive: true, force: true });
    }
});
