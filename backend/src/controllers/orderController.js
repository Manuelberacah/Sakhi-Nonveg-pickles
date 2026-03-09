import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { sendOrderMail } from "../services/emailService.js";
import { getDeliveryCharge } from "../utils/delivery.js";

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
    return res.status(500).json({ message: "Checkout failed", error: error.message });
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
