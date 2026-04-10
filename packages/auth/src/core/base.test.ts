import { Buffer } from "node:buffer";
import { exportJWK, generateKeyPair, importJWK, SignJWT } from "jose";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthError } from "../errors";
import { BaseAuthSetup } from "./base";

vi.mock("jose", async (importOriginal) => {
  // biome-ignore lint/suspicious/noExplicitAny: Test
  const actual = await importOriginal<any>();
  return {
    ...actual,
    createRemoteJWKSet: vi
      .fn()
      .mockReturnValue(() => Promise.resolve("mocked-jwks")),
  };
});

class MockAuthSetup extends BaseAuthSetup<{
  publicKey?: string;
  issuer: string;
  remotePublicKey?: boolean;
  accountUrl?: string;
}> {
  public async testGetKey(keyString: string, type: "Public" | "Private") {
    return this._getKey(keyString, type);
  }

  public async testGetVerifyKey() {
    return this.getVerifyKey();
  }
}

describe("BaseAuthSetup", () => {
  let privateJWK: string;
  let publicJWK: string;
  const ISSUER = "https://auth.test.com";
  const AUDIENCE = "test-app";

  beforeEach(async () => {
    const { privateKey, publicKey } = await generateKeyPair("PS256", {
      extractable: true,
    });
    privateJWK = JSON.stringify(await exportJWK(privateKey));
    publicJWK = JSON.stringify(await exportJWK(publicKey));
  });

  describe("_getKey", () => {
    it("should fail with invalid JSON", async () => {
      const setup = new MockAuthSetup({ publicKey: publicJWK, issuer: ISSUER });
      try {
        await setup.testGetKey("invalid-json", "Public");
        expect.fail("Should have thrown");
      } catch (error) {
        expect(error).toBeInstanceOf(AuthError);
        expect((error as AuthError).code).toBe("INVALID_PUBLIC_KEY");
        expect((error as AuthError).message).toContain(
          "Failed to import Public JWK",
        );
      }
    });

    it("should fail with invalid key format", async () => {
      const setup = new MockAuthSetup({ publicKey: publicJWK, issuer: ISSUER });
      await expect(
        setup.testGetKey(JSON.stringify({ kty: "oct", k: "..." }), "Public"),
      ).rejects.toThrow(AuthError);
    });
  });

  describe("getVerifyKey", () => {
    it("should return and cache the remote JWKS set", async () => {
      const { createRemoteJWKSet } = await import("jose");
      const setup = new MockAuthSetup({
        remotePublicKey: true,
        accountUrl: "https://auth.test.com",
        issuer: ISSUER,
      });

      const firstKey = await setup.testGetVerifyKey();
      const secondKey = await setup.testGetVerifyKey();

      expect(createRemoteJWKSet).toHaveBeenCalledWith(
        new URL("https://auth.test.com/.well-known/jwks.json"),
      );
      expect(firstKey).toBe(secondKey);
      expect(typeof firstKey).toBe("function");
    });

    it("should cache the imported key", async () => {
      const setup = new MockAuthSetup({ publicKey: publicJWK, issuer: ISSUER });
      const firstKey = await setup.testGetVerifyKey();
      const secondKey = await setup.testGetVerifyKey();
      expect(firstKey).toBe(secondKey);
    });
  });

  describe("Token Verification Edge Cases", () => {
    it("should return null for expired tokens", async () => {
      const setup = new MockAuthSetup({
        publicKey: publicJWK,
        issuer: ISSUER,
      });

      const token = await new SignJWT({ userId: "123" })
        .setProtectedHeader({ alg: "PS256" })
        .setIssuer(ISSUER)
        .setAudience(AUDIENCE)
        .setIssuedAt()
        .setExpirationTime("-1h") // Expired
        // biome-ignore lint/suspicious/noExplicitAny: PS256 key type compatibility in tests
        .sign((await importJWK(JSON.parse(privateJWK), "PS256")) as any);

      const payload = await setup.verifyAuthToken(token, AUDIENCE);
      expect(payload).toBeNull();
    });

    it("should return null for audience mismatch", async () => {
      const setup = new MockAuthSetup({
        publicKey: publicJWK,
        issuer: ISSUER,
      });

      const token = await new SignJWT({ userId: "123" })
        .setProtectedHeader({ alg: "PS256" })
        .setIssuer(ISSUER)
        .setAudience("wrong-audience")
        .setIssuedAt()
        .setExpirationTime("1h")
        // biome-ignore lint/suspicious/noExplicitAny: PS256 key type compatibility in tests
        .sign((await importJWK(JSON.parse(privateJWK), "PS256")) as any);

      const payload = await setup.verifyAuthToken(token, AUDIENCE);
      expect(payload).toBeNull();
    });

    it("should return null for issuer mismatch", async () => {
      const setup = new MockAuthSetup({
        publicKey: publicJWK,
        issuer: ISSUER,
      });

      const token = await new SignJWT({ userId: "123" })
        .setProtectedHeader({ alg: "PS256" })
        .setIssuer("https://wrong.test.com")
        .setAudience(AUDIENCE)
        .setIssuedAt()
        .setExpirationTime("1h")
        // biome-ignore lint/suspicious/noExplicitAny: PS256 key type compatibility in tests
        .sign((await importJWK(JSON.parse(privateJWK), "PS256")) as any);

      const payload = await setup.verifyAuthToken(token, AUDIENCE);
      expect(payload).toBeNull();
    });

    it("should return null if signature is tampered", async () => {
      const setup = new MockAuthSetup({
        publicKey: publicJWK,
        issuer: ISSUER,
      });

      const token = await new SignJWT({ userId: "123" })
        .setProtectedHeader({ alg: "PS256" })
        .setIssuer(ISSUER)
        .setAudience(AUDIENCE)
        .setIssuedAt()
        .setExpirationTime("1h")
        // biome-ignore lint/suspicious/noExplicitAny: PS256 key type compatibility in tests
        .sign((await importJWK(JSON.parse(privateJWK), "PS256")) as any);

      const parts = token.split(".");
      // Tamper with payload
      const tamperedPayload = Buffer.from(
        JSON.stringify({ userId: "456", iss: ISSUER, aud: AUDIENCE }),
      ).toString("base64url");
      const tamperedToken = `${parts[0]}.${tamperedPayload}.${parts[2]}`;

      const payload = await setup.verifyAuthToken(tamperedToken, AUDIENCE);
      expect(payload).toBeNull();
    });
  });
});
