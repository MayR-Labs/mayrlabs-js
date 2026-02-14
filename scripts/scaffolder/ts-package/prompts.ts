import * as p from "@clack/prompts";
import fs from "node:fs";
import path from "node:path";
import { PackageOptions } from "./types.js";

export async function promptPackageDetails(
  packagesDir: string
): Promise<PackageOptions | symbol> {
  return p.group(
    {
      access: () =>
        p.select({
          message: "Access",
          options: [
            {
              value: "internal",
              label: "Internal",
              hint: "Private package (@mayrlabs/name)",
            },
            {
              value: "published",
              label: "Published",
              hint: "Public package (@mayrlabs/name)",
            },
          ],
        }),
      name: () =>
        p.text({
          message: "Package Name (without @mayrlabs prefix)",
          placeholder: "example",
          validate: (value) => {
            if (!value) return "Name is required";
            if (/[^a-z0-9-]/.test(value))
              return "Name can only contain lowercase letters, numbers, and dashes";
            if (fs.existsSync(path.join(packagesDir, value)))
              return "Package already exists";
            return;
          },
        }),
      description: () =>
        p.text({
          message: "Description",
          placeholder: "A cool package",
        }),
      license: () =>
        p.select({
          message: "License",
          options: [
            { value: "MIT", label: "MIT" },
            { value: "ISC", label: "ISC" },
          ],
        }),
      author: () =>
        p.select({
          message: "Author",
          options: [
            {
              value: {
                name: "Aghogho Meyoron",
                email: "youngmayor.dev@gmail.com",
                url: "https://mayrlabs.com",
              },
              label: "Aghogho Meyoron <youngmayor.dev@gmail.com>",
            },
          ],
        }),
      type: () =>
        p.select({
          message: "Type",
          options: [
            { value: "bin", label: "Bin", hint: "Executable" },
            { value: "lib", label: "Lib", hint: "Library" },
            { value: "both", label: "Both", hint: "Executable & Library" },
          ],
        }),
    },
    {
      onCancel: () => {
        p.cancel("Operation cancelled.");
        process.exit(0);
      },
    }
  ) as Promise<PackageOptions | symbol>;
}
