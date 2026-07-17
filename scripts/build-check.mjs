import { exec } from "node:child_process";
import { existsSync, unlinkSync, writeFileSync } from "node:fs";

const REPORT_FILE = "build-error.txt";
const MAX_BUFFER = 1024 * 1024 * 30;
const MAX_FALLBACK_LINES = 60;

const stripAnsi = (text) => text.replace(/\x1b\[[0-9;]*m/g, "");

// บรรทัดที่ถือเป็น "จุด error" โดยตรง — ไม่ดึง noise จาก progress / plugin banner
const ERROR_ANCHOR_PATTERNS = [
  /\berror TS\d+:/i,
  /:\d+:\d+\s*-\s*error\b/i,
  /\(\d+,\d+\):\s*error\b/i,
  /\berror during build\b/i,
  /\bTransform failed with \d+ error/i,
  /\bERROR:\s/,
  /\bModule not found\b/i,
  /\bCannot find module\b/i,
  /\bCould not resolve\b/i,
  /\bFailed to compile\b/i,
  /\bSyntaxError\b/,
  /\bTypeError\b/,
  /\bReferenceError\b/,
  /\bRollupError\b/i,
  /\bBuild failed\b/i,
  /\bhas no exported member\b/i,
  /\bis not assignable to\b/i,
  /\bdoes not exist on type\b/i,
  /\bProperty .+ does not exist\b/i,
  /\bUnexpected token\b/i,
  /\bParsing error\b/i,
  /\.(vue|ts|tsx|js|jsx|mjs|cjs):\d+(?::\d+)?(?:\s*[-:]\s*)?\s*(?:error|ERROR)/i,
];

const isCodeFrameLine = (line) =>
  /^\s*\d+\s*\|/.test(line) ||
  /^\s*>/.test(line) ||
  /^\s*\^+/.test(line) ||
  /^\s*~+/.test(line);

const isNoiseLine = (line) =>
  /^\s*(vite|rollup|esbuild|vue-tsc|transforming|rendering chunks|computing gzip|built in|✓|dist\/)/i.test(
    line,
  );

const normalizeBlock = (block) => stripAnsi(block).trim();

const collectErrorBlocks = (lines) => {
  const blocks = [];
  const seen = new Set();

  const addBlock = (startIndex) => {
    const anchor = lines[startIndex]?.trimEnd();
    if (!anchor || isNoiseLine(anchor)) return;

    const chunk = [anchor];
    let index = startIndex + 1;

    while (index < lines.length && chunk.length < 6) {
      const line = lines[index]?.trimEnd() ?? "";
      if (!line) {
        index += 1;
        continue;
      }
      if (isCodeFrameLine(line)) {
        chunk.push(line);
        index += 1;
        continue;
      }
      break;
    }

    const block = normalizeBlock(chunk.join("\n"));
    if (!block || seen.has(block)) return;

    seen.add(block);
    blocks.push(block);
  };

  lines.forEach((line, index) => {
    const plain = stripAnsi(line);
    const isAnchor = ERROR_ANCHOR_PATTERNS.some((pattern) => pattern.test(plain));
    if (isAnchor) addBlock(index);
  });

  return blocks;
};

const getErrorSummary = (block) => {
  const firstLine = block.split("\n").find(Boolean) ?? block;
  return firstLine.length > 120 ? `${firstLine.slice(0, 117)}...` : firstLine;
};

const formatErrorSection = (block, index, total) => {
  const step = index + 1;
  const divider = "=".repeat(70);

  return [
    divider,
    `ERROR ${step}/${total}`,
    divider,
    block,
  ].join("\n");
};

const formatReport = (blocks, rawOutput) => {
  if (blocks.length) {
    const total = blocks.length;
    const indexLines = blocks.map(
      (block, index) => `  ${index + 1}. ${getErrorSummary(block)}`,
    );

    const body = blocks
      .map((block, index) => formatErrorSection(block, index, total))
      .join("\n\n");

    return [
      `BUILD FAIL — ${total} issue(s)`,
      "",
      "Index:",
      ...indexLines,
      "",
      body,
    ].join("\n");
  }

  const fallbackLines = rawOutput.split(/\r?\n/).slice(-MAX_FALLBACK_LINES);
  return [
    "BUILD FAIL — no structured errors matched; showing tail of build output",
    "",
    fallbackLines.join("\n"),
  ].join("\n");
};

exec("npm run build", { maxBuffer: MAX_BUFFER }, (err, stdout, stderr) => {
  if (!err) {
    if (existsSync(REPORT_FILE)) unlinkSync(REPORT_FILE);
    console.log("BUILD PASS");
    return;
  }

  const output = stripAnsi(`${stdout}\n${stderr}`).trim();
  const lines = output.split(/\r?\n/);
  const blocks = collectErrorBlocks(lines);
  const report = formatReport(blocks, output);

  writeFileSync(REPORT_FILE, report, "utf-8");
  const issueCount = blocks.length || "?";
  console.log(`BUILD FAIL — ${issueCount} issue(s) — see ${REPORT_FILE}`);
  process.exit(1);
});
