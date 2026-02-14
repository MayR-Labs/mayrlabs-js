import * as p from "@clack/prompts";
import color from "picocolors";
import { scaffoldTsPackage } from "./ts-package";

async function main() {
  console.clear();
  p.intro(`${color.bgCyan(color.black(" Scaffolder "))}`);

  const projectType = await p.select({
    message: "What do you want to scaffold?",
    options: [
      {
        value: "ts-package",
        label: "TS Package",
        hint: "Create a new TypeScript package",
      },
    ],
  });

  if (p.isCancel(projectType)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  if (projectType === "ts-package") {
    await scaffoldTsPackage();
  }

  p.outro(`Scaffolding complete!`);
}

main().catch(console.error);
