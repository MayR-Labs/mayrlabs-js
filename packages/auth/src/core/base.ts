import {
  type CryptoKey,
  createRemoteJWKSet,
  importJWK,
  type JWTVerifyGetKey,
  jwtVerify,
} from "jose";
import { MayRLabsAuthError } from "../errors";
import type {
  MayRLabsAuthErrorPayload,
  MayRLabsAuthMachinePayload,
  MayRLabsAuthUserPayload,
} from "../types";
import { MACHINE_AUDIENCE } from "./constants";

export abstract class BaseAuthSetup<
  T extends {
    publicKey?: string;
    issuer: string;
    remotePublicKey?: boolean;
    accountUrl?: string;
  },
> {
  protected _publicKey: CryptoKey | null = null;
  protected _jwks: JWTVerifyGetKey | null = null;

  public readonly config: T;

  constructor(config: T) {
    this.config = config;
  }

  protected async _getKey(
    keyString: string,
    keyType: "Public" | "Private",
  ): Promise<CryptoKey> {
    try {
      return (await importJWK(JSON.parse(keyString), "PS256")) as CryptoKey;
    } catch (error) {
      throw new MayRLabsAuthError(
        `Failed to import ${keyType} JWK: ${error instanceof Error ? error.message : "Unknown error"}`,
        `INVALID_${keyType.toUpperCase()}_KEY`,
      );
    }
  }

  protected async getVerifyKey(): Promise<CryptoKey | JWTVerifyGetKey> {
    if (this.config.remotePublicKey && this.config.accountUrl) {
      this._jwks ??= createRemoteJWKSet(
        new URL(`${this.config.accountUrl}/.well-known/jwks.json`),
      );

      return this._jwks;
    }

    if (!this.config.publicKey) {
      throw new MayRLabsAuthError(
        "Local public key missing and remotePublicKey not enabled.",
        "MISSING_PUBLIC_KEY",
      );
    }

    this._publicKey ??= await this._getKey(this.config.publicKey, "Public");

    return this._publicKey;
  }

  async #verifyToken<ResponseT>(
    token: string,
    audience?: string,
  ): Promise<ResponseT | null> {
    try {
      const key = await this.getVerifyKey();

      const { payload } = await jwtVerify(
        token,
        key as Parameters<typeof jwtVerify>[1],
        {
          algorithms: ["PS256"],
          issuer: this.config.issuer,
          audience,
        },
      );

      return payload as ResponseT;
    } catch (error) {
      if (error instanceof MayRLabsAuthError) throw error;

      return null;
    }
  }

  /**
   * Verifies an authentication token and returns its payload on success.
   *
   * @param token The JWT string to verify.
   * @param audience The expected audience of the token.
   *
   * @returns The user payload if token is valid, or null.
   */
  async verifyAuthToken(
    token: string,
    audience?: string,
  ): Promise<MayRLabsAuthUserPayload | null> {
    return this.#verifyToken<MayRLabsAuthUserPayload>(token, audience);
  }

  /**
   * Verifies an error token created by the authentication issuer.
   *
   * @param token The JWT string.
   * @param audience The expected audience.
   *
   * @returns The error payload if valid, or null.
   */
  async verifyErrorToken(
    token: string,
    audience?: string,
  ): Promise<MayRLabsAuthErrorPayload | null> {
    return this.#verifyToken<MayRLabsAuthErrorPayload>(token, audience);
  }

  /**
   * Verifies a machine-to-machine authentication token.
   *
   * @param token The JWT string.
   *
   * @returns The machine payload if valid, or null.
   */
  async verifyMachineToken(
    token: string,
  ): Promise<MayRLabsAuthMachinePayload | null> {
    return this.#verifyToken<MayRLabsAuthMachinePayload>(
      token,
      MACHINE_AUDIENCE,
    );
  }
}
