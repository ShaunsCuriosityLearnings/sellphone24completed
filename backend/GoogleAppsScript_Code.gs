/**
 * ==============================================================================
 * SellPhoneCash — Unified Google Sheets Sync Webhook
 * ==============================================================================
 * Automatically stores both:
 *  1. "Sell Phone Leads" (Trade-In Cash Valuation Leads & Pickup Bookings)
 *  2. "Buy Phone Orders" (Certified Pre-Owned Resale Marketplace Enquiries/Orders)
 * 
 * In a SINGLE Google Spreadsheet with dedicated, auto-formatted tabs!
 * ==============================================================================
 */

// Configuration
var SPREADSHEET_ID = ""; // Leave blank "" to use the current active spreadsheet attached to this script

/**
 * Handle incoming POST requests from the backend
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  // Wait up to 30 seconds for concurrent requests
  try {
    lock.waitLock(30000);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: "Server busy, could not acquire lock" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("No post data received in request.");
    }

    var payload = JSON.parse(e.postData.contents);
    var action = payload.action;
    var ss = SPREADSHEET_ID ? SpreadsheetApp.openById(SPREADSHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();

    // --------------------------------------------------------------------------
    // CASE 1: SELL PHONE LEADS (Trade-In / Sell Old Devices for Cash)
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
      ], "#0f172a", "#10b981");

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

      return ContentService
        .createTextOutput(JSON.stringify({ status: "success", type: "sell_lead", orderId: lead.orderId }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // --------------------------------------------------------------------------
    // CASE 2: BUY PHONE ORDERS (Pre-Owned Marketplace Purchase Orders)
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
      ], "#0f172a", "#3b82f6");

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

      return ContentService
        .createTextOutput(JSON.stringify({ status: "success", type: "buy_order", orderNumber: order.orderNumber }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    throw new Error("Unrecognized payload action or missing order data.");

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

/**
 * Health-check GET handler (accessible from browser)
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: "active",
      message: "SellPhoneCash Google Sheets Sync Webhook is active and running!",
      supportedActions: ["appendSellLead", "appendBuyOrder"],
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Helper: Find or create tab with styled headers and frozen first row
 */
function getOrCreateSheet(ss, sheetName, headers, bgColor, accentColor) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    
    // Insert header row
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

    // Auto resize column widths
    for (var i = 1; i <= headers.length; i++) {
      sheet.autoResizeColumn(i);
      var width = sheet.getColumnWidth(i);
      if (width < 120) sheet.setColumnWidth(i, 130);
    }
  }
  return sheet;
}

/**
 * Helper: Format the newly appended row
 */
function formatLastRow(sheet, numCols) {
  var lastRow = sheet.getLastRow();
  var range = sheet.getRange(lastRow, 1, 1, numCols);
  range.setFontFamily("Roboto");
  range.setFontSize(10);
  range.setVerticalAlignment("middle");
  sheet.setRowHeight(lastRow, 28);

  // Set date format on col 1 & 3
  sheet.getRange(lastRow, 1).setNumberFormat("yyyy-mm-dd hh:mm:ss");
  
  // Set alternating row color for readability
  if (lastRow % 2 === 0) {
    range.setBackground("#f8fafc");
  } else {
    range.setBackground("#ffffff");
  }
}

/**
 * Helper: Format devices array if passed raw
 */
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

/**
 * Helper: Format items array if passed raw
 */
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
