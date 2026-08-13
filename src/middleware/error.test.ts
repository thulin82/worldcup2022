import { beforeEach, describe, expect, it, vi } from "vitest";
import type { NextFunction, Request, Response } from "express";
import { errorHandler } from "./error.js";
import { ErrorResponse } from "../utils/errorResponse.js";

function mockRes() {
  const res = {} as Response;
  res.status = vi.fn().mockReturnValue(res);
  res.render = vi.fn().mockReturnValue(res);
  return res;
}

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("errorHandler", () => {
  it("renders the error view with the ErrorResponse status and message", () => {
    const res = mockRes();

    errorHandler(
      new ErrorResponse("Group must be a single letter", 400),
      {} as Request,
      res,
      vi.fn() as NextFunction
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.render).toHaveBeenCalledWith("error", {
      statusCode: 400,
      message: "Group must be a single letter",
    });
  });

  it("hides internal details behind a 500", () => {
    const res = mockRes();

    errorHandler(
      new Error("connect ECONNREFUSED 10.0.0.1:443"),
      {} as Request,
      res,
      vi.fn() as NextFunction
    );

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.render).toHaveBeenCalledWith("error", {
      statusCode: 500,
      message: "Something went wrong",
    });
  });
});
