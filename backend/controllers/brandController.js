import Brand from "../models/Brand.js";
import Category from "../models/Category.js";

// @desc    Get all brands (with optional category filtering)
// @route   GET /api/brands
// @access  Public
export const getBrands = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};

    if (category) {
      // Find category by slug
      const categoryDoc = await Category.findOne({ slug: category.toLowerCase() });
      if (categoryDoc) {
        filter.categories = categoryDoc._id;
      } else {
        // If category is not found, return empty brands
        return res.status(200).json([]);
      }
    }

    const brands = await Brand.find(filter).populate("categories", "name slug");
    res.status(200).json(brands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new brand
// @route   POST /api/brands
// @access  Admin
export const createBrand = async (req, res) => {
  try {
    let { name, slug, logo, categories } = req.body;
    
    if (req.file) {
      logo = req.file.path;
    }

    if (typeof categories === 'string') {
      try { categories = JSON.parse(categories); } catch (e) {}
    }

    // Auto-generate slug from name if not provided
    const brandSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    const newBrand = await Brand.create({
      name,
      slug: brandSlug,
      logo,
      categories: categories || []
    });

    const populatedBrand = await Brand.findById(newBrand._id).populate("categories", "name slug");
    res.status(201).json(populatedBrand);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a brand
// @route   PUT /api/brands/:id
// @access  Admin
export const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    let { name, slug, logo, categories } = req.body;

    const brand = await Brand.findById(id);
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    if (req.file) {
      logo = req.file.path;
    }
    if (typeof categories === 'string') {
      try { categories = JSON.parse(categories); } catch (e) {}
    }

    if (name) brand.name = name;
    if (slug) brand.slug = slug;
    if (logo) brand.logo = logo;
    if (categories) brand.categories = categories;

    await brand.save();

    const populatedBrand = await Brand.findById(brand._id).populate("categories", "name slug");
    res.status(200).json(populatedBrand);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a brand
// @route   DELETE /api/brands/:id
// @access  Admin
export const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBrand = await Brand.findByIdAndDelete(id);
    
    if (!deletedBrand) {
      return res.status(404).json({ message: "Brand not found" });
    }
    
    res.status(200).json({ message: "Brand deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
