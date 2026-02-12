import picocolors from "picocolors";
import figlet from "figlet";
import { constants } from "../index.js";

// We need to read package.json version, but internal packages might not be able to read their own package.json easily in all envs.
// ideally we pass version or read it. For now let's just use hardcoded or pass it in.
// Actually, genesis read it from "../../package.json".
// We can export a function that takes the version/name, or we can read our own.
// Let's make it generic to take name and version.

export function introScreen(name: string, version: string) {
  console.log();
  console.log(
    picocolors.cyan(
      figlet.textSync("MayR\nLabs", {
        font: "Graceful",
        horizontalLayout: "default",
        verticalLayout: "default",
        width: 80,
        whitespaceBreak: true,
      })
    )
  );
  console.log(picocolors.cyan(`${name} - v${version}`));
  console.log();
  console.log(constants.brand.FOOTER.js.replace(/\/\*\*|\*\/|\*/g, "").trim());
  console.log();
}
