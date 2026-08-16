export class AppError extends Error {
  public readonly statusCode: number;
  public readonly status: "fail" | "error";
  public readonly isOperational: boolean;
  public readonly code?: string;
  public readonly details?: unknown;

  constructor(
    message: string,
    statusCode: number,
    options?: { code?: string; details?: unknown; isOperational?: boolean },
  ) {
    super(message);

    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
    this.isOperational = options?.isOperational ?? true;
    if (options?.code !== undefined) {
      this.code = options.code;
    }
    if (options?.details !== undefined) {
      this.details = options.details;
    }

    Error.captureStackTrace(this, this.constructor);
  }
}
