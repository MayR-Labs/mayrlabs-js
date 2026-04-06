/* biome-ignore-all lint/suspicious/noExplicitAny: console spy object requires any for easy property access */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Debugger, debug } from "./index.js";

describe("Debugger", () => {
  let consoleSpy: any;

  beforeEach(() => {
    consoleSpy = {
      log: vi.spyOn(console, "log").mockImplementation(() => {}),
      info: vi.spyOn(console, "info").mockImplementation(() => {}),
      warn: vi.spyOn(console, "warn").mockImplementation(() => {}),
      error: vi.spyOn(console, "error").mockImplementation(() => {}),
      debug: vi.spyOn(console, "debug").mockImplementation(() => {}),
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("should log messages", () => {
    new Debugger().log("test message");
    expect(consoleSpy.log).toHaveBeenCalled();
  });

  it("should support namespaces", () => {
    new Debugger("MyNamespace").log("test message");
    expect(consoleSpy.log).toHaveBeenCalledWith(
      expect.stringContaining("[MyNamespace]"),
      "test message",
    );
  });

  it("should support custom colors", () => {
    debug().custom("#ff0000", "custom message");
    expect(consoleSpy.log).toHaveBeenCalled();
  });

  it("should respect devOnly mode (production)", () => {
    vi.stubEnv("NODE_ENV", "production");

    debug().devOnly().log("should not see this");
    expect(consoleSpy.log).not.toHaveBeenCalled();
  });

  it("should respect devOnly mode (development)", () => {
    vi.stubEnv("NODE_ENV", "development");

    debug().devOnly().log("should see this");
    expect(consoleSpy.log).toHaveBeenCalled();
  });

  it("should timeBox execution", async () => {
    const result = await debug().timeBox("Test Operation", async () => {
      return "success";
    });
    expect(result).toBe("success");
    expect(consoleSpy.log).toHaveBeenCalledWith(
      expect.stringContaining("LOG"),
      expect.stringContaining("Test Operation took"),
    );
  });

  it("should timeBox error handling", async () => {
    await expect(
      debug().timeBox("Failed Operation", async () => {
        throw new Error("fail");
      }),
    ).rejects.toThrow("fail");

    expect(consoleSpy.error).toHaveBeenCalledWith(
      expect.stringContaining("ERROR"),
      expect.stringContaining("Failed Operation failed after"),
      expect.any(Error),
    );
  });
});
