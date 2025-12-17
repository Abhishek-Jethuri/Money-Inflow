import express from "express";
import cors from "cors";
import { db } from "./db/db.js";
import { readdirSync } from "fs";
import { errorHandler } from "./middleware/errorMiddleware.js";
import cookieParser from "cookie-parser";
import env from "./libs/env.js";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use(express.static("public"));

const routesDir = path.join(__dirname, "routes");
const routeFiles = readdirSync(routesDir);
for (const routeFile of routeFiles) {
  const routePath = path.join(routesDir, routeFile);
  const routeModule = await import(routePath);
  app.use("/api/v1", routeModule.default);
}

app.use(errorHandler);

const server = async () => {
  try {
    await db();
    app
      .listen(env.PORT, () => {
        console.log(`Server running on port ${env.PORT}`);
      })
      .on("error", (err) => {
        console.error("Failed to start the server:", err);
      });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

server();
