import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getPackageManager, runCommand, installPackages } from "./pm";
import { execa } from "execa";

vi.mock("execa");

describe("Package Manager Utils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getPackageManager", () => {
    const originalEnv = process.env;

    beforeEach(() => {
      process.env = { ...originalEnv };
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    it("should detect npm by default", async () => {
      delete process.env.npm_config_user_agent;
      const pm = await getPackageManager();
      expect(pm).toBe("npm");
    });

    it("should detect yarn", async () => {
      process.env.npm_config_user_agent =
        "yarn/1.22.19 npm/? node/v16.14.2 darwin x64";
      const pm = await getPackageManager();
      expect(pm).toBe("yarn");
    });

    it("should detect pnpm", async () => {
      process.env.npm_config_user_agent =
        "pnpm/7.0.0 npm/? node/v16.14.2 darwin x64";
      const pm = await getPackageManager();
      expect(pm).toBe("pnpm");
    });

    it("should detect bun", async () => {
      process.env.npm_config_user_agent =
        "bun/1.0.0 npm/? node/v16.14.2 darwin x64";
      const pm = await getPackageManager();
      expect(pm).toBe("bun");
    });
  });

  describe("installPackages", () => {
    const originalEnv = process.env;

    beforeEach(() => {
      process.env = { ...originalEnv };
      delete process.env.npm_config_user_agent; // simulate npm by default
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    it("should install packages with npm", async () => {
      await installPackages(["react"], false);
      expect(execa).toHaveBeenCalledWith("npm", ["install", "react"]);
    });

    it("should install dev packages with npm", async () => {
      await installPackages(["typescript"], true);
      expect(execa).toHaveBeenCalledWith("npm", [
        "install",
        "--save-dev",
        "typescript",
      ]);
    });
  });
});
