import express from "express";
import {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController.js";
import { requireAdmin } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.route("/")
  .get(getBlogs)
  .post(requireAdmin, upload.single("img"), createBlog);

router.route("/:slug")
  .get(getBlogBySlug);

router.route("/:id")
  .put(requireAdmin, upload.single("img"), updateBlog)
  .delete(requireAdmin, deleteBlog);

export default router;
