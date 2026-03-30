import { describe, it, expect } from "vitest";
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
});
