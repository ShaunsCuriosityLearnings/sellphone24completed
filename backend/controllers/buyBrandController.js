import BuyBrand from "../models/BuyBrand.js";

const DEFAULT_BUY_BRANDS = [
  {
    name: "Apple",
    slug: "apple",
    logo: "/products/apple.svg",
    categories: ["smartphones", "laptops", "tablets", "smartwatches"],
    isFeaturedOnFrontpage: true,
    displayOrder: 1,
  },
  {
    name: "Samsung",
    slug: "samsung",
    logo: "/products/samsung.svg",
    categories: ["smartphones", "tablets", "smartwatches"],
    isFeaturedOnFrontpage: true,
    displayOrder: 2,
  },
  {
    name: "Google",
    slug: "google",
    logo: "/products/google.svg",
    categories: ["smartphones", "tablets"],
    isFeaturedOnFrontpage: true,
    displayOrder: 3,
  },
  {
    name: "OnePlus",
    slug: "oneplus",
    logo: "/products/oneplus.svg",
    categories: ["smartphones"],
    isFeaturedOnFrontpage: true,
    displayOrder: 4,
  },
  {
    name: "Dell",
    slug: "dell",
    logo: "/products/dell.svg",
    categories: ["laptops"],
    isFeaturedOnFrontpage: true,
    displayOrder: 5,
  },
  {
    name: "Lenovo",
    slug: "lenovo",
    logo: "/products/lenovo.svg",
    categories: ["laptops", "tablets"],
    isFeaturedOnFrontpage: true,
    displayOrder: 6,
  },
  {
    name: "Sony",
    slug: "sony",
    logo: "/products/sony.svg",
    categories: ["games", "smartphones"],
    isFeaturedOnFrontpage: true,
    displayOrder: 7,
  },
  {
    name: "Nintendo",
    slug: "nintendo",
    logo: "/products/nintendo.svg",
    categories: ["games"],
    isFeaturedOnFrontpage: false,
    displayOrder: 8,
  },
];

// @desc    Get all buy brands (auto-seeds defaults if empty)
// @route   GET /api/buy-brands
// @access  Public
export const getBuyBrands = async (req, res) => {
  try {
    let brands = await BuyBrand.find({}).sort({ displayOrder: 1, name: 1 });

    if (!brands || brands.length === 0) {
      try {
        await BuyBrand.insertMany(DEFAULT_BUY_BRANDS);
        brands = await BuyBrand.find({}).sort({ displayOrder: 1, name: 1 });
      } catch (seedErr) {
        console.warn("Could not auto-seed default buy brands:", seedErr.message);
      }
    }

    res.status(200).json(brands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new buy brand
// @route   POST /api/buy-brands
// @access  Admin
export const createBuyBrand = async (req, res) => {
  try {
    let { name, slug, logo, categories, isFeaturedOnFrontpage, displayOrder, frontpageDisplayName } = req.body;
    
    if (req.file) {
      logo = req.file.path;
    }
    if (!logo) {
      logo = "/products/apple.svg";
    }

    if (!slug && name) {
      slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    }

    if (typeof categories === "string") {
      try {
        categories = JSON.parse(categories);
      } catch (e) {
        categories = categories.split(",").map(c => c.trim()).filter(Boolean);
      }
    }

    const existing = await BuyBrand.findOne({ slug });
    if (existing) {
      return res.status(400).json({ message: `A brand with the slug "${slug}" already exists in the Buy-Phones database.` });
    }

    const newBrand = await BuyBrand.create({
      name,
      slug,
      logo,
      categories: Array.isArray(categories) ? categories : [],
      isFeaturedOnFrontpage: Boolean(isFeaturedOnFrontpage),
      displayOrder: Number(displayOrder) || 0,
      frontpageDisplayName: frontpageDisplayName || name,
    });

    res.status(201).json(newBrand);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "A brand with this slug or name already exists." });
    }
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update buy brand
// @route   PUT /api/buy-brands/:id
// @access  Admin
export const updateBuyBrand = async (req, res) => {
  try {
    const { id } = req.params;
    let dataToUpdate = { ...req.body };

    if (req.file) {
      dataToUpdate.logo = req.file.path;
    }

    if (typeof dataToUpdate.categories === "string") {
      try {
        dataToUpdate.categories = JSON.parse(dataToUpdate.categories);
      } catch (e) {
        dataToUpdate.categories = dataToUpdate.categories.split(",").map((c) => c.trim()).filter(Boolean);
      }
    }

    const updated = await BuyBrand.findByIdAndUpdate(id, dataToUpdate, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Brand not found in Buy-Phones database" });
    }

    res.status(200).json(updated);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "A brand with this slug or name already exists." });
    }
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete buy brand
// @route   DELETE /api/buy-brands/:id
// @access  Admin
export const deleteBuyBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await BuyBrand.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Brand not found in Buy-Phones database" });
    }
    res.status(200).json({ message: "Buy-Phones brand deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
