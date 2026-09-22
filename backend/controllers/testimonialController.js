import Testimonial from "../models/Testimonial.js";

// @desc    Get all testimonials (optionally filtered by featured)
// @route   GET /api/testimonials
// @access  Public
export const getTestimonials = async (req, res) => {
  try {
    const { featured } = req.query;
    const filter = {};
    if (featured === "true") {
      filter.isFeatured = true;
    }

    const testimonials = await Testimonial.find(filter).sort({ displayOrder: 1, createdAt: -1 });
    res.status(200).json(testimonials);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch testimonials: " + error.message });
  }
};

// @desc    Create a new testimonial
// @route   POST /api/testimonials
// @access  Admin
export const createTestimonial = async (req, res) => {
  try {
    const { name, location, avatar, quote, rating, isFeatured, displayOrder } = req.body;
    if (!name || !quote) {
      return res.status(400).json({ message: "Name and quote are required" });
    }

    const testimonial = await Testimonial.create({
      name,
      location,
      avatar,
      quote,
      rating: rating ? Number(rating) : 5,
      isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : true,
      displayOrder: displayOrder ? Number(displayOrder) : 0,
    });

    res.status(201).json(testimonial);
  } catch (error) {
    res.status(400).json({ message: "Failed to create testimonial: " + error.message });
  }
};

// @desc    Update a testimonial
// @route   PUT /api/testimonials/:id
// @access  Admin
export const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    res.status(200).json(testimonial);
  } catch (error) {
    res.status(400).json({ message: "Failed to update testimonial: " + error.message });
  }
};

// @desc    Delete a testimonial
// @route   DELETE /api/testimonials/:id
// @access  Admin
export const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findByIdAndDelete(id);

    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    res.status(200).json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete testimonial: " + error.message });
  }
};
