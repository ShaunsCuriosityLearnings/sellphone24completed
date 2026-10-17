import express from "express";
import {
  getBuyProducts,
  getBuyProductById,
  createBuyProduct,
  updateBuyProduct,
  deleteBuyProduct,
} from "../controllers/buyProductController.js";
import { requireAdmin } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

const uploadFields = upload.fields([
  { name: 'images[frontView]', maxCount: 1 },
  { name: 'images[sideView]', maxCount: 1 },
  { name: 'images[backView]', maxCount: 1 },
  { name: 'frontView', maxCount: 1 },
  { name: 'sideView', maxCount: 1 },
  { name: 'backView', maxCount: 1 },
]);

router.route("/")
  .get(getBuyProducts)
  .post(requireAdmin, uploadFields, createBuyProduct);

router.route("/:id")
  .get(getBuyProductById)
  .put(requireAdmin, uploadFields, updateBuyProduct)
  .delete(requireAdmin, deleteBuyProduct);

export default router;
