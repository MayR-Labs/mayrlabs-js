import { decrypt, encrypt } from "./encryption";
import { AuthConfig, MayRLabsUser, M2MPayload } from "../types";
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
      session: {
        key: config.session?.key || "mayrlabs-session",
      },
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
  getLoginUrl(returnTo?: string): string {
    const url = new URL(`${this.config.accountUrl}/login`);

    url.searchParams.set("app_id", this.config.appId);

    if (returnTo) url.searchParams.set("return_to", returnTo);

    return url.toString();
  }

  /**
   * Sends an encrypted M2M request to the central account system.
   */
  async sendRequest<T>(
    action: string,
    userId: string,
    payload: any = {}
  ): Promise<T> {
    const innerPayload: M2MPayload = {
      app_id: this.config.appId,
      user_id: userId,
      action,
      created_at: new Date().toISOString(),
      payload,
    };

    const encrypted = await this.encrypt(JSON.stringify(innerPayload));

    const response = await fetch(
      `${this.config.accountUrl}/api/encrypted-request`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          app_id: this.config.appId,
          action,
          payload: encrypted,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`M2M Request failed: ${response.status} ${errorText}`);
    }

    const result = (await response.json()) as any;

    // If the response payload is encrypted, decrypt it.
    if (
      result &&
      typeof result === "object" &&
      "payload" in result &&
      typeof result.payload === "string"
    ) {
      const decrypted = await this.decrypt(result.payload);
      return JSON.parse(decrypted) as T;
    }

    return result as T;
  }
}
