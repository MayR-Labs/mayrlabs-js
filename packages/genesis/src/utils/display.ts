import pc from "picocolors";
import packageJson from "../../package.json";
import { introScreen as introScreenCore } from "./intro.js";

export function introScreen() {
  introScreenCore(packageJson.name, packageJson.version);
}

export function showAbout() {
  introScreen();
  console.log(pc.bold("About:"));
  console.log(
    "  Interactive CLI to setup project tools like Husky, Prettier, ESLint, etc."
  );
  console.log("");
  console.log(pc.bold("How to use:"));
  console.log(
    "  Run 'npx @mayrlabs/genesis' and follow the interactive prompts."
  );
  console.log("");
}

export function showVisit() {
  console.log(pc.bold("Project Homepage:"));
  console.log(pc.underline(pc.cyan(packageJson.homepage)));
  console.log("");
}

export function showManual() {
  introScreen();
  console.log(pc.bold("Usage:"));
  console.log("  npx @mayrlabs/genesis [command] [options]");
  console.log("");
  console.log(pc.bold("Commands:"));
  console.log("  about              Show project details");
  console.log("  version            Show version information");
  console.log("  visit              Visit project homepage");
  console.log("  help               Show this help message");
  console.log("  configure [tool]   Configure a specific tool");
  console.log("  plugin [tool]      Manage plugins for tools");
  console.log("");
  console.log(pc.bold("Options:"));
  console.log("  -a, --about        Show project details");
  console.log("  -v, --version      Show version information");
  console.log("  -V, --visit        Visit project homepage");
  console.log("  -h, --help         Show this help message");
  console.log("");
}
