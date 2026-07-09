import dotenv from "dotenv";

dotenv.config();

export const env = {
  geminiApiKey: process.env.GEMINI_API_KEY ?? "",
  port: Number(process.env.PORT ?? 5000),
  clientUrl: process.env.CLIENT_URL ?? "http://localhost:3000",
  geminiModel: process.env.GEMINI_MODEL ?? "gemini-1.5-flash",
  batchSize: Number(process.env.BATCH_SIZE ?? 10),
};
