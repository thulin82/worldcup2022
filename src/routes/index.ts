import { Router } from "express";
import { getGroups } from "../controllers/groups.js";
import { getStandings } from "../controllers/standings.js";
import { getScorers } from "../controllers/scorers.js";
import { getPlayoff } from "../controllers/playoff.js";

const router = Router();

router.get("/", getGroups);

router.get("/standings", getStandings);

router.get("/scorers", getScorers);

router.get("/playoff", getPlayoff);

export default router;
