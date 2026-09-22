import "dotenv/config";
import { connectToMongoDB } from "./config/db.js";
import Category from "./models/Category.js";
import Brand from "./models/Brand.js";
import Product from "./models/Product.js";

async function inspectHierarchy() {
  await connectToMongoDB();

  const categories = await Category.find({});
  const brands = await Brand.find({});
  const products = await Product.find({});

  console.log(`=== LIVE DB STATS ===`);
  console.log(`Categories: ${categories.length}`);
  categories.forEach(c => console.log(`  - Category: slug="${c.slug}", name="${c.name}", _id=${c._id}`));

  console.log(`\nBrands: ${brands.length}`);
  brands.forEach(b => console.log(`  - Brand: slug="${b.slug}", name="${b.name}", _id=${b._id}`));

  console.log(`\nTotal Products: ${products.length}`);
  
  let validBrandCount = 0;
  let invalidBrandCount = 0;
  
  const productsByCat = {};

  products.forEach(p => {
    const cat = p.category;
    if (!productsByCat[cat]) productsByCat[cat] = 0;
    productsByCat[cat]++;

    const brandExists = brands.some(b => b._id.toString() === p.brand?.toString());
    if (brandExists) {
      validBrandCount++;
    } else {
      invalidBrandCount++;
      console.log(`  ⚠️ Orphaned Product: "${p.name}", brandId="${p.brand}", category="${p.category}"`);
    }
  });

  console.log(`\nProduct Category Breakdown:`, productsByCat);
  console.log(`Valid Brand Refs: ${validBrandCount}, Invalid/Orphaned Brand Refs: ${invalidBrandCount}`);

  process.exit(0);
}

inspectHierarchy();
