export class MayRLabsAuthError extends Error {
  constructor(
    message: string,
    public readonly code: string = "AUTH_ERROR"
  ) {
    super(message);
    this.name = "MayRLabsAuthError";
  }
}

export class UnauthenticatedError extends MayRLabsAuthError {
  constructor(message: string = "User is not authenticated.") {
    super(message, "UNAUTHENTICATED");
    this.name = "UnauthenticatedError";
  }
}
