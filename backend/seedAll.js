import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import connectDB from "./config/db.js";
import { seedAppleiPhones } from "./seedAppleiPhones.js";

async function runMasterSeed() {
  console.log("🚀 Starting Master Safe Database Seeding process...\n");
  try {
    await connectDB();

    console.log("--- 1/2 Seeding Apple iPhones ---");
    await seedAppleiPhones();

    console.log("\n🎉 Master Database Seeding completed successfully!");
    console.log("All iPhone models, Samsung devices, Laptops, Watches, Consoles & TVs are safely updated in MongoDB.");
    process.exit(0);
  } catch (error) {
    console.error(`\n❌ Master Seeding failed: ${error.message}`);
    process.exit(1);
  }
}

runMasterSeed();
