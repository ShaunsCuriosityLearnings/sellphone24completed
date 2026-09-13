import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getHeroProduct,
  setHeroProduct,
} from "../controllers/productController.js";
import { requireAdmin } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

const uploadFields = upload.fields([
  { name: 'images[frontView]', maxCount: 1 },
  { name: 'images[sideView]', maxCount: 1 },
  { name: 'images[backView]', maxCount: 1 }
]);

router.get("/hero", getHeroProduct);
router.post("/set-hero/:id", requireAdmin, setHeroProduct);

router.route("/")
  .get(getProducts)
  .post(requireAdmin, uploadFields, createProduct);

router.route("/:id")
  .get(getProductById)
  .put(requireAdmin, uploadFields, updateProduct)
  .delete(requireAdmin, deleteProduct);

export default router;
