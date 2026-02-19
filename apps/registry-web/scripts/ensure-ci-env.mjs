import fs from "node:fs";
import path from "node:path";

const isCI = Boolean(process.env.CI) || Boolean(process.env.GITHUB_ACTIONS);

if (!isCI) process.exit(0);

const root = process.cwd();
const examplePath = path.join(root, ".env.example");
const localPath = path.join(root, ".env.local");

if (fs.existsSync(localPath)) {
  console.log(
    "[env] CI detected; .env.local already exists, leaving it alone."
  );
  process.exit(0);
}

if (!fs.existsSync(examplePath)) {
  console.error("[env] CI detected but .env.example not found.");
  process.exit(1);
}

fs.copyFileSync(examplePath, localPath);
console.log("[env] CI detected; copied .env.example -> .env.local");
