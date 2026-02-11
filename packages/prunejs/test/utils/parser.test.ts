import { describe, it, expect, afterEach } from "vitest";
import {
  extractExports,
  extractNonExportedDeclarations,
  extractImports,
  shouldSkipName,
  isComment,
} from "@/utils/parser";
import mockfs from "mock-fs";

describe("parser", () => {
  const projectRoot = "/test-project";

  afterEach(() => {
    mockfs.restore();
  });

  describe("isComment", () => {
    it("should identify single-line comments", () => {
      expect(isComment("// this is a comment")).toBe(true);
      expect(isComment("  // indented comment")).toBe(true);
    });

    it("should identify multi-line comment starts", () => {
      expect(isComment("/* start of comment")).toBe(true);
      expect(isComment("  * inside comment")).toBe(true);
    });

    it("should return false for code", () => {
      expect(isComment("const x = 1;")).toBe(false);
      expect(isComment("export function foo() {}")).toBe(false);
    });
  });

  describe("shouldSkipName", () => {
    it("should skip private/hook/handler names", () => {
      expect(shouldSkipName("_private")).toBe(true);
      expect(shouldSkipName("useHook")).toBe(true);
      expect(shouldSkipName("handleClick")).toBe(true);
      expect(shouldSkipName("onEvent")).toBe(true);
    });

    it("should skip config/options types", () => {
      expect(shouldSkipName("AppConfig")).toBe(true);
      expect(shouldSkipName("UserOptions")).toBe(true);
    });

    it("should not skip regular names", () => {
      expect(shouldSkipName("calculateTotal")).toBe(false);
      expect(shouldSkipName("User")).toBe(false);
    });
  });

  describe("extractExports", () => {
    it("should extract named exports", () => {
      mockfs({
        "/test-project/file.ts": `
          // This is a comment
          export const a = 1;
          /* Another comment */
          export function b() {}
          export class C {}
          export interface D {}
          export type E = string;
        `,
      });

      const exports = extractExports("/test-project/file.ts", projectRoot);
      expect(exports).toHaveLength(5);
      expect(exports.map((e: any) => e.name)).toEqual(
        expect.arrayContaining(["a", "b", "C", "D", "E"])
      );
    });

    it("should extract grouped exports", () => {
      mockfs({
        "/test-project/file.ts": `
          const a = 1;
          const b = 2;
          export { a, b as c };
        `,
      });

      const exports = extractExports("/test-project/file.ts", projectRoot);
      expect(exports).toHaveLength(2);
      expect(exports.map((e: any) => e.name)).toEqual(
        expect.arrayContaining(["a", "c"])
      );
    });

    it("should extract default export", () => {
      mockfs({
        "/test-project/file.ts": `
          export default function myFunc() {}
        `,
      });
      const exports = extractExports("/test-project/file.ts", projectRoot);
      expect(exports).toHaveLength(1);
      expect(exports[0].name).toBe("myFunc");
    });
  });

  describe("extractNonExportedDeclarations", () => {
    it("should extract top-level declarations", () => {
      mockfs({
        "/test-project/file.ts": `
          function internalFunc() {}
          class InternalClass {}
          const internalVar = () => {};
        `,
      });

      const decls = extractNonExportedDeclarations(
        "/test-project/file.ts",
        projectRoot
      );
      expect(decls).toHaveLength(3);
      expect(decls.map((d: any) => d.name)).toEqual(
        expect.arrayContaining(["internalFunc", "InternalClass", "internalVar"])
      );
    });

    it("should ignore exported declarations", () => {
      mockfs({
        "/test-project/file.ts": `
          export function exportedFunc() {}
          function internalFunc() {}
        `,
      });

      const decls = extractNonExportedDeclarations(
        "/test-project/file.ts",
        projectRoot
      );
      expect(decls).toHaveLength(1);
      expect(decls[0].name).toBe("internalFunc");
    });

    it("should respect skip patterns", () => {
      mockfs({
        "/test-project/file.ts": `
          function _private() {}
          function useHook() {}
        `,
      });

      const decls = extractNonExportedDeclarations(
        "/test-project/file.ts",
        projectRoot
      );
      expect(decls).toHaveLength(0);
    });
  });

  describe("extractImports", () => {
    it("should extract named imports", () => {
      mockfs({
        "/test-project/file.ts": `
          import { a, b as c } from 'pkg';
        `,
      });

      const imports = extractImports("/test-project/file.ts");
      expect(imports).toEqual(expect.arrayContaining(["a", "c"]));
    });

    it("should extract default imports", () => {
      mockfs({
        "/test-project/file.ts": `
          import React from 'react';
        `,
      });

      const imports = extractImports("/test-project/file.ts");
      expect(imports).toContain("React");
    });

    it("should extract namespace imports", () => {
      mockfs({
        "/test-project/file.ts": `
          import * as fs from 'fs';
        `,
      });

      const imports = extractImports("/test-project/file.ts");
      expect(imports).toContain("fs");
    });
  });
});
