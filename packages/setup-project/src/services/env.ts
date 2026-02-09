import { select, confirm, text, multiselect } from "@clack/prompts";
import { installPackages } from "@/utils/pm";
import fs from "fs-extra";
import path from "path";

export async function promptEnv(config: any) {
  const variant = (await select({
    message: "Which @t3-oss/env variant?",
    options: [
      { value: "@t3-oss/env-nextjs", label: "Next.js" },
      { value: "@t3-oss/env-nuxt", label: "Nuxt" },
      { value: "@t3-oss/env-core", label: "Core" },
    ],
  })) as string;
  config.envVariant = variant;

  const validator = (await select({
    message: "Which validator?",
    options: [
      { value: "zod", label: "Zod" },
      { value: "valibot", label: "Valibot" },
      { value: "arktype", label: "Arktype" },
    ],
  })) as string;
  config.envValidator = validator;

  const installPresets = await confirm({
    message: "Install presets?",
  });
  config.envInstallPresets = installPresets;

  if (installPresets) {
    const presets = await multiselect({
      message: "Select preset to extend:",
      options: [
        { value: "netlify", label: "Netlify" },
        { value: "vercel", label: "Vercel" },
        { value: "neonVercel", label: "Neon (Vercel)" },
        { value: "supabaseVercel", label: "Supabase (Vercel)" },
        { value: "uploadThing", label: "UploadThing" },
        { value: "render", label: "Render" },
        { value: "railway", label: "Railway" },
        { value: "fly.io", label: "Fly.io" },
        { value: "upstashRedis", label: "Upstash Redis" },
        { value: "coolify", label: "Coolify" },
        { value: "vite", label: "Vite" },
        { value: "wxt", label: "WXT" },
      ],
      required: false,
    });
    config.envPresets = presets;
  }

  const split = await select({
    message: "Split or Joined env files?",
    options: [
      { value: "split", label: "Split (env/server.ts, env/client.ts)" },
      { value: "joined", label: "Joined (env.ts)" },
    ],
  });
  config.envSplit = split;

  const location = await text({
    message: "Where to create them?",
    initialValue: "src/lib",
    placeholder: "src/lib",
  });
  config.envLocation = location;
}

export async function installEnv(config: any) {
  await installPackages([config.envVariant, config.envValidator], true);

  if (config.envInstallPresets) {
    const presetPackage = `@t3-oss/env-core/presets-${config.envValidator}`;
    await installPackages([presetPackage], true);
  }

  const targetDir = config.envLocation as string;
  await fs.ensureDir(targetDir);

  const presetImport =
    config.envPresets && config.envPresets.length > 0
      ? `// Presets: ${config.envPresets.join(", ")}\n`
      : "";

  const content = `import { createEnv } from "${config.envVariant}";\nimport { ${config.envValidator} } from "${config.envValidator}";\n\n${presetImport}`;

  if (config.envSplit === "split") {
    await fs.outputFile(
      path.join(targetDir, "env/server.ts"),
      `${content}\n// Server env definition\nexport const env = createEnv({\n  server: {\n    // ...\n  },\n  experimental__runtimeEnv: process.env\n});`,
    );
    await fs.outputFile(
      path.join(targetDir, "env/client.ts"),
      `${content}\n// Client env definition\nexport const env = createEnv({\n  client: {\n    // ...\n  },\n  experimental__runtimeEnv: {\n    // ...\n  }\n});`,
    );
  } else {
    await fs.outputFile(
      path.join(targetDir, "env.ts"),
      `${content}\n// Joined env definition\nexport const env = createEnv({\n  server: {\n    // ...\n  },\n  client: {\n    // ...\n  },\n  experimental__runtimeEnv: {\n    // ...\n  }\n});`,
    );
  }
}
