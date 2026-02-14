import * as p from "@clack/prompts";
import color from "picocolors";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
// import { execa } from 'execa'; // We'll use child_process for now to avoid issues if execa isn't available or compatible
import { execSync } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "../../");
const PACKAGES_DIR = path.join(ROOT_DIR, "packages");

export async function scaffoldTsPackage() {
  const group = await p.group(
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
            if (fs.existsSync(path.join(PACKAGES_DIR, value)))
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
  );

  const { access, name, description, license, author, type } = group;
  const packageDir = path.join(PACKAGES_DIR, name);
  const packageName = `@mayrlabs/${name}`;

  const s = p.spinner();
  s.start("Creating package structure...");

  // Create folder
  fs.mkdirSync(packageDir, { recursive: true });

  // Init npm
  execSync("npm init -y", { cwd: packageDir, stdio: "ignore" });

  // Modify package.json
  const packageJsonPath = path.join(packageDir, "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

  packageJson.name = packageName;
  packageJson.version = "0.0.0";
  packageJson.private = access === "internal"; // "false if access is published" i.e. private is false (public) if published. So if internal, private is true.
  // Wait, if internal, private should be true? The prompt said "Access - Internal or Published".
  // "private: false if access is published" implies private: true if access is internal.

  if (access === "published") {
    packageJson.private = false;
    packageJson.publishConfig = { access: "public" };
  } else {
    packageJson.private = true;
  }

  packageJson.description = description;
  packageJson.keywords = [];
  packageJson.homepage = `https://github.com/MayR-Labs/mayrlabs-js/tree/main/packages/${name}#readme`;
  packageJson.bugs = { url: "https://github.com/MayR-Labs/mayrlabs-js/issues" };
  packageJson.license = license;
  packageJson.author = author;
  packageJson.repository = {
    type: "git",
    url: "git+https://github.com/MayR-Labs/mayrlabs-js.git",
    directory: `packages/${name}`,
  };

  packageJson.files = ["dist", "README.md", "CHANGELOG.md", "package.json"];

  // Type is typically module or commonjs. User didn't specify preference, but usually we use module or commonjs.
  // "type: commonjs or module depending on you know"
  // genesis uses commonjs. prunejs uses commonjs. I'll stick to commonjs for now as per other packages.
  packageJson.type = "commonjs";

  if (type === "bin" || type === "both") {
    packageJson.bin = { [name]: "dist/cli.cjs" };
    packageJson.main = "dist/cli.cjs";
    packageJson.module = "dist/cli.mjs";
  } else {
    packageJson.main = "dist/index.cjs"; // Usually commonjs main is .js or .cjs
    packageJson.module = "dist/index.mjs";
  }

  if (type === "lib") {
    packageJson.main = "dist/index.js"; // The prompt said "dist/index.js"
    // Wait: "main: dist/cli.cjs if type is bin or both, else dist/index.js"
    // "module: dist/cli.mjs if type is bin, else dist/index.js" -> This seems like a typo in the prompt or maybe index.mjs?
    // I will assume standard: main=dist/index.js (cjs/js), module=dist/index.mjs
    packageJson.main = "dist/index.js";
    packageJson.module = "dist/index.mjs";
  }

  packageJson.exports = {
    ".": {
      import: type === "bin" ? "./dist/cli.mjs" : "./dist/index.mjs",
      require: type === "bin" ? "./dist/cli.cjs" : "./dist/index.js",
    },
  };

  // Correction based on prompt:
  // "main: dist/cli.cjs if type is bin or both, else dist/index.js"
  // "module: dist/cli.mjs if type is bin, else dist/index.js" -> usually module points to ESM.
  // I will follow the prompt strictly where it makes sense, but ensure correctness.

  if (type === "lib") {
    packageJson.exports = {
      ".": {
        import: "./dist/index.mjs",
        require: "./dist/index.js",
      },
    };

    // Prompt said: "module: ... else dist/index.js" -> likely meant index.mjs or just index.js acting as ESM?
    // But standard is module uses .mjs or .js if type=module.
    // Given type=commonjs (assumed), module should handle ESM.
    packageJson.module = "dist/index.mjs";
  }

  packageJson.scripts = {
    build: "tsdown",
    "pkg:dev": "tsdown --watch",
    demo: "tsx src/index.ts", // Adjust based on type
    "demo:dist": "node dist/index.js",
    test: "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    prepublishOnly: "npm run build",
  };

  if (type === "bin" || type === "both") {
    packageJson.scripts.demo = "tsx src/cli.ts";
    packageJson.scripts["demo:dist"] = "node dist/cli.cjs";
  }

  packageJson.devDependencies = {
    "@mayrlabs/core": "*",
    "@repo/eslint-config": "^0.0.0",
    "@types/node": "^25.2.3",
    "@vitest/coverage-v8": "^4.0.18",
    eslint: "^9.39.1",
    tsdown: "^0.20.3",
    tsx: "^4.21.0",
    typescript: "^5.9.2",
    vitest: "^4.0.18",
  };

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

  // Create tsconfig.json
  const tsconfig = {
    compilerOptions: {
      target: "ES2022",
      module: "NodeNext",
      moduleResolution: "NodeNext",
      lib: ["ES2022"],
      outDir: "dist",
      rootDir: "src",
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      resolveJsonModule: true,
      baseUrl: ".",
      paths: {
        "@/*": ["src/*"],
      },
    },
    include: ["src/**/*"],
    exclude: ["node_modules", "dist"],
  };
  fs.writeFileSync(
    path.join(packageDir, "tsconfig.json"),
    JSON.stringify(tsconfig, null, 2)
  );

  // Create README.md
  fs.writeFileSync(
    path.join(packageDir, "README.md"),
    `# ${packageName}\n\n${description}\n`
  );

  // Create LICENSE
  // For now just empty or simple text, or copy? Prompt doesn't specify content details other than "MIT or ISC"
  // We'll create a placeholder.
  fs.writeFileSync(
    path.join(packageDir, "LICENSE"),
    `${license} License\n\nCopyright (c) ${new Date().getFullYear()} ${author.name}`
  );

  // Create src folder and files
  const srcDir = path.join(packageDir, "src");
  fs.mkdirSync(srcDir);

  if (type === "bin" || type === "both") {
    fs.writeFileSync(
      path.join(srcDir, "cli.ts"),
      `#!/usr/bin/env node\n\nconsole.log('Hello from ${packageName} CLI');\n`
    );
  }

  if (type === "lib" || type === "both") {
    fs.writeFileSync(
      path.join(srcDir, "index.ts"),
      `export const hello = () => 'Hello from ${packageName}';\n`
    );
  }

  // Create playground setup
  const playgroundSetupDir = path.join(
    ROOT_DIR,
    "playground",
    ".setup",
    `${name}-pg`
  );
  fs.mkdirSync(playgroundSetupDir, { recursive: true });

  const playgroundPackageJson = {
    name: `${name}-pg`,
    version: "0.0.0",
    private: true,
    description: `Playground for ${packageName}`,
    devDependencies: {
      [packageName]: `file:../../../packages/${name}`,
    },
  };
  fs.writeFileSync(
    path.join(playgroundSetupDir, "package.json"),
    JSON.stringify(playgroundPackageJson, null, 2)
  );

  s.stop("Package created successfully!");

  const nextSteps = [`cd packages/${name}`, `npm install`, `npm run build`];

  p.note(nextSteps.join("\n"), "Next steps:");
}
