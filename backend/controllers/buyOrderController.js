import BuyOrder from "../models/BuyOrder.js";
import BuyProduct from "../models/BuyProduct.js";
import { syncBuyOrderToGoogleSheets } from "../utils/googleSheetsService.js";
import { sendBuyOrderConfirmationEmails } from "../utils/buyOrderEmailService.js";

// Helper to generate unique order number: BUY-YYYYMMDD-XXXX
const generateOrderNumber = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `BUY-${dateStr}-${randomSuffix}`;
};

// @desc    Create / Submit new Buy Phone Order
// @route   POST /api/buy-orders
// @access  Public
export const createBuyOrder = async (req, res) => {
  try {
    const { customerDetails, items, paymentMethod, notes, marketingAttribution } = req.body;

    if (!customerDetails || !customerDetails.name || !customerDetails.phone || !customerDetails.address) {
      return res.status(400).json({ message: "Customer name, phone, and delivery address are required" });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order must contain at least one phone item" });
    }

    // 1. Server-side validation and price recalculation (Never trust client totals)
    let calculatedSubtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      let unitPrice = Number(item.price) || 0;
      let title = item.title || "Refurbished Smartphone";
      let brand = item.brand || "Apple";
      let model = item.model || title;
      let image = item.image || "/products/iphone-pro-max.jpg";
      const quantity = Math.max(1, Number(item.quantity) || 1);

      // If productId is provided, verify against DB
      if (item.productId) {
        const dbProduct = await BuyProduct.findById(item.productId);
        if (dbProduct) {
          unitPrice = dbProduct.price;
          title = dbProduct.title;
          brand = dbProduct.brand;
          model = dbProduct.model || dbProduct.title;
          image = dbProduct.images?.frontView || image;

          // Decrement stock if available
          if (dbProduct.stock > 0) {
            dbProduct.stock = Math.max(0, dbProduct.stock - quantity);
            if (dbProduct.stock === 0) {
              dbProduct.isAvailable = false;
            }
            await dbProduct.save();
          }
        }
      }

      calculatedSubtotal += unitPrice * quantity;

      validatedItems.push({
        productId: item.productId || null,
        title,
        brand,
        model,
        selectedStorage: item.selectedStorage || "Standard",
        selectedColor: item.selectedColor || "Standard",
        condition: item.condition || "Pristine (Like New)",
        price: unitPrice,
        quantity,
        image,
      });
    }

    const deliveryFee = 0; // Free delivery across UAE
    const finalTotal = calculatedSubtotal + deliveryFee;
    const orderNumber = generateOrderNumber();

    // 2. Persist order in MongoDB as primary source of truth
    const order = await BuyOrder.create({
      orderNumber,
      customerDetails: {
        ...customerDetails,
        notes: notes || customerDetails.notes || "",
      },
      items: validatedItems,
      subtotal: calculatedSubtotal,
      deliveryFee,
      totalAmount: finalTotal,
      paymentMethod: paymentMethod === "card_on_delivery" ? "card_on_delivery" : "cod",
      paymentStatus: "unpaid",
      orderStatus: "pending",
      marketingAttribution: marketingAttribution || {
        source: "direct",
        medium: "none",
        campaign: "none",
        referrer: "direct",
      },
    });

    // 3. Asynchronously trigger Google Sheets Sync
    syncBuyOrderToGoogleSheets(order).then(async (syncResult) => {
      try {
        await BuyOrder.findByIdAndUpdate(order._id, {
          "googleSheetsSync.isSynced": syncResult.success,
          "googleSheetsSync.syncedAt": syncResult.success ? new Date() : null,
          "googleSheetsSync.error": syncResult.error || null,
        });
      } catch (e) {
        console.warn("Could not update googleSheetsSync status:", e.message);
      }
    }).catch((err) => {
      console.error("Google Sheets sync trigger error:", err);
    });

    // 4. Asynchronously send transactional emails
    sendBuyOrderConfirmationEmails(order).catch((err) => {
      console.error("Email notification error:", err);
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Error creating buy order:", error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all Buy Orders (Admin)
// @route   GET /api/buy-orders
// @access  Admin
export const getBuyOrders = async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};

    if (status && status !== "all") {
      filter.orderStatus = status;
    }

    if (search) {
      const searchRegex = new RegExp(search, "i");
      filter.$or = [
        { orderNumber: searchRegex },
        { "customerDetails.name": searchRegex },
        { "customerDetails.phone": searchRegex },
        { "customerDetails.email": searchRegex },
        { "customerDetails.city": searchRegex },
      ];
    }

    const orders = await BuyOrder.find(filter).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single Buy Order by ID or Order Number
// @route   GET /api/buy-orders/:id
// @access  Public / Admin
export const getBuyOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    let order = null;

    if (id.startsWith("BUY-")) {
      order = await BuyOrder.findOne({ orderNumber: id });
    } else {
      order = await BuyOrder.findById(id);
    }

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update Buy Order status
// @route   PATCH /api/buy-orders/:id/status
// @access  Admin
export const updateBuyOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    const updateFields = {};
    if (orderStatus) updateFields.orderStatus = orderStatus;
    if (paymentStatus) updateFields.paymentStatus = paymentStatus;

    const order = await BuyOrder.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Sync updated status to Google Sheets log
    syncBuyOrderToGoogleSheets(order).catch(() => {});

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Retry Google Sheets sync for an order
// @route   POST /api/buy-orders/:id/retry-sheets
// @access  Admin
export const retryGoogleSheetsSync = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await BuyOrder.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const result = await syncBuyOrderToGoogleSheets(order);
    order.googleSheetsSync.isSynced = result.success;
    order.googleSheetsSync.syncedAt = result.success ? new Date() : null;
    order.googleSheetsSync.error = result.error || null;
    order.googleSheetsSync.retryCount = (order.googleSheetsSync.retryCount || 0) + 1;
    await order.save();

    res.status(200).json({
      success: result.success,
      message: result.success ? "Google Sheets sync succeeded" : "Google Sheets sync failed: " + result.error,
      googleSheetsSync: order.googleSheetsSync,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
