import nodemailer from "nodemailer";
import {
  getClientBuyOrderConfirmationTemplate,
  getAdminBuyOrderNotificationTemplate,
  getClientBuyOrderStatusUpdateTemplate,
  getAdminBuyOrderStatusUpdateTemplate,
} from "./buyOrderEmailTemplates.js";

// Helper to construct SMTP transporter dynamically
const createTransporter = () => {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT) || 587;
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
    tls: {
      rejectUnauthorized: false,
    },
  });
};

/**
 * Send email helper wrapper (catches errors silently to prevent API route failures)
 */
const sendMailAsync = async (options) => {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.log(`ℹ️ [Email Simulation] Would send to: ${options.to} | Subject: "${options.subject}"`);
      return;
    }

    const fromAddress = process.env.SMTP_FROM || `SellPhone24 Store <${process.env.SMTP_USER}>`;
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

/**
 * 1. Trigger emails when a Buy Phone Order is placed
 */
export const sendBuyOrderConfirmationEmails = async (order) => {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.ADMIN_EMAILS || "sellphone24phone@gmail.com, mesouq2@gmail.com";
  const clientEmail = order.customerDetails?.email;

  // A. Email to Customer (Invoice + 12-Month Warranty Card)
  if (clientEmail) {
    sendMailAsync({
      to: clientEmail,
      subject: `Order Confirmation #${order.orderNumber} | SellPhone24 Certified Store`,
      html: getClientBuyOrderConfirmationTemplate(order),
    });
  }

  // B. Email to Admin (New Purchase Order Alert)
  if (adminEmail) {
    sendMailAsync({
      to: adminEmail,
      subject: `🛒 New Store Order: #${order.orderNumber} - AED ${order.totalAmount?.toLocaleString()} from ${order.customerDetails?.name}`,
      html: getAdminBuyOrderNotificationTemplate(order),
    });
  }
};

/**
 * 2. Trigger emails when a Buy Phone Order Status is updated
 */
export const sendBuyOrderStatusUpdateEmails = async (order) => {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.ADMIN_EMAILS || "sellphone24phone@gmail.com, mesouq2@gmail.com";
  const clientEmail = order.customerDetails?.email;

  // A. Email to Customer (Delivery Status Change)
  if (clientEmail) {
    sendMailAsync({
      to: clientEmail,
      subject: `Order Update: #${order.orderNumber} is now ${(order.orderStatus || "").toUpperCase()} | SellPhone24 Store`,
      html: getClientBuyOrderStatusUpdateTemplate(order),
    });
  }

  // B. Email to Admin (Status Sync Notification)
  if (adminEmail) {
    sendMailAsync({
      to: adminEmail,
      subject: `🔄 Store Order #${order.orderNumber} Status Updated → ${(order.orderStatus || "").toUpperCase()}`,
      html: getAdminBuyOrderStatusUpdateTemplate(order),
    });
  }
};
