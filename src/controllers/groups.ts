import type { Request, Response } from "express";
import { asyncHandler } from "../middleware/async.js";
import { matchService } from "../services/matchService.js";

// @desc    Group stage fixtures for all 12 groups
// @route   GET /
// @access  Public
export const getGroups = asyncHandler(async (_req: Request, res: Response) => {
  const groups = await matchService.getGroupMatches();

  res.render("index", groups);
});
