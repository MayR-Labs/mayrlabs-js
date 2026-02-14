import * as p from "@clack/prompts";
import color from "picocolors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { checkGitStatus } from "./git.js";
import { getPackages, selectPackages, confirmPin } from "./prompts.js";
import { deletePackages } from "./actions.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "../../");
const PACKAGES_DIR = path.join(ROOT_DIR, "packages");

async function main() {
  console.clear();
  p.intro(`${color.bgRed(color.white(" Cleaner "))}`);

  // 1. Check Git Status
  await checkGitStatus(ROOT_DIR);

  // 2. Select Packages
  const packages = getPackages(PACKAGES_DIR);
  if (packages.length === 0) {
    p.outro("No packages found to clean.");
    process.exit(0);
  }

  const selectedPackages = await selectPackages(packages);

  // 3. PIN Confirmation
  await confirmPin();

  // 4. Delete Packages
  deletePackages(ROOT_DIR, PACKAGES_DIR, selectedPackages);

  p.outro("Cleanup complete.");
}

main().catch(console.error);
