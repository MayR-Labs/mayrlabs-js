import { text, select, log } from "@clack/prompts";
import fs from "fs-extra";
import path from "path";
import pc from "picocolors";
import { Config } from "@/config/config";
import { LICENSE_TYPE_OPTIONS } from "@/constants/options";
import { withCancelHandling } from "@/utils/handle-cancel";

export async function promptLicense(config: Config) {
  log.message(pc.bgGreen(pc.black(" License Configuration ")));

  const licenseConfig = config.get("license");

  licenseConfig.config.name = await withCancelHandling(async () =>
    text({
      message: "License Holder Name:",
      placeholder: "John Doe",
      initialValue: licenseConfig.config.name,
    }),
  );

  licenseConfig.config.email = await withCancelHandling(async () =>
    text({
      message: "License Holder Email:",
      placeholder: "john@example.com",
      initialValue: licenseConfig.config.email,
    }),
  );

  licenseConfig.config.website = await withCancelHandling(async () =>
    text({
      message: "License Holder Website:",
      placeholder: "https://example.com",
      initialValue: licenseConfig.config.website,
    }),
  );

  licenseConfig.config.type = (await withCancelHandling(async () =>
    select({
      message: "Select License Type:",
      options: LICENSE_TYPE_OPTIONS,
    }),
  )) as string as "MIT" | "ISC" | "Apache-2.0" | "UNLICENSED";
}

export async function installLicense(config: Config) {
  const licenseConfig = config.get("license");

  const { type, name, email, website } = licenseConfig.config;

  if (type !== "UNLICENSED") {
    const year = new Date().getFullYear().toString();
    const templatePath = path.join(__dirname, "licenses", `${type}.txt`);

    if (await fs.pathExists(templatePath)) {
      let licenseContent = await fs.readFile(templatePath, "utf-8");
      licenseContent = licenseContent.replace(/{YEAR}/g, year);
      licenseContent = licenseContent.replace(/{HOLDER}/g, name || "");
      licenseContent = licenseContent.replace(/{EMAIL}/g, email || "");
      licenseContent = licenseContent.replace(/{WEBSITE}/g, website || "");

      await fs.outputFile("LICENSE", licenseContent);
    } else {
      const simpleContent = `Copyright (c) ${year} ${name}\nLicensed under ${type}`;
      await fs.outputFile("LICENSE", simpleContent);
    }
  }

  if (await fs.pathExists("package.json")) {
    const pkg = await fs.readJson("package.json");

    pkg.license = type;

    if (name) {
      pkg.author = { name, email, url: website };
    }

    await fs.writeJson("package.json", pkg, { spaces: 2 });
  }
}
