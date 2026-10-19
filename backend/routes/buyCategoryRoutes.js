import express from "express";
import {
  getBuyCategories,
  createBuyCategory,
  updateBuyCategory,
  deleteBuyCategory,
} from "../controllers/buyCategoryController.js";
import upload from "../middlewares/upload.js";
import { requireAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(getBuyCategories)
  .post(requireAdmin, upload.single("image"), createBuyCategory);

router.route("/:id")
  .put(requireAdmin, upload.single("image"), updateBuyCategory)
  .delete(requireAdmin, deleteBuyCategory);

export default router;
