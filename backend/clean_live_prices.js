import "dotenv/config";
import { connectToMongoDB } from "./config/db.js";
import Product from "./models/Product.js";

async function cleanLivePrices() {
  await connectToMongoDB();
  const liveProds = await Product.find({ isLivePrice: true });
  console.log("Current live products count in DB:", liveProds.length);

  if (liveProds.length > 6) {
    const toKeep = liveProds.slice(0, 6).map(p => p._id);
    const toRemove = liveProds.slice(6).map(p => p._id);

    await Product.updateMany({ _id: { $in: toRemove } }, { isLivePrice: false });
    console.log(`✅ Success: Trimmed live devices down to 6. (Set ${toRemove.length} devices to isLivePrice: false)`);
  } else {
    console.log("DB already has <= 6 live price devices.");
  }
  process.exit(0);
}

cleanLivePrices();
