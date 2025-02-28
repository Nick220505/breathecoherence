export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export class UserExistsError extends AuthError {
  constructor() {
    super("User already exists");
    this.name = "UserExistsError";
  }
}

export class InvalidVerificationError extends AuthError {
  constructor() {
    super("Invalid or expired verification code");
    this.name = "InvalidVerificationError";
  }
}
