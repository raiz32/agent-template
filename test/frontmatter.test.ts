import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildSkillFile, parseFrontmatter } from '../src/utils/frontmatter.js';

const SAMPLE_SKILL_FILE = `---
description: Prep a branch, commit changes, and open a draft PR
argument-hint: [message]
allowed-tools: Bash(git add:*)
---

Create a git commit with message: $ARGUMENTS
`;

test('parseFrontmatter extracts frontmatter lines and body', () => {
    const parsed = parseFrontmatter(SAMPLE_SKILL_FILE);

    assert.deepEqual(parsed.frontmatterLines, [
        'description: Prep a branch, commit changes, and open a draft PR',
        'argument-hint: [message]',
        'allowed-tools: Bash(git add:*)',
    ]);
    assert.equal(parsed.body, 'Create a git commit with message: $ARGUMENTS');
});

test('parseFrontmatter returns raw content as body when no frontmatter block exists', () => {
    const raw = 'Just a body, no frontmatter';
    const parsed = parseFrontmatter(raw);

    assert.deepEqual(parsed.frontmatterLines, []);
    assert.equal(parsed.body, raw);
});

test('buildSkillFile keeps every frontmatter key when allowedKeys is omitted', () => {
    const parsed = parseFrontmatter(SAMPLE_SKILL_FILE);
    const output = buildSkillFile(parsed);

    assert.equal(
        output,
        '---\ndescription: Prep a branch, commit changes, and open a draft PR\nargument-hint: [message]\nallowed-tools: Bash(git add:*)\n---\n\nCreate a git commit with message: $ARGUMENTS\n',
    );
});

test('buildSkillFile filters frontmatter to allowedKeys only', () => {
    const parsed = parseFrontmatter(SAMPLE_SKILL_FILE);
    const output = buildSkillFile(parsed, ['description', 'argument-hint']);

    assert.equal(
        output,
        '---\ndescription: Prep a branch, commit changes, and open a draft PR\nargument-hint: [message]\n---\n\nCreate a git commit with message: $ARGUMENTS\n',
    );
});

test('buildSkillFile strips frontmatter entirely when allowedKeys is empty', () => {
    const parsed = parseFrontmatter(SAMPLE_SKILL_FILE);
    const output = buildSkillFile(parsed, []);

    assert.equal(output, 'Create a git commit with message: $ARGUMENTS\n');
});
