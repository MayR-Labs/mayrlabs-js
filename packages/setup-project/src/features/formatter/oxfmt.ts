import { installPackages } from "@/utils/pm";

export async function installOxfmt() {
  await installPackages(["oxfmt@latest"], true);
}

export async function configureOxfmtPlugins(plugins: string[]) {
  // No-op for now
}
