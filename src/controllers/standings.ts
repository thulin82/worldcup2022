import type { Request, Response } from "express";
import { asyncHandler } from "../middleware/async.js";
import { standingsService } from "../services/standingsService.js";

// @desc    Group standings tables
// @route   GET /standings
// @access  Public
export const getStandings = asyncHandler(async (_req: Request, res: Response) => {
  const result = await standingsService.getStandings();

  res.render("standings", { result });
});
