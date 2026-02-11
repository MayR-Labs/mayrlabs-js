import { describe, it, expect, afterEach } from "vitest";
import {
  findBlockEnd,
  findBlockEndFromLines,
  getAllFiles,
} from "@/utils/file-system";
import mockfs from "mock-fs";
import path from "path";
import ignore from "ignore";

describe("file-system", () => {
  afterEach(() => {
    mockfs.restore();
  });

  describe("findBlockEndFromLines", () => {
    it("should find end of block in lines array", () => {
      const lines = ["function foo() {", "  console.log('bar');", "}"];
      expect(findBlockEndFromLines(lines, 1)).toBe(3);
    });
  });

  describe("findBlockEnd", () => {
    it("should find end of a simple block", () => {
      mockfs({
        "/test-project/file.ts": `
          function foo() {
            console.log("bar");
          }
        `,
      });

      const endLine = findBlockEnd("/test-project/file.ts", 2);
      expect(endLine).toBe(4);
    });

    it("should handle nested blocks", () => {
      mockfs({
        "/test-project/file.ts": `
          function foo() {
            if (true) {
              console.log("bar");
            }
          }
        `,
      });

      const endLine = findBlockEnd("/test-project/file.ts", 2);
      expect(endLine).toBe(6);
    });

    it("should handle single line blocks", () => {
      mockfs({
        "/test-project/file.ts": `
          function foo() { return 1; }
        `,
      });

      const endLine = findBlockEnd("/test-project/file.ts", 2);
      expect(endLine).toBe(2);
    });

    it("should handle single line statements without braces", () => {
      mockfs({
        "/test-project/file.ts": `
          export const a = 1;
        `,
      });

      const endLine = findBlockEnd("/test-project/file.ts", 2);
      expect(endLine).toBe(2);
    });
  });

  describe("getAllFiles", () => {
    it("should recursively find files", () => {
      mockfs({
        "/test-project": {
          "file1.ts": "",
          src: {
            "file2.tsx": "",
            utils: {
              "file3.js": "",
            },
          },
          ignored: {
            "file4.ts": "",
          },
        },
      });

      const ig = ignore();
      const files = getAllFiles(
        "/test-project",
        "/test-project",
        ig,
        ["ignored"],
        [".ts", ".tsx", ".js"]
      );

      expect(files).toHaveLength(3);
      expect(files).toEqual(
        expect.arrayContaining([
          path.normalize("/test-project/file1.ts"),
          path.normalize("/test-project/src/file2.tsx"),
          path.normalize("/test-project/src/utils/file3.js"),
        ])
      );
    });

    it("should respect gitignore", () => {
      mockfs({
        "/test-project": {
          "file1.ts": "",
          "ignored.ts": "",
        },
      });

      const ig = ignore().add("ignored.ts");
      const files = getAllFiles(
        "/test-project",
        "/test-project",
        ig,
        [],
        [".ts"]
      );

      expect(files).toHaveLength(1);
      expect(files[0]).toContain("file1.ts");
    });
  });
});
