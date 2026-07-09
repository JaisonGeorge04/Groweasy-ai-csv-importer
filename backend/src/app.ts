import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { importRouter } from "./routes/import.routes.js";
import { AppError } from "./utils/errors.js";

export const app = express();

app.use(
  cors({
    origin: env.clientUrl,
  }),
);
app.use(express.json({ limit: "2mb" }));

app.get("/health", (_, response) => {
  response.status(200).json({ ok: true });
});

app.use(importRouter);

app.use((error: Error, _: express.Request, response: express.Response, __: express.NextFunction) => {
  if (error instanceof AppError) {
    response.status(error.statusCode).json({ message: error.message });
    return;
  }

  response.status(500).json({
    message: error.message || "Something went wrong while processing the import.",
  });
});
