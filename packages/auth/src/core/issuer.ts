import { type CryptoKey, importJWK, SignJWT } from "jose";
import { MayRLabsAuthError } from "../errors";
import type {
  IssuerConfig,
  MayRLabsAuthErrorPayload,
  MayRLabsAuthMachinePayload,
  MayRLabsAuthUserPayload,
} from "../types";
import { ISSUER } from "./constants";

export class IssuerAuthSetup {
  private _key: CryptoKey | null = null;
  private readonly privateKey: string;

  constructor(config: IssuerConfig) {
    this.privateKey = config.privateKey;
  }

  private async getKey(): Promise<CryptoKey> {
    if (this._key) return this._key;

    try {
      this._key = (await importJWK(
        JSON.parse(this.privateKey),
        "PS256"
      )) as CryptoKey;

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

    return new SignJWT(payload)
      .setProtectedHeader({ alg: "PS256" })
      .setIssuer(ISSUER)
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
      iss: ISSUER,
      aud: "mayrlabs-internal",
    };

    return new SignJWT(machinePayload as unknown as Record<string, unknown>)
      .setProtectedHeader({ alg: "PS256" })
      .setIssuer(ISSUER)
      .setAudience("mayrlabs-internal")
      .setIssuedAt()
      .setExpirationTime(options.expiresIn)
      .sign(key);
  }

  async signErrorToken(
    payload: { message: string; code: string },
    options: { audience: string; expiresIn: string | number }
  ): Promise<string> {
    const key = await this.getKey();

    const errorPayload: MayRLabsAuthErrorPayload = {
      ...payload,
      iss: ISSUER,
    };

    return new SignJWT(errorPayload as unknown as Record<string, unknown>)
      .setProtectedHeader({ alg: "PS256" })
      .setIssuer(ISSUER)
      .setAudience(options.audience)
      .setIssuedAt()
      .setExpirationTime(options.expiresIn)
      .sign(key);
  }
}
