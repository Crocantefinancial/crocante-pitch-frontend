import type { AxiosError } from "axios";
import { ErrorMessages } from "./error-messages";

/**
 * Normalized domain error used across the app.
 * Axios errors MUST be converted to this type at the boundary.
 */
export class ServiceError extends Error {
  readonly code: string;
  readonly status: number;
  readonly details?: unknown;

  constructor(params: {
    message: string;
    code: string;
    status: number;
    details?: unknown;
  }) {
    super(params.message);
    this.name = "ServiceError";
    this.code = params.code;
    this.status = params.status;
    this.details = params.details;

    // Fix prototype chain (important for instanceof)
    Object.setPrototypeOf(this, ServiceError.prototype);
  }

  /**
   * Convert any Axios error into a ServiceError.
   * This should be the ONLY place Axios error shapes are handled.
   */
  static fromAxiosError(error: unknown): ServiceError {
    if (!isAxiosError(error)) {
      return new ServiceError({
        message: ErrorMessages.UNKNOWN_ERROR.msg,
        code: ErrorMessages.UNKNOWN_ERROR.code,
        status: 0,
      });
    }

    const status = error.response?.status ?? 0;
    const data = error.response?.data;

    /**
     * Supported backend shapes:
     *
     * 1) { error: { msg: string; code: string } }
     * 2) { error: string }
     * 3) { message: string; code?: string }
     * 4) empty / malformed
     */

    // Case 1: structured error
    if (
      data &&
      typeof data === "object" &&
      "error" in data &&
      typeof (data as any).error === "object"
    ) {
      const err = (data as any).error;
      return new ServiceError({
        message: err.msg ?? ErrorMessages.UNKNOWN_ERROR.msg,
        code: err.code ?? ErrorMessages.UNKNOWN_ERROR.code,
        status,
        details: data,
      });
    }

    // Case 2: error as string
    if (
      data &&
      typeof data === "object" &&
      "error" in data &&
      typeof (data as any).error === "string"
    ) {
      return new ServiceError({
        message: (data as any).error,
        code: ErrorMessages.UNKNOWN_ERROR.code,
        status,
        details: data,
      });
    }

    // Case 3: message at top level
    if (data && typeof data === "object" && "message" in data) {
      return new ServiceError({
        message: String((data as any).message),
        code: (data as any).code ?? ErrorMessages.UNKNOWN_ERROR.code,
        status,
        details: data,
      });
    }

    // Case 4: no response (network error)
    if (error.request && !error.response) {
      return new ServiceError({
        message: ErrorMessages.NO_RESPONSE.msg,
        code: ErrorMessages.NO_RESPONSE.code,
        status: 0,
      });
    }

    // Fallback
    return new ServiceError({
      message: ErrorMessages.REQUEST_SETUP_ERROR.msg,
      code: ErrorMessages.REQUEST_SETUP_ERROR.code,
      status,
    });
  }
}

/**
 * Narrow unknown to AxiosError
 */
function isAxiosError(error: unknown): error is AxiosError {
  return typeof error === "object" && error !== null && "isAxiosError" in error;
}

export default ServiceError;
