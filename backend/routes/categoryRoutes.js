import express from "express";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { requireAdmin } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.route("/")
  .get(getCategories)
  .post(requireAdmin, upload.single("image"), createCategory);

router.route("/:id")
  .put(requireAdmin, upload.single("image"), updateCategory)
  .delete(requireAdmin, deleteCategory);

export default router;
