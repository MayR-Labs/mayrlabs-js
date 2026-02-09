import fs from "fs-extra";
import path from "path";

const CONFIG_DIR = ".mayrlabs/setup-projects";
const CONFIG_FILE = "config.json";

export async function ensureConfigDir() {
  await fs.ensureDir(CONFIG_DIR);
  // Create a .gitignore inside the directory to ignore everything
  const gitignorePath = path.join(CONFIG_DIR, ".gitignore");
  if (!(await fs.pathExists(gitignorePath))) {
    await fs.outputFile(gitignorePath, "*\n");
  }
}

export async function saveConfig(config: any) {
  await ensureConfigDir();
  const configPath = path.join(CONFIG_DIR, CONFIG_FILE);
  await fs.writeJson(configPath, config, { spaces: 2 });
}

export async function readConfig(): Promise<any> {
  const configPath = path.join(CONFIG_DIR, CONFIG_FILE);
  if (await fs.pathExists(configPath)) {
    return await fs.readJson(configPath);
  }
  return null;
}

export function getConfigPath(): string {
  return path.join(process.cwd(), CONFIG_DIR, CONFIG_FILE);
}
