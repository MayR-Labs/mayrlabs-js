import fs from "node:fs";
import path from "node:path";
import { PackageOptions, PackageJson } from "./types.js";
import {
  MIT_LICENSE,
  ISC_LICENSE,
  TSDOWN_CONFIG,
  VITEST_CONFIG,
} from "./templates.js";

export function createPackageJson(packageDir: string, options: PackageOptions) {
  const { access, name, description, license, author, type } = options;
  const namePrefix = access === "published" ? "@mayrlabs" : "@repo";

  const packageJson: PackageJson = {
    name: `${namePrefix}/${name}`,
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
      "@repo/eslint-config": "*",
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
  author: { name: string; email: string; url: string }
) {
  let template = license === "MIT" ? MIT_LICENSE : ISC_LICENSE;
  const year = new Date().getFullYear().toString();
  const authorString = `${author.name} <${author.email}> (${author.url})`;

  template = template.replace("{year}", year).replace("{author}", authorString);

  fs.writeFileSync(path.join(packageDir, "LICENSE"), template);
}

export function createTsdownConfig(packageDir: string) {
  fs.writeFileSync(path.join(packageDir, "tsdown.config.mts"), TSDOWN_CONFIG);
}

export function createVitestConfig(packageDir: string) {
  fs.writeFileSync(path.join(packageDir, "vitest.config.ts"), VITEST_CONFIG);
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
