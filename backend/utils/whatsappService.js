/**
 * Formats a clean WhatsApp order alert string
 */
export const formatWhatsAppOrderMessage = (order) => {
  const orderId = order._id ? String(order._id).slice(-8).toUpperCase() : "NEW";
  const name = order.customerDetails?.name || "Customer";
  const phone = order.customerDetails?.phone || "N/A";
  const email = order.customerDetails?.email || "N/A";
  const address = `${order.customerDetails?.address || ""}, ${order.customerDetails?.city || ""}, UAE`;
  const date = order.pickupSchedule?.pickupDate || "Asap";
  const time = order.pickupSchedule?.pickupTime || "Standard Slot";
  const payout = order.totalPayout ? Number(order.totalPayout).toLocaleString() : "0";

  let deviceText = "";
  if (Array.isArray(order.devices) && order.devices.length > 0) {
    deviceText = order.devices
      .map(
        (d) =>
          `• *${d.name}* (${d.selectedStorage || ""}, ${d.selectedColor || ""}, Condition: ${d.selectedCondition || ""}) - AED ${d.calculatedPrice}`
      )
      .join("\n");
  } else {
    deviceText = "• Device Valuation Request";
  }

  return (
    `🚨 *NEW ORDER ALERT - SellPhoneCash*\n\n` +
    `🆔 *Order ID:* #${orderId}\n` +
    `👤 *Customer Name:* ${name}\n` +
    `📞 *Phone:* ${phone}\n` +
    `📧 *Email:* ${email}\n\n` +
    `📍 *Pickup Address:* ${address}\n` +
    `📅 *Pickup Date:* ${date}\n` +
    `⏰ *Time Slot:* ${time}\n\n` +
    `📱 *Devices:* \n${deviceText}\n\n` +
    `💰 *Estimated Evaluation:* *AED ${payout}*\n` +
    `💵 *Payment Method:* Cash on Doorstep Collection\n\n` +
    `⚡ _SellPhoneCash Automated Order System_`
  );
};

/**
 * Send WhatsApp order notification to +971555549817
 */
export const sendOrderWhatsAppNotification = async (order) => {
  const targetWhatsAppNumber = process.env.WHATSAPP_NOTIFY_NUMBER || "971555549817";
  const message = formatWhatsAppOrderMessage(order);

  console.log(`📱 [WhatsApp Service] Order #${order._id || 'NEW'} notification prepared for +${targetWhatsAppNumber}`);

  // Optional: If WhatsApp Gateway API URL is defined in .env (e.g. UltraMsg, Meta API, GreenAPI, Twilio), dispatch payload
  const gatewayUrl = process.env.WHATSAPP_GATEWAY_URL;
  if (gatewayUrl) {
    try {
      const response = await fetch(gatewayUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: targetWhatsAppNumber,
          body: message,
          message: message,
          token: process.env.WHATSAPP_GATEWAY_TOKEN,
        }),
      });
      console.log(`✅ [WhatsApp Service] Gateway response status: ${response.status}`);
    } catch (err) {
      console.error(`❌ [WhatsApp Service] Gateway dispatch error:`, err.message);
    }
  }
};
