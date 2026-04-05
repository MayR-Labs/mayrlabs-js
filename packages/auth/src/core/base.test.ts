import { Buffer } from "node:buffer";
import { exportJWK, generateKeyPair, importJWK, SignJWT } from "jose";
import { beforeEach, describe, expect, it } from "vitest";
import { MayRLabsAuthError } from "../errors";
import { BaseAuthSetup } from "./base";

class MockAuthSetup extends BaseAuthSetup<{
  publicKey: string;
  issuer: string;
}> {
  public async testGetKey(keyString: string, type: "Public" | "Private") {
    return this._getKey(keyString, type);
  }

  public async testGetPublicKey() {
    return this.getPublicKey();
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
        expect(error).toBeInstanceOf(MayRLabsAuthError);
        expect((error as MayRLabsAuthError).code).toBe("INVALID_PUBLIC_KEY");
        expect((error as MayRLabsAuthError).message).toContain(
          "Failed to import Public JWK"
        );
      }
    });

    it("should fail with invalid key format", async () => {
      const setup = new MockAuthSetup({ publicKey: publicJWK, issuer: ISSUER });
      await expect(
        setup.testGetKey(JSON.stringify({ kty: "oct", k: "..." }), "Public")
      ).rejects.toThrow(MayRLabsAuthError);
    });
  });

  describe("getPublicKey", () => {
    it("should cache the imported key", async () => {
      const setup = new MockAuthSetup({ publicKey: publicJWK, issuer: ISSUER });
      const firstKey = await setup.testGetPublicKey();
      const secondKey = await setup.testGetPublicKey();
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
        JSON.stringify({ userId: "456", iss: ISSUER, aud: AUDIENCE })
      ).toString("base64url");
      const tamperedToken = `${parts[0]}.${tamperedPayload}.${parts[2]}`;

      const payload = await setup.verifyAuthToken(tamperedToken, AUDIENCE);
      expect(payload).toBeNull();
    });
  });
});
