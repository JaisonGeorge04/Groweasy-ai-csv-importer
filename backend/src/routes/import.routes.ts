import { Router } from "express";
import multer from "multer";
import path from "node:path";
import { uploadCsvController, processCsvController } from "../controllers/import.controller.js";
import { uploadDirectory } from "../utils/path.js";

const router = Router();

const upload = multer({
  dest: path.join(uploadDirectory, "incoming"),
  fileFilter: (_, file, callback) => {
    const isCsv = file.mimetype === "text/csv" || file.originalname.endsWith(".csv");
    if (isCsv) {
      callback(null, true);
      return;
    }

    callback(new Error("Only CSV files are allowed."));
  },
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

router.post("/upload", upload.single("file"), async (request, response, next) => {
  try {
    await uploadCsvController(request, response);
  } catch (error) {
    next(error);
  }
});

router.post("/process", async (request, response, next) => {
  try {
    await processCsvController(request, response);
  } catch (error) {
    next(error);
  }
});

export { router as importRouter };
