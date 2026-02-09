import pc from "picocolors";
import figlet from "figlet";
import packageJson from "../../package.json";
import { intro } from "@clack/prompts";

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

  intro(pc.inverse(pc.bold(pc.cyan(" Welcome to the Project Setup Wizard "))));
}
