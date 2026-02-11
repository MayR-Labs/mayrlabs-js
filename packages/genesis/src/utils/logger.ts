import fs from "fs-extra";
import path from "path";

const LOG_DIR = ".mayrlabs/setup-project";
const ERRORS_DIR = path.join(LOG_DIR, "errors");

export async function logError(error: unknown): Promise<string> {
  try {
    await fs.ensureDir(ERRORS_DIR);

    const gitignorePath = path.join(LOG_DIR, ".gitignore");

    if (!(await fs.pathExists(gitignorePath))) {
      await fs.outputFile(gitignorePath, "*\n");
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const logFile = path.join(ERRORS_DIR, `log-${timestamp}.txt`);

    const errorMessage =
      error instanceof Error ? error.stack || error.message : String(error);

    const logContent = `Timestamp: ${new Date().toISOString()}\n\nError:\n${errorMessage}\n`;

    await fs.outputFile(logFile, logContent);
    return logFile;
  } catch (e) {
    console.error("Failed to log error:", e);
    return "";
  }
}
