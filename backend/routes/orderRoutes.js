import express from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { requireAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/")
  .post(createOrder)
  .get(getOrders);

router.route("/:id")
  .get(getOrderById);

router.route("/:id/status")
  .patch(requireAdmin, updateOrderStatus);

export default router;
