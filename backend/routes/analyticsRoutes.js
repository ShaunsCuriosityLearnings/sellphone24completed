import express from "express";
import { trackEvents, getDashboardData } from "../controllers/analyticsController.js";

const router = express.Router();

// Public endpoint for non-blocking client-side telemetry intake
router.post("/track", trackEvents);

// Admin endpoint for analytics dashboard & reports
router.get("/dashboard", getDashboardData);

export default router;
