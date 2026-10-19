import express from "express";
import {
  exportBuyDatabase,
  restoreBuyDatabase,
  getBuyDatabaseStats,
} from "../controllers/buyDatabaseController.js";
import { requireAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET /api/buy-database/stats
router.get("/stats", getBuyDatabaseStats);

// GET /api/buy-database/export
router.get("/export", exportBuyDatabase);

// POST /api/buy-database/restore
router.post("/restore", requireAdmin, restoreBuyDatabase);

export default router;
