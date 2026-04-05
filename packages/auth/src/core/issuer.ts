import { type CryptoKey, SignJWT } from "jose";
import type {
  IssuerConfig,
  IssuerConfigInput,
  MayRLabsAuthErrorPayload,
  MayRLabsAuthMachinePayload,
  MayRLabsAuthUserPayload,
} from "../types";
import { BaseAuthSetup } from "./base";
import { ISSUER, MACHINE_AUDIENCE } from "./constants";

export class IssuerAuthSetup extends BaseAuthSetup<IssuerConfig> {
  private _privateKey: CryptoKey | null = null;

  constructor(config: IssuerConfigInput) {
    super({ ...config, issuer: config.issuer || ISSUER });
  }

  private async getPrivateKey(): Promise<CryptoKey> {
    this._privateKey ??= await this._getKey(this.config.privateKey, "Private");

    return this._privateKey;
  }

  async signUserToken(
    payload: Omit<MayRLabsAuthUserPayload, "iat" | "exp" | "iss" | "aud">,
    options: { audience: string; expiresIn?: string | number },
  ): Promise<string> {
    const key = await this.getPrivateKey();

    return new SignJWT(payload as unknown as Record<string, unknown>)
      .setProtectedHeader({ alg: "PS256" })
      .setIssuer(this.config.issuer)
      .setAudience(options.audience)
      .setIssuedAt()
      .setExpirationTime(options.expiresIn || "7d")
      .sign(key);
  }

  async signMachineToken(
    payload: { sub: string },
    options: { expiresIn?: string | number },
  ): Promise<string> {
    const key = await this.getPrivateKey();

    const machinePayload: MayRLabsAuthMachinePayload = {
      ...payload,
      type: "machine",
    };

    return new SignJWT(machinePayload as unknown as Record<string, unknown>)
      .setProtectedHeader({ alg: "PS256" })
      .setIssuer(this.config.issuer)
      .setAudience(MACHINE_AUDIENCE)
      .setIssuedAt()
      .setExpirationTime(options.expiresIn || "1h")
      .sign(key);
  }

  async signErrorToken(
    payload: { message: string; code: string },
    options: { audience: string; expiresIn?: string | number },
  ): Promise<string> {
    const key = await this.getPrivateKey();

    const errorPayload: MayRLabsAuthErrorPayload = {
      ...payload,
    };

    return new SignJWT(errorPayload as unknown as Record<string, unknown>)
      .setProtectedHeader({ alg: "PS256" })
      .setIssuer(this.config.issuer)
      .setAudience(options.audience)
      .setIssuedAt()
      .setExpirationTime(options.expiresIn || "1h")
      .sign(key);
  }
}
