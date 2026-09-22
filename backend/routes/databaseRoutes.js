import express from "express";
import { exportDatabase, exportProducts, restoreDatabase } from "../controllers/databaseController.js";
import { requireAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET /api/database/export
router.get("/export", exportDatabase);

// GET /api/database/export/products
router.get("/export/products", exportProducts);

// POST /api/database/restore
router.post("/restore", requireAdmin, restoreDatabase);

export default router;
