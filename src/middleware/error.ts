import type { NextFunction, Request, Response } from "express";
import { ErrorResponse } from "../utils/errorResponse.js";

/**
 * Renders a friendly error page and hides internal details for 5xx responses.
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error(err.stack);

  const statusCode = err instanceof ErrorResponse ? err.statusCode : 500;
  const message = statusCode >= 500 ? "Something went wrong" : err.message;

  res.status(statusCode).render("error", { statusCode, message });
}
