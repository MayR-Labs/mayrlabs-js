import * as p from "@clack/prompts";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import { promptPackageDetails } from "./prompts.js";
import {
  createPackageJson,
  createTsConfig,
  createReadme,
  createLicense,
  createSrcFiles,
  createTsdownConfig,
  createVitestConfig,
} from "./generators.js";
import { setupPlayground } from "./playground.js";
import { PackageOptions } from "./types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "../../../");
const PACKAGES_DIR = path.join(ROOT_DIR, "packages");

export async function scaffoldTsPackage() {
  const options = await promptPackageDetails(PACKAGES_DIR);

  if (p.isCancel(options)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  // Type guard/assertion since isCancel check handles the symbol
  const pkgOptions = options as PackageOptions;
  const { name, access, description, license, author, type } = pkgOptions;
  const packageDir = path.join(PACKAGES_DIR, name);
  const namePrefix = access === "published" ? "@mayrlabs" : "@repo";

  const packageName = `${namePrefix}/${name}`;

  const s = p.spinner();
  s.start("Creating package structure...");

  try {
    // Create folder
    fs.mkdirSync(packageDir, { recursive: true });

    // Init npm
    execSync("npm init -y", { cwd: packageDir, stdio: "ignore" });

    // Generate files
    createPackageJson(packageDir, pkgOptions);
    createTsConfig(packageDir);
    createReadme(packageDir, name, description);
    createLicense(packageDir, license, author);
    createSrcFiles(packageDir, type, packageName);
    createTsdownConfig(packageDir);
    createVitestConfig(packageDir);

    // Setup playground
    setupPlayground(ROOT_DIR, name, packageName);

    s.message("Installing dependencies...");

    // Install dependencies
    const devDeps = [
      "vitest@latest",
      "typescript@latest",
      "tsx@latest",
      "tsdown@latest",
      "@vitest/coverage-v8@latest",
      "@types/node@latest",
      "eslint@latest",
    ];

    execSync(`npm install -D ${devDeps.join(" ")} -w ${packageName}`, {
      cwd: ROOT_DIR,
      stdio: "inherit",
    });

    s.stop("Package created successfully!");

    const nextSteps = [`cd packages/${name}`, `npm install`, `npm run build`];

    p.note(nextSteps.join("\n"), "Next steps:");
  } catch (error) {
    s.stop("Failed to create package");
    console.error(error);

    // Cleanup if possible? For now, leave it for manual inspection or retry
    // In a real scenario, you might want to rmdir the created folder if it's empty or failed early
  }
}
