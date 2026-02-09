import { text, select, log } from "@clack/prompts";
import fs from "fs-extra";
import path from "path";
import pc from "picocolors";

export async function promptLicense(config: any) {
  log.message(pc.bgGreen(pc.black(" License Configuration ")));

  const name = await text({
    message: "License Holder Name:",
    placeholder: "John Doe",
    initialValue: config.authorName || "",
  });
  config.licenseName = name;

  const email = await text({
    message: "License Holder Email:",
    placeholder: "john@example.com",
  });
  config.licenseEmail = email;

  const website = await text({
    message: "License Holder Website:",
    placeholder: "https://example.com",
  });
  config.licenseWebsite = website;

  const type = (await select({
    message: "Select License Type:",
    options: [
      { value: "MIT", label: "MIT" },
      { value: "ISC", label: "ISC" },
      { value: "Apache-2.0", label: "Apache 2.0" },
      { value: "UNLICENSED", label: "UNLICENSED" },
    ],
  })) as string;
  config.licenseType = type;
}

export async function installLicense(config: any) {
  if (config.licenseType !== "UNLICENSED") {
    const year = new Date().getFullYear().toString();

    // __dirname is now available via CJS (native) or ESM (tsup shim)

    // Structure:
    // dist/index.js
    // dist/licenses/*.txt (copied via build script)

    // If running from dist/index.js, __dirname is dist.
    // We need dist/licenses.

    const templatePath = path.join(
      __dirname,
      "licenses",
      `${config.licenseType}.txt`,
    );

    if (await fs.pathExists(templatePath)) {
      let licenseContent = await fs.readFile(templatePath, "utf-8");
      licenseContent = licenseContent.replace(/{YEAR}/g, year);
      licenseContent = licenseContent.replace(/{HOLDER}/g, config.licenseName);
      licenseContent = licenseContent.replace(/{EMAIL}/g, config.licenseEmail);
      licenseContent = licenseContent.replace(
        /{WEBSITE}/g,
        config.licenseWebsite,
      );

      await fs.outputFile("LICENSE", licenseContent);
    } else {
      // Fallback if template missing - strict fallback or error?
      // Let's write a minimal fallback to avoid failure
      const simpleContent = `Copyright (c) ${year} ${config.licenseName}\nLicensed under ${config.licenseType}`;
      await fs.outputFile("LICENSE", simpleContent);
    }
  }

  // Update package.json
  if (await fs.pathExists("package.json")) {
    const pkg = await fs.readJson("package.json");
    pkg.license = config.licenseType;
    if (config.licenseName) {
      pkg.author = `${config.licenseName} <${config.licenseEmail}> (${config.licenseWebsite})`;
    }
    await fs.writeJson("package.json", pkg, { spaces: 2 });
  }
}
