import type { Request, Response } from "express";
import { asyncHandler } from "../middleware/async.js";
import { scorersService } from "../services/scorersService.js";

// @desc    Tournament top scorers
// @route   GET /scorers
// @access  Public
export const getScorers = asyncHandler(async (_req: Request, res: Response) => {
  const result = await scorersService.getTopScorers();

  res.render("scorers", { result });
});
