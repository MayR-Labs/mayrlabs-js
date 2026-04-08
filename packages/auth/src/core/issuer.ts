import { type CryptoKey, SignJWT } from "jose";
import type {
  IssuerConfig,
  IssuerConfigInput,
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

  /**
   * Signs a JWT for an authenticated user.
   * Uses the PS256 algorithm and the configured private key.
   *
   * @param payload User data to include inside the token (omitting standard JWT claims).
   * @param options Configuration for audience and expiration. Default expiration is 7d.
   *
   * @returns A promise that resolves to the signed JWT string.
   */
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

  /**
   * Signs a JWT for machine-to-machine communications.
   * Incorporates a dedicated machine audience and type identifier.
   *
   * @param payload Minimal payload containing the subject ('sub') of the machine.
   * @param options Configuration for expiration. Default expiration is 1h.
   *
   * @returns A promise that resolves to the signed JWT machine token string.
   */
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

  /**
   * Signs a JWT intended to communicate an authentication error back to the client.
   *
   * @param payload Error details containing a 'message' and an error 'code'.
   * @param options Configuration for audience and expiration. Default expiration is 1h.
   *
   * @returns A promise that resolves to the signed JWT error token string.
   */
  async signErrorToken(
    payload: { message: string; code: string },
    options: { audience: string; expiresIn?: string | number },
  ): Promise<string> {
    const key = await this.getPrivateKey();

    return new SignJWT(payload)
      .setProtectedHeader({ alg: "PS256" })
      .setIssuer(this.config.issuer)
      .setAudience(options.audience)
      .setIssuedAt()
      .setExpirationTime(options.expiresIn || "1h")
      .sign(key);
  }
}
