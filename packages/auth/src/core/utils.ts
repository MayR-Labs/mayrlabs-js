import type { AuthUserPayload } from "../types";
import {
  _generateRandomString,
  ALPHANUMERIC_CHARSET,
  ALPHANUMERICDASH_CHARSET,
} from "./_utils";

/**
 * A utility class that wraps the AuthUserPayload.
 * Provides helper methods for checking roles and permissions.
 */
export class AuthUser {
  constructor(private readonly payload: AuthUserPayload) {}

  /**
   * The unique identifier for the user.
   */
  get id(): string {
    return this.payload.id;
  }

  /**
   * The user's email address.
   */
  get email(): string {
    return this.payload.email;
  }

  /**
   * The user's custom username.
   */
  get username(): string | null {
    return this.payload.username;
  }

  /**
   * The user's first name.
   */
  get firstName(): string | null {
    return this.payload.firstName;
  }

  /**
   * The user's last name.
   */
  get lastName(): string | null {
    return this.payload.lastName;
  }

  /**
   * The user's full name (firstName + lastName).
   */
  get fullName(): string {
    return `${this.firstName || ""} ${this.lastName || ""}`.trim();
  }

  /**
   * The user's list of roles.
   */
  get roles(): string[] {
    return this.payload.roles || [];
  }

  /**
   * The user's avatar image URL.
   */
  get avatarUrl(): string {
    return this.payload.avatarUrl;
  }

  /**
   * Checks if the user has a specific role.
   * @param role The role to check for.
   */
  hasRole(role: string): boolean {
    return this.roles.includes(role);
  }

  /**
   * Checks if the user has any of the specified roles.
   * @param roles An array of roles to check.
   */
  hasAnyRole(roles: string[]): boolean {
    return roles.some((r) => this.hasRole(r));
  }

  /**
   * Checks if the user has all of the specified roles.
   * @param roles An array of roles to check.
   */
  hasAllRoles(roles: string[]): boolean {
    return roles.every((r) => this.hasRole(r));
  }

  /**
   * Returns the raw payload object.
   */
  toJSON(): AuthUserPayload {
    return this.payload;
  }
}

/**
 * Generates a high-entropy cryptographically strong random string
 * to be used as a PKCE code verifier.
 *
 * @param length The length of the string (default: 64).
 * @returns The generated verifier string.
 */
export function generateCodeVerifier(length = 64): string {
  return _generateRandomString(ALPHANUMERICDASH_CHARSET, length);
}

/**
 * Generates a PKCE code challenge from a code verifier using S256 (SHA-256).
 *
 * @param verifier The code verifier string.
 * @returns A promise that resolves to the base64url encoded challenge string.
 */
export async function generateCodeChallenge(verifier: string): Promise<string> {
  const data = new TextEncoder().encode(verifier);
  const buffer = await crypto.subtle.digest("SHA-256", data);

  return b64url(new Uint8Array(buffer));
}

/**
 * Generates a random alphanumeric string of a specified length.
 *
 * @param length The length of the string (default: 32).
 * @returns The generated random string.
 */
export function generateRandomString(length = 32): string {
  return _generateRandomString(ALPHANUMERIC_CHARSET, length);
}

/**
 * Helper to encode an array buffer into a base64url string.
 */
function b64url(buffer: Uint8Array): string {
  const binary = String.fromCharCode(...buffer);
  const base64 = btoa(binary);

  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
