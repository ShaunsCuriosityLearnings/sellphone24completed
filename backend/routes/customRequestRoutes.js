import express from "express";
import { createCustomRequest, getCustomRequests } from "../controllers/customRequestController.js";
import { clerkMiddleware } from "@clerk/express";

const router = express.Router();

// Public route to submit a custom device request
router.post("/", createCustomRequest);

// Protected route to get all custom requests (for admin)
router.get("/", getCustomRequests);

export default router;
