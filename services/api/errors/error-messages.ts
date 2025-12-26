import { HttpStatusCode } from "axios";

/**
 * App-level fallback errors (used when backend doesn't provide a structured code)
 * We keep these stable because UI logic and logging may rely on them.
 */
export const ErrorMessages = {
  UNKNOWN_ERROR: {
    msg: "An unknown error occurred",
    code: "UNKNOWN_ERROR",
    status: HttpStatusCode.InternalServerError,
  },
  NO_RESPONSE: {
    msg: "No response received from server",
    code: "NO_RESPONSE",
    status: 0, // network / CORS / offline
  },
  REQUEST_SETUP_ERROR: {
    msg: "An error occurred while setting up the request",
    code: "REQUEST_SETUP_ERROR",
    status: 0,
  },
} as const;

export type AppErrorCode =
  (typeof ErrorMessages)[keyof typeof ErrorMessages]["code"];

/**
 * Domain errors we may want to match on in UI/business logic.
 * We prefer matching on "code" rather than string includes on "msg" to avoid false positives.
 */
export const TOTPErrors = {
  TOTP_ALREADY_ENABLED: {
    msg: "authorization error: TOTP already enabled",
    code: "TOTP_ALREADY_ENABLED",
    status: HttpStatusCode.Conflict,
  },
  TOTP_NOT_CREATED: {
    msg: "authorization error: TOTP not created",
    code: "TOTP_NOT_CREATED",
    status: HttpStatusCode.Conflict,
  },
  TOTP_NOT_ENABLED: {
    msg: "authorization error: TOTP not enabled",
    code: "TOTP_NOT_ENABLED",
    status: HttpStatusCode.Conflict,
  },
  TOTP_MISSING: {
    msg: "authorization error: TOTP required",
    code: "TOTP_MISSING",
    status: HttpStatusCode.Unauthorized,
  },
  TOTP_INVALID: {
    msg: "authorization error: invalid TOTP code",
    code: "TOTP_INVALID",
    status: HttpStatusCode.Unauthorized,
  },
} as const;

export const AuthErrors = {
  CREDENTIALS_INVALID: {
    msg: "authentication error: invalid username or password (CREDENTIALS_INVALID)",
    code: "CREDENTIALS_INVALID",
    status: HttpStatusCode.Forbidden,
  },
  SESSION_INVALID: {
    msg: "authentication error: invalid session (SESSION_INVALID)",
    code: "SESSION_INVALID",
    status: HttpStatusCode.Unauthorized,
  },
  TOKEN_EXPIRED: {
    msg: "authorization error: token is expired (TOKEN_EXPIRED)",
    code: "TOKEN_EXPIRED",
    status: HttpStatusCode.Unauthorized,
  },
  TOKEN_INVALID_CLAIMS: {
    msg: "authorization error: token has invalid claims (TOKEN_INVALID_CLAIMS)",
    code: "TOKEN_INVALID_CLAIMS",
    status: HttpStatusCode.Unauthorized,
  },
  AUTH_HEADER_MISSING: {
    msg: "authorization error: authorization header not found (AUTH_HEADER_MISSING)",
    code: "AUTH_HEADER_MISSING",
    status: HttpStatusCode.Unauthorized,
  },
} as const;

export const DomainErrors = {
  ENTITY_NOT_FOUND: {
    msg: "Client not found (ENTITY_NOT_FOUND)",
    code: "ENTITY_NOT_FOUND",
    status: HttpStatusCode.NotFound,
  },
  TRADE_PRICE_OUT_OF_RANGE: {
    msg: "constraint violation: trade order price out of range (TRADE_PRICE_OUT_OF_RANGE)",
    code: "TRADE_PRICE_OUT_OF_RANGE",
    status: HttpStatusCode.Conflict,
  },
  OTP_EXPIRED: {
    msg: "OTP code has expired",
    code: "OTP_EXPIRED",
    status: HttpStatusCode.Unauthorized,
  },
  OTP_INVALID: {
    msg: "Invalid OTP code",
    code: "OTP_INVALID",
    status: HttpStatusCode.Unauthorized,
  },
  TOTP_RESET_RECENTLY: {
    msg: "authentication error: TOTP recently (TOTP_RESET_RECENTLY)",
    code: "TOTP_RESET_RECENTLY",
    status: HttpStatusCode.Forbidden,
  },
} as const;

export type KnownDomainErrorCode =
  | (typeof TOTPErrors)[keyof typeof TOTPErrors]["code"]
  | (typeof AuthErrors)[keyof typeof AuthErrors]["code"]
  | (typeof DomainErrors)[keyof typeof DomainErrors]["code"];

export function isKnownDomainErrorCode(
  code: string
): code is KnownDomainErrorCode {
  return (
    Object.values(TOTPErrors).some((e) => e.code === code) ||
    Object.values(AuthErrors).some((e) => e.code === code) ||
    Object.values(DomainErrors).some((e) => e.code === code)
  );
}

export function isTOTPError(code: string): boolean {
  return Object.values(TOTPErrors).some((e) => e.code === code);
}
