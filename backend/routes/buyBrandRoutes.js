import express from "express";
import {
  getBuyBrands,
  createBuyBrand,
  updateBuyBrand,
  deleteBuyBrand,
} from "../controllers/buyBrandController.js";
import { uploadBrand } from "../middlewares/upload.js";
import { requireAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(getBuyBrands)
  .post(requireAdmin, uploadBrand.single("logo"), createBuyBrand);

router.route("/:id")
  .put(requireAdmin, uploadBrand.single("logo"), updateBuyBrand)
  .delete(requireAdmin, deleteBuyBrand);

export default router;
