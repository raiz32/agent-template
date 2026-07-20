export interface ParsedSkillFile {
    frontmatterLines: string[];
    body: string;
}

const FRONTMATTER_DELIMITER = '---';

// แยก frontmatter (flat key:value เท่านั้น) ออกจาก body ของไฟล์ skill กลาง
export function parseFrontmatter(raw: string): ParsedSkillFile {
    const lines = raw.split(/\r?\n/);

    if (lines[0]?.trim() !== FRONTMATTER_DELIMITER) {
        return { frontmatterLines: [], body: raw };
    }

    const closingIndex = lines.findIndex(
        (line, index) => index > 0 && line.trim() === FRONTMATTER_DELIMITER,
    );

    if (closingIndex === -1) {
        return { frontmatterLines: [], body: raw };
    }

    const frontmatterLines = lines.slice(1, closingIndex).filter((line) => line.trim() !== '');
    const body = lines
        .slice(closingIndex + 1)
        .join('\n')
        .replace(/^\n+/, '')
        .replace(/\n+$/, '');

    return { frontmatterLines, body };
}

// ประกอบ frontmatter block กลับเป็น markdown string โดยกรองเฉพาะ key ที่อนุญาต
// allowedKeys undefined = เก็บทุก key, [] = ตัด frontmatter ทิ้งทั้งหมด (เช่น Cursor)
export function buildSkillFile(parsed: ParsedSkillFile, allowedKeys?: readonly string[]): string {
    const filteredLines = allowedKeys
        ? parsed.frontmatterLines.filter((line) => {
              const key = line.split(':')[0]?.trim();
              return key !== undefined && allowedKeys.includes(key);
          })
        : parsed.frontmatterLines;

    if (filteredLines.length === 0) {
        return `${parsed.body}\n`;
    }

    return `${FRONTMATTER_DELIMITER}\n${filteredLines.join('\n')}\n${FRONTMATTER_DELIMITER}\n\n${parsed.body}\n`;
}
