import { prompts } from "@/utils/prompts";
import fs from "fs-extra";
import path from "path";
import pc from "picocolors";
import { Config } from "@/core/config";
import { LICENSE_TYPE_OPTIONS, LicenseTypeValue } from "@/constants/options";
import { withCancelHandling } from "@/utils/handle-cancel";

export async function promptLicense(config: Config) {
  prompts.log.message(pc.bgGreen(pc.black(" License Configuration ")));

  const licenseOptions = config.get("license").options;

  licenseOptions.name = await withCancelHandling(async () =>
    prompts.text({
      message: "License Holder Name:",
      placeholder: "John Doe",
      initialValue: licenseOptions.name,
    })
  );

  licenseOptions.email = await withCancelHandling(async () =>
    prompts.text({
      message: "License Holder Email:",
      placeholder: "john@example.com",
      initialValue: licenseOptions.email,
    })
  );

  licenseOptions.website = await withCancelHandling(async () =>
    prompts.text({
      message: "License Holder Website:",
      placeholder: "https://example.com",
      initialValue: licenseOptions.website,
    })
  );

  licenseOptions.type = (await withCancelHandling(async () =>
    prompts.select({
      message: "Select License Type:",
      options: LICENSE_TYPE_OPTIONS,
    })
  )) as LicenseTypeValue;
}

export async function installLicense(config: Config) {
  const licenseOptions = config.get("license").options;

  const { type, name, email, website } = licenseOptions;

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
