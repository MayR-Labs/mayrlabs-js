import { installPackages } from "@/utils/pm";

export async function installOxlint() {
  await installPackages(["oxlint@latest"], true);
}
