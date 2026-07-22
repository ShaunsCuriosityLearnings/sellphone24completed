import Brand from "../models/Brand.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";

const getCategoryAliases = (slug) => {
  if (!slug) return [];
  const s = slug.toLowerCase().trim();
  if (s === "smartphones" || s === "mobile" || s === "phones" || s === "cell-phones") {
    return ["smartphones", "mobile", "phones", "cell-phones"];
  }
  if (s === "laptops" || s === "macbooks" || s === "computers") {
    return ["laptops", "macbooks", "computers"];
  }
  if (s === "smartwatches" || s === "watches") {
    return ["smartwatches", "watches"];
  }
  if (s === "tablets" || s === "ipads") {
    return ["tablets", "ipads"];
  }
  return [s];
};

// @desc    Get all brands (with optional category filtering)
// @route   GET /api/brands
// @access  Public
export const getBrands = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};

    if (category) {
      const aliases = getCategoryAliases(category);

      const categoryDocs = await Category.find({
        slug: { $in: aliases.map((a) => new RegExp(`^${a}$`, "i")) }
      });
      const categoryIds = categoryDocs.map((c) => c._id);

      const brandIdsWithProducts = await Product.distinct("brand", {
        category: { $in: aliases.map((a) => new RegExp(`^${a}$`, "i")) }
      });

      filter.$or = [
        { categories: { $in: categoryIds } },
        { _id: { $in: brandIdsWithProducts } }
      ];
    }

    let brands = await Brand.find(filter).populate("categories", "name slug");
    
    // Fallback: If category specific brand query produced empty list, return all active brands so sidebar is never empty
    if (!brands || brands.length === 0) {
      brands = await Brand.find({}).populate("categories", "name slug");
    }

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
