import path from "node:path";
import express from "express";
import cors from "cors";
import hbs from "hbs";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/error.js";
import { registerHelpers } from "./utils/hbsHelpers.js";

/** Views and static assets live outside src so they are not compiled into dist. */
const viewsPath = path.resolve(process.cwd(), "views");
const publicPath = path.resolve(process.cwd(), "public");

/**
 * Builds the Express app. Kept separate from server.ts so it can be
 * imported in tests without binding a port.
 */
export function createApp() {
  const app = express();

  app.use(cors());
  app.set("views", viewsPath);
  app.set("view engine", "hbs");
  hbs.registerPartials(path.join(viewsPath, "partials"));
  registerHelpers(hbs);

  app.use(express.static(publicPath));

  app.get("/healthz", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/", routes);

  app.use(errorHandler);

  return app;
}
