import * as p from "@clack/prompts";
import color from "picocolors";
import fs from "node:fs";
import path from "node:path";

export function getPackages(packagesDir: string): string[] {
  try {
    return fs.readdirSync(packagesDir).filter((file) => {
      return fs.statSync(path.join(packagesDir, file)).isDirectory();
    });
  } catch (e) {
    return [];
  }
}

export async function selectPackages(packages: string[]): Promise<string[]> {
  if (packages.length === 0) {
    return [];
  }

  const selectedPackages = await p.multiselect({
    message: "Select packages to remove (SPACE to select, ENTER to confirm)",
    options: packages.map((pkg) => ({ value: pkg, label: pkg })),
    required: true,
  });

  if (p.isCancel(selectedPackages)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  return selectedPackages as string[];
}

export async function confirmPin() {
  const pin = Math.floor(100000 + Math.random() * 900000).toString();
  const pinConfirmation = await p.text({
    message: `CONFIRMATION: Enter the PIN to confirm deletion: ${color.red(pin)}`,
    validate: (value) => {
      if (value !== pin) return "Incorrect PIN";
    },
  });

  if (p.isCancel(pinConfirmation)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }
}
