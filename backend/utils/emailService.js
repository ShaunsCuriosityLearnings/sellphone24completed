import nodemailer from "nodemailer";
import {
  getClientOrderEmailTemplate,
  getAdminOrderEmailTemplate,
  getClientStatusEmailTemplate,
  getAdminStatusEmailTemplate,
  getClientCustomRequestEmailTemplate,
  getAdminCustomRequestEmailTemplate,
} from "./emailTemplates.js";

// Helper to construct SMTP transporter dynamically
const createTransporter = () => {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT) || 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    console.warn("⚠️ SMTP_USER or SMTP_PASS environment variables are not configured in backend/.env. Emails will not be sent until configured.");
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user,
      pass,
    },
  });
};

/**
 * Send email helper wrapper (catches errors silently to prevent API route failures)
 */
const sendMailAsync = async (options) => {
  try {
    const transporter = createTransporter();
    if (!transporter) return;

    const fromAddress = process.env.SMTP_FROM || `SellPhoneCash <${process.env.SMTP_USER}>`;
    const info = await transporter.sendMail({
      from: fromAddress,
      ...options,
    });
    console.log(`✉️ Email successfully dispatched to ${options.to} [MessageId: ${info.messageId}]`);
    return info;
  } catch (error) {
    console.error(`❌ Failed to send email to ${options.to}:`, error.message);
  }
};

/**
 * 1. Trigger emails when an Order is placed
 */
export const sendOrderConfirmationEmails = async (order) => {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
  const clientEmail = order.customerDetails?.email;

  // A. Email to Client
  if (clientEmail) {
    sendMailAsync({
      to: clientEmail,
      subject: `Order Confirmation - #${order._id} | SellPhoneCash`,
      html: getClientOrderEmailTemplate(order),
    });
  }

  // B. Email to Admin
  if (adminEmail) {
    sendMailAsync({
      to: adminEmail,
      subject: `🚨 New Order Alert: #${order._id} from ${order.customerDetails?.name}`,
      html: getAdminOrderEmailTemplate(order),
    });
  }
};

/**
 * 2. Trigger emails when an Order Status is updated
 */
export const sendStatusUpdateEmails = async (order) => {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
  const clientEmail = order.customerDetails?.email;

  // A. Email to Client
  if (clientEmail) {
    sendMailAsync({
      to: clientEmail,
      subject: `Order Status Update: #${order._id} | SellPhoneCash`,
      html: getClientStatusEmailTemplate(order),
    });
  }

  // B. Email to Admin
  if (adminEmail) {
    sendMailAsync({
      to: adminEmail,
      subject: `Order Status Updated: #${order._id} → ${order.status.toUpperCase()}`,
      html: getAdminStatusEmailTemplate(order),
    });
  }
};

/**
 * 3. Trigger emails when a Custom Device Valuation Request is submitted
 */
export const sendCustomRequestEmails = async (data) => {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
  const clientEmail = data.email;

  // A. Email to Client
  if (clientEmail) {
    sendMailAsync({
      to: clientEmail,
      subject: `Custom Device Request Received - SellPhoneCash`,
      html: getClientCustomRequestEmailTemplate(data),
    });
  }

  // B. Email to Admin
  if (adminEmail) {
    sendMailAsync({
      to: adminEmail,
      subject: `📝 Custom Request: ${data.deviceBrand} ${data.deviceModel} from ${data.name}`,
      html: getAdminCustomRequestEmailTemplate(data),
    });
  }
};
