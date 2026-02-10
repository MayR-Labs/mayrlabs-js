import { select, confirm, text, multiselect, log } from "@clack/prompts";
import { installPackages } from "@/utils/pm";
import fs from "fs-extra";
import path from "path";
import pc from "picocolors";
import { Config } from "@/config/config";
import {
  ENV_VARIANT_OPTIONS,
  ENV_VALIDATOR_OPTIONS,
  ENV_PRESET_OPTIONS,
  ENV_SPLIT_OPTIONS,
  EnvVariantValue,
  EnvValidatorValue,
  EnvPresetValue,
  EnvSplitValue,
} from "@/constants/options";
import { withCancelHandling } from "@/utils/handle-cancel";

export async function promptEnv(config: Config) {
  log.message(pc.bgCyan(pc.black(" Env Validation Configuration ")));

  const variant = (await withCancelHandling(async () =>
    select({
      message: "Which @t3-oss/env variant?",
      options: ENV_VARIANT_OPTIONS,
    }),
  )) as EnvVariantValue;

  const validator = (await withCancelHandling(async () =>
    select({
      message: "Which validator?",
      options: ENV_VALIDATOR_OPTIONS,
    }),
  )) as EnvValidatorValue;

  const installPresets = (await withCancelHandling(async () =>
    confirm({
      message: "Install presets?",
    }),
  )) as boolean;

  let presets: EnvPresetValue[] | undefined;
  if (installPresets) {
    presets = (await withCancelHandling(async () =>
      multiselect({
        message: "Select preset to extend:",
        options: ENV_PRESET_OPTIONS,
        required: false,
      }),
    )) as EnvPresetValue[];
  }

  const split = (await withCancelHandling(async () =>
    select({
      message: "Split or Joined env files?",
      options: ENV_SPLIT_OPTIONS,
    }),
  )) as EnvSplitValue;

  const location = (await withCancelHandling(async () =>
    text({
      message: "Where should the environment files be created?",
      initialValue: config.get("env").config?.location || "src/lib",
      placeholder: "src/lib",
    }),
  )) as string;

  config.get("env").config = {
    variant,
    validator,
    installPresets,
    presets,
    split,
    location,
  };
}

export async function installEnv(config: Config) {
  const envConfig = config.get("env").config;
  if (!envConfig) return;

  const { variant, validator, location, presets, split } = envConfig;

  if (!variant || !validator || !location) return;

  await installPackages([variant, validator], true);

  await fs.ensureDir(location);

  const presetImport =
    presets && presets.length > 0 ? `// Presets: ${presets.join(", ")}\n` : "";

  const content = `import { createEnv } from "${variant}";\nimport { ${validator} } from "${validator}";\n\n${presetImport}`;

  if (split === "split") {
    await fs.outputFile(
      path.join(location, "env/server.ts"),
      `${content}\n// Server env definition\nexport const env = createEnv({\n  server: {\n    // ...\n  },\n  experimental__runtimeEnv: process.env\n});`,
    );
    await fs.outputFile(
      path.join(location, "env/client.ts"),
      `${content}\n// Client env definition\nexport const env = createEnv({\n  client: {\n    // ...\n  },\n  experimental__runtimeEnv: {\n    // ...\n  }\n});`,
    );
  } else {
    await fs.outputFile(
      path.join(location, "env.ts"),
      `${content}\n// Joined env definition\nexport const env = createEnv({\n  server: {\n    // ...\n  },\n  client: {\n    // ...\n  },\n  experimental__runtimeEnv: {\n    // ...\n  }\n});`,
    );
  }
}
