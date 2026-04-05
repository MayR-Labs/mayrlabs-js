import fs from "node:fs";
import path from "node:path";
import { z } from "zod";

const shouldCreate = z.coerce
  .number()
  .default(0)
  .parse(process.env.CREATE_LOCAL_ENV);

if (!shouldCreate) process.exit(0);

const root = process.cwd();
const examplePath = path.join(root, ".env.example");
const localPath = path.join(root, ".env.local");

if (fs.existsSync(localPath)) {
  console.log(
    "[env] CI detected; .env.local already exists, leaving it alone.",
  );
  process.exit(0);
}

if (!fs.existsSync(examplePath)) {
  console.error("[env] CI detected but .env.example not found.");
  process.exit(1);
}

fs.copyFileSync(examplePath, localPath);
console.log("[env] CI detected; copied .env.example -> .env.local");
