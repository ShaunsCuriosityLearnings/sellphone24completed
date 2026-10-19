import mongoose from "mongoose";
import BuyProduct from "../models/BuyProduct.js";
import Brand from "../models/Brand.js";

// @desc    Get all buy products with filtering
// @route   GET /api/buy-products
// @access  Public
export const getBuyProducts = async (req, res) => {
  try {
    const { category, brand, condition, minPrice, maxPrice, search, featured, sort, status, includeDrafts } = req.query;

    const query = {};

    // Filter by publication status
    if (status && status !== "all") {
      query.status = status;
    } else if (includeDrafts !== "true") {
      query.status = { $ne: "draft" };
    }

    // Filter by department / category
    if (category && category !== "all") {
      const catLower = category.toLowerCase().trim();
      if (catLower === "smartphones" || catLower === "mobile") {
        query.$or = [
          { category: new RegExp(`^(smartphones|mobile|phones)$`, "i") },
          { category: { $exists: false } }
        ];
      } else {
        query.category = new RegExp(`^${catLower}$`, "i");
      }
    }

    if (brand && brand !== "all") {
      let matchedBrand = null;
      if (mongoose.Types.ObjectId.isValid(brand)) {
        matchedBrand = await Brand.findById(brand);
      }
      if (!matchedBrand) {
        matchedBrand = await Brand.findOne({
          $or: [
            { slug: brand.toLowerCase().trim() },
            { name: new RegExp(`^${brand.trim()}$`, "i") }
          ]
        });
      }

      if (matchedBrand) {
        query.$or = [
          { brandRef: matchedBrand._id },
          { brand: new RegExp(`^${matchedBrand.name}$`, "i") },
          { brand: new RegExp(`^${brand}$`, "i") }
        ];
      } else {
        query.brand = new RegExp(`^${brand}$`, "i");
      }
    }

    if (condition && condition !== "all") {
      query.condition = new RegExp(condition, "i");
    }

    if (featured === "true") {
      query.isFeatured = true;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined && minPrice !== "all") query.price.$gte = Number(minPrice);
      if (maxPrice !== undefined && maxPrice !== "all") query.price.$lte = Number(maxPrice);
    }

    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { title: searchRegex },
        { brand: searchRegex },
        { model: searchRegex },
        { description: searchRegex },
      ];
    }

    let sortOptions = { isFeatured: -1, createdAt: -1 };
    if (sort === "price-asc") sortOptions = { price: 1 };
    else if (sort === "price-desc") sortOptions = { price: -1 };
    else if (sort === "rating") sortOptions = { rating: -1 };

    const products = await BuyProduct.find(query)
      .populate("brandRef")
      .populate("originalProductRef")
      .sort(sortOptions);

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single buy product by ID or Slug
// @route   GET /api/buy-products/:id
// @access  Public
export const getBuyProductById = async (req, res) => {
  try {
    const { id } = req.params;
    let product = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await BuyProduct.findById(id)
        .populate("brandRef")
        .populate("originalProductRef");
    }

    if (!product && typeof id === "string") {
      const cleanSlug = id.toLowerCase().trim();
      product = await BuyProduct.findOne({
        $or: [
          { slug: cleanSlug },
          { slug: cleanSlug.replace(/-/g, " ") },
        ]
      })
        .populate("brandRef")
        .populate("originalProductRef");

      // Fallback matching by title words
      if (!product) {
        const words = cleanSlug.split(/[-_+\s]+/).filter(Boolean);
        if (words.length > 0) {
          const regexPattern = words.join(".*");
          product = await BuyProduct.findOne({
            title: { $regex: new RegExp(regexPattern, "i") },
          })
            .populate("brandRef")
            .populate("originalProductRef");
        }
      }
    }

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new buy product
// @route   POST /api/buy-products
// @access  Admin
export const createBuyProduct = async (req, res) => {
  try {
    let productData = { ...req.body };

    // Parse JSON strings when sent via multipart/form-data
    ['storages', 'colors', 'features', 'seoMetadata'].forEach((field) => {
      if (typeof productData[field] === 'string') {
        try { productData[field] = JSON.parse(productData[field]); } catch (e) {}
      }
    });

    if (typeof productData.images === 'string') {
      try { productData.images = JSON.parse(productData.images); } catch (e) {}
    }
    if (!productData.images || typeof productData.images !== 'object') {
      productData.images = {};
    }

    // Process uploaded file slots
    if (req.files) {
      if (req.files['images[frontView]']?.[0]?.path) productData.images.frontView = req.files['images[frontView]'][0].path;
      else if (req.files['frontView']?.[0]?.path) productData.images.frontView = req.files['frontView'][0].path;

      if (req.files['images[sideView]']?.[0]?.path) productData.images.sideView = req.files['images[sideView]'][0].path;
      else if (req.files['sideView']?.[0]?.path) productData.images.sideView = req.files['sideView'][0].path;

      if (req.files['images[backView]']?.[0]?.path) productData.images.backView = req.files['images[backView]'][0].path;
      else if (req.files['backView']?.[0]?.path) productData.images.backView = req.files['backView'][0].path;
    }

    // Accept direct URL strings if passed as separate fields
    if (productData.frontView && !productData.images.frontView) productData.images.frontView = productData.frontView;
    if (productData.sideView && !productData.images.sideView) productData.images.sideView = productData.sideView;
    if (productData.backView && !productData.images.backView) productData.images.backView = productData.backView;

    // Fallbacks
    if (!productData.images.frontView) {
      productData.images.frontView = "/products/iphone-pro-max.jpg";
    }
    if (!productData.images.sideView) {
      productData.images.sideView = productData.images.frontView;
    }
    if (!productData.images.backView) {
      productData.images.backView = productData.images.frontView;
    }

    // Parse numeric fields
    if (productData.price !== undefined) productData.price = Number(productData.price);
    if (productData.originalPrice !== undefined) productData.originalPrice = Number(productData.originalPrice);
    if (productData.stock !== undefined) productData.stock = Number(productData.stock);

    if (productData.title && !productData.slug) {
      productData.slug = productData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    // Link Brand model dynamically
    const targetBrand = productData.brandRef || productData.brandId;
    if (targetBrand && mongoose.Types.ObjectId.isValid(targetBrand)) {
      productData.brandRef = targetBrand;
      const bDoc = await Brand.findById(targetBrand);
      if (bDoc) productData.brand = bDoc.name;
    } else if (productData.brand) {
      const foundBrand = await Brand.findOne({
        $or: [
          { name: new RegExp(`^${productData.brand.trim()}$`, "i") },
          { slug: productData.brand.toLowerCase().trim() }
        ]
      });
      if (foundBrand) {
        productData.brandRef = foundBrand._id;
        productData.brand = foundBrand.name;
      }
    }

    // STRICT ISOLATION: creates exclusively in the BuyProduct collection
    const newProduct = new BuyProduct(productData);
    await newProduct.save();
    const populated = await BuyProduct.findById(newProduct._id)
      .populate("brandRef")
      .populate("originalProductRef");
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update buy product
// @route   PUT /api/buy-products/:id
// @access  Admin
export const updateBuyProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let updateData = { ...req.body };

    // Parse JSON strings when sent via multipart/form-data
    ['storages', 'colors', 'features', 'seoMetadata'].forEach((field) => {
      if (typeof updateData[field] === 'string') {
        try { updateData[field] = JSON.parse(updateData[field]); } catch (e) {}
      }
    });

    if (typeof updateData.images === 'string') {
      try { updateData.images = JSON.parse(updateData.images); } catch (e) {}
    }

    // Retrieve existing product to preserve existing image paths if not replaced
    const existingProduct = await BuyProduct.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const currentImages = existingProduct.images ? {
      frontView: existingProduct.images.frontView,
      sideView: existingProduct.images.sideView,
      backView: existingProduct.images.backView,
    } : { frontView: "/products/iphone-pro-max.jpg" };

    if (!updateData.images || typeof updateData.images !== 'object') {
      updateData.images = { ...currentImages };
    } else {
      updateData.images = { ...currentImages, ...updateData.images };
    }

    // Process uploaded file slots
    if (req.files) {
      if (req.files['images[frontView]']?.[0]?.path) updateData.images.frontView = req.files['images[frontView]'][0].path;
      else if (req.files['frontView']?.[0]?.path) updateData.images.frontView = req.files['frontView'][0].path;

      if (req.files['images[sideView]']?.[0]?.path) updateData.images.sideView = req.files['images[sideView]'][0].path;
      else if (req.files['sideView']?.[0]?.path) updateData.images.sideView = req.files['sideView'][0].path;

      if (req.files['images[backView]']?.[0]?.path) updateData.images.backView = req.files['images[backView]'][0].path;
      else if (req.files['backView']?.[0]?.path) updateData.images.backView = req.files['backView'][0].path;
    }

    // Accept direct URL strings if passed as separate fields
    if (updateData.frontView) updateData.images.frontView = updateData.frontView;
    if (updateData.sideView) updateData.images.sideView = updateData.sideView;
    if (updateData.backView) updateData.images.backView = updateData.backView;

    // Parse numeric fields
    if (updateData.price !== undefined) updateData.price = Number(updateData.price);
    if (updateData.originalPrice !== undefined) updateData.originalPrice = Number(updateData.originalPrice);
    if (updateData.stock !== undefined) updateData.stock = Number(updateData.stock);

    if (updateData.title && !updateData.slug) {
      updateData.slug = updateData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    // Link Brand model dynamically
    const targetBrand = updateData.brandRef || updateData.brandId;
    if (targetBrand && mongoose.Types.ObjectId.isValid(targetBrand)) {
      updateData.brandRef = targetBrand;
      const bDoc = await Brand.findById(targetBrand);
      if (bDoc) updateData.brand = bDoc.name;
    } else if (updateData.brand) {
      const foundBrand = await Brand.findOne({
        $or: [
          { name: new RegExp(`^${updateData.brand.trim()}$`, "i") },
          { slug: updateData.brand.toLowerCase().trim() }
        ]
      });
      if (foundBrand) {
        updateData.brandRef = foundBrand._id;
        updateData.brand = foundBrand.name;
      }
    }

    // STRICT ISOLATION: Updates ONLY the BuyProduct collection. Product (trade-in) collection is NEVER touched!
    const updatedProduct = await BuyProduct.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate("brandRef")
      .populate("originalProductRef");
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete buy product
// @route   DELETE /api/buy-products/:id
// @access  Admin
export const deleteBuyProduct = async (req, res) => {
  try {
    const product = await BuyProduct.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
