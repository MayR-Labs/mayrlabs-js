import { describe, it, expect } from "vitest";
import { Generator } from "./generator";

describe("Generator", () => {
  it("generates simple icon url", () => {
    expect(Generator.simpleIcon.url("asana")).toBe(
      "https://cdn.simpleicons.org/asana"
    );
  });

  it("generates dev icon url", () => {
    expect(Generator.devIcon.url("react")).toBe(
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg"
    );
    expect(Generator.devIcon.url("react", "plain")).toBe(
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-plain.svg"
    );
  });

  it("generates icon url from full slug", () => {
    expect(Generator.iconUrl("simple:asana")).toBe(
      "https://cdn.simpleicons.org/asana"
    );
    expect(Generator.iconUrl("dev:react:original")).toBe(
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg"
    );
    expect(Generator.iconUrl("local:/assets/icon.svg")).toBe(
      "/assets/icon.svg"
    );
    expect(Generator.iconUrl("remote:https://example.com/icon.svg")).toBe(
      "https://example.com/icon.svg"
    );
  });

  it("defaults to simple icon if no prefix", () => {
    expect(Generator.iconUrl("asana")).toBe(
      "https://cdn.simpleicons.org/asana"
    );
  });
});
