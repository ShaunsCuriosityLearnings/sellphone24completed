/**
 * HTML Email Templates for SellPhoneCash / sellphone.ae
 */

const primaryColor = "#0284c7"; // Brand blue
const darkBg = "#0f172a";
const lightBg = "#f8fafc";
const cardBg = "#ffffff";

// Helper to format currency
const formatPrice = (amount) => {
  return `AED ${Number(amount || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
};

// Helper for status badge styling & text
const getStatusLabel = (status) => {
  switch (status) {
    case "pending":
      return { text: "Pending Review", color: "#eab308" };
    case "pickup_assigned":
      return { text: "Pickup Assigned", color: "#3b82f6" };
    case "inspected":
      return { text: "Device Inspected", color: "#8b5cf6" };
    case "completed":
      return { text: "Order Completed & Paid", color: "#22c55e" };
    case "cancelled":
      return { text: "Order Cancelled", color: "#ef4444" };
    default:
      return { text: status, color: "#64748b" };
  }
};

/**
 * 1A. Client Order Placement Email Template
 */
export const getClientOrderEmailTemplate = (order) => {
  const { customerDetails, pickupSchedule, devices, totalPayout, _id } = order;

  const deviceRows = devices.map((d) => `
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 12px; font-weight: 600; color: #1e293b;">
        ${d.name} <br>
        <span style="font-size: 12px; color: #64748b; font-weight: normal;">
          ${d.brand} • ${d.category} • ${d.selectedStorage} • ${d.selectedColor} • Condition: ${d.selectedCondition}
        </span>
      </td>
      <td style="padding: 12px; text-align: center; color: #475569;">${d.quantity || 1}</td>
      <td style="padding: 12px; text-align: right; font-weight: 600; color: #0284c7;">${formatPrice(d.calculatedPrice)}</td>
    </tr>
  `).join("");

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: ${lightBg}; margin: 0; padding: 20px; color: #334155;">
      <div style="max-width: 600px; margin: 0 auto; background: ${cardBg}; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <!-- Header -->
        <div style="background-color: ${darkBg}; padding: 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">SellPhoneCash</h1>
          <p style="color: #94a3b8; margin: 4px 0 0 0; font-size: 14px;">Sell Your Device Effortlessly</p>
        </div>

        <!-- Body -->
        <div style="padding: 24px;">
          <h2 style="color: #0f172a; margin-top: 0;">Order Confirmed! 🎉</h2>
          <p>Hi <strong>${customerDetails.name}</strong>,</p>
          <p>Thank you for booking a device trade-in/sale with <strong>SellPhoneCash</strong>! We have received your order (Ref: <code>#${_id}</code>).</p>
          
          <!-- Summary Box -->
          <div style="background-color: #f1f5f9; border-left: 4px solid ${primaryColor}; padding: 16px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0; font-size: 15px;"><strong>Estimated Cash Payout:</strong> <span style="font-size: 20px; color: ${primaryColor}; font-weight: bold;">${formatPrice(totalPayout)}</span></p>
            <p style="margin: 6px 0 0 0; font-size: 14px; color: #475569;"><strong>Payment Method:</strong> Cash on Pickup</p>
          </div>

          <!-- Pickup Schedule -->
          <h3 style="color: #0f172a; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px;">Pickup Details</h3>
          <p style="margin: 4px 0;"><strong>Scheduled Date:</strong> ${pickupSchedule?.pickupDate || "To be arranged"}</p>
          <p style="margin: 4px 0;"><strong>Time Slot:</strong> ${pickupSchedule?.pickupTime || "Standard Hours"}</p>
          <p style="margin: 4px 0;"><strong>Address:</strong> ${customerDetails.address}, ${customerDetails.city}, ${customerDetails.state || "UAE"}</p>

          <!-- Device Breakdown -->
          <h3 style="color: #0f172a; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; margin-top: 24px;">Devices to Collect</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 8px;">
            <thead>
              <tr style="background-color: #f8fafc; color: #475569; text-align: left; font-size: 13px;">
                <th style="padding: 10px;">Device Details</th>
                <th style="padding: 10px; text-align: center;">Qty</th>
                <th style="padding: 10px; text-align: right;">Payout</th>
              </tr>
            </thead>
            <tbody>
              ${deviceRows}
            </tbody>
          </table>

          <div style="margin-top: 30px; padding: 16px; background-color: #eff6ff; border-radius: 8px; border: 1px solid #bfdbfe;">
            <h4 style="margin: 0 0 8px 0; color: #1e40af;">What happens next?</h4>
            <ul style="margin: 0; padding-left: 20px; color: #1e3a8a; font-size: 14px;">
              <li>Our verification team will assign a courier for pickup.</li>
              <li>Our agent will inspect your device at your doorstep.</li>
              <li>You will receive your cash payout immediately upon inspection.</li>
            </ul>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8;">
          <p style="margin: 0;">© ${new Date().getFullYear()} SellPhoneCash. All rights reserved.</p>
          <p style="margin: 4px 0 0 0;">Need help? Contact support or reply directly to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * 1B. Admin Order Placement Email Template
 */
export const getAdminOrderEmailTemplate = (order) => {
  const { customerDetails, pickupSchedule, devices, totalPayout, _id } = order;

  const deviceRows = devices.map((d) => `
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 10px;"><strong>${d.name}</strong> (${d.brand})</td>
      <td style="padding: 10px;">${d.selectedStorage} | ${d.selectedColor} | ${d.selectedCondition}</td>
      <td style="padding: 10px; text-align: right;">${formatPrice(d.calculatedPrice)}</td>
    </tr>
  `).join("");

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: sans-serif; background-color: #f1f5f9; padding: 20px;">
      <div style="max-width: 650px; margin: 0 auto; background: #ffffff; padding: 24px; border-radius: 8px; border-top: 4px solid ${primaryColor};">
        <h2 style="color: #0f172a; margin-top: 0;">🚨 New Order Received (#${_id})</h2>
        <p style="font-size: 16px; color: #334155;">A new sell order has been submitted on SellPhoneCash.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; background: #f8fafc; border-radius: 6px;">
          <tr>
            <td style="padding: 12px; font-weight: bold;">Customer Name:</td>
            <td style="padding: 12px;">${customerDetails.name}</td>
          </tr>
          <tr>
            <td style="padding: 12px; font-weight: bold;">Email:</td>
            <td style="padding: 12px;"><a href="mailto:${customerDetails.email}">${customerDetails.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 12px; font-weight: bold;">Phone:</td>
            <td style="padding: 12px;"><a href="tel:${customerDetails.phone}">${customerDetails.phone}</a></td>
          </tr>
          <tr>
            <td style="padding: 12px; font-weight: bold;">Pickup Address:</td>
            <td style="padding: 12px;">${customerDetails.address}, ${customerDetails.city}, ${customerDetails.state || "UAE"} ${customerDetails.pincode ? `(${customerDetails.pincode})` : ""}</td>
          </tr>
          <tr>
            <td style="padding: 12px; font-weight: bold;">Scheduled Pickup:</td>
            <td style="padding: 12px;">${pickupSchedule?.pickupDate} @ ${pickupSchedule?.pickupTime}</td>
          </tr>
          <tr>
            <td style="padding: 12px; font-weight: bold; color: ${primaryColor};">Total Payout:</td>
            <td style="padding: 12px; font-weight: bold; font-size: 18px; color: ${primaryColor};">${formatPrice(totalPayout)}</td>
          </tr>
        </table>

        <h3>Devices to Collect</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tr style="background: #e2e8f0; text-align: left;">
            <th style="padding: 8px;">Device</th>
            <th style="padding: 8px;">Variant & Condition</th>
            <th style="padding: 8px; text-align: right;">Calculated Payout</th>
          </tr>
          ${deviceRows}
        </table>
      </div>
    </body>
    </html>
  `;
};

/**
 * 2A. Client Order Status Update Email Template
 */
export const getClientStatusEmailTemplate = (order) => {
  const { customerDetails, status, totalPayout, _id } = order;
  const statusInfo = getStatusLabel(status);

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: ${lightBg}; margin: 0; padding: 20px; color: #334155;">
      <div style="max-width: 600px; margin: 0 auto; background: ${cardBg}; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <div style="background-color: ${darkBg}; padding: 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">SellPhoneCash</h1>
        </div>
        <div style="padding: 24px;">
          <h2 style="color: #0f172a; margin-top: 0;">Order Status Update</h2>
          <p>Hi <strong>${customerDetails.name}</strong>,</p>
          <p>The status of your device trade-in order (Ref: <code>#${_id}</code>) has been updated.</p>

          <div style="text-align: center; margin: 24px 0; padding: 20px; background-color: #f8fafc; border-radius: 8px;">
            <span style="font-size: 13px; text-transform: uppercase; tracking: 1px; color: #64748b; font-weight: bold; display: block; margin-bottom: 8px;">Current Status</span>
            <span style="display: inline-block; background-color: ${statusInfo.color}; color: #ffffff; padding: 8px 20px; border-radius: 20px; font-weight: bold; font-size: 16px;">
              ${statusInfo.text}
            </span>
          </div>

          <p style="font-size: 14px; color: #475569;">
            <strong>Expected Payout:</strong> ${formatPrice(totalPayout)}
          </p>

          <p style="font-size: 14px; color: #475569; margin-top: 20px;">
            If you have any questions regarding this status update, feel free to reply directly to this email or call our customer support.
          </p>
        </div>
        <div style="background-color: #f8fafc; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8;">
          <p style="margin: 0;">© ${new Date().getFullYear()} SellPhoneCash. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * 2B. Admin Order Status Update Email Template
 */
export const getAdminStatusEmailTemplate = (order) => {
  const { customerDetails, status, _id } = order;
  const statusInfo = getStatusLabel(status);

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: sans-serif; background-color: #f1f5f9; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 24px; border-radius: 8px; border-top: 4px solid ${statusInfo.color};">
        <h3 style="color: #0f172a; margin-top: 0;">Order Status Changed (#${_id})</h3>
        <p>Order status for customer <strong>${customerDetails.name}</strong> (${customerDetails.email}) has been updated to:</p>
        <div style="padding: 10px 16px; background-color: ${statusInfo.color}; color: #fff; font-weight: bold; display: inline-block; border-radius: 4px;">
          ${statusInfo.text}
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * 3A. Client Custom Device Request Email Template
 */
export const getClientCustomRequestEmailTemplate = (data) => {
  const { name, deviceBrand, deviceModel, condition, description } = data;

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: ${lightBg}; margin: 0; padding: 20px; color: #334155;">
      <div style="max-width: 600px; margin: 0 auto; background: ${cardBg}; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <div style="background-color: ${darkBg}; padding: 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">SellPhoneCash</h1>
        </div>
        <div style="padding: 24px;">
          <h2 style="color: #0f172a; margin-top: 0;">We Received Your Valuation Request! 📱</h2>
          <p>Hi <strong>${name}</strong>,</p>
          <p>Thank you for submitting your custom device request to sell your <strong>${deviceBrand} ${deviceModel}</strong>!</p>
          
          <div style="background-color: #f8fafc; border-left: 4px solid ${primaryColor}; padding: 16px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 4px 0;"><strong>Brand:</strong> ${deviceBrand}</p>
            <p style="margin: 4px 0;"><strong>Model:</strong> ${deviceModel}</p>
            <p style="margin: 4px 0;"><strong>Condition:</strong> ${condition}</p>
            ${description ? `<p style="margin: 4px 0;"><strong>Notes:</strong> ${description}</p>` : ""}
          </div>

          <p style="font-size: 14px; color: #475569;">
            Our evaluation team is reviewing your device specifications and will contact you via email or phone shortly with our best custom cash quote!
          </p>
        </div>
        <div style="background-color: #f8fafc; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8;">
          <p style="margin: 0;">© ${new Date().getFullYear()} SellPhoneCash. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * 3B. Admin Custom Device Request Email Template
 */
export const getAdminCustomRequestEmailTemplate = (data) => {
  const { name, email, phone, deviceBrand, deviceModel, condition, description } = data;

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: sans-serif; background-color: #f1f5f9; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 24px; border-radius: 8px; border-top: 4px solid #8b5cf6;">
        <h2 style="color: #0f172a; margin-top: 0;">📝 New Custom Device Sell Request</h2>
        <p>A customer submitted a custom device quote request on SellPhoneCash:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; background: #f8fafc;">
          <tr>
            <td style="padding: 10px; font-weight: bold;">Customer Name:</td>
            <td style="padding: 10px;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold;">Email:</td>
            <td style="padding: 10px;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold;">Phone:</td>
            <td style="padding: 10px;"><a href="tel:${phone}">${phone}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold;">Device:</td>
            <td style="padding: 10px;">${deviceBrand} - ${deviceModel}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold;">Condition:</td>
            <td style="padding: 10px;">${condition}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold;">Description:</td>
            <td style="padding: 10px;">${description || "N/A"}</td>
          </tr>
        </table>
      </div>
    </body>
    </html>
  `;
};
