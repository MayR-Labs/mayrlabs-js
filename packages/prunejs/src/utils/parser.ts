import fs from "fs-extra";
import path from "path";
import { PATTERNS, REGEX } from "./constants";
import { ExportInfo, NonExportedInfo } from "./types";

export function isComment(line: string): boolean {
  return (
    line.trim().startsWith("//") ||
    line.trim().startsWith("*") ||
    line.trim().startsWith("/*")
  );
}

export function shouldSkipName(name: string): boolean {
  return PATTERNS.SKIP.some((pattern) => pattern.test(name));
}

export function extractExports(
  filePath: string,
  projectRoot: string
): ExportInfo[] {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const relativePath = path.relative(projectRoot, filePath);
  const exports: ExportInfo[] = [];

  const addExport = (name: string, type: string, line: number) => {
    exports.push({
      name,
      type,
      file: relativePath,
      line,
      filePath,
      isUsed: false,
      category: "exported",
    });
  };

  for (let lineNum = 0; lineNum < lines.length; lineNum++) {
    const line = lines[lineNum];

    if (isComment(line)) continue;

    for (const { regex, type } of PATTERNS.EXPORT) {
      const matches = [...line.matchAll(regex)];
      for (const match of matches) {
        const name = match[1];
        addExport(name, type, lineNum + 1);
      }
    }

    const namedExportMatch = line.match(REGEX.NAMED_EXPORT);
    if (namedExportMatch) {
      const names = namedExportMatch[1]
        .split(",")
        .map((n) =>
          n
            .trim()
            .split(/\s+as\s+/)[0]
            .trim()
        )
        .filter((n) => n && !n.includes("*"));

      for (const name of names) {
        addExport(name, "const", lineNum + 1);
      }
    }

    if (line.includes("export default")) {
      const defaultFunctionMatch = line.match(REGEX.DEFAULT_FUNCTION);
      if (defaultFunctionMatch) {
        const name = defaultFunctionMatch[1];
        addExport(name, "default", lineNum + 1);
      }
    }
  }

  return exports;
}

export function extractNonExportedDeclarations(
  filePath: string,
  projectRoot: string
): NonExportedInfo[] {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const relativePath = path.relative(projectRoot, filePath);
  const declarations: NonExportedInfo[] = [];

  for (let lineNum = 0; lineNum < lines.length; lineNum++) {
    const line = lines[lineNum];

    if (isComment(line)) continue;
    if (line.includes("export")) continue;

    for (const { regex, type } of PATTERNS.NON_EXPORTED) {
      regex.lastIndex = 0;
      const matches = [...line.matchAll(regex)];
      for (const match of matches) {
        const name = match[1];
        if (shouldSkipName(name)) continue;
        declarations.push({
          name,
          type,
          file: relativePath,
          line: lineNum + 1,
          filePath,
          isUsed: false,
          category: "non-exported",
        });
      }
    }
  }

  return declarations;
}

export function extractImports(filePath: string): string[] {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const imports: Set<string> = new Set();

  for (const line of lines) {
    if (isComment(line)) continue;

    const namedImportMatch = line.match(REGEX.NAMED_IMPORT);
    if (namedImportMatch) {
      const names = namedImportMatch[1]
        .split(",")
        .map((n) =>
          n
            .trim()
            .split(/\s+as\s+/)
            .pop()
            ?.trim()
        )
        .filter((n) => n) as string[];
      names.forEach((name) => name && imports.add(name));
    }

    const defaultImportMatch = line.match(REGEX.DEFAULT_IMPORT);
    if (defaultImportMatch) {
      imports.add(defaultImportMatch[1]);
    }

    const namespaceImportMatch = line.match(REGEX.NAMESPACE_IMPORT);
    if (namespaceImportMatch) {
      imports.add(namespaceImportMatch[1]);
    }
  }

  const matches = content.matchAll(REGEX.IDENTIFIER);
  for (const match of matches) {
    imports.add(match[1]);
  }

  return Array.from(imports);
}
