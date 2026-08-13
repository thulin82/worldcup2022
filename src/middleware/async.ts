import type { NextFunction, Request, Response } from "express";

type AsyncRequestHandler<Req extends Request = Request> = (
  req: Req,
  res: Response,
  next: NextFunction
) => Promise<unknown>;

/**
 * Wraps an async Express handler so rejected promises are forwarded to next().
 */
export const asyncHandler =
  <Req extends Request = Request>(fn: AsyncRequestHandler<Req>) =>
  (req: Req, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);
