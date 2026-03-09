import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT || 587),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendOrderMail = async ({ user, order, itemsText }) => {
  const receiver = process.env.ORDER_RECEIVER_EMAIL || process.env.EMAIL_USER;

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
