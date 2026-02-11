import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import ora from "ora";
import { loadConfig, validateConfig } from "@/utils/config";
import {
  UnusedCodeFinder,
  ReportData,
  ExportInfo,
  NonExportedInfo,
} from "@/utils/analyzer";

type UnusedItem = (ExportInfo | NonExportedInfo) & { action?: string };

export default async function fixCommand() {
  let spinner;
  try {
    const config = await loadConfig();
    await validateConfig(config);

    spinner = ora("Scanning for unused code to fix...").start();

    const projectRoot = process.cwd();
    const finder = new UnusedCodeFinder(projectRoot, config);

    const report: ReportData = await finder.analyze();

    const allUnused: UnusedItem[] = [
      ...report.unusedExports,
      ...report.unusedNonExported,
    ];

    if (allUnused.length === 0) {
      spinner.succeed("No unused code found to fix.");
      return;
    }

    spinner.text = `Found ${allUnused.length} unused items. Fixing...`;

    spinner.text = `Found ${allUnused.length} unused items. Fixing...`;

    const itemsByFile: Record<string, UnusedItem[]> = {};
    for (const item of allUnused) {
      if (!itemsByFile[item.filePath]) {
        itemsByFile[item.filePath] = [];
      }
      itemsByFile[item.filePath].push(item);
    }

    let fixedCount = 0;
    const fixLog: {
      file: string;
      line: number;
      name: string;
      type: string;
      action: string;
    }[] = [];

    for (const filePath of Object.keys(itemsByFile)) {
      const items = itemsByFile[filePath];

      // Sort by line number descending to avoid shifting issues
      items.sort((a, b) => b.line - a.line);

      const content = fs.readFileSync(filePath, "utf-8");
      const lines = content.split("\n");

      for (const item of items) {
        const startLine = item.line;
        const endLine = finder.findBlockEnd(filePath, startLine);

        const startIndex = startLine - 1;
        const endIndex = endLine - 1;

        if (
          startIndex >= 0 &&
          endIndex < lines.length &&
          startIndex <= endIndex
        ) {
          lines.splice(startIndex, endIndex - startIndex + 1);
          fixedCount++;
          fixLog.push({
            file: item.file,
            line: item.line,
            name: item.name,
            type: item.type,
            action: "Removed",
          });
        }
      }

      fs.writeFileSync(filePath, lines.join("\n"));
    }

    spinner.succeed(`Fixed ${fixedCount} unused items!`);

    const reportDir = path.join(projectRoot, ".prunejs");
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir);
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const reportPath = path.join(reportDir, `fix_${timestamp}.md`);

    let md = "# PruneJS Fix Report\n\n";
    md += `Generated: ${new Date().toLocaleString()}\n\n`;
    md += `Total items removed: ${fixedCount}\n\n`;
    md += "| File | Original Line | Type | Name |\n";
    md += "|------|---------------|------|------|\n";
    fixLog.forEach((item) => {
      md += `| ${item.file} | ${item.line} | ${item.type} | \`${item.name}\` |\n`;
    });

    fs.writeFileSync(reportPath, md);
    console.log(`\n📄 Fix report saved to: ${chalk.cyan(reportPath)}`);
  } catch (error) {
    if (spinner) spinner.fail("Fix failed");
    console.error(error);
  }
}
