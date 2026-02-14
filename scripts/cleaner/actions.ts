import * as p from "@clack/prompts";
import fs from "node:fs";
import path from "node:path";

export function deletePackages(
  rootDir: string,
  packagesDir: string,
  packages: string[]
) {
  const s = p.spinner();
  s.start("Deleting packages...");

  for (const pkg of packages) {
    const pkgPath = path.join(packagesDir, pkg);
    const playgroundPath = path.join(
      rootDir,
      "playground",
      ".setup",
      `${pkg}-pg`
    );

    try {
      if (fs.existsSync(pkgPath)) {
        fs.rmSync(pkgPath, { recursive: true, force: true });
      }
      if (fs.existsSync(playgroundPath)) {
        fs.rmSync(playgroundPath, { recursive: true, force: true });
      }
    } catch (e) {
      p.log.error(`Failed to delete ${pkg}: ${e}`);
    }
  }

  s.stop("Packages deleted.");
}
