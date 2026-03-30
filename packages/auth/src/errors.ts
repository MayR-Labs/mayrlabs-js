export class AuthError extends Error {
  constructor(
    message: string,
    public readonly code: string = "AUTH_ERROR"
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export class UnauthenticatedError extends AuthError {
  constructor(message: string = "User is not authenticated.") {
    super(message, "UNAUTHENTICATED");
    this.name = "UnauthenticatedError";
  }
}
