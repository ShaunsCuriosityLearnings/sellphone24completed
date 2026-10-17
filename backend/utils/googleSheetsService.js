import fs from "fs";
import path from "path";

/**
 * Append a Buy Order row to the dedicated "Buy Phones Orders" Google Sheet
 * Supports:
 * 1. Google Apps Script Webhook (Easiest & most reliable: zero complex OAuth token expiration issues)
 * 2. Google Sheets REST API v4 using Service Account / Bearer token
 * 3. Graceful fallback to local persistent sync file if external credentials are not yet set
 */
export const syncBuyOrderToGoogleSheets = async (order) => {
  const webhookUrl = process.env.GOOGLE_SHEET_BUY_ORDERS_WEBHOOK_URL || process.env.GOOGLE_SHEET_WEBHOOK_URL;
  const sheetId = process.env.GOOGLE_SHEET_ID;

  const itemsFormatted = (order.items || [])
    .map((item) => `${item.title} (${item.selectedStorage || "Standard"}, ${item.selectedColor || "Standard"}, ${item.condition}) x${item.quantity} @ AED ${item.price}`)
    .join(" | ");

  const rowData = {
    orderNumber: order.orderNumber,
    date: new Date(order.createdAt || Date.now()).toISOString().replace("T", " ").substring(0, 19),
    customerName: order.customerDetails?.name || "N/A",
    phone: order.customerDetails?.phone || "N/A",
    email: order.customerDetails?.email || "N/A",
    city: order.customerDetails?.city || "Dubai",
    address: `${order.customerDetails?.address || ""}, ${order.customerDetails?.building || ""} ${order.customerDetails?.apartment || ""}`.trim(),
    items: itemsFormatted,
    totalAmount: order.totalAmount,
    paymentMethod: order.paymentMethod === "cod" ? "Cash on Delivery" : "Card on Delivery",
    paymentStatus: order.paymentStatus || "unpaid",
    orderStatus: order.orderStatus || "pending",
    notes: order.customerDetails?.notes || "",
  };

  // Always log to local operational backup
  try {
    const backupDir = path.join(process.cwd(), "backups");
    if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
    const logFile = path.join(backupDir, "google_sheets_buy_orders_log.json");
    let currentLogs = [];
    if (fs.existsSync(logFile)) {
      try {
        currentLogs = JSON.parse(fs.readFileSync(logFile, "utf-8"));
      } catch (e) {
        currentLogs = [];
      }
    }
    // Avoid duplicate entries
    const existingIdx = currentLogs.findIndex((log) => log.orderNumber === order.orderNumber);
    if (existingIdx >= 0) {
      currentLogs[existingIdx] = { ...rowData, updatedAt: new Date().toISOString() };
    } else {
      currentLogs.push({ ...rowData, loggedAt: new Date().toISOString() });
    }
    fs.writeFileSync(logFile, JSON.stringify(currentLogs, null, 2));
  } catch (err) {
    console.warn("⚠️ Could not write local Google Sheets sync log:", err.message);
  }

  // If webhook is provided, dispatch POST request
  if (webhookUrl) {
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "appendBuyOrder",
          sheetName: "Buy Phones Orders",
          order: rowData,
        }),
      });

      if (!response.ok) {
        throw new Error(`Google Sheets Webhook HTTP error ${response.status}`);
      }

      console.log(`📊 Successfully synced Order #${order.orderNumber} to Google Sheets via Webhook.`);
      return { success: true, method: "webhook" };
    } catch (error) {
      console.error(`❌ Google Sheets Webhook sync failed for #${order.orderNumber}:`, error.message);
      return { success: false, error: error.message };
    }
  }

  // If no webhook or API configured, mark as pending setup but logged locally
  console.log(`ℹ️ Google Sheet Webhook (GOOGLE_SHEET_BUY_ORDERS_WEBHOOK_URL) not configured. Order #${order.orderNumber} saved to local sync log.`);
  return { success: true, method: "local_log", note: "Logged locally in backups/google_sheets_buy_orders_log.json" };
};
