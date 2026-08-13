import dotenv from "dotenv";
import { loadEnv } from "./config/env.js";
import { createApp } from "./app.js";

dotenv.config({ path: "./config/config.env", quiet: true });

const env = loadEnv();

const app = createApp();

const server = app.listen(env.PORT, () =>
  console.log(`Server started on port ${env.PORT}`)
);

export { app, server };
