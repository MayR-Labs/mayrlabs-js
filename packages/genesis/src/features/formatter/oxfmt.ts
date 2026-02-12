import { installPackages } from "@/utils/pm";

export async function installOxfmt() {
  await installPackages(["oxfmt@latest"], true);
}
