import { select, confirm, text, multiselect } from "@clack/prompts";
import { installPackages } from "../utils/pm.js";
import fs from "fs-extra";
import path from "path";

export async function setupEnv(config: any) {
  const variant = (await select({
    message: "Which @t3-oss/env variant?",
    options: [
      { value: "@t3-oss/env-nextjs", label: "Next.js" },
      { value: "@t3-oss/env-nuxt", label: "Nuxt" },
      { value: "@t3-oss/env-core", label: "Core" },
    ],
  })) as string;

  const validator = (await select({
    message: "Which validator?",
    options: [
      { value: "zod", label: "Zod" },
      { value: "valibot", label: "Valibot" },
      { value: "arktype", label: "Arktype" },
    ],
  })) as string;

  await installPackages([variant, validator], true);

  const installPresets = await confirm({
    message: "Install presets?",
  });

  if (installPresets) {
    // logic to install presets
    const presetPackage = `@t3-oss/env-core/presets-${validator}`;
    await installPackages([presetPackage], true);

    // Select specific presets
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

    // We would ideally generate code that imports these presets.
    // For now, we will just note them or generate basic comments/imports if we were generating full code.
    config.envPresets = presets;
  }

  const split = await select({
    message: "Split or Joined env files?",
    options: [
      { value: "split", label: "Split (env/server.ts, env/client.ts)" },
      { value: "joined", label: "Joined (env.ts)" },
    ],
  });

  const location = await text({
    message: "Where to create them?",
    initialValue: "src/lib",
    placeholder: "src/lib",
  });

  // Create files based on selection
  const targetDir = location as string;
  await fs.ensureDir(targetDir);

  const presetImport =
    config.envPresets && config.envPresets.length > 0
      ? `// Presets: ${config.envPresets.join(", ")}\n`
      : "";

  // Basic scaffold content
  const content = `import { createEnv } from "${variant}";\nimport { ${validator} } from "${validator}";\n\n${presetImport}`;

  if (split === "split") {
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
