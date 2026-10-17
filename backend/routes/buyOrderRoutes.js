import express from "express";
import {
  createBuyOrder,
  getBuyOrders,
  getBuyOrderById,
  updateBuyOrderStatus,
  retryGoogleSheetsSync,
} from "../controllers/buyOrderController.js";
import { requireAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/")
  .post(createBuyOrder)
  .get(requireAdmin, getBuyOrders);

router.route("/:id")
  .get(getBuyOrderById);

router.route("/:id/status")
  .patch(requireAdmin, updateBuyOrderStatus);

router.route("/:id/retry-sheets")
  .post(requireAdmin, retryGoogleSheetsSync);

export default router;
