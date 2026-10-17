import nodemailer from "nodemailer";

const createTransporter = () => {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT) || 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    console.warn("⚠️ SMTP_USER or SMTP_PASS not configured in backend/.env. Buy order emails will be logged only.");
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
};

const sendMailAsync = async (options) => {
  try {
    const transporter = createTransporter();
    if (!transporter) return;

    const fromAddress = process.env.SMTP_FROM || `SellPhoneCash Store <${process.env.SMTP_USER}>`;
    const info = await transporter.sendMail({
      from: fromAddress,
      ...options,
    });
    console.log(`✉️ Buy Order Email dispatched to ${options.to} [MessageId: ${info.messageId}]`);
    return info;
  } catch (error) {
    console.error(`❌ Failed to send buy order email to ${options.to}:`, error.message);
  }
};

export const sendBuyOrderConfirmationEmails = async (order) => {
  const adminEmail = process.env.ADMIN_EMAIL || "sellphone24phone@gmail.com, mesouq2@gmail.com";
  const clientEmail = order.customerDetails?.email;

  const itemsHtml = (order.items || []).map(item => `
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 12px 8px; font-size: 13px; color: #1e293b; font-weight: bold;">
        ${item.title}
        <div style="font-size: 11px; color: #64748b; font-weight: normal; margin-top: 2px;">
          Storage: ${item.selectedStorage || "Standard"} • Color: ${item.selectedColor || "Standard"} • Condition: ${item.condition}
        </div>
      </td>
      <td style="padding: 12px 8px; font-size: 13px; color: #1e293b; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px 8px; font-size: 13px; color: #059669; font-weight: bold; text-align: right;">AED ${item.price.toLocaleString()}</td>
    </tr>
  `).join("");

  // 1. Email to Customer
  if (clientEmail) {
    const customerHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
        <div style="background: #0f172a; padding: 24px; text-align: center;">
          <h1 style="color: #ffffff; font-size: 20px; margin: 0; font-weight: 800; letter-spacing: -0.5px;">SellPhoneCash Store</h1>
          <p style="color: #10b981; font-size: 12px; margin: 4px 0 0 0; font-weight: 600; text-transform: uppercase;">Order Confirmed • #${order.orderNumber}</p>
        </div>
        <div style="padding: 24px;">
          <h2 style="font-size: 16px; color: #0f172a; margin-top: 0;">Thank you for your order, ${order.customerDetails?.name}! 👋</h2>
          <p style="font-size: 13px; color: #475569; line-height: 1.5;">
            We have received your order for certified pre-owned smartphone(s). Our logistics team is preparing your package for express doorstep delivery in <strong>${order.customerDetails?.city || "UAE"}</strong>.
          </p>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin: 20px 0;">
            <h3 style="font-size: 12px; color: #64748b; text-transform: uppercase; margin: 0 0 10px 0; font-weight: 700;">Delivery Address</h3>
            <p style="font-size: 13px; color: #1e293b; margin: 0; font-weight: 600;">${order.customerDetails?.name}</p>
            <p style="font-size: 12px; color: #475569; margin: 4px 0 0 0;">
              ${order.customerDetails?.address}${order.customerDetails?.building ? `, ${order.customerDetails.building}` : ""}${order.customerDetails?.apartment ? `, Flat ${order.customerDetails.apartment}` : ""}, ${order.customerDetails?.city}
            </p>
            <p style="font-size: 12px; color: #475569; margin: 4px 0 0 0;">Phone: <strong>${order.customerDetails?.phone}</strong></p>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background: #f1f5f9; text-align: left; font-size: 11px; text-transform: uppercase; color: #64748b;">
                <th style="padding: 8px;">Device Details</th>
                <th style="padding: 8px; text-align: center;">Qty</th>
                <th style="padding: 8px; text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding: 12px 8px; font-size: 13px; color: #64748b; text-align: right;">Delivery:</td>
                <td style="padding: 12px 8px; font-size: 13px; color: #059669; font-weight: bold; text-align: right;">FREE</td>
              </tr>
              <tr style="border-top: 2px solid #e2e8f0;">
                <td colspan="2" style="padding: 12px 8px; font-size: 14px; font-weight: 800; color: #0f172a; text-align: right;">Total Amount Due:</td>
                <td style="padding: 12px 8px; font-size: 16px; font-weight: 900; color: #059669; text-align: right;">AED ${order.totalAmount.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>

          <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 14px; margin: 20px 0; font-size: 12px; color: #065f46;">
            <strong>🛡️ Comprehensive 12-Month Store Warranty Included</strong><br>
            Every phone has passed our 32-point inspection with verified genuine screen, clean IMEI, and 95%+ battery health. Payment will be collected via <strong>${order.paymentMethod === "cod" ? "Cash on Delivery" : "Card on Delivery"}</strong> upon receipt.
          </div>

          <div style="text-align: center; margin-top: 24px; font-size: 12px; color: #94a3b8;">
            Need help with your order? Contact us on WhatsApp: <strong>+971 55 554 9817</strong>
          </div>
        </div>
      </div>
    `;

    sendMailAsync({
      to: clientEmail,
      subject: `Order Confirmation - #${order.orderNumber} | SellPhoneCash Store`,
      html: customerHtml,
    });
  }

  // 2. Email to Admin
  if (adminEmail) {
    const adminHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px;">
        <h2 style="color: #059669; margin-top: 0; font-size: 18px;">🛒 New Phone Purchase Order: #${order.orderNumber}</h2>
        <p style="font-size: 14px; color: #1e293b;">A customer has placed an order on the <strong>/buy-phones</strong> store:</p>
        
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; margin: 16px 0; font-size: 13px;">
          <p style="margin: 4px 0;"><strong>Customer:</strong> ${order.customerDetails?.name}</p>
          <p style="margin: 4px 0;"><strong>Phone:</strong> ${order.customerDetails?.phone}</p>
          <p style="margin: 4px 0;"><strong>Email:</strong> ${order.customerDetails?.email}</p>
          <p style="margin: 4px 0;"><strong>Emirate / City:</strong> ${order.customerDetails?.city}</p>
          <p style="margin: 4px 0;"><strong>Full Address:</strong> ${order.customerDetails?.address}, ${order.customerDetails?.building} ${order.customerDetails?.apartment}</p>
          <p style="margin: 4px 0;"><strong>Total Value:</strong> <span style="font-size: 16px; font-weight: 800; color: #059669;">AED ${order.totalAmount.toLocaleString()}</span></p>
          <p style="margin: 4px 0;"><strong>Payment Method:</strong> ${order.paymentMethod === "cod" ? "Cash on Delivery" : "Card on Delivery"}</p>
          ${order.customerDetails?.notes ? `<p style="margin: 4px 0;"><strong>Notes:</strong> ${order.customerDetails.notes}</p>` : ""}
        </div>

        <h3 style="font-size: 13px; color: #475569; text-transform: uppercase;">Items Ordered:</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          ${itemsHtml}
        </table>

        <div style="margin-top: 20px; text-align: center;">
          <a href="http://localhost:3000/admin/buy-phones" style="background: #0f172a; color: #ffffff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: bold; display: inline-block;">
            Manage in Buy Phones Admin
          </a>
        </div>
      </div>
    `;

    sendMailAsync({
      to: adminEmail,
      subject: `🚨 [Buy Order] #${order.orderNumber} - AED ${order.totalAmount.toLocaleString()} from ${order.customerDetails?.name}`,
      html: adminHtml,
    });
  }
};
