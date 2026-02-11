import inquirer from "inquirer";
import { execSync } from "child_process";
import chalk from "chalk";
import ora from "ora";

export default async function globalCommand(subcommand?: string) {
  let action = subcommand;

  if (!action) {
    const answer = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message:
          "What would you like to do with the global @mayrlabs/prunejs package?",
        choices: [
          {
            name: "Install (npm install -g @mayrlabs/prunejs)",
            value: "install",
          },
          { name: "Update (npm update -g @mayrlabs/prunejs)", value: "update" },
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
      spinner.start("Installing @mayrlabs/prunejs globally...");
      execSync("npm install -g @mayrlabs/prunejs", { stdio: "inherit" });
      spinner.succeed(
        chalk.green("Successfully installed @mayrlabs/prunejs globally!")
      );
    } else if (action === "update") {
      spinner.start("Updating global @mayrlabs/prunejs...");
      execSync("npm update -g @mayrlabs/prunejs", { stdio: "inherit" });
      spinner.succeed(
        chalk.green("Successfully updated global @mayrlabs/prunejs!")
      );
    } else {
      console.log(chalk.red(`Unknown subcommand: ${action}`));
      console.log("Available subcommands: install, update");
    }
  } catch (error) {
    spinner.fail(chalk.red(`Failed to ${action} @mayrlabs/prunejs globally.`));
    console.error(error instanceof Error ? error.message : String(error));
  }
}
