import { type CryptoKey, importJWK, jwtVerify } from "jose";
import { MayRLabsAuthError } from "../errors";
import type {
  MayRLabsAuthErrorPayload,
  MayRLabsAuthUserPayload,
} from "../types";

export abstract class BaseAuthSetup<
  T extends { publicKey: string; issuer: string; audience?: string },
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

  async #verifyToken<ResponseT>(token: string): Promise<ResponseT | null> {
    try {
      const key = await this.getPublicKey();

      const { payload } = await jwtVerify(token, key, {
        algorithms: ["PS256"],
        issuer: this.config.issuer,
        audience: this.config.audience,
      });

      return payload as unknown as ResponseT;
    } catch (error) {
      if (error instanceof MayRLabsAuthError) throw error;
      return null;
    }
  }

  async verifyAuthToken(
    token: string
  ): Promise<MayRLabsAuthUserPayload | null> {
    return this.#verifyToken<MayRLabsAuthUserPayload>(token);
  }

  async verifyErrorToken(
    token: string
  ): Promise<MayRLabsAuthErrorPayload | null> {
    return this.#verifyToken<MayRLabsAuthErrorPayload>(token);
  }
}
