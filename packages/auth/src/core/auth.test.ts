import { exportJWK, generateKeyPair } from "jose";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ClientAuthSetup } from "./client";
import { IssuerAuthSetup } from "./issuer";

describe("Identity SDK", () => {
  let privateJWK: string;
  let publicJWK: string;

  beforeEach(async () => {
    const { privateKey, publicKey } = await generateKeyPair("PS256", {
      extractable: true,
    });
    privateJWK = JSON.stringify(await exportJWK(privateKey));
    publicJWK = JSON.stringify(await exportJWK(publicKey));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  describe("IssuerAuthSetup", () => {
    it("should sign a user token correctly", async () => {
      const issuer = new IssuerAuthSetup({
        privateKey: privateJWK,
        publicKey: publicJWK,
      });

      const token = await issuer.signUserToken(
        { userId: "u123", email: "test@mayrlabs.com", roles: ["user"] },
        { audience: "app1", expiresIn: "1h" }
      );
      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
    });

    it("should sign a machine token correctly", async () => {
      const issuer = new IssuerAuthSetup({
        privateKey: privateJWK,
        publicKey: publicJWK,
      });

      const token = await issuer.signMachineToken(
        { sub: "service1" },
        { expiresIn: "1h" }
      );
      expect(token).toBeDefined();
    });

    it("should sign an error token correctly", async () => {
      const issuer = new IssuerAuthSetup({
        privateKey: privateJWK,
        publicKey: publicJWK,
      });

      const token = await issuer.signErrorToken(
        { message: "Error", code: "ERR_1" },
        { audience: "app1", expiresIn: "1h" }
      );

      expect(token).toBeDefined();
    });

    it("should be able to verify its own tokens", async () => {
      const issuer = new IssuerAuthSetup({
        privateKey: privateJWK,
        publicKey: publicJWK,
        issuer: "my-issuer",
      });

      const token = await issuer.signUserToken(
        { userId: "u123", email: "test@mayrlabs.com", roles: ["user"] },
        { audience: "app1", expiresIn: "1h" }
      );

      const payload = await issuer.verifyAuthToken(token);
      expect(payload).not.toBeNull();
      expect(payload?.userId).toBe("u123");
      expect(payload?.iss).toBe("my-issuer");
    });
  });

  describe("ClientAuthSetup", () => {
    const clientConfig = {
      publicKey: "", // will be set in it blockers
      clientId: "client1",
      clientSecret: "secret1",
      accountUrl: "https://auth.mayrlabs.com",
      audience: "app1",
    };

    it("should verify a valid user token", async () => {
      const issuer = new IssuerAuthSetup({
        privateKey: privateJWK,
        publicKey: publicJWK,
      });

      const token = await issuer.signUserToken(
        { userId: "u123", email: "test@mayrlabs.com", roles: ["user"] },
        { audience: "app1", expiresIn: "1h" }
      );

      const client = new ClientAuthSetup({
        ...clientConfig,
        publicKey: publicJWK,
      });

      const payload = await client.verifyAuthToken(token);

      expect(payload).not.toBeNull();
      expect(payload?.userId).toBe("u123");
      expect(payload?.email).toBe("test@mayrlabs.com");
    });

    it("should return null for invalid token", async () => {
      const client = new ClientAuthSetup({
        ...clientConfig,
        publicKey: publicJWK,
      });

      const payload = await client.verifyAuthToken("invalid-token");

      expect(payload).toBeNull();
    });

    it("should verify a valid error token", async () => {
      const issuer = new IssuerAuthSetup({
        privateKey: privateJWK,
        publicKey: publicJWK,
      });

      const token = await issuer.signErrorToken(
        { message: "Forbidden", code: "FORBIDDEN" },
        { audience: "app1", expiresIn: "1h" }
      );

      const client = new ClientAuthSetup({
        ...clientConfig,
        publicKey: publicJWK,
      });

      const payload = await client.verifyErrorToken(token);

      expect(payload).not.toBeNull();
      expect(payload?.code).toBe("FORBIDDEN");
    });

    it("should generate correct login URL", () => {
      const client = new ClientAuthSetup({
        ...clientConfig,
        publicKey: publicJWK,
      });

      const url = client.getLoginUrl();

      expect(url).toBe("https://auth.mayrlabs.com/login?appId=client1");
    });

    describe("authenticateMachine", () => {
      it("should successfully fetch machine token", async () => {
        const client = new ClientAuthSetup({
          ...clientConfig,
          publicKey: publicJWK,
        });

        const mockToken = "mock-machine-token";

        const mockFetch = vi.fn().mockResolvedValue({
          ok: true,
          json: async () => ({ token: mockToken }),
        });

        vi.stubGlobal("fetch", mockFetch);

        const token = await client.authenticateMachine();

        expect(token).toBe(mockToken);
        expect(mockFetch).toHaveBeenCalledWith(
          "https://auth.mayrlabs.com/api/auth/service",
          expect.objectContaining({
            method: "POST",
            body: JSON.stringify({
              clientId: "client1",
              clientSecret: "secret1",
            }),
          })
        );
      });

      it("should throw on authentication failure", async () => {
        const client = new ClientAuthSetup({
          ...clientConfig,
          publicKey: publicJWK,
        });

        const mockFetch = vi.fn().mockResolvedValue({
          ok: false,
          json: async () => ({
            message: "Invalid secret",
            code: "INVALID_SECRET",
          }),
        });

        vi.stubGlobal("fetch", mockFetch);

        await expect(client.authenticateMachine()).rejects.toThrow(
          "Invalid secret"
        );
      });
    });
  });
});
