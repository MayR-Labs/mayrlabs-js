import picocolors from "picocolors";
import figlet from "figlet";

export function introScreen(
  name: string = "MayR Labs",
  version: string = "1.0.0"
) {
  console.log();
  console.log(
    picocolors.cyan(
      figlet.textSync("MayR Labs", {
        font: "Graceful",
        horizontalLayout: "default",
        verticalLayout: "default",
        width: 80,
        whitespaceBreak: true,
      })
    )
  );
  console.log();
  console.log(picocolors.cyan(`${"_".repeat(30)}${name} - v${version}`));
  console.log();
}
