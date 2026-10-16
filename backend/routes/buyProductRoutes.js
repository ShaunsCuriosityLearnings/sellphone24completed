import express from "express";
import {
  getBuyProducts,
  getBuyProductById,
  createBuyProduct,
  updateBuyProduct,
  deleteBuyProduct,
} from "../controllers/buyProductController.js";
import { requireAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(getBuyProducts)
  .post(requireAdmin, createBuyProduct);

router.route("/:id")
  .get(getBuyProductById)
  .put(requireAdmin, updateBuyProduct)
  .delete(requireAdmin, deleteBuyProduct);

export default router;
