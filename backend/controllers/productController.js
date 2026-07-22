import Product from "../models/Product.js";
import Brand from "../models/Brand.js";
import Category from "../models/Category.js";

// Helper to format product populated brand back to string for frontend compatibility
const formatProduct = (p) => {
  const obj = p.toObject();
  if (obj.brand && typeof obj.brand === "object") {
    obj.brandLogo = obj.brand.logo;
    obj.brand = obj.brand.name; // Keep brand string for backward compatibility
  }
  return obj;
};

// Helper to auto-link Brand to Category in Mongoose
const autoLinkBrandToCategory = async (brandId, categorySlug) => {
  if (!brandId || !categorySlug) return;
  try {
    const categoryDoc = await Category.findOne({ slug: categorySlug.toLowerCase() });
    if (categoryDoc) {
      await Brand.findByIdAndUpdate(brandId, { $addToSet: { categories: categoryDoc._id } });
    }
  } catch (e) {
    console.warn("Could not auto-link brand to category:", e.message);
  }
};

export const getCategoryAliases = (slug) => {
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

// @desc    Get all products (with optional filtering by category, brand, or search query)
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const { category, brand, search } = req.query;
    const filter = {};

    if (category) {
      const aliases = getCategoryAliases(category);
      filter.category = { $in: aliases.map((a) => new RegExp(`^${a}$`, "i")) };
    }

    if (brand) {
      // Find Brand by name or slug
      const brandDoc = await Brand.findOne({
        $or: [
          { name: { $regex: new RegExp(`^${brand}$`, "i") } },
          { slug: { $regex: new RegExp(`^${brand}$`, "i") } }
        ]
      });
      if (brandDoc) {
        filter.brand = brandDoc._id;
      } else {
        // If brand not found, return empty array
        return res.status(200).json([]);
      }
    }

    if (search) {
      // Find matching Brand IDs
      const matchingBrands = await Brand.find({
        name: { $regex: search, $options: "i" }
      });
      const brandIds = matchingBrands.map((b) => b._id);

      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { brand: { $in: brandIds } },
        { shortDescription: { $regex: search, $options: "i" } },
      ];
    }

    const products = await Product.find(filter).populate("brand");
    const formatted = products.map(formatProduct);
    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get product details by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate("brand");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(formatProduct(product));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Admin
export const createProduct = async (req, res) => {
  try {
    let data = { ...req.body };
    
    // Parse arrays sent as JSON strings via FormData
    ['storages', 'colors'].forEach(field => {
      if (typeof data[field] === 'string') {
        try { data[field] = JSON.parse(data[field]); } catch (e) {}
      }
    });

    if (req.files) {
      if (!data.images) data.images = {};
      if (req.files['images[frontView]']) data.images.frontView = req.files['images[frontView]'][0].path;
      if (req.files['images[sideView]']) data.images.sideView = req.files['images[sideView]'][0].path;
      if (req.files['images[backView]']) data.images.backView = req.files['images[backView]'][0].path;
    }

    const newProduct = await Product.create(data);
    await autoLinkBrandToCategory(data.brand, data.category);

    const populated = await Product.findById(newProduct._id).populate("brand");
    res.status(201).json(formatProduct(populated));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update product details
// @route   PUT /api/products/:id
// @access  Admin
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let dataToUpdate = { ...req.body };

    // Parse arrays sent as JSON strings via FormData
    ['storages', 'colors'].forEach(field => {
      if (typeof dataToUpdate[field] === 'string') {
        try { dataToUpdate[field] = JSON.parse(dataToUpdate[field]); } catch (e) {}
      }
    });

    if (req.files) {
      if (!dataToUpdate.images) dataToUpdate.images = {};
      if (req.files['images[frontView]']) dataToUpdate.images.frontView = req.files['images[frontView]'][0].path;
      if (req.files['images[sideView]']) dataToUpdate.images.sideView = req.files['images[sideView]'][0].path;
      if (req.files['images[backView]']) dataToUpdate.images.backView = req.files['images[backView]'][0].path;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, dataToUpdate, {
      new: true,
      runValidators: true,
    }).populate("brand");
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    await autoLinkBrandToCategory(updatedProduct.brand?._id || dataToUpdate.brand, updatedProduct.category || dataToUpdate.category);

    res.status(200).json(formatProduct(updatedProduct));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Admin
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
