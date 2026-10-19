import express from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  retrySellOrderSheetsSync,
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

router.route("/:id/retry-sheets")
  .post(requireAdmin, retrySellOrderSheetsSync);

export default router;
