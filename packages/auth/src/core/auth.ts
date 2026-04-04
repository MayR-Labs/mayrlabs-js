import { decrypt, encrypt } from "./encryption";
import type { AuthConfig, MayRLabsUser } from "../types";
import { jwtVerify } from "jose";

export class AuthSetup {
  public config: AuthConfig;

  constructor(config: AuthConfig) {
    this.config = {
      appId: config.appId,
      clientSecret: config.clientSecret,
      accountUrl: config.accountUrl || "https://myaccount.mayrlabs.com",
      redirects: {
        error: config.redirects?.error || "/login",
        success: config.redirects?.success || "/dashboard",
      },
      session: { key: config.session?.key || "mayrlabs-session" },
    };
  }

  /**
   * Encrypts a payload for secure communication.
   */
  async encrypt(payload: string): Promise<string> {
    return encrypt(payload, this.config.clientSecret);
  }

  /**
   * Decrypts a payload coming from a secure source.
   */
  async decrypt(encrypted: string): Promise<string> {
    return decrypt(encrypted, this.config.clientSecret);
  }

  async #verifyToken<PayloadT>(token: string): Promise<PayloadT | null> {
    try {
      const secret = new TextEncoder().encode(this.config.clientSecret);

      const { payload } = await jwtVerify(token, secret);

      return payload as unknown as PayloadT;
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          "Auth: Token verification failed:",
          error instanceof Error ? error.message : error
        );
      }

      return null;
    }
  }

  /**
   * Verifies the session token and returns the user data.
   */
  async verifyAuthToken(token: string): Promise<MayRLabsUser | null> {
    return this.#verifyToken<MayRLabsUser>(token);
  }

  /**
   * Verifies an error token and returns its payload.
   */
  async verifyErrorToken(
    token: string
  ): Promise<{ errorCode: string; message: string } | null> {
    return this.#verifyToken<{ errorCode: string; message: string }>(token);
  }

  /**
   * Returns the centralized login URL.
   */
  getLoginUrl(): string {
    const url = new URL(`${this.config.accountUrl}/login`);

    url.searchParams.set("app_id", this.config.appId);

    return url.toString();
  }
}
