import { describe, it, expect, afterEach } from "vitest";
import { UnusedCodeFinder } from "@/utils/analyzer";
import { PruneConfig } from "@/utils/config";
import mockfs from "mock-fs";

describe("UnusedCodeFinder", () => {
  const projectRoot = "/test-project";
  const baseConfig: PruneConfig = {
    includeDirs: ["."],
    includeExtensions: [".ts"],
    excludeDirs: [],
    excludeIgnoredFiles: false,
    skipExportsIn: [],
  };

  afterEach(() => {
    mockfs.restore();
  });

  it("should find unused exports", async () => {
    mockfs({
      "/test-project/unused.ts": `
        export const unused = 1;
      `,
      "/test-project/used.ts": `
        export const used = 1;
      `,
      "/test-project/consumer.ts": `
        import { used } from './used';
        console.log(used);
      `,
    });

    const finder = new UnusedCodeFinder(projectRoot, baseConfig);
    const report = await finder.analyze();

    expect(report.unusedExports).toHaveLength(1);
    expect(report.unusedExports[0].name).toBe("unused");
    expect(report.totalExports).toBe(2);
  });

  it("should find unused non-exported declarations", async () => {
    mockfs({
      "/test-project/file.ts": `
        const unusedLocal = () => {};
        const usedLocal = function() {};
        console.log(usedLocal);
      `,
    });

    const finder = new UnusedCodeFinder(projectRoot, baseConfig);
    const report = await finder.analyze();

    expect(report.unusedNonExported).toHaveLength(1);
    expect(report.unusedNonExported[0].name).toBe("unusedLocal");
  });

  it("should respect .gitignore", async () => {
    mockfs({
      "/test-project/.gitignore": "ignored.ts",
      "/test-project/ignored.ts": "export const ignored = 1;",
      "/test-project/included.ts": "export const included = 1;",
    });

    const finder = new UnusedCodeFinder(projectRoot, {
      ...baseConfig,
      excludeIgnoredFiles: true,
    });
    const report = await finder.analyze();

    expect(report.totalExports).toBe(1); // Only from included.ts
    expect(report.unusedExports[0].name).toBe("included");
  });

  it("should handle usage within the same file", async () => {
    mockfs({
      "/test-project/file.ts": `
        export const usedSelf = 1;
        console.log(usedSelf);
      `,
    });

    const finder = new UnusedCodeFinder(projectRoot, baseConfig);
    const report = await finder.analyze();

    expect(report.unusedExports).toHaveLength(0);
  });
});
