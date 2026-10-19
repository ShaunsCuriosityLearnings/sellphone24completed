/**
 * HTML Email Templates for SellPhone24 Buy Phones (Certified Pre-Owned Store)
 * 
 * Distinct Brand Aesthetic:
 * - Emerald Green (#059669 / #10b981) + Slate Obsidian (#0f172a / #1e293b)
 * - E-Commerce Invoice & Retail Certificate styling
 * - Distinct from SellPhone trade-in cash payouts (which uses Trade-in Blue #0284c7)
 */

const primaryEmerald = "#059669";
const lightEmeraldBg = "#ecfdf5";
const borderEmerald = "#a7f3d0";
const darkSlate = "#0f172a";
const textMuted = "#64748b";
const cardBg = "#ffffff";
const pageBg = "#f8fafc";

// Helper to format currency in AED
const formatAED = (amount) => {
  return `AED ${Number(amount || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// Helper for Buy Order Status Badge
const getBuyOrderStatusInfo = (status) => {
  switch (status) {
    case "pending":
      return {
        label: "Under Verification",
        bgColor: "#fef3c7",
        textColor: "#b45309",
        borderColor: "#fde68a",
        icon: "⏳",
        headline: "Your Order is Being Verified",
        message: "We have received your order and our logistics team is currently verifying the stock and delivery dispatch slot."
      };
    case "confirmed":
      return {
        label: "Confirmed & In Packaging",
        bgColor: "#dbeafe",
        textColor: "#1d4ed8",
        borderColor: "#bfdbfe",
        icon: "📦",
        headline: "Order Confirmed & Packaging Underway",
        message: "Your certified smartphone has passed the pre-dispatch 32-point inspection and is being securely packaged with tamper-proof seal."
      };
    case "dispatched":
      return {
        label: "Out for Express Delivery",
        bgColor: "#ede9fe",
        textColor: "#6d28d9",
        borderColor: "#ddd6fe",
        icon: "🚚",
        headline: "Your Smartphone is On the Way!",
        message: "Your parcel is with our express courier partner. Please keep your phone reachable and have payment ready (Cash or Card on Delivery)."
      };
    case "delivered":
      return {
        label: "Delivered & Warranty Active",
        bgColor: "#dcfce7",
        textColor: "#15803d",
        borderColor: "#86efac",
        icon: "🎉",
        headline: "Order Delivered Successfully!",
        message: "Your phone has been handed over. Your 12-Month Comprehensive Store Warranty is now officially active!"
      };
    case "cancelled":
      return {
        label: "Order Cancelled",
        bgColor: "#fee2e2",
        textColor: "#b91c1c",
        borderColor: "#fecaca",
        icon: "❌",
        headline: "Order Cancelled",
        message: "This order has been cancelled. If this was a mistake or you wish to re-order, please contact our support team."
      };
    default:
      return {
        label: status || "Processing",
        bgColor: "#f1f5f9",
        textColor: "#475569",
        borderColor: "#cbd5e1",
        icon: "ℹ️",
        headline: `Order Status: ${status}`,
        message: `Your order status has been updated to ${status}.`
      };
  }
};

/**
 * 1A. Customer Buy Order Confirmation Invoice Template
 */
export const getClientBuyOrderConfirmationTemplate = (order) => {
  const { customerDetails, items, totalAmount, subtotal, deliveryFee, paymentMethod, orderNumber, createdAt } = order;

  const orderDate = new Date(createdAt || Date.now()).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const paymentText = paymentMethod === "card_on_delivery" ? "Card on Delivery (POS Machine)" : "Cash on Delivery (COD)";

  const itemsRows = (items || []).map((item) => `
    <tr style="border-bottom: 1px solid #f1f5f9;">
      <td style="padding: 14px 10px; vertical-align: top;">
        <div style="font-weight: 700; color: #0f172a; font-size: 14px; line-height: 1.3;">
          ${item.title}
        </div>
        <div style="font-size: 12px; color: #64748b; margin-top: 4px; line-height: 1.4;">
          <span style="display: inline-block; background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-weight: 600; color: #334155; margin-right: 4px;">${item.selectedStorage || "Standard"}</span>
          <span style="display: inline-block; background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-weight: 600; color: #334155; margin-right: 4px;">${item.selectedColor || "Standard"}</span>
          <span style="display: inline-block; background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; padding: 2px 6px; border-radius: 4px; font-weight: 600;">Grade: ${item.condition}</span>
        </div>
      </td>
      <td style="padding: 14px 10px; text-align: center; color: #334155; font-size: 13px; font-weight: 600; vertical-align: middle;">
        ${item.quantity || 1}
      </td>
      <td style="padding: 14px 10px; text-align: right; color: #059669; font-weight: 800; font-size: 14px; vertical-align: middle;">
        ${formatAED((item.price || 0) * (item.quantity || 1))}
      </td>
    </tr>
  `).join("");

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation #${orderNumber}</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: ${pageBg}; margin: 0; padding: 24px 12px; color: #334155; line-height: 1.6;">
      <div style="max-width: 620px; margin: 0 auto; background: ${cardBg}; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01); border: 1px solid #e2e8f0;">
        
        <!-- Premium Store Header -->
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px 24px; text-align: center; position: relative;">
          <div style="display: inline-block; background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); padding: 4px 14px; border-radius: 20px; margin-bottom: 12px;">
            <span style="color: #34d399; font-size: 11px; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase;">
              ✓ Certified Pre-Owned Store
            </span>
          </div>
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">SellPhone24 Store</h1>
          <p style="color: #94a3b8; margin: 6px 0 0 0; font-size: 13px;">Premium Quality Smartphones • 12-Month Store Warranty</p>
        </div>

        <!-- Receipt Header Card -->
        <div style="padding: 24px 28px 12px 28px; border-bottom: 1px solid #f1f5f9;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="vertical-align: top;">
                <span style="font-size: 11px; color: ${textMuted}; text-transform: uppercase; font-weight: 700; letter-spacing: 0.8px;">Order Reference</span>
                <div style="font-size: 18px; font-weight: 800; color: #0f172a; margin-top: 2px;">#${orderNumber}</div>
                <div style="font-size: 12px; color: #64748b; margin-top: 2px;">Date: ${orderDate}</div>
              </td>
              <td style="vertical-align: top; text-align: right;">
                <span style="display: inline-block; background: ${lightEmeraldBg}; border: 1px solid ${borderEmerald}; color: #065f46; padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 700;">
                  Order Confirmed
                </span>
              </td>
            </tr>
          </table>
        </div>

        <!-- Body Content -->
        <div style="padding: 20px 28px;">
          <p style="font-size: 15px; color: #0f172a; margin-top: 0;">
            Dear <strong>${customerDetails.name}</strong>,
          </p>
          <p style="font-size: 14px; color: #475569; margin-top: 4px; line-height: 1.5;">
            Thank you for purchasing with <strong>SellPhone24 Store</strong>! We are delighted to confirm that your order for certified pre-owned smartphone(s) has been secured and sent to our logistics team for priority doorstep delivery.
          </p>

          <!-- Delivery Address & Recipient Card -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin: 20px 0;">
            <div style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 800; letter-spacing: 0.8px; margin-bottom: 8px;">
              📍 Express Delivery Destination
            </div>
            <div style="font-size: 14px; font-weight: 700; color: #0f172a;">${customerDetails.name}</div>
            <div style="font-size: 13px; color: #334155; margin-top: 3px;">
              ${customerDetails.address}${customerDetails.building ? `, ${customerDetails.building}` : ""}${customerDetails.apartment ? `, Flat/Villa: ${customerDetails.apartment}` : ""}, <strong>${customerDetails.city}</strong>, UAE
            </div>
            <div style="font-size: 13px; color: #0284c7; font-weight: 600; margin-top: 4px;">
              📞 Recipient Contact: ${customerDetails.phone}
            </div>
            ${customerDetails.notes ? `
              <div style="margin-top: 8px; padding-top: 8px; border-top: 1px dashed #cbd5e1; font-size: 12px; color: #64748b;">
                <strong>Delivery Note:</strong> "${customerDetails.notes}"
              </div>
            ` : ""}
          </div>

          <!-- Items Table -->
          <div style="margin: 24px 0 16px 0;">
            <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: #475569; margin-bottom: 10px;">
              Order Itemization
            </div>
            <table style="width: 100%; border-collapse: collapse; background: #ffffff;">
              <thead>
                <tr style="background: #f8fafc; border-top: 1px solid #e2e8f0; border-bottom: 2px solid #e2e8f0;">
                  <th style="padding: 10px; text-align: left; font-size: 11px; text-transform: uppercase; color: #64748b;">Smartphone Item</th>
                  <th style="padding: 10px; text-align: center; font-size: 11px; text-transform: uppercase; color: #64748b;">Qty</th>
                  <th style="padding: 10px; text-align: right; font-size: 11px; text-transform: uppercase; color: #64748b;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${itemsRows}
              </tbody>
            </table>
          </div>

          <!-- Invoice Calculation & Breakdown -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Subtotal</td>
                <td style="padding: 6px 0; text-align: right; font-weight: 600; color: #1e293b;">${formatAED(subtotal || totalAmount)}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Express Doorstep Delivery (UAE)</td>
                <td style="padding: 6px 0; text-align: right; font-weight: 700; color: #059669;">
                  ${deliveryFee === 0 || !deliveryFee ? "FREE (Complimentary)" : formatAED(deliveryFee)}
                </td>
              </tr>
              <tr style="border-top: 2px solid #e2e8f0;">
                <td style="padding: 12px 0 4px 0; font-size: 15px; font-weight: 800; color: #0f172a;">Total Payable on Delivery:</td>
                <td style="padding: 12px 0 4px 0; text-align: right; font-size: 19px; font-weight: 900; color: #059669;">
                  ${formatAED(totalAmount)}
                </td>
              </tr>
              <tr>
                <td colspan="2" style="padding-top: 4px; font-size: 12px; color: #64748b;">
                  Payment Mode: <strong>${paymentText}</strong>
                </td>
              </tr>
            </table>
          </div>

          <!-- 12-Month Store Warranty Guarantee Box -->
          <div style="background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%); border: 1px solid #6ee7b7; border-radius: 12px; padding: 18px; margin: 24px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="width: 42px; vertical-align: top;">
                  <span style="font-size: 32px;">🛡️</span>
                </td>
                <td style="vertical-align: top; padding-left: 10px;">
                  <div style="font-size: 14px; font-weight: 800; color: #065f46;">
                    12-Month Comprehensive Store Warranty Included
                  </div>
                  <div style="font-size: 12px; color: #047857; margin-top: 4px; line-height: 1.5;">
                    Your device has passed our rigorous <strong>32-Point Technician Audit</strong> including genuine OLED display verification, battery health testing (90%+), FaceID/fingerprint sensors, and clean IMEI certification with zero network locks.
                  </div>
                  <div style="margin-top: 8px; font-size: 11px; color: #065f46; font-weight: 700;">
                    ✓ 7-Day Replacement Guarantee &nbsp;•&nbsp; ✓ Free Doorstep Technical Support
                  </div>
                </td>
              </tr>
            </table>
          </div>

          <!-- What To Expect Next / Delivery Process -->
          <div style="border-top: 1px solid #f1f5f9; padding-top: 18px; margin-top: 20px;">
            <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; color: #475569; letter-spacing: 0.8px; margin-bottom: 12px;">
              Delivery & Inspection Flow
            </div>
            <div style="font-size: 13px; color: #475569; line-height: 1.6;">
              <p style="margin: 4px 0;">1. <strong>Verification:</strong> Our team packs your phone with its warranty card and security accessories.</p>
              <p style="margin: 4px 0;">2. <strong>Express Courier:</strong> Our dispatch driver will contact you via phone or WhatsApp prior to arrival.</p>
              <p style="margin: 4px 0;">3. <strong>Doorstep Inspection:</strong> You may inspect the package and outer condition before settling payment.</p>
              <p style="margin: 4px 0;">4. <strong>Payment:</strong> Settle the exact amount (<strong>${formatAED(totalAmount)}</strong>) with the courier via cash or card.</p>
            </div>
          </div>

          <!-- WhatsApp Direct Link -->
          <div style="text-align: center; margin: 28px 0 12px 0;">
            <a href="https://wa.me/971555549817?text=Hello%2C%20I%20have%20an%20enquiry%20regarding%20my%20order%20%23${orderNumber}" style="background-color: #25d366; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 13px; font-weight: 700; display: inline-block;">
              💬 Chat with Order Support on WhatsApp
            </a>
          </div>

        </div>

        <!-- Footer -->
        <div style="background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8;">
          <p style="margin: 0; font-weight: 600; color: #64748b;">SellPhone24 Store — Certified Smartphones Resale Platform</p>
          <p style="margin: 4px 0 0 0;">Dubai, United Arab Emirates • Phone: +971 55 554 9817</p>
          <p style="margin: 6px 0 0 0; color: #cbd5e1;">© ${new Date().getFullYear()} SellPhone24. All rights reserved.</p>
        </div>

      </div>
    </body>
    </html>
  `;
};

/**
 * 1B. Admin Notification Template for New Buy Phone Order
 */
export const getAdminBuyOrderNotificationTemplate = (order) => {
  const { customerDetails, items, totalAmount, paymentMethod, orderNumber } = order;

  const itemsList = (items || []).map((item) => `
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 10px; font-weight: 700; color: #0f172a; font-size: 13px;">
        ${item.title}
        <div style="font-size: 11px; color: #64748b; font-weight: normal;">
          ${item.selectedStorage} • ${item.selectedColor} • ${item.condition}
        </div>
      </td>
      <td style="padding: 10px; text-align: center; font-size: 13px;">${item.quantity || 1}</td>
      <td style="padding: 10px; text-align: right; font-weight: 700; color: #059669; font-size: 13px;">
        ${formatAED((item.price || 0) * (item.quantity || 1))}
      </td>
    </tr>
  `).join("");

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f1f5f9; padding: 24px; margin: 0;">
      <div style="max-width: 650px; margin: 0 auto; background: #ffffff; padding: 26px; border-radius: 12px; border-top: 5px solid #059669; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
        
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 14px; margin-bottom: 16px;">
          <div>
            <span style="background: #ecfdf5; color: #065f46; font-size: 11px; font-weight: 800; padding: 4px 8px; border-radius: 4px; text-transform: uppercase;">
              🛒 Store Buy Order
            </span>
            <h2 style="color: #0f172a; margin: 6px 0 0 0; font-size: 20px;">
              New Order Received: #${orderNumber}
            </h2>
          </div>
        </div>

        <p style="font-size: 14px; color: #334155;">
          A customer placed an order on the <strong>/buy-phones</strong> store. Please verify inventory and prepare dispatch:
        </p>

        <!-- Customer Snapshot Table -->
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0; background: #f8fafc; border-radius: 8px; overflow: hidden; font-size: 13px;">
          <tr>
            <td style="padding: 10px 14px; font-weight: bold; width: 140px; color: #64748b;">Customer Name:</td>
            <td style="padding: 10px 14px; font-weight: 700; color: #0f172a;">${customerDetails.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; font-weight: bold; color: #64748b;">Phone:</td>
            <td style="padding: 10px 14px;"><a href="tel:${customerDetails.phone}" style="color: #0284c7; font-weight: 700; text-decoration: none;">${customerDetails.phone}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; font-weight: bold; color: #64748b;">Email:</td>
            <td style="padding: 10px 14px;"><a href="mailto:${customerDetails.email}" style="color: #0284c7; text-decoration: none;">${customerDetails.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; font-weight: bold; color: #64748b;">Emirate / City:</td>
            <td style="padding: 10px 14px; font-weight: 600;">${customerDetails.city}</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; font-weight: bold; color: #64748b;">Delivery Address:</td>
            <td style="padding: 10px 14px;">${customerDetails.address}${customerDetails.building ? `, ${customerDetails.building}` : ""}${customerDetails.apartment ? `, ${customerDetails.apartment}` : ""}</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; font-weight: bold; color: #64748b;">Payment Method:</td>
            <td style="padding: 10px 14px; font-weight: 700; color: #0f172a;">${paymentMethod === "card_on_delivery" ? "Card on Delivery" : "Cash on Delivery"}</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; font-weight: bold; color: #059669;">Total Order Value:</td>
            <td style="padding: 10px 14px; font-size: 16px; font-weight: 800; color: #059669;">${formatAED(totalAmount)}</td>
          </tr>
          ${customerDetails.notes ? `
            <tr>
              <td style="padding: 10px 14px; font-weight: bold; color: #64748b;">Customer Note:</td>
              <td style="padding: 10px 14px; font-style: italic; color: #475569;">"${customerDetails.notes}"</td>
            </tr>
          ` : ""}
        </table>

        <!-- Purchased Devices -->
        <h3 style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #475569; margin: 20px 0 8px 0;">Items Ordered</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #e2e8f0; text-align: left; font-size: 11px; text-transform: uppercase; color: #475569;">
              <th style="padding: 8px 10px;">Item</th>
              <th style="padding: 8px 10px; text-align: center;">Qty</th>
              <th style="padding: 8px 10px; text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList}
          </tbody>
        </table>

        <!-- Quick Admin Action Button -->
        <div style="margin-top: 26px; text-align: center;">
          <a href="http://localhost:3000/admin/buy-phones" style="background: #0f172a; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 13px; font-weight: 700; display: inline-block;">
            Open Buy Phones Admin Dashboard →
          </a>
        </div>

      </div>
    </body>
    </html>
  `;
};

/**
 * 2A. Customer Buy Order Status Transition Email Template
 */
export const getClientBuyOrderStatusUpdateTemplate = (order) => {
  const { customerDetails, orderStatus, orderNumber, totalAmount } = order;
  const statusInfo = getBuyOrderStatusInfo(orderStatus);

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="utf-8"></head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: ${pageBg}; margin: 0; padding: 24px 12px; color: #334155;">
      <div style="max-width: 600px; margin: 0 auto; background: ${cardBg}; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
        
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 28px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800;">SellPhone24 Store</h1>
          <p style="color: #34d399; margin: 4px 0 0 0; font-size: 12px; font-weight: 700; text-transform: uppercase;">Order Status Update</p>
        </div>

        <div style="padding: 28px;">
          <p style="font-size: 15px; color: #0f172a; margin-top: 0;">
            Hi <strong>${customerDetails.name}</strong>,
          </p>
          <p style="font-size: 14px; color: #475569; line-height: 1.5;">
            The fulfillment status of your certified phone order (Order Ref: <strong>#${orderNumber}</strong>) has been updated:
          </p>

          <!-- Status Highlight Card -->
          <div style="text-align: center; margin: 24px 0; padding: 24px; background: ${statusInfo.bgColor}; border: 1px solid ${statusInfo.borderColor}; border-radius: 12px;">
            <div style="font-size: 32px; margin-bottom: 6px;">${statusInfo.icon}</div>
            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: ${statusInfo.textColor}; font-weight: 800;">Current Delivery State</div>
            <div style="display: inline-block; color: ${statusInfo.textColor}; font-weight: 900; font-size: 20px; margin-top: 4px;">
              ${statusInfo.label}
            </div>
            <p style="margin: 12px auto 0 auto; max-width: 440px; font-size: 13px; color: ${statusInfo.textColor}; line-height: 1.5;">
              ${statusInfo.message}
            </p>
          </div>

          <!-- Order Summary Details -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; margin: 20px 0; font-size: 13px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="color: #64748b; padding: 4px 0;">Order Number:</td>
                <td style="text-align: right; font-weight: 700; color: #0f172a;">#${orderNumber}</td>
              </tr>
              <tr>
                <td style="color: #64748b; padding: 4px 0;">Delivery Emirate:</td>
                <td style="text-align: right; font-weight: 600; color: #1e293b;">${customerDetails.city}</td>
              </tr>
              <tr>
                <td style="color: #64748b; padding: 4px 0;">Total Amount Due:</td>
                <td style="text-align: right; font-weight: 800; color: #059669;">${formatAED(totalAmount)}</td>
              </tr>
            </table>
          </div>

          <p style="font-size: 13px; color: #64748b; line-height: 1.5;">
            If you have any questions or need to make urgent changes to your delivery address, reach out to our team instantly via WhatsApp at <strong>+971 55 554 9817</strong>.
          </p>
        </div>

        <div style="background: #f8fafc; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8;">
          <p style="margin: 0;">© ${new Date().getFullYear()} SellPhone24 Store. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * 2B. Admin Buy Order Status Update Notification Template
 */
export const getAdminBuyOrderStatusUpdateTemplate = (order) => {
  const { customerDetails, orderStatus, orderNumber, totalAmount } = order;
  const statusInfo = getBuyOrderStatusInfo(orderStatus);

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f1f5f9; padding: 24px; margin: 0;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 24px; border-radius: 12px; border-top: 4px solid ${statusInfo.textColor};">
        <h3 style="color: #0f172a; margin-top: 0; font-size: 17px;">
          Store Order Status Updated: #${orderNumber}
        </h3>
        <p style="font-size: 14px; color: #334155;">
          The status for customer <strong>${customerDetails.name}</strong> (${customerDetails.phone}) has transitioned to:
        </p>

        <div style="padding: 10px 18px; background: ${statusInfo.bgColor}; border: 1px solid ${statusInfo.borderColor}; color: ${statusInfo.textColor}; font-weight: 800; display: inline-block; border-radius: 6px; font-size: 14px; margin: 10px 0;">
          ${statusInfo.icon} ${statusInfo.label}
        </div>

        <p style="font-size: 13px; color: #64748b; margin-top: 14px;">
          Order Value: <strong>${formatAED(totalAmount)}</strong> &nbsp;|&nbsp; City: <strong>${customerDetails.city}</strong>
        </p>

        <div style="margin-top: 20px;">
          <a href="http://localhost:3000/admin/buy-phones" style="background: #0f172a; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-size: 12px; font-weight: 700; display: inline-block;">
            View in Buy Phones Admin
          </a>
        </div>
      </div>
    </body>
    </html>
  `;
};
