import { app } from "./app.js";
import { env } from "./config/env.js";
import { ensureStorageDirectories } from "./services/storage.service.js";

async function startServer() {
  await ensureStorageDirectories();

  app.listen(env.port, () => {
    console.log(`GrowEasy backend listening on http://localhost:${env.port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start backend:", error);
  process.exit(1);
});
