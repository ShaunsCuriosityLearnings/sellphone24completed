import Order from "../models/Order.js";

// @desc    Create/Submit a new valuation order
// @route   POST /api/orders
// @access  Public
export const createOrder = async (req, res) => {
  try {
    const { customerDetails, pickupSchedule, devices, paymentMethod, totalPayout } = req.body;

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
      status: "pending",
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

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
