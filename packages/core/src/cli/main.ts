import { intro, outro, select } from "@clack/prompts";
import picocolors from "picocolors";
import open from "open";
import { introScreen } from "../utils/intro.js";
import { PACKAGES } from "../constants/packages.js";
import { BANNER, ABOUT } from "../constants/brand.js";
import packageJson from "../../package.json" with { type: "json" };

async function showPackages() {
  const selectedPackage = await select({
    message: "Select a package to view details:",
    options: [
      ...PACKAGES.map((pkg) => ({
        value: pkg,
        label: pkg.name,
        hint: pkg.description.slice(0, 50) + "...",
      })),
      { value: "back", label: "Example: Go Back" },
    ],
  });

  if (selectedPackage === "back") {
    return;
  }

  const pkg = selectedPackage as (typeof PACKAGES)[0];

  console.log(picocolors.bold(picocolors.cyan(`\n📦 ${pkg.name}`)));
  console.log(picocolors.dim(pkg.description));
  console.log();

  const action = await select({
    message: "What would you like to do?",
    options: [
      { value: "github", label: "View on GitHub" },
      { value: "npm", label: "View on NPM" },
      { value: "back", label: "Go Back" },
    ],
  });

  if (action === "github") {
    await open(
      `https://github.com/MayR-Labs/mayrlabs-js/tree/main/${pkg.path}`
    );
  } else if (action === "npm") {
    await open(`https://www.npmjs.com/package/${pkg.name}`);
  }
}

export async function main() {
  console.clear();

  introScreen(packageJson.name, packageJson.version);

  intro(picocolors.inverse(" MayR Labs CLI "));

  while (true) {
    const action = await select({
      message: "What would you like to do?",
      options: [
        { value: "github", label: "Visit Github" },
        { value: "website", label: "Visit Website" },
        { value: "packages", label: "View Packages" },
        { value: "about", label: "About MayR Labs" },
        { value: "exit", label: "Exit" },
      ],
    });

    if (action === "github") {
      await open("https://github.com/MayR-Labs");
      outro("Opened Github!");
    } else if (action === "website") {
      await open("https://mayrlabs.com");
      outro("Opened Website!");
    } else if (action === "packages") {
      await showPackages();
    } else if (action === "about") {
      console.log(picocolors.cyan(ABOUT));
      console.log(picocolors.dim(BANNER.js));
    } else if (action === "exit") {
      outro("Goodbye!");
      process.exit(0);
    }
  }
}
