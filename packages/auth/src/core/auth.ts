import { importJWK, SignJWT, jwtVerify } from "jose";
import type {
  IssuerConfig,
  ClientConfig,
  MayRLabsAuthUserPayload,
  MayRLabsAuthMachinePayload,
  MayRLabsAuthErrorPayload,
} from "../types";
import { MayRLabsAuthError } from "../errors";

export class IssuerAuthSetup {
  private _key: any = null;

  private readonly privateKey: string;
  private readonly issuer: string;

  constructor(config: IssuerConfig) {
    this.privateKey = config.privateKey;
    this.issuer = config.issuer || "auth.mayrlabs.com";
  }

  private async getKey(): Promise<any> {
    if (this._key) return this._key;

    try {
      this._key = (await importJWK(
        JSON.parse(this.privateKey),
        "PS256"
      )) as any;

      return this._key;
    } catch (error) {
      throw new MayRLabsAuthError(
        `Failed to import Private JWK: ${error instanceof Error ? error.message : "Unknown error"}`,
        "INVALID_PRIVATE_KEY"
      );
    }
  }

  async signUserToken(
    payload: Omit<MayRLabsAuthUserPayload, "iat" | "exp" | "iss" | "aud">,
    options: { audience: string; expiresIn: string | number }
  ): Promise<string> {
    const key = await this.getKey();

    return new SignJWT(payload as any)
      .setProtectedHeader({ alg: "PS256" })
      .setIssuer(this.issuer)
      .setAudience(options.audience)
      .setIssuedAt()
      .setExpirationTime(options.expiresIn)
      .sign(key);
  }

  async signMachineToken(
    payload: { sub: string },
    options: { expiresIn: string | number }
  ): Promise<string> {
    const key = await this.getKey();

    const machinePayload: MayRLabsAuthMachinePayload = {
      ...payload,
      type: "machine",
      iat: Math.floor(Date.now() / 1000),
      exp: 0, // Will be overriden by setExpirationTime
      iss: this.issuer as "auth.mayrlabs.com",
      aud: "mayrlabs-internal",
    };

    return new SignJWT(machinePayload as any)
      .setProtectedHeader({ alg: "PS256" })
      .setIssuer(this.issuer)
      .setAudience("mayrlabs-internal")
      .setIssuedAt()
      .setExpirationTime(options.expiresIn)
      .sign(key);
  }

  async signErrorToken(payload: {
    message: string;
    code: string;
  }): Promise<string> {
    const key = await this.getKey();

    const errorPayload: MayRLabsAuthErrorPayload = {
      ...payload,
      iat: Math.floor(Date.now() / 1000),
      iss: this.issuer as "auth.mayrlabs.com",
    };

    return new SignJWT(errorPayload as any)
      .setProtectedHeader({ alg: "PS256" })
      .setIssuer(this.issuer)
      .setIssuedAt()
      .sign(key);
  }
}

export class ClientAuthSetup {
  private _key: any = null;
  public readonly config: ClientConfig;

  constructor(config: ClientConfig) {
    this.config = {
      ...config,
      accountUrl: config.accountUrl.replace(/\/$/, ""),
    };
  }

  private async getKey(): Promise<any> {
    if (this._key) return this._key;

    try {
      this._key = (await importJWK(
        JSON.parse(this.config.publicKey),
        "PS256"
      )) as any;

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
      });

      return payload as unknown as MayRLabsAuthUserPayload;
    } catch {
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
      });

      return payload as unknown as MayRLabsAuthErrorPayload;
    } catch {
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
        `Machine authentication failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        "MACHINE_AUTH_FAILED"
      );
    }
  }
}
