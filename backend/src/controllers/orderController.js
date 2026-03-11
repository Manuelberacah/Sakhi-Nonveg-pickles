import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { sendOrderMail } from "../services/emailService.js";
import { getDeliveryCharge } from "../utils/delivery.js";
import Razorpay from "razorpay";
import crypto from "crypto";

const assertRazorpayConfig = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay config missing (RAZORPAY_KEY_ID/RAZORPAY_KEY_SECRET)");
  }
};

const getRazorpayClient = () => {
  assertRazorpayConfig();
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
};

export const checkout = async (req, res) => {
  try {
    const { address, pincode, region } = req.body;

    if (!address || !pincode || !region) {
      return res.status(400).json({ message: "Address, pincode and region are required" });
    }

    const user = await User.findById(req.user._id).populate("cart.product");

    if (!user.cart.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const items = user.cart.map((item) => {
      const price = item.product.prices[item.size];
      return {
        productId: item.product._id,
        name: item.product.name,
        size: item.size,
        price,
        quantity: item.quantity,
        subtotal: price * item.quantity
      };
    });

    const productsAmount = items.reduce((sum, item) => sum + item.subtotal, 0);
    const deliveryCharge = getDeliveryCharge(region);
    const totalAmount = productsAmount + deliveryCharge;

    const order = await Order.create({
      user: req.user._id,
      items,
      address,
      pincode,
      region,
      deliveryCharge,
      totalAmount
    });

    const itemsText = items
      .map(
        (item) =>
          `- ${item.name} (${item.size}) x ${item.quantity} = Rs.${item.subtotal}`
      )
      .join("\n");

    await sendOrderMail({ user, order, itemsText });

    user.cart = [];
    await user.save();

    return res.status(201).json({ order });
  } catch (error) {
    console.error("Checkout failed:", error?.message || error);
    if (error?.stack) console.error(error.stack);
    return res.status(500).json({ message: "Checkout failed", error: error.message });
  }
};

export const createRazorpayOrder = async (req, res) => {
  try {
    assertRazorpayConfig();
    const { address, pincode, region } = req.body;

    if (!address || !pincode || !region) {
      return res.status(400).json({ message: "Address, pincode and region are required" });
    }

    const user = await User.findById(req.user._id).populate("cart.product");
    if (!user.cart.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const items = user.cart.map((item) => {
      const price = item.product.prices[item.size];
      return {
        productId: item.product._id,
        name: item.product.name,
        size: item.size,
        price,
        quantity: item.quantity,
        subtotal: price * item.quantity
      };
    });

    const productsAmount = items.reduce((sum, item) => sum + item.subtotal, 0);
    const deliveryCharge = getDeliveryCharge(region);
    const totalAmount = productsAmount + deliveryCharge;

    const razorpay = getRazorpayClient();
    const order = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100),
      currency: "INR",
      receipt: `order_${Date.now()}`,
      notes: {
        userId: req.user._id.toString(),
        address,
        pincode,
        region
      }
    });

    return res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error("Create Razorpay order failed:", error?.message || error);
    if (error?.stack) console.error(error.stack);
    return res.status(500).json({ message: "Failed to create Razorpay order", error: error.message });
  }
};

export const verifyRazorpayPayment = async (req, res) => {
  try {
    assertRazorpayConfig();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, address, pincode, region } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Payment verification data is required" });
    }
    if (!address || !pincode || !region) {
      return res.status(400).json({ message: "Address, pincode and region are required" });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    const user = await User.findById(req.user._id).populate("cart.product");
    if (!user.cart.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const items = user.cart.map((item) => {
      const price = item.product.prices[item.size];
      return {
        productId: item.product._id,
        name: item.product.name,
        size: item.size,
        price,
        quantity: item.quantity,
        subtotal: price * item.quantity
      };
    });

    const productsAmount = items.reduce((sum, item) => sum + item.subtotal, 0);
    const deliveryCharge = getDeliveryCharge(region);
    const totalAmount = productsAmount + deliveryCharge;

    const order = await Order.create({
      user: req.user._id,
      items,
      address,
      pincode,
      region,
      deliveryCharge,
      totalAmount,
      status: "paid",
      paymentProvider: "razorpay",
      paymentOrderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      paymentSignature: razorpay_signature
    });

    const itemsText = items
      .map((item) => `- ${item.name} (${item.size}) x ${item.quantity} = Rs.${item.subtotal}`)
      .join("\n");

    await sendOrderMail({ user, order, itemsText });

    user.cart = [];
    await user.save();

    return res.status(201).json({ order });
  } catch (error) {
    console.error("Verify Razorpay payment failed:", error?.message || error);
    if (error?.stack) console.error(error.stack);
    return res.status(500).json({ message: "Payment verification failed", error: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
};

export const getAdminProducts = async (_req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: 1 });
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch admin products", error: error.message });
  }
};
