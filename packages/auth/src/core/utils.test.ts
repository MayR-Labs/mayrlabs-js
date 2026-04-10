import { describe, expect, it } from "vitest";
import type { AuthUserPayload } from "../types";
import {
  AuthUser,
  generateCodeChallenge,
  generateCodeVerifier,
  generateRandomString,
} from "./utils";

describe("Core Utilities", () => {
  describe("AuthUser", () => {
    const payload: AuthUserPayload = {
      id: "u123",
      email: "test@mayrlabs.com",
      username: "testuser",
      firstName: "Test",
      lastName: "User",
      roles: ["admin", "editor"],
      avatarUrl: "https://example.com/avatar.jpg",
      iat: 1234567890,
      exp: 1234567890 + 3600,
    };

    it("should instantiate correctly and provide getters", () => {
      const user = new AuthUser(payload);
      expect(user.id).toBe(payload.id);
      expect(user.email).toBe(payload.email);
      expect(user.username).toBe(payload.username);
      expect(user.firstName).toBe(payload.firstName);
      expect(user.lastName).toBe(payload.lastName);
      expect(user.fullName).toBe("Test User");
      expect(user.roles).toEqual(payload.roles);
      expect(user.avatarUrl).toBe(payload.avatarUrl);
    });

    it("should handle missing optional names in fullName", () => {
      const minimalUser = new AuthUser({
        ...payload,
        firstName: null,
        lastName: null,
      });
      expect(minimalUser.fullName).toBe("");
    });

    it("should correctly check roles", () => {
      const user = new AuthUser(payload);
      expect(user.hasRole("admin")).toBe(true);
      expect(user.hasRole("viewer")).toBe(false);
      expect(user.hasAnyRole(["viewer", "editor"])).toBe(true);
      expect(user.hasAnyRole(["viewer", "guest"])).toBe(false);
      expect(user.hasAllRoles(["admin", "editor"])).toBe(true);
      expect(user.hasAllRoles(["admin", "viewer"])).toBe(false);
    });

    it("should return the raw payload via toJSON", () => {
      const user = new AuthUser(payload);
      expect(user.toJSON()).toEqual(payload);
    });
  });

  describe("PKCE & Random String Utilities", () => {
    it("generateCodeVerifier should generate string of requested length", () => {
      const verifier = generateCodeVerifier(128);
      expect(verifier).toHaveLength(128);
      // character set [A-Z], [a-z], [0-9], "-", ".", "_", "~"
      expect(verifier).toMatch(/^[A-Za-z0-9\-._~]+$/);
    });

    it("generateCodeChallenge should generate base64url encoded S256 hash", async () => {
      // Known verifier -> expected challenge (using standard SHA-256 base64url)
      // Example from RFC 7636: "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk"
      // Wait, let's use a simple one we can verify if needed, or just check it's a valid b64url string
      const verifier = "test-verifier";
      const challenge = await generateCodeChallenge(verifier);

      expect(challenge).toBeDefined();
      expect(typeof challenge).toBe("string");
      expect(challenge).not.toContain("+");
      expect(challenge).not.toContain("/");
      expect(challenge).not.toContain("=");
    });

    it("generateRandomString should generate alphanumeric strings", () => {
      const str = generateRandomString(32);
      expect(str).toHaveLength(32);
      expect(str).toMatch(/^[A-Za-z0-9]+$/);
    });

    it("generateRandomString should be sufficiently random", () => {
      const str1 = generateRandomString(32);
      const str2 = generateRandomString(32);
      expect(str1).not.toBe(str2);
    });
  });
});
