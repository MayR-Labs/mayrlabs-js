import { execa } from "execa";

export type PackageManager = "npm" | "yarn" | "pnpm" | "bun";

export async function getPackageManager(): Promise<PackageManager> {
  const userAgent = process.env.npm_config_user_agent;

  if (userAgent) {
    if (userAgent.startsWith("yarn")) return "yarn";
    if (userAgent.startsWith("pnpm")) return "pnpm";
    if (userAgent.startsWith("bun")) return "bun";
  }

  return "npm";
}

export async function installPackages(
  packages: string[],
  dev: boolean = false,
) {
  const pm = await getPackageManager();
  const args = [];

  if (pm === "npm") {
    args.push("install");
    if (dev) args.push("--save-dev");
  } else if (pm === "yarn") {
    args.push("add");
    if (dev) args.push("-D");
  } else if (pm === "pnpm") {
    args.push("add");
    if (dev) args.push("-D");
  } else if (pm === "bun") {
    args.push("add");
    if (dev) args.push("-d");
  }

  await execa(pm, [...args, ...packages]);
}

export async function runCommand(command: string, args: string[]) {
  const pm = await getPackageManager();
  let cmd: string = pm;
  let cmdArgs = args;

  if (pm === "npm") {
    cmd = "npm";
    cmdArgs = ["run", command, ...args];

    // special case for npx/exec
    if (command === "exec") {
      cmd = "npx";
      cmdArgs = args;
    }
  } else if (pm === "yarn") {
    cmd = "yarn";
    cmdArgs = [command, ...args];
  } else if (pm === "pnpm") {
    cmd = "pnpm";
    cmdArgs = [command, ...args];
    if (command === "exec") {
      cmd = "pnpm";
      cmdArgs = ["exec", ...args];
    }
  } else if (pm === "bun") {
    cmd = "bun";
    cmdArgs = [command, ...args];
  }

  // Normalize execute command
  if (command === "execute") {
    if (pm === "npm") {
      cmd = "npx";
      cmdArgs = args;
    } else if (pm === "yarn") {
      cmd = "yarn";
      cmdArgs = ["exec", ...args]; // or just yarn <cmd>
      // yarn doesn't always need exec, but for safety
      cmd = "yarn";
      cmdArgs = args;
    } else if (pm === "pnpm") {
      cmd = "pnpm";
      cmdArgs = ["exec", ...args];
    } else if (pm === "bun") {
      cmd = "bun";
      cmdArgs = ["x", ...args];
    }
  }

  await execa(cmd, cmdArgs);
}
