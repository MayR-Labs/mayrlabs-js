import fs from "node:fs";
import path from "node:path";

export function setupPlayground(
  rootDir: string,
  name: string,
  packageName: string
) {
  const playgroundSetupDir = path.join(
    rootDir,
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
      [packageName]: `file:../../packages/${name}`,
    },
  };

  fs.writeFileSync(
    path.join(playgroundSetupDir, "package.json"),
    JSON.stringify(playgroundPackageJson, null, 2)
  );
}
