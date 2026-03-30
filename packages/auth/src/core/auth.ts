import { decrypt, encrypt } from "./encryption";
import { AuthConfig, MayRLabsUser, M2MPayload } from "../types";
import { jwtVerify } from "jose";
import { DecryptedM2MResponse, M2MResponse } from "./types/m2m";

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
  getLoginUrl(returnTo?: string): string {
    const url = new URL(`${this.config.accountUrl}/login`);

    url.searchParams.set("app_id", this.config.appId);

    if (returnTo) url.searchParams.set("return_to", returnTo);

    return url.toString();
  }

  /**
   * Sends an encrypted M2M request to the MayR Labs Account system.
   *
   * @template T The expected data type of the action result.
   * @param action The specific action key to execute (e.g., 'update_settings').
   * @param userId The ID of the user the action is on behalf of.
   * @param payload Optional data to include in the request.
   * @returns A promise resolving to the decrypted result of the action.
   */
  async sendRequest<T>(
    action: string,
    userId: string,
    payload: unknown = {}
  ): Promise<T> {
    const innerPayload: M2MPayload = {
      app_id: this.config.appId,
      user_id: userId,
      action,
      created_at: new Date().toISOString(),
      payload,
    };

    // 1. Encrypt the inner payload
    const encryptedPayload = await this.encrypt(JSON.stringify(innerPayload));

    // 2. Prepare the FormData body
    const body = new FormData();
    body.set("app_id", this.config.appId);
    body.set("action", action);
    body.set("payload", encryptedPayload);

    // 3. Dispatch the request
    const response = await fetch(
      `${this.config.accountUrl}/api/encrypted-request`,
      { method: "POST", body }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`M2M HTTP Error: ${response.status} ${errorText}`);
    }

    // 4. Parse the outer JSON envelope
    const outerResult = (await response.json()) as M2MResponse;

    if (!outerResult.success) {
      const msg = outerResult.error?.message ?? "Unknown M2M transport error";

      throw new Error(
        `M2M Transport Error: ${msg} [${outerResult.error?.code ?? "N/A"}]`
      );
    }

    if (!outerResult.data?.response) {
      throw new Error(
        "M2M Error: Received successful response but missing encrypted data."
      );
    }

    // 5. Decrypt and parse the actual result
    const decryptedText = await this.decrypt(outerResult.data.response);

    const innerResult = JSON.parse(decryptedText) as DecryptedM2MResponse<T>;

    if (!innerResult.success) {
      const msg =
        innerResult.error?.message ?? "Action failed in account center";

      throw new Error(
        `M2M Action Error: ${msg} [${innerResult.error?.code ?? "N/A"}]`
      );
    }

    return innerResult.data;
  }
}
