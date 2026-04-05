import { type CryptoKey, importJWK, jwtVerify } from "jose";
import { MayRLabsAuthError } from "../errors";
import type {
  MayRLabsAuthErrorPayload,
  MayRLabsAuthMachinePayload,
  MayRLabsAuthUserPayload,
} from "../types";
import { MACHINE_AUDIENCE } from "./constants";

export abstract class BaseAuthSetup<
  T extends { publicKey: string; issuer: string },
> {
  protected _publicKey: CryptoKey | null = null;

  public readonly config: T;

  constructor(config: T) {
    this.config = config;
  }

  protected async _getKey(
    keyString: string,
    keyType: "Public" | "Private"
  ): Promise<CryptoKey> {
    try {
      return (await importJWK(JSON.parse(keyString), "PS256")) as CryptoKey;
    } catch (error) {
      throw new MayRLabsAuthError(
        `Failed to import ${keyType} JWK: ${error instanceof Error ? error.message : "Unknown error"}`,
        `INVALID_${keyType.toUpperCase()}_KEY`
      );
    }
  }

  protected async getPublicKey(): Promise<CryptoKey> {
    this._publicKey ??= await this._getKey(this.config.publicKey, "Public");

    return this._publicKey;
  }

  async #verifyToken<ResponseT>(
    token: string,
    audience?: string
  ): Promise<ResponseT | null> {
    try {
      const key = await this.getPublicKey();

      const { payload } = await jwtVerify(token, key, {
        algorithms: ["PS256"],
        issuer: this.config.issuer,
        audience,
      });

      return payload as ResponseT;
    } catch (error) {
      if (error instanceof MayRLabsAuthError) throw error;
      return null;
    }
  }

  async verifyAuthToken(
    token: string,
    audience?: string
  ): Promise<MayRLabsAuthUserPayload | null> {
    return this.#verifyToken<MayRLabsAuthUserPayload>(token, audience);
  }

  async verifyErrorToken(
    token: string,
    audience?: string
  ): Promise<MayRLabsAuthErrorPayload | null> {
    return this.#verifyToken<MayRLabsAuthErrorPayload>(token, audience);
  }

  async verifyMachineToken(
    token: string
  ): Promise<MayRLabsAuthMachinePayload | null> {
    return this.#verifyToken<MayRLabsAuthMachinePayload>(
      token,
      MACHINE_AUDIENCE
    );
  }
}
