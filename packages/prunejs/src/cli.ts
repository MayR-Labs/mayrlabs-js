#!/usr/bin/env node

import { Command } from "commander";
import inquirer from "inquirer";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import initCommand from "@/commands/init";
import scanCommand from "@/commands/scan";
import fixCommand from "@/commands/fix";
import globalCommand from "@/commands/global";
import localCommand from "@/commands/local";
import cleanCommand from "@/commands/clean";
import packageJson from "../package.json";

const program = new Command();

async function checkPackageJson() {
  const packageJsonPath = path.resolve(process.cwd(), "package.json");
  if (!fs.existsSync(packageJsonPath)) {
    console.log(
      chalk.yellow(
        "Warning: You do not seem to be running prunejs from the project's root directory."
      )
    );
    const { proceed } = await inquirer.prompt([
      {
        type: "confirm",
        name: "proceed",
        message: "Are you sure you want to proceed?",
        default: false,
      },
    ]);

    if (!proceed) {
      console.log(chalk.red("Operation cancelled."));
      process.exit(0);
    }
  }
}

program
  .name("prunejs")
  .description(
    "Scan JS/TS projects and detects unused files, functions, classes and exports"
  )
  .version(packageJson.version, "-v, --version");

program
  .command("version")
  .description("Show the version of prunejs")
  .action(() => {
    console.log(packageJson.version);
  });

program
  .command("init")
  .description("Initialize prunejs configuration")
  .option("-f, --force", "Overwrite existing configuration")
  .action(initCommand);

program
  .command("scan")
  .description("Scan the codebase for unused code")
  .action(scanCommand);

program
  .command("fix")
  .description("Remove unused code found by scan")
  .action(fixCommand);

program
  .command("global [subcommand]")
  .description("Install or update prunejs globally (install | update)")
  .action(globalCommand);

program
  .command("local [subcommand]")
  .description("Install or update prunejs locally (install | update)")
  .action(localCommand);

program
  .command("clean [subcommand]")
  .description("Clean reports (fix | report | all)")
  .action(cleanCommand);

// Interactive mode if no args
if (process.argv.length <= 2) {
  (async () => {
    const { command } = await inquirer.prompt([
      {
        type: "list",
        name: "command",
        message: "What would you like to do?",
        choices: [
          { name: "Scan for unused code", value: "scan" },
          { name: "Fix unused code", value: "fix" },
          { name: "Initialize configuration", value: "init" },
          { name: "Manage global package", value: "global" },
          { name: "Manage local dependency", value: "local" },
          { name: "Clean reports", value: "clean" },
          { name: "Exit", value: "exit" },
        ],
      },
    ]);

    if (command === "exit") {
      process.exit(0);
    }

    await checkPackageJson();

    if (command === "scan") await scanCommand();
    else if (command === "fix") await fixCommand();
    else if (command === "init") await initCommand({});
    else if (command === "global") await globalCommand();
    else if (command === "local") await localCommand();
    else if (command === "clean") await cleanCommand();
  })();
} else {
  program.hook("preAction", async (thisCommand, actionCommand) => {
    if (thisCommand.name() === "version" || actionCommand.name() === "help") {
      return;
    }
    await checkPackageJson();
  });

  program.parse(process.argv);
}
