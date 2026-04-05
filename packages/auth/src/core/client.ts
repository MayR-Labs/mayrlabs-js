import { MayRLabsAuthError } from "../errors";
import type { ClientConfig, ClientConfigInput } from "../types";
import { BaseAuthSetup } from "./base";
import { ISSUER } from "./constants";

const DEFAULTS = {
  redirects: { error: "/login", success: "/dashboard" },
  session: { key: "mayrlabs-session" },
};

export class ClientAuthSetup extends BaseAuthSetup<ClientConfig> {
  constructor(input: ClientConfigInput) {
    super({
      ...input,
      issuer: input.issuer || ISSUER,
      redirects: { ...DEFAULTS.redirects, ...input.redirects },
      session: { ...DEFAULTS.session, ...input.session },
    });
  }

  getLoginUrl(): string {
    const url = new URL(`${this.config.accountUrl}/login`);
    url.searchParams.set("appId", this.config.clientId);

    return url.toString();
  }

  async authenticateMachine(): Promise<string> {
    try {
      const response = await fetch(
        `${this.config.accountUrl}/api/auth/service`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientId: this.config.clientId,
            clientSecret: this.config.clientSecret,
          }),
        }
      );

      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as {
          message?: string;
          code?: string;
        };

        throw new MayRLabsAuthError(
          errorData.message || "Failed to authenticate machine",
          errorData.code || "MACHINE_AUTH_FAILED"
        );
      }

      const data = (await response.json()) as { token: string };

      return data.token;
    } catch (error) {
      if (error instanceof MayRLabsAuthError) throw error;

      throw new MayRLabsAuthError(
        `Machine authentication network error: ${error instanceof Error ? error.message : "Unknown error"}`,
        "MACHINE_AUTH_NETWORK_ERROR"
      );
    }
  }
}
