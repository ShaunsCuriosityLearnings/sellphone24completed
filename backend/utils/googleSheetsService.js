import fs from "fs";
import path from "path";

/**
 * Append a Buy Order row to the dedicated "Buy Phones Orders" Google Sheet
 */
export const syncBuyOrderToGoogleSheets = async (order) => {
  const webhookUrl = process.env.GOOGLE_SHEET_BUY_ORDERS_WEBHOOK_URL || process.env.GOOGLE_SHEET_WEBHOOK_URL;

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

  // If webhook URL is missing, fail explicitly so status isn't masked
  if (!webhookUrl) {
    console.warn(`⚠️ Google Sheet Webhook (GOOGLE_SHEET_WEBHOOK_URL) not configured in backend/.env. Order #${order.orderNumber} saved to local sync log only.`);
    return { success: false, error: "Google Sheet Webhook URL not configured in backend/.env", method: "local_log" };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "appendBuyOrder",
        sheetName: "Buy Phone Orders",
        order: rowData,
      }),
    });

    if (!response.ok) {
      throw new Error(`Google Sheets Webhook HTTP error ${response.status}`);
    }

    const rawText = await response.text();
    let jsonResult = {};
    try {
      jsonResult = JSON.parse(rawText);
    } catch (parseErr) {
      throw new Error(`Invalid JSON response from Google Sheets Webhook: ${rawText.slice(0, 100)}`);
    }

    if (jsonResult.status === "error") {
      throw new Error(jsonResult.message || "Google Sheets Webhook returned error status");
    }

    console.log(`📊 Successfully synced Order #${order.orderNumber} to Google Sheets via Webhook.`);
    return { success: true, method: "webhook", data: jsonResult };
  } catch (error) {
    console.error(`❌ Google Sheets Webhook sync failed for #${order.orderNumber}:`, error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Append a Sell Phone Trade-In Lead row to the "Sell Phone Leads" Google Sheet
 */
export const syncSellLeadToGoogleSheets = async (order) => {
  const webhookUrl = process.env.GOOGLE_SHEET_SELL_LEADS_WEBHOOK_URL || process.env.GOOGLE_SHEET_WEBHOOK_URL;

  const devicesFormatted = (order.devices || [])
    .map((d) => `${d.brand || ""} ${d.name || "Device"} (${d.selectedStorage || "Standard"}, ${d.selectedColor || "Standard"}, ${d.selectedCondition || "Good"}) x${d.quantity || 1} @ AED ${d.calculatedPrice || 0}`)
    .join(" | ");

  const rowData = {
    orderId: String(order._id || order.id || "N/A"),
    date: new Date(order.createdAt || Date.now()).toISOString().replace("T", " ").substring(0, 19),
    customerName: order.customerDetails?.name || "N/A",
    phone: order.customerDetails?.phone || "N/A",
    email: order.customerDetails?.email || "N/A",
    city: order.customerDetails?.city || "Dubai",
    address: order.customerDetails?.address || "N/A",
    pickupDate: order.pickupSchedule?.pickupDate || "N/A",
    pickupTime: order.pickupSchedule?.pickupTime || "N/A",
    devices: devicesFormatted || "Standard Device",
    totalPayout: order.totalPayout || 0,
    paymentMethod: order.paymentMethod === "cash" ? "Cash on Pickup" : order.paymentMethod || "Cash",
    status: order.status || "pending",
    channel: order.acquisitionChannel || order.marketingAttribution?.source || "Direct",
    campaign: order.utmCampaign || order.marketingAttribution?.campaign || "none",
  };

  // Always log to local operational backup
  try {
    const backupDir = path.join(process.cwd(), "backups");
    if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
    const logFile = path.join(backupDir, "google_sheets_sell_leads_log.json");
    let currentLogs = [];
    if (fs.existsSync(logFile)) {
      try {
        currentLogs = JSON.parse(fs.readFileSync(logFile, "utf-8"));
      } catch (e) {
        currentLogs = [];
      }
    }
    const existingIdx = currentLogs.findIndex((log) => log.orderId === rowData.orderId);
    if (existingIdx >= 0) {
      currentLogs[existingIdx] = { ...rowData, updatedAt: new Date().toISOString() };
    } else {
      currentLogs.push({ ...rowData, loggedAt: new Date().toISOString() });
    }
    fs.writeFileSync(logFile, JSON.stringify(currentLogs, null, 2));
  } catch (err) {
    console.warn("⚠️ Could not write local Sell Leads sync log:", err.message);
  }

  // If webhook URL is missing, fail explicitly so status isn't masked
  if (!webhookUrl) {
    console.warn(`⚠️ Google Sheet Webhook (GOOGLE_SHEET_WEBHOOK_URL) not configured in backend/.env. Sell Lead #${rowData.orderId} saved to local sync log only.`);
    return { success: false, error: "Google Sheet Webhook URL not configured in backend/.env", method: "local_log" };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "appendSellLead",
        sheetName: "Sell Phone Leads",
        lead: rowData,
      }),
    });

    if (!response.ok) {
      throw new Error(`Google Sheets Webhook HTTP error ${response.status}`);
    }

    const rawText = await response.text();
    let jsonResult = {};
    try {
      jsonResult = JSON.parse(rawText);
    } catch (parseErr) {
      throw new Error(`Invalid JSON response from Google Sheets Webhook: ${rawText.slice(0, 100)}`);
    }

    if (jsonResult.status === "error") {
      throw new Error(jsonResult.message || "Google Sheets Webhook returned error status");
    }

    console.log(`📊 Successfully synced Sell Lead #${rowData.orderId} to Google Sheets via Webhook.`);
    return { success: true, method: "webhook", data: jsonResult };
  } catch (error) {
    console.error(`❌ Google Sheets Webhook sync failed for Sell Lead #${rowData.orderId}:`, error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Append a Custom Device Request to the Google Sheet
 */
export const syncCustomRequestToGoogleSheets = async (customRequest) => {
  const webhookUrl = process.env.GOOGLE_SHEET_SELL_LEADS_WEBHOOK_URL || process.env.GOOGLE_SHEET_WEBHOOK_URL;

  const rowData = {
    orderId: "CUSTOM-" + String(customRequest._id || customRequest.id || Date.now()).slice(-6).toUpperCase(),
    date: new Date(customRequest.createdAt || Date.now()).toISOString().replace("T", " ").substring(0, 19),
    customerName: customRequest.name || "N/A",
    phone: customRequest.phone || "N/A",
    email: customRequest.email || "N/A",
    city: "Dubai (Custom Quote)",
    address: customRequest.description ? `Note: ${customRequest.description}` : "Unlisted Device Quote Request",
    pickupDate: "TBD (Quote Pending)",
    pickupTime: "Pending Review",
    devices: `[CUSTOM QUOTE] ${customRequest.deviceBrand} ${customRequest.deviceModel} (${customRequest.condition})`,
    totalPayout: 0,
    paymentMethod: "Quote Pending",
    status: customRequest.status || "pending",
    channel: "Custom Quote Form",
    campaign: "sell-any-device",
  };

  if (!webhookUrl) return { success: false, error: "Webhook not configured" };

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "appendSellLead",
        sheetName: "Sell Phone Leads",
        lead: rowData,
      }),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const text = await response.text();
    const json = JSON.parse(text);
    return { success: json.status !== "error", data: json };
  } catch (err) {
    console.error("Custom request Google Sheet sync failed:", err.message);
    return { success: false, error: err.message };
  }
};
