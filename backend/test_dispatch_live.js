import dotenv from "dotenv";
dotenv.config();

import { syncSellLeadToGoogleSheets, syncBuyOrderToGoogleSheets } from "./utils/googleSheetsService.js";
import { sendOrderConfirmationEmails } from "./utils/emailService.js";
import { sendBuyOrderConfirmationEmails } from "./utils/buyOrderEmailService.js";

async function dispatchLiveTests() {
  console.log("================================================================");
  console.log("🚀 INITIATING LIVE GOOGLE SHEETS & EMAIL TEST DISPATCH");
  console.log("================================================================");
  console.log("Google Sheets Webhook URL:", process.env.GOOGLE_SHEET_WEBHOOK_URL);
  console.log("SMTP User:", process.env.SMTP_USER);
  console.log("----------------------------------------------------------------");

  const randomSuffix = Math.floor(1000 + Math.random() * 9000);

  // 1. SELL PHONE LEAD TEST PAYLOAD
  const sellLeadPayload = {
    _id: "SELL-TEST-" + randomSuffix,
    createdAt: new Date(),
    customerDetails: {
      name: "Rashid Al Maktoum (LIVE TEST LEAD)",
      phone: "+971 50 777 8899",
      email: "sellphone24phone@gmail.com",
      city: "Dubai",
      address: "Downtown Dubai, Boulevard Point, Apt 1204",
      state: "Dubai"
    },
    pickupSchedule: {
      pickupDate: "Tomorrow (Wednesday)",
      pickupTime: "11:00 AM - 02:00 PM"
    },
    devices: [
      {
        name: "Apple iPhone 15 Pro Max",
        brand: "Apple",
        category: "Phone",
        selectedStorage: "256GB",
        selectedColor: "Natural Titanium",
        selectedCondition: "Flawless (100% Value)",
        calculatedPrice: 3350,
        quantity: 1
      }
    ],
    totalPayout: 3350,
    paymentMethod: "cash",
    acquisitionChannel: "Google Search (Organic)",
    utmCampaign: "dubai_sell_iphone_15_pro_max",
    status: "pending"
  };

  console.log("1️⃣ Dispatching Sell Phone Lead to Google Sheet (Tab: 'Sell Phone Leads')...");
  const sellSheetResult = await syncSellLeadToGoogleSheets(sellLeadPayload);
  console.log("📊 Sell Lead Google Sheets Result:", sellSheetResult);

  console.log("✉️ Dispatching Sell Phone Lead Confirmation Email...");
  await sendOrderConfirmationEmails(sellLeadPayload);

  console.log("----------------------------------------------------------------");

  // 2. BUY PHONE ORDER TEST PAYLOAD
  const buyOrderPayload = {
    orderNumber: "BUY-" + new Date().toISOString().slice(0, 10).replace(/-/g, "") + "-" + randomSuffix,
    createdAt: new Date(),
    customerDetails: {
      name: "Sara Al Nuaimi (LIVE TEST BUYER)",
      phone: "+971 55 444 3322",
      email: "sellphone24phone@gmail.com",
      city: "Abu Dhabi",
      address: "Corniche Road, Etihad Towers",
      building: "Tower 3",
      apartment: "Flat 1502",
      notes: "Live verification test order - please call before arrival."
    },
    items: [
      {
        title: "Samsung Galaxy S24 Ultra 5G",
        brand: "Samsung",
        model: "Galaxy S24 Ultra",
        selectedStorage: "512GB",
        selectedColor: "Titanium Gray",
        condition: "Pristine (Like New)",
        price: 3299,
        quantity: 1
      }
    ],
    subtotal: 3299,
    deliveryFee: 0,
    totalAmount: 3299,
    paymentMethod: "card_on_delivery",
    orderStatus: "pending"
  };

  console.log("2️⃣ Dispatching Buy Phone Order to Google Sheet (Tab: 'Buy Phone Orders')...");
  const buySheetResult = await syncBuyOrderToGoogleSheets(buyOrderPayload);
  console.log("📊 Buy Order Google Sheets Result:", buySheetResult);

  console.log("✉️ Dispatching Buy Phone Order Invoice & Warranty Email...");
  await sendBuyOrderConfirmationEmails(buyOrderPayload);

  console.log("================================================================");
  console.log("✅ TEST COMPLETED SUCCESSFULLY FOR BOTH FORMS!");
  console.log("================================================================");
}

dispatchLiveTests().catch(err => {
  console.error("❌ Test failed:", err);
});
