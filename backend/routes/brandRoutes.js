import express from "express";
import {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} from "../controllers/brandController.js";
import { requireAdmin } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.route("/")
  .get(getBrands)
  .post(requireAdmin, upload.single("logo"), createBrand);

router.route("/:id")
  .put(requireAdmin, upload.single("logo"), updateBrand)
  .delete(requireAdmin, deleteBrand);

export default router;
