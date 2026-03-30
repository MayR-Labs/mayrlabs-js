import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { AuthSetup } from "./auth";
import { SignJWT } from "jose";

describe("AuthSetup", () => {
  const config = {
    appId: "test-app",
    clientSecret: "test-secret-at-least-32-chars-long-!!!",
    accountUrl: "https://auth.test.com",
    redirects: { error: "/login", success: "/dashboard" },
    session: { key: "test-session" },
  };

  const setup = new AuthSetup(config);

  it("should verify a valid error token", async () => {
    const errorPayload = {
      errorCode: "AUTH_FAILED",
      message: "Invalid credentials",
    };
    const secret = new TextEncoder().encode(config.clientSecret);
    const token = await new SignJWT(errorPayload)
      .setProtectedHeader({ alg: "HS256" })
      .sign(secret);

    const verified = await setup.verifyErrorToken(token);
    expect(verified).toMatchObject(errorPayload);
  });

  it("should return null for an invalid error token", async () => {
    const verified = await setup.verifyErrorToken("invalid-token");
    expect(verified).toBeNull();
  });

  it("should return null for a token signed with wrong secret", async () => {
    const errorPayload = {
      errorCode: "AUTH_FAILED",
      message: "Invalid credentials",
    };
    const secret = new TextEncoder().encode(
      "wrong-secret-!!!-wrong-secret-!!!"
    );
    const token = await new SignJWT(errorPayload)
      .setProtectedHeader({ alg: "HS256" })
      .sign(secret);

    const verified = await setup.verifyErrorToken(token);
    expect(verified).toBeNull();
  });

  describe("sendRequest", () => {
    let fetchSpy: any;

    beforeEach(() => {
      fetchSpy = vi.spyOn(global, "fetch");
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should throw on non-2xx HTTP responses", async () => {
      fetchSpy.mockResolvedValue({
        ok: false,
        status: 500,
        text: async () => "Internal Server Error",
      } as Response);

      await expect(setup.sendRequest("test_action", "user_1")).rejects.toThrow(
        "M2M HTTP Error: 500 Internal Server Error"
      );
    });

    it("should throw on success: false outer envelope", async () => {
      fetchSpy.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: false,
          error: { message: "Account locked", code: "LOCKED" },
        }),
      } as Response);

      await expect(setup.sendRequest("test_action", "user_1")).rejects.toThrow(
        "M2M Transport Error: Account locked [LOCKED]"
      );
    });

    it("should throw when successful envelope is missing encrypted response", async () => {
      fetchSpy.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: {}, // missing response property
        }),
      } as Response);

      await expect(setup.sendRequest("test_action", "user_1")).rejects.toThrow(
        "M2M Error: Received successful response but missing encrypted data."
      );
    });

    it("should throw on success: false inner envelope", async () => {
      const innerResponse = {
        success: false,
        error: { message: "User not found", code: "NOT_FOUND" },
      };
      const encryptedInner = await setup.encrypt(JSON.stringify(innerResponse));

      fetchSpy.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: { response: encryptedInner },
        }),
      } as Response);

      await expect(setup.sendRequest("test_action", "user_1")).rejects.toThrow(
        "M2M Action Error: User not found [NOT_FOUND]"
      );
    });

    it("should successfully decrypt and return data for successful flow", async () => {
      const targetData = { synced: true };
      const innerResponse = {
        success: true,
        data: targetData,
      };
      const encryptedInner = await setup.encrypt(JSON.stringify(innerResponse));

      fetchSpy.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: { response: encryptedInner },
        }),
      } as Response);

      const result = await setup.sendRequest("test_action", "user_1");
      expect(result).toEqual(targetData);

      // Verify fetch was called with correct structure
      expect(fetchSpy).toHaveBeenCalledWith(
        `${config.accountUrl}/api/encrypted-request`,
        expect.objectContaining({
          method: "POST",
          body: expect.any(FormData),
        })
      );
    });
  });
});
