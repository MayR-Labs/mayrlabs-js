import inquirer from "inquirer";
import { execSync } from "child_process";
import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import ora from "ora";

export default async function localCommand(subcommand?: string) {
  const packageJsonPath = path.resolve(process.cwd(), "package.json");
  if (!fs.existsSync(packageJsonPath)) {
    console.log(
      chalk.red("Error: package.json not found in the current directory.")
    );
    return;
  }

  let action = subcommand;

  if (!action) {
    const answer = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message:
          "What would you like to do with the local @mayrlabs/prunejs dependency?",
        choices: [
          {
            name: "Install (npm install -D @mayrlabs/prunejs)",
            value: "install",
          },
          { name: "Update (npm update @mayrlabs/prunejs)", value: "update" },
          { name: "Cancel", value: "cancel" },
        ],
      },
    ]);
    action = answer.action;
  }

  if (action === "cancel") {
    console.log(chalk.red("Operation cancelled."));
    return;
  }

  const spinner = ora();

  try {
    if (action === "install") {
      spinner.start("Installing @mayrlabs/prunejs as a dev dependency...");
      execSync("npm install -D @mayrlabs/prunejs", { stdio: "inherit" });
      spinner.succeed(
        chalk.green("Successfully installed @mayrlabs/prunejs locally!")
      );
    } else if (action === "update") {
      spinner.start("Updating local @mayrlabs/prunejs...");
      execSync("npm update @mayrlabs/prunejs", { stdio: "inherit" });
      spinner.succeed(
        chalk.green("Successfully updated local @mayrlabs/prunejs!")
      );
    } else {
      console.log(chalk.red(`Unknown subcommand: ${action}`));
      console.log("Available subcommands: install, update");
    }
  } catch (error) {
    spinner.fail(chalk.red(`Failed to ${action} @mayrlabs/prunejs locally.`));
    console.error(error instanceof Error ? error.message : String(error));
  }
}
