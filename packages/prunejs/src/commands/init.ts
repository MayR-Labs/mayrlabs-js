import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { getDefaultConfig, CONFIG_FILE } from "@/utils/config";
import packageJson from "../../package.json";

interface InitOptions {
  force?: boolean;
}

export default async function initCommand(options: InitOptions) {
  console.log(chalk.blue("Initializing prunejs..."));

  const configPath = path.resolve(process.cwd(), CONFIG_FILE);
  const force = options && options.force;

  if (fs.existsSync(configPath) && !force) {
    console.log(chalk.yellow(`${CONFIG_FILE} already exists.`));
    console.log(chalk.red("Use --force to overwrite."));
    return;
  }

  if (fs.existsSync(configPath) && force) {
    console.log(chalk.yellow(`Overwriting ${CONFIG_FILE}...`));
  }

  const defaultConfig = getDefaultConfig();

  const configContent = `/**
 * PruneJS v${packageJson.version} Config
 *
 * For more information, visit https://github.com/YoungMayor/prunejs#configuration
 */
module.exports = ${JSON.stringify(defaultConfig, null, 2)};\n`;

  fs.writeFileSync(configPath, configContent);
  console.log(chalk.green(`Created ${CONFIG_FILE}`));

  console.log(chalk.blue("Initialization complete!"));
}
