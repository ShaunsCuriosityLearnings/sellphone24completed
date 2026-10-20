import Order from "../models/Order.js";
import { sendOrderConfirmationEmails, sendStatusUpdateEmails } from "../utils/emailService.js";
import { sendOrderWhatsAppNotification } from "../utils/whatsappService.js";
import { syncSellLeadToGoogleSheets } from "../utils/googleSheetsService.js";

// @desc    Create/Submit a new valuation order
// @route   POST /api/orders
// @access  Public
export const createOrder = async (req, res) => {
  try {
    const {
      customerDetails,
      pickupSchedule,
      devices,
      paymentMethod,
      totalPayout,
      sessionId,
      intentScoreAtBooking,
      acquisitionChannel,
      utmCampaign,
      marketingAttribution,
    } = req.body;

    // Enforce cash payout option based on client request
    if (paymentMethod !== "cash") {
      return res.status(400).json({ message: "Only cash payments are supported" });
    }

    const order = await Order.create({
      customerDetails,
      pickupSchedule,
      devices,
      paymentMethod,
      totalPayout,
      sessionId: sessionId || "",
      intentScoreAtBooking: intentScoreAtBooking || 0,
      acquisitionChannel: acquisitionChannel || "Organic / Direct",
      utmCampaign: utmCampaign || "none",
      marketingAttribution: marketingAttribution || {
        source: "direct",
        medium: "none",
        campaign: "none",
        gclid: "",
        fbclid: "",
        ttclid: "",
        referrer: "direct",
      },
      status: "pending",
    });

    // Trigger emails asynchronously (Client confirmation & Admin notification)
    sendOrderConfirmationEmails(order);

    // Trigger WhatsApp notification for +971555972150
    sendOrderWhatsAppNotification(order);

    // Asynchronously dispatch to Google Sheets
    syncSellLeadToGoogleSheets(order).then(async (syncResult) => {
      try {
        await Order.findByIdAndUpdate(order._id, {
          "googleSheetsSync.isSynced": syncResult.success,
          "googleSheetsSync.syncedAt": syncResult.success ? new Date() : null,
          "googleSheetsSync.error": syncResult.error || null,
        });
        if (syncResult.success) {
          console.log(`📊 Order #${order._id} synced to Google Sheets successfully.`);
        } else {
          console.warn(`⚠️ Order #${order._id} Google Sheets sync failed: ${syncResult.error}`);
        }
      } catch (e) {
        console.warn("Could not update Order googleSheetsSync status:", e.message);
      }
    }).catch((err) => {
      console.error("Google Sheets sync trigger error:", err);
    });

    res.status(201).json({
      success: true,
      message: "Valuation order created successfully",
      order,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Admin
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order details by ID
// @route   GET /api/orders/:id
// @access  Public/Admin
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "pickup_assigned", "inspected", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Trigger emails asynchronously (Client status update & Admin log)
    sendStatusUpdateEmails(order);

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Retry Google Sheets sync for a Sell Phone order
// @route   POST /api/orders/:id/retry-sheets
// @access  Admin
export const retrySellOrderSheetsSync = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const result = await syncSellLeadToGoogleSheets(order);
    order.googleSheetsSync = order.googleSheetsSync || {};
    order.googleSheetsSync.isSynced = result.success;
    order.googleSheetsSync.syncedAt = result.success ? new Date() : null;
    order.googleSheetsSync.error = result.error || null;
    order.googleSheetsSync.retryCount = (order.googleSheetsSync.retryCount || 0) + 1;
    await order.save();

    res.status(200).json({
      success: result.success,
      message: result.success ? "Synced to Google Sheets successfully" : `Sync failed: ${result.error}`,
      googleSheetsSync: order.googleSheetsSync,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
