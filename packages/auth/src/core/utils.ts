import type { MayRLabsAuthUserPayload } from "../types";

/**
 * A utility class that wraps the MayRLabs user payload.
 * Provides helper methods for checking roles and permissions.
 */
export class MayRLabsUser {
  constructor(private readonly payload: MayRLabsAuthUserPayload) {}

  /**
   * The unique identifier for the user.
   */
  get id(): string {
    return this.payload.userId;
  }

  /**
   * The user's email address.
   */
  get email(): string {
    return this.payload.email;
  }

  /**
   * The user's list of roles.
   */
  get roles(): string[] {
    return this.payload.roles || [];
  }

  /**
   * The user's avatar image URL if provided.
   */
  get avatarUrl(): string | undefined {
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
  toJSON(): MayRLabsAuthUserPayload {
    return this.payload;
  }
}
