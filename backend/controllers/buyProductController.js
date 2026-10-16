import BuyProduct from "../models/BuyProduct.js";

// @desc    Get all buy products with filtering
// @route   GET /api/buy-products
// @access  Public
export const getBuyProducts = async (req, res) => {
  try {
    const { brand, condition, minPrice, maxPrice, search, featured, sort } = req.query;

    const query = {};

    if (brand && brand !== "all") {
      query.brand = new RegExp(`^${brand}$`, "i");
    }

    if (condition && condition !== "all") {
      query.condition = new RegExp(condition, "i");
    }

    if (featured === "true") {
      query.isFeatured = true;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
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

    const products = await BuyProduct.find(query).sort(sortOptions);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single buy product by ID
// @route   GET /api/buy-products/:id
// @access  Public
export const getBuyProductById = async (req, res) => {
  try {
    const product = await BuyProduct.findById(req.params.id);
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
    const productData = req.body;
    const newProduct = new BuyProduct(productData);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update buy product
// @route   PUT /api/buy-products/:id
// @access  Admin
export const updateBuyProduct = async (req, res) => {
  try {
    const updatedProduct = await BuyProduct.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
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
