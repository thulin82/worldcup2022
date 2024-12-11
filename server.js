import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import apicache from "apicache";
import hbs from "hbs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: "./config/config.env" });

hbs.registerHelper("isPlayOffs", function (value) {
    return value == "Playoffs";
});

hbs.registerHelper("limit", function (arr, limit) {
    if (!Array.isArray(arr)) {
        return [];
    }
    return arr.slice(0, limit);
});

const app = express();
const cache = apicache.middleware;

//Middleware
app.use(cors());
app.use(cache("5 minutes"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
hbs.registerPartials(__dirname + "/views/partials");

app.use(express.static(path.join(__dirname, "/public")));

// Import routes using dynamic import
const { default: indexRouter } = await import("./routes/index.js");
app.use("/", indexRouter);

const PORT = process.env.PORT || 4567;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

export default app;
