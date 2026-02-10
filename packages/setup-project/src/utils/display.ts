import pc from "picocolors";
import figlet from "figlet";
import packageJson from "../../package.json";

export function introScreen() {
  console.log();
  console.log(
    pc.cyan(
      figlet.textSync("MayR\nLabs", {
        font: "Graceful",
        horizontalLayout: "default",
        verticalLayout: "default",
        width: 80,
        whitespaceBreak: true,
      }),
    ),
  );
  console.log(pc.cyan(`@mayrlabs/setup-project v${packageJson.version}`));
  console.log();
}

export function showAbout() {
  introScreen();
  console.log(pc.bold("About:"));
  console.log(
    "  Interactive CLI to setup project tools like Husky, Prettier, ESLint, etc.",
  );
  console.log("");
  console.log(pc.bold("How to use:"));
  console.log(
    "  Run 'npx @mayrlabs/setup-project' and follow the interactive prompts.",
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
  console.log("  npx @mayrlabs/setup-project [command] [options]");
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
