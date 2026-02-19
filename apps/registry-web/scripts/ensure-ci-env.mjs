import fs from "node:fs";
import path from "node:path";

const createLocalEnv = Boolean(process.env.CREATE_LOCAL_ENV);

console.log(
  "Create Local Env:",
  process.env.CREATE_LOCAL_ENV,
  process.env.CREATE_LOCAL_ENV2
);

if (!createLocalEnv) process.exit(0);

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
