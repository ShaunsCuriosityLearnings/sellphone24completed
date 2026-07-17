import { CustomRequest } from "../models/CustomRequest.js";

// Create a new custom request
export const createCustomRequest = async (req, res) => {
  try {
    const { name, email, phone, deviceBrand, deviceModel, condition, description } = req.body;

    if (!name || !email || !phone || !deviceBrand || !deviceModel || !condition) {
      return res.status(400).json({ message: "All required fields must be provided." });
    }

    const newRequest = new CustomRequest({
      name,
      email,
      phone,
      deviceBrand,
      deviceModel,
      condition,
      description,
    });

    const savedRequest = await newRequest.save();

    res.status(201).json({
      success: true,
      message: "Custom request submitted successfully.",
      data: savedRequest,
    });
  } catch (error) {
    console.error("Error creating custom request:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get all custom requests (for admin)
export const getCustomRequests = async (req, res) => {
  try {
    const requests = await CustomRequest.find().sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching custom requests:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
