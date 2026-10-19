/**
 * ==============================================================================
 * SellPhoneCash — Unified Google Sheets Sync Webhook (V2 - Ultra-Reliable)
 * ==============================================================================
 * Automatically stores both:
 *  1. "Sell Phone Leads" (Trade-In Cash Valuation Leads & Pickup Bookings)
 *  2. "Buy Phone Orders" (Certified Pre-Owned Resale Marketplace Enquiries/Orders)
 * 
 * In a SINGLE Google Spreadsheet with dedicated, auto-formatted tabs!
 * ==============================================================================
 */

// OPTIONAL: If your script is created at script.google.com (standalone),
// paste your Google Sheet ID between the quotes below.
// Example: https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
// ID is: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
// If you opened Apps Script from inside the Google Sheet (Extensions > Apps Script), you can leave this blank!
var SPREADSHEET_ID = "";

/**
 * Main Webhook Receiver (called automatically by Node.js backend)
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService
        .createTextOutput(JSON.stringify({ 
          status: "error", 
          message: "No payload received. Note: To test this in the Apps Script editor, run the testSellLead() or testBuyOrder() function instead of clicking Run on doPost()." 
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var payload = JSON.parse(e.postData.contents);
    var result = processIncomingLeadOrOrder(payload);

    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log("doPost Error: " + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Health-check GET endpoint (testable directly from your browser)
 */
function doGet(e) {
  var sheetOk = false;
  var sheetTitle = "None";
  try {
    var ss = getSpreadsheet();
    sheetOk = true;
    sheetTitle = ss.getName();
  } catch (err) {
    sheetOk = false;
  }

  return ContentService
    .createTextOutput(JSON.stringify({
      status: "active",
      message: "SellPhoneCash Google Sheets Sync Webhook is running successfully!",
      connectedSheet: sheetTitle,
      supportedActions: ["appendSellLead", "appendBuyOrder"],
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Core processing logic (shared between live webhook and test functions)
 */
function processIncomingLeadOrOrder(payload) {
  var ss = getSpreadsheet();
  var action = payload.action;

  // --------------------------------------------------------------------------
  // 1. SELL PHONE LEADS (Trade-In / Valuation & Doorstep Pickup)
  // --------------------------------------------------------------------------
  if (action === "appendSellLead" || payload.lead || (payload.order && payload.order.devices)) {
    var lead = payload.lead || payload.order;
    var sellSheet = getOrCreateSheet(ss, "Sell Phone Leads", [
      "Timestamp",
      "Order ID",
      "Date / Time",
      "Customer Name",
      "Phone Number",
      "Email Address",
      "Emirate / City",
      "Pickup Address",
      "Pickup Date",
      "Pickup Time",
      "Devices & Condition",
      "Total Payout (AED)",
      "Payment Method",
      "Status",
      "Channel",
      "Campaign"
    ], "#0f172a");

    var sellRow = [
      new Date(),
      lead.orderId || lead._id || "N/A",
      lead.date || new Date().toISOString(),
      lead.customerName || (lead.customerDetails && lead.customerDetails.name) || "N/A",
      lead.phone || (lead.customerDetails && lead.customerDetails.phone) || "N/A",
      lead.email || (lead.customerDetails && lead.customerDetails.email) || "N/A",
      lead.city || (lead.customerDetails && lead.customerDetails.city) || "Dubai",
      lead.address || (lead.customerDetails && lead.customerDetails.address) || "N/A",
      lead.pickupDate || (lead.pickupSchedule && lead.pickupSchedule.pickupDate) || "N/A",
      lead.pickupTime || (lead.pickupSchedule && lead.pickupSchedule.pickupTime) || "N/A",
      lead.devices || formatDevices(lead.devices),
      Number(lead.totalPayout || 0),
      lead.paymentMethod || "Cash on Pickup",
      lead.status || "pending",
      lead.channel || (lead.marketingAttribution && lead.marketingAttribution.source) || "Direct",
      lead.campaign || (lead.marketingAttribution && lead.marketingAttribution.campaign) || "none"
    ];

    sellSheet.appendRow(sellRow);
    formatLastRow(sellSheet, sellRow.length);
    SpreadsheetApp.flush();

    return { status: "success", type: "sell_lead", orderId: lead.orderId, row: sellSheet.getLastRow() };
  }

  // --------------------------------------------------------------------------
  // 2. BUY PHONE ORDERS (Pre-Owned Marketplace Purchase Orders)
  // --------------------------------------------------------------------------
  if (action === "appendBuyOrder" || payload.order) {
    var order = payload.order;
    var buySheet = getOrCreateSheet(ss, "Buy Phone Orders", [
      "Timestamp",
      "Order Number",
      "Date / Time",
      "Customer Name",
      "Phone Number",
      "Email Address",
      "City / Emirate",
      "Delivery Address",
      "Purchased Handsets",
      "Total Amount (AED)",
      "Payment Method",
      "Payment Status",
      "Order Status",
      "Notes"
    ], "#0f172a");

    var buyRow = [
      new Date(),
      order.orderNumber || "BUY-" + Date.now(),
      order.date || new Date().toISOString(),
      order.customerName || (order.customerDetails && order.customerDetails.name) || "N/A",
      order.phone || (order.customerDetails && order.customerDetails.phone) || "N/A",
      order.email || (order.customerDetails && order.customerDetails.email) || "N/A",
      order.city || (order.customerDetails && order.customerDetails.city) || "Dubai",
      order.address || (order.customerDetails && (order.customerDetails.address + " " + (order.customerDetails.building || ""))) || "N/A",
      order.items || formatItems(order.items),
      Number(order.totalAmount || 0),
      order.paymentMethod || "Cash on Delivery",
      order.paymentStatus || "unpaid",
      order.orderStatus || "pending",
      order.notes || (order.customerDetails && order.customerDetails.notes) || ""
    ];

    buySheet.appendRow(buyRow);
    formatLastRow(buySheet, buyRow.length);
    SpreadsheetApp.flush();

    return { status: "success", type: "buy_order", orderNumber: order.orderNumber, row: buySheet.getLastRow() };
  }

  throw new Error("Unrecognized action. Expected action='appendSellLead' or action='appendBuyOrder'.");
}

/**
 * ==============================================================================
 * TEST FUNCTIONS (Click 'Run' on these inside Apps Script to test without error)
 * ==============================================================================
 */

// Select 'testSellLead' in the dropdown and click Run (▶)
function testSellLead() {
  var sampleLead = {
    action: "appendSellLead",
    lead: {
      orderId: "SELL-TEST-101",
      date: new Date().toISOString(),
      customerName: "Ahmed Al Qasimi",
      phone: "+971 50 123 4567",
      email: "ahmed@example.ae",
      city: "Dubai",
      address: "Downtown Boulevard, Tower 1",
      pickupDate: "Tomorrow",
      pickupTime: "10:00 AM - 01:00 PM",
      devices: "Apple iPhone 15 Pro Max (256GB, Pristine) x1 @ AED 3,250",
      totalPayout: 3250,
      paymentMethod: "Cash on Pickup",
      status: "pending",
      channel: "Google Ads",
      campaign: "dubai_sell_iphone"
    }
  };

  var res = processIncomingLeadOrOrder(sampleLead);
  Logger.log("✅ Sell Lead Test Result: " + JSON.stringify(res));
}

// Select 'testBuyOrder' in the dropdown and click Run (▶)
function testBuyOrder() {
  var sampleOrder = {
    action: "appendBuyOrder",
    order: {
      orderNumber: "BUY-TEST-202",
      date: new Date().toISOString(),
      customerName: "Sarah Mansoori",
      phone: "+971 55 987 6543",
      email: "sarah@example.ae",
      city: "Abu Dhabi",
      address: "Corniche Road, Flat 402",
      items: "Samsung Galaxy S24 Ultra 5G (512GB, Titanium) x1 @ AED 3,249",
      totalAmount: 3249,
      paymentMethod: "Cash on Delivery",
      paymentStatus: "unpaid",
      orderStatus: "pending",
      notes: "Please call before arrival."
    }
  };

  var res = processIncomingLeadOrOrder(sampleOrder);
  Logger.log("✅ Buy Order Test Result: " + JSON.stringify(res));
}

/**
 * ==============================================================================
 * Helper Functions
 * ==============================================================================
 */

function getSpreadsheet() {
  if (SPREADSHEET_ID && SPREADSHEET_ID.trim() !== "") {
    return SpreadsheetApp.openById(SPREADSHEET_ID.trim());
  }
  try {
    var active = SpreadsheetApp.getActiveSpreadsheet();
    if (active) return active;
  } catch (e) {}

  throw new Error("Could not find connected spreadsheet. If you are using a standalone Apps Script project, please paste your Google Sheet ID into SPREADSHEET_ID at line 18.");
}

function getOrCreateSheet(ss, sheetName, headers, bgColor) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);

    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground(bgColor);
    headerRange.setFontColor("#ffffff");
    headerRange.setFontWeight("bold");
    headerRange.setFontFamily("Roboto");
    headerRange.setFontSize(10);
    headerRange.setHorizontalAlignment("center");
    headerRange.setVerticalAlignment("middle");
    sheet.setRowHeight(1, 38);

    for (var i = 1; i <= headers.length; i++) {
      sheet.autoResizeColumn(i);
      if (sheet.getColumnWidth(i) < 130) sheet.setColumnWidth(i, 140);
    }
  }
  return sheet;
}

function formatLastRow(sheet, numCols) {
  var lastRow = sheet.getLastRow();
  var range = sheet.getRange(lastRow, 1, 1, numCols);
  range.setFontFamily("Roboto");
  range.setFontSize(10);
  range.setVerticalAlignment("middle");
  sheet.setRowHeight(lastRow, 28);
  sheet.getRange(lastRow, 1).setNumberFormat("yyyy-mm-dd hh:mm:ss");
  range.setBackground(lastRow % 2 === 0 ? "#f8fafc" : "#ffffff");
}

function formatDevices(devices) {
  if (!devices) return "N/A";
  if (typeof devices === "string") return devices;
  if (Array.isArray(devices)) {
    return devices.map(function(d) {
      return (d.brand || "") + " " + (d.name || "Device") + " (" + (d.selectedStorage || "") + ", " + (d.selectedCondition || "") + ") x" + (d.quantity || 1) + " @ AED " + (d.calculatedPrice || 0);
    }).join(" | ");
  }
  return JSON.stringify(devices);
}

function formatItems(items) {
  if (!items) return "N/A";
  if (typeof items === "string") return items;
  if (Array.isArray(items)) {
    return items.map(function(i) {
      return (i.title || "Phone") + " (" + (i.selectedStorage || "") + ", " + (i.selectedColor || "") + ") x" + (i.quantity || 1) + " @ AED " + (i.price || 0);
    }).join(" | ");
  }
  return JSON.stringify(items);
}
