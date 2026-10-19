import express from "express";
import {
  getBuyBrands,
  createBuyBrand,
  updateBuyBrand,
  deleteBuyBrand,
} from "../controllers/buyBrandController.js";
import upload from "../middlewares/upload.js";
import { requireAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(getBuyBrands)
  .post(requireAdmin, upload.single("logo"), createBuyBrand);

router.route("/:id")
  .put(requireAdmin, upload.single("logo"), updateBuyBrand)
  .delete(requireAdmin, deleteBuyBrand);

export default router;
