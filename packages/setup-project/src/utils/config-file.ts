import fs from "fs-extra";
import { prompts } from "@/utils/prompts";
import { withCancelHandling } from "@/utils/handle-cancel";
import path from "node:path";

export async function resolveConfigFile(
  toolName: string,
  candidates: string[],
): Promise<string> {
  // 1. Check existing
  for (const file of candidates) {
    if (await fs.pathExists(file)) return file;
  }

  // 2. Prompt
  const response = (await withCancelHandling(async () =>
    prompts.select({
      message: `Where do you want to store the ${toolName} config?`,
      options: candidates.map((c) => ({ value: c, label: c })),
      initialValue: candidates[0],
    }),
  )) as string;

  return response;
}

export async function writeConfig(filePath: string, config: any) {
  const ext = path.extname(filePath);

  if (ext === ".json" || ext === "") {
    await fs.writeJson(filePath, config, { spaces: 2 });
  } else if (ext === ".js" || ext === ".cjs") {
    const content = `module.exports = ${JSON.stringify(config, null, 2)};`;
    await fs.writeFile(filePath, content);
  } else if (ext === ".mjs") {
    const content = `export default ${JSON.stringify(config, null, 2)};`;
    await fs.writeFile(filePath, content);
  } else {
    // Default to JSON for unknown extensions if suitable, or error?
    // For now, let's assume JSON compatible if not JS/MJS/CJS
    await fs.writeJson(filePath, config, { spaces: 2 });
  }
}
