import BuyCategory from "../models/BuyCategory.js";

const DEFAULT_BUY_CATEGORIES = [
  {
    name: "Smartphones",
    slug: "smartphones",
    description: "Certified Pristine & Pre-Owned Flagships",
    image: "/products/iphone-pro-max.jpg",
  },
  {
    name: "Laptops",
    slug: "laptops",
    description: "MacBooks & High-Performance Windows Laptops",
    image: "/products/macbook-pro.webp",
  },
  {
    name: "Tablets",
    slug: "tablets",
    description: "iPads & Galaxy Tabs with Store Warranty",
    image: "/products/ipad-pro-m4.webp",
  },
  {
    name: "Smartwatches",
    slug: "smartwatches",
    description: "Apple Watch & Galaxy Smart Wearables",
    image: "/products/apple-watch-ultra.webp",
  },
  {
    name: "Gaming & Consoles",
    slug: "games",
    description: "PlayStation, Xbox & Nintendo Consoles",
    image: "/products/gaming-console.webp",
  },
];

// @desc    Get all buy categories (auto-seeds defaults if empty)
// @route   GET /api/buy-categories
// @access  Public
export const getBuyCategories = async (req, res) => {
  try {
    let categories = await BuyCategory.find({}).sort({ createdAt: 1 });
    
    // Auto-seed defaults if brand new isolated database
    if (!categories || categories.length === 0) {
      try {
        await BuyCategory.insertMany(DEFAULT_BUY_CATEGORIES);
        categories = await BuyCategory.find({}).sort({ createdAt: 1 });
      } catch (seedErr) {
        console.warn("Could not auto-seed default buy categories:", seedErr.message);
      }
    }
    
    // Strictly exclude sell / trade-in only categories from buy-phones store
    const excludedSlugs = new Set(["tvs", "tv", "any-device", "anydevice", "custom-request", "all-services"]);
    const validCategories = (categories || []).filter((cat) => {
      const s = (cat.slug || cat.name || "").toLowerCase().trim();
      return !excludedSlugs.has(s) && !s.includes("any-device");
    });
    
    res.status(200).json(validCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new buy category
// @route   POST /api/buy-categories
// @access  Admin
export const createBuyCategory = async (req, res) => {
  try {
    let { name, slug, description, image } = req.body;
    if (req.file) {
      image = req.file.path;
    }
    if (!image) {
      image = "/products/iphone-pro-max.jpg";
    }

    if (!slug && name) {
      slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    }
    
    const existing = await BuyCategory.findOne({ slug });
    if (existing) {
      return res.status(400).json({ message: `A category with the slug "${slug}" already exists in the Buy-Phones database.` });
    }

    const newCategory = await BuyCategory.create({ name, slug, description, image });
    res.status(201).json(newCategory);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "A category with this slug already exists." });
    }
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update buy category
// @route   PUT /api/buy-categories/:id
// @access  Admin
export const updateBuyCategory = async (req, res) => {
  try {
    const { id } = req.params;
    let dataToUpdate = { ...req.body };
    
    if (req.file) {
      dataToUpdate.image = req.file.path;
    }

    const updated = await BuyCategory.findByIdAndUpdate(id, dataToUpdate, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ message: "Category not found in Buy-Phones database" });
    }
    res.status(200).json(updated);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "A category with this slug already exists." });
    }
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete buy category
// @route   DELETE /api/buy-categories/:id
// @access  Admin
export const deleteBuyCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await BuyCategory.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Category not found in Buy-Phones database" });
    }
    res.status(200).json({ message: "Buy-Phones category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
