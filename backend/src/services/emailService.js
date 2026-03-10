import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

let cachedTransporter = null;

const getTransporter = () => {
  if (cachedTransporter) return cachedTransporter;

  const host = process.env.EMAIL_HOST;
  const port = Number(process.env.EMAIL_PORT || 587);
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!host || !user || !pass) {
    throw new Error("Email config missing (EMAIL_HOST/EMAIL_USER/EMAIL_PASS)");
  }

  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure: false,
    auth: { user, pass }
  });

  return cachedTransporter;
};

export const sendOrderMail = async ({ user, order, itemsText }) => {
  const receiver = process.env.ORDER_RECEIVER_EMAIL || process.env.EMAIL_USER;

  const transporter = getTransporter();

  await transporter.sendMail({
    from: `Sakhi Non-Veg Pickles <${process.env.EMAIL_USER}>`,
    to: receiver,
    subject: `New Order #${order._id}`,
    text: [
      `Customer: ${user.name} (${user.email})`,
      `Order ID: ${order._id}`,
      `Address: ${order.address}`,
      `Pincode: ${order.pincode}`,
      `Region: ${order.region}`,
      `Delivery: Rs.${order.deliveryCharge}`,
      `Total: Rs.${order.totalAmount}`,
      "Items:",
      itemsText
    ].join("\n")
  });
};
