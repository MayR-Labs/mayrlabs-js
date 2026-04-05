import { type CryptoKey, importJWK, jwtVerify } from "jose";
import { MayRLabsAuthError } from "../errors";
import type {
  ClientConfig,
  ClientConfigInput,
  MayRLabsAuthErrorPayload,
  MayRLabsAuthUserPayload,
} from "../types";
import { ISSUER } from "./constants";

const DEFAULTS = {
  redirects: {
    error: "/login",
    success: "/dashboard",
  },
  session: {
    key: "mayrlabs_session",
  },
};

export class ClientAuthSetup {
  private _key: CryptoKey | null = null;
  public readonly config: ClientConfig;

  constructor(input: ClientConfigInput) {
    this.config = {
      ...input,
      issuer: input.issuer || ISSUER,
      redirects: { ...DEFAULTS.redirects, ...input.redirects },
      session: { ...DEFAULTS.session, ...input.session },
    };
  }

  private async getKey(): Promise<CryptoKey> {
    if (this._key) return this._key;

    try {
      this._key = (await importJWK(
        JSON.parse(this.config.publicKey),
        "PS256"
      )) as CryptoKey;

      return this._key;
    } catch (error) {
      throw new MayRLabsAuthError(
        `Failed to import Public JWK: ${error instanceof Error ? error.message : "Unknown error"}`,
        "INVALID_PUBLIC_KEY"
      );
    }
  }

  getLoginUrl(): string {
    const url = new URL(`${this.config.accountUrl}/login`);
    url.searchParams.set("appId", this.config.clientId);

    return url.toString();
  }

  async verifyAuthToken(
    token: string
  ): Promise<MayRLabsAuthUserPayload | null> {
    try {
      const key = await this.getKey();

      const { payload } = await jwtVerify(token, key, {
        algorithms: ["PS256"],
        issuer: this.config.issuer,
        audience: this.config.audience,
      });

      return payload as unknown as MayRLabsAuthUserPayload;
    } catch (error) {
      if (error instanceof MayRLabsAuthError) throw error;
      return null;
    }
  }

  async verifyErrorToken(
    token: string
  ): Promise<MayRLabsAuthErrorPayload | null> {
    try {
      const key = await this.getKey();

      const { payload } = await jwtVerify(token, key, {
        algorithms: ["PS256"],
        issuer: this.config.issuer,
        audience: this.config.audience,
      });

      return payload as unknown as MayRLabsAuthErrorPayload;
    } catch (error) {
      if (error instanceof MayRLabsAuthError) throw error;
      return null;
    }
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
