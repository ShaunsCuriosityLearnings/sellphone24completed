import BuyCategory from "../models/BuyCategory.js";
import BuyBrand from "../models/BuyBrand.js";
import BuyProduct from "../models/BuyProduct.js";
import BuyOrder from "../models/BuyOrder.js";
import fs from "fs";
import path from "path";

// @desc    Get live database stats for Buy-Phones isolated database
// @route   GET /api/buy-database/stats
// @access  Admin
export const getBuyDatabaseStats = async (req, res) => {
  try {
    const [productsCount, categoriesCount, brandsCount, ordersCount] = await Promise.all([
      BuyProduct.countDocuments(),
      BuyCategory.countDocuments(),
      BuyBrand.countDocuments(),
      BuyOrder.countDocuments(),
    ]);

    res.status(200).json({
      databaseName: process.env.MONGODB_BUY_DB || "buyphone24",
      counts: {
        products: productsCount,
        categories: categoriesCount,
        brands: brandsCount,
        orders: ordersCount,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get Buy-Phones stats: " + error.message });
  }
};

// @desc    Export full Buy-Phones database snapshot (isolated from Sell-Phones)
// @route   GET /api/buy-database/export
// @access  Admin
export const exportBuyDatabase = async (req, res) => {
  try {
    const [categories, brands, buyProducts, buyOrders] = await Promise.all([
      BuyCategory.find({}).lean(),
      BuyBrand.find({}).lean(),
      BuyProduct.find({}).lean(),
      BuyOrder.find({}).lean(),
    ]);

    const backupData = {
      system: "BuyPhone24",
      databaseName: process.env.MONGODB_BUY_DB || "buyphone24",
      version: "2.0",
      timestamp: new Date().toISOString(),
      counts: {
        categories: categories.length,
        brands: brands.length,
        products: buyProducts.length,
        orders: buyOrders.length,
      },
      categories,
      brands,
      products: buyProducts,
      orders: buyOrders,
    };

    // Save a local copy to backups/buy-latest.json
    try {
      const backupDir = path.join(process.cwd(), "backups");
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }
      fs.writeFileSync(path.join(backupDir, "buy-latest.json"), JSON.stringify(backupData, null, 2));
    } catch (e) {
      console.warn("Could not save local buy-latest.json backup file:", e.message);
    }

    const dateStr = new Date().toISOString().split("T")[0];
    const filename = `buyphone24-db-backup-${dateStr}.json`;

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "application/json");
    res.status(200).send(JSON.stringify(backupData, null, 2));
  } catch (error) {
    res.status(500).json({ message: "Failed to export Buy-Phones database: " + error.message });
  }
};

// @desc    Restore Buy-Phones database from JSON snapshot payload (100% Isolated from Sell-Phones)
// @route   POST /api/buy-database/restore
// @access  Admin
export const restoreBuyDatabase = async (req, res) => {
  try {
    req.setTimeout(300000); // 5 min timeout
    res.setTimeout(300000);

    const backupData = req.body;

    if (!backupData || (!backupData.products && !backupData.categories && !backupData.brands)) {
      return res.status(400).json({
        message: "Invalid Buy-Phones backup file format. Must contain products, categories, or brands.",
      });
    }

    // STEP 1: HARD CLEAR ONLY THE BUY-PHONES COLLECTIONS (Leaves Sell-Phone 100% untouched)
    await Promise.all([
      BuyCategory.deleteMany({}),
      BuyBrand.deleteMany({}),
      BuyProduct.deleteMany({}),
      BuyOrder.deleteMany({}),
    ]);

    // STEP 2: BULK RESTORE BUY-PHONES COLLECTIONS
    if (Array.isArray(backupData.categories) && backupData.categories.length > 0) {
      await BuyCategory.insertMany(backupData.categories);
    }

    if (Array.isArray(backupData.brands) && backupData.brands.length > 0) {
      await BuyBrand.insertMany(backupData.brands);
    }

    if (Array.isArray(backupData.products) && backupData.products.length > 0) {
      await BuyProduct.insertMany(backupData.products);
    }

    if (Array.isArray(backupData.orders) && backupData.orders.length > 0) {
      await BuyOrder.insertMany(backupData.orders.filter((ord) => ord._id));
    }

    // Save as local buy-latest.json
    try {
      const backupDir = path.join(process.cwd(), "backups");
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }
      fs.writeFileSync(path.join(backupDir, "buy-latest.json"), JSON.stringify(backupData, null, 2));
    } catch (e) {}

    const productCount = Array.isArray(backupData.products) ? backupData.products.length : 0;
    const categoryCount = Array.isArray(backupData.categories) ? backupData.categories.length : 0;
    const brandCount = Array.isArray(backupData.brands) ? backupData.brands.length : 0;
    const orderCount = Array.isArray(backupData.orders) ? backupData.orders.length : 0;

    res.status(200).json({
      message: "Buy-Phones database successfully restored! Sell-Phones database was completely untouched.",
      counts: {
        products: productCount,
        categories: categoryCount,
        brands: brandCount,
        orders: orderCount,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Buy-Phones database restore failed: " + error.message });
  }
};
