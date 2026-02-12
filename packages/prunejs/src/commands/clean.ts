import fs from "fs-extra";
import path from "path";
import ora from "ora";
import inquirer from "inquirer";
import chalk from "chalk";
import { PRUNE_DIR, REPORT_DIR } from "@/utils/constants";

export default async function cleanCommand(subcommand?: string) {
  const pruneDir = path.resolve(process.cwd(), PRUNE_DIR, REPORT_DIR);

  if (!fs.existsSync(pruneDir)) {
    console.log(
      chalk.yellow("Reports directory does not exist. Nothing to clean.")
    );
    return;
  }

  let action = subcommand;

  if (!action) action = await promptForAction();

  if (action === "cancel") {
    console.log(chalk.red("Operation cancelled."));
    return;
  }

  const spinner = ora();

  try {
    switch (action) {
      case "all":
        cleanAll(pruneDir);

        break;

      case "fix":
      case "report":
        cleanReport(action, pruneDir);

        break;

      default:
        console.log(chalk.red(`Unknown subcommand: ${action}`));
        console.log("Available subcommands: fix, report, all");

        break;
    }
  } catch (error) {
    spinner.fail(chalk.red(`Failed to clean ${action}.`));
    console.error(error instanceof Error ? error.message : String(error));
  }
}

async function promptForAction(): Promise<string> {
  const answer = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "What would you like to clean?",
      choices: [
        { name: "Fix Reports (delete fix_*.md)", value: "fix" },
        { name: "Scan Reports (delete report_*.md)", value: "report" },
        { name: "All (delete reports directory)", value: "all" },
        { name: "Cancel", value: "cancel" },
      ],
    },
  ]);

  return answer.action;
}

function cleanAll(pruneDir: string) {
  const spinner = ora();

  spinner.start("Deleting reports directory...");
  fs.rmSync(pruneDir, { recursive: true, force: true });
  spinner.succeed(chalk.green("Successfully deleted reports directory."));
}

function cleanReport(action: string, pruneDir: string) {
  const spinner = ora();

  spinner.start(`Deleting ${action} reports...`);

  const files = fs.readdirSync(pruneDir);

  let deletedCount = 0;

  files.forEach((file) => {
    if (file.startsWith(`${action}_`) && file.endsWith(".md")) {
      fs.unlinkSync(path.join(pruneDir, file));
      deletedCount++;
    }
  });

  if (deletedCount > 0) {
    spinner.succeed(
      chalk.green(`Successfully deleted ${deletedCount} ${action} reports.`)
    );
  } else {
    spinner.info(chalk.yellow(`No ${action} reports found.`));
  }
}
