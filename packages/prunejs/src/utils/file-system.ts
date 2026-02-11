import fs from "fs-extra";
import path from "path";
import ignore from "ignore";

export function getAllFiles(
  dir: string,
  projectRoot: string,
  ig: ReturnType<typeof ignore>,
  excludeDirs: string[],
  includeExtensions: string[],
  files: string[] = []
): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(projectRoot, fullPath);

    if (ig.ignores(relativePath)) {
      continue;
    }

    if (entry.isDirectory()) {
      if (!excludeDirs.includes(entry.name)) {
        getAllFiles(
          fullPath,
          projectRoot,
          ig,
          excludeDirs,
          includeExtensions,
          files
        );
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (includeExtensions.includes(ext)) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

/**
 * Finds the end line of a code block starting at startLine.
 * Uses brace counting to handle nested blocks.
 * @param {string} filePath - Path to the file
 * @param {number} startLine - 1-indexed start line
 * @returns {number} - 1-indexed end line
 */
export function findBlockEnd(filePath: string, startLine: number): number {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  let braceCount = 0;
  let foundStart = false;

  for (let i = startLine - 1; i < lines.length; i++) {
    const line = lines[i];

    for (const char of line) {
      if (char === "{") {
        braceCount++;
        foundStart = true;
      } else if (char === "}") {
        braceCount--;
      }
    }

    if (foundStart && braceCount === 0) {
      return i + 1;
    }

    // Handle single line statements (no braces)
    if (!foundStart && line.trim().endsWith(";")) {
      return i + 1;
    }

    // Safety break for extremely long files or unbalanced braces
    if (foundStart && braceCount < 0) return i + 1;
  }

  return startLine; // Fallback if no block found
}
