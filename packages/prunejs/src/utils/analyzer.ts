import fs from "fs-extra";
import path from "path";
import ignore from "ignore";
import { PruneConfig } from "./config";
import type { ExportInfo, NonExportedInfo, ReportData } from "./types";
import { getAllFiles, findBlockEnd } from "./file-system";
import {
  extractExports,
  extractNonExportedDeclarations,
  extractImports,
} from "./parser";

export { ExportInfo, NonExportedInfo, ReportData };

export class UnusedCodeFinder {
  projectRoot: string;
  private exports: Map<string, ExportInfo[]>;
  private nonExportedDeclarations: Map<string, NonExportedInfo>;
  private imports: Map<string, Set<string>>; // name -> Set<filePath>
  private excludeDirs: string[];
  private includeDirs: string[];
  private includeExtensions: string[];
  private ig: ReturnType<typeof ignore>;
  private skipExportsManager: ReturnType<typeof ignore>;

  constructor(projectRoot: string, config: PruneConfig) {
    this.projectRoot = projectRoot;
    this.exports = new Map();
    this.nonExportedDeclarations = new Map();
    this.imports = new Map(); // name -> Set<filePath>
    this.excludeDirs = config.excludeDirs || [];
    this.includeDirs = config.includeDirs || ["."];
    this.includeExtensions = config.includeExtensions || [];
    this.ig = ignore();
    this.skipExportsManager = ignore().add(config.skipExportsIn || []);

    if (config.excludeIgnoredFiles) {
      this.loadGitignore();
    }
  }

  loadGitignore() {
    const gitignorePath = path.join(this.projectRoot, ".gitignore");
    if (fs.existsSync(gitignorePath)) {
      try {
        const gitignoreContent = fs.readFileSync(gitignorePath, "utf-8");
        this.ig.add(gitignoreContent);
      } catch (error) {
        console.warn(
          "Failed to load .gitignore:",
          error instanceof Error ? error.message : String(error)
        );
      }
    }
  }

  async analyze(): Promise<ReportData> {
    let files: string[] = [];
    for (const dir of this.includeDirs) {
      const fullPath = path.resolve(this.projectRoot, dir);
      if (fs.existsSync(fullPath)) {
        if (fs.statSync(fullPath).isDirectory()) {
          files = files.concat(
            getAllFiles(
              fullPath,
              this.projectRoot,
              this.ig,
              this.excludeDirs,
              this.includeExtensions
            )
          );
        } else if (fs.statSync(fullPath).isFile()) {
          const ext = path.extname(fullPath);
          if (this.includeExtensions.includes(ext)) {
            files.push(fullPath);
          }
        }
      }
    }

    files = [...new Set(files)];

    for (const file of files) {
      const fileExports = extractExports(file, this.projectRoot);
      for (const info of fileExports) {
        if (!this.exports.has(info.name)) {
          this.exports.set(info.name, []);
        }
        this.exports.get(info.name)!.push(info);
      }

      const fileDeclarations = extractNonExportedDeclarations(
        file,
        this.projectRoot
      );
      for (const info of fileDeclarations) {
        const key = `${info.file}:${info.name}`;
        this.nonExportedDeclarations.set(key, info);
      }
    }

    for (const file of files) {
      const fileImports = extractImports(file);
      for (const name of fileImports) {
        if (!this.imports.has(name)) {
          this.imports.set(name, new Set());
        }
        this.imports.get(name)!.add(file);
      }
    }

    this.markUsedExports();
    this.markUsedNonExportedDeclarations();

    return this.generateReportData();
  }

  markUsedExports() {
    for (const [name, exportInfos] of this.exports.entries()) {
      const usageFiles = this.imports.get(name);

      if (!usageFiles) continue;

      exportInfos.forEach((info) => {
        const relativePath = path.relative(this.projectRoot, info.filePath);
        if (this.skipExportsManager.ignores(relativePath)) {
          info.isUsed = true;
          return;
        }

        let usedInOtherFile = false;
        for (const file of usageFiles) {
          if (file !== info.filePath) {
            usedInOtherFile = true;
            break;
          }
        }

        if (usedInOtherFile) {
          info.isUsed = true;
        } else {
          // Check for usage within the same file (excluding definition)
          const content = fs.readFileSync(info.filePath, "utf-8");
          const lines = content.split("\n");
          const otherLines = lines.filter((_, idx) => idx + 1 !== info.line);
          const otherContent = otherLines.join("\n");

          const usagePattern = new RegExp(`\\b${this.escapeRegex(name)}\\b`);
          if (usagePattern.test(otherContent)) {
            info.isUsed = true;
          }
        }
      });
    }
  }
  markUsedNonExportedDeclarations() {
    for (const [, declaration] of this.nonExportedDeclarations.entries()) {
      const content = fs.readFileSync(declaration.filePath, "utf-8");
      const lines = content.split("\n");
      const otherLines = lines.filter((_, idx) => idx + 1 !== declaration.line);
      const otherContent = otherLines.join("\n");
      const usagePattern = new RegExp(
        `\\b${this.escapeRegex(declaration.name)}\\b`
      );

      if (usagePattern.test(otherContent)) {
        declaration.isUsed = true;
      }
    }
  }

  escapeRegex(str: string) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  generateReportData(): ReportData {
    const unusedExports: ExportInfo[] = [];
    const unusedNonExported: NonExportedInfo[] = [];

    for (const exportInfos of this.exports.values()) {
      for (const info of exportInfos) {
        if (!info.isUsed) unusedExports.push(info);
      }
    }

    for (const declaration of this.nonExportedDeclarations.values()) {
      if (!declaration.isUsed) unusedNonExported.push(declaration);
    }

    return {
      totalExports: this.getTotalExports(),
      unusedExports,
      totalNonExported: this.nonExportedDeclarations.size,
      unusedNonExported,
    };
  }

  getTotalExports(): number {
    let total = 0;
    for (const exportInfos of this.exports.values()) {
      total += exportInfos.length;
    }
    return total;
  }

  findBlockEnd(filePath: string, startLine: number): number {
    return findBlockEnd(filePath, startLine);
  }
}
