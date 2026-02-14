import fs from "node:fs";
import path from "node:path";
import { PackageOptions, PackageJson } from "./types.js";

export function createPackageJson(packageDir: string, options: PackageOptions) {
  const { access, name, description, license, author, type } = options;
  const packageName = `@mayrlabs/${name}`;

  const packageJson: PackageJson = {
    name: packageName,
    version: "0.0.0",
    description: description,
    keywords: [],
    homepage: `https://github.com/MayR-Labs/mayrlabs-js/tree/main/packages/${name}#readme`,
    bugs: { url: "https://github.com/MayR-Labs/mayrlabs-js/issues" },
    license: license,
    author: author,
    repository: {
      type: "git",
      url: "git+https://github.com/MayR-Labs/mayrlabs-js.git",
      directory: `packages/${name}`,
    },
    files: ["dist", "README.md", "CHANGELOG.md", "package.json"],
    type: "commonjs",
    exports: {},
    scripts: {
      build: "tsdown",
      "pkg:dev": "tsdown --watch",
      test: "vitest run",
      "test:watch": "vitest",
      "test:coverage": "vitest run --coverage",
      prepublishOnly: "npm run build",
    },
    devDependencies: {
      "@repo/eslint-config": "^0.0.0",
      "@types/node": "^25.2.3",
      "@vitest/coverage-v8": "^4.0.18",
      eslint: "^9.39.1",
      tsdown: "^0.20.3",
      tsx: "^4.21.0",
      typescript: "^5.9.2",
      vitest: "^4.0.18",
    },
  };

  if (access === "published") {
    packageJson.private = false;
    packageJson.publishConfig = { access: "public" };
  } else {
    packageJson.private = true;
  }

  if (type === "bin" || type === "both") {
    packageJson.bin = { [name]: "dist/cli.cjs" };
    packageJson.main = "dist/cli.cjs";
    packageJson.module = "dist/cli.mjs";

    packageJson.exports["."] = {
      import: "./dist/cli.mjs",
      require: "./dist/cli.cjs",
    };

    packageJson.scripts.demo = "tsx src/cli.ts";
    packageJson.scripts["demo:dist"] = "node dist/cli.cjs";
  } else {
    packageJson.main = "dist/index.js";
    packageJson.module = "dist/index.mjs";

    packageJson.exports["."] = {
      import: "./dist/index.mjs",
      require: "./dist/index.js",
    };

    packageJson.scripts.demo = "tsx src/index.ts";
    packageJson.scripts["demo:dist"] = "node dist/index.js";
  }

  fs.writeFileSync(
    path.join(packageDir, "package.json"),
    JSON.stringify(packageJson, null, 2)
  );
}

export function createTsConfig(packageDir: string) {
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
}

export function createReadme(
  packageDir: string,
  name: string,
  description: string
) {
  fs.writeFileSync(
    path.join(packageDir, "README.md"),
    `# @mayrlabs/${name}\n\n${description}\n`
  );
}

export function createLicense(
  packageDir: string,
  license: string,
  author: { name: string }
) {
  // @ai: We should have LICENSE templates that would be used. And the author should be name, email and url

  fs.writeFileSync(
    path.join(packageDir, "LICENSE"),
    `${license} License\n\nCopyright (c) ${new Date().getFullYear()} ${author.name}`
  );
}

export function createSrcFiles(
  packageDir: string,
  type: "bin" | "lib" | "both",
  packageName: string
) {
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
}
