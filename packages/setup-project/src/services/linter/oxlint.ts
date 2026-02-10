import { installPackages } from "@/utils/pm";

export async function installOxlint() {
  await installPackages(["oxlint@latest"], true);
}

export async function configureOxlintPlugins(plugins: string[]) {
  // Oxlint configuration
}
