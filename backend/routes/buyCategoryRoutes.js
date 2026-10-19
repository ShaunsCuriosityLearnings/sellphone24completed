import express from "express";
import {
  getBuyCategories,
  createBuyCategory,
  updateBuyCategory,
  deleteBuyCategory,
} from "../controllers/buyCategoryController.js";
import { uploadCategory } from "../middlewares/upload.js";
import { requireAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(getBuyCategories)
  .post(requireAdmin, uploadCategory.single("image"), createBuyCategory);

router.route("/:id")
  .put(requireAdmin, uploadCategory.single("image"), updateBuyCategory)
  .delete(requireAdmin, deleteBuyCategory);

export default router;
