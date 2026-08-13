import type { Request, Response } from "express";

// @desc    Static knockout stage bracket
// @route   GET /playoff
// @access  Public
export function getPlayoff(_req: Request, res: Response): void {
  res.render("playoff");
}
