import jwt from "jsonwebtoken";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

const ADMIN_EMAIL = "sakhipickles.nonveg@gmail.com";
const ADMIN_PASSWORD = "Chamundeswari@22";

const createAdminToken = () =>
  jwt.sign({ role: "admin", email: ADMIN_EMAIL }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });

const generateSlug = (name = "") =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const adminLogin = (req, res) => {
  const { email, password } = req.body;

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: "Invalid admin credentials" });
  }

  return res.json({
    token: createAdminToken(),
    admin: { email: ADMIN_EMAIL, role: "admin" }
  });
};

export const getOverview = async (_req, res) => {
  try {
    const [users, orders, products] = await Promise.all([
      User.countDocuments(),
      Order.countDocuments({ status: "paid" }),
      Product.countDocuments()
    ]);

    return res.json({ users, orders, products });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch overview", error: error.message });
  }
};

export const getProductsAdmin = async (_req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch products", error: error.message });
  }
};

export const createProductAdmin = async (req, res) => {
  try {
    const { name, nameTe, image, description, descriptionTe, prices } = req.body;

    if (!name || !image || !description || !prices) {
      return res
        .status(400)
        .json({ message: "name, image, description and prices are required" });
    }

    const slug = generateSlug(name);
    const exists = await Product.findOne({ slug });
    if (exists) {
      return res.status(409).json({ message: "Product already exists" });
    }

    const product = await Product.create({
      name,
      nameTe,
      slug,
      image,
      description,
      descriptionTe,
      prices
    });

    return res.status(201).json(product);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create product", error: error.message });
  }
};

export const updateProductAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, nameTe, image, description, descriptionTe, prices } = req.body;
    const existing = await Product.findById(id);

    if (!existing) {
      return res.status(404).json({ message: "Product not found" });
    }

    const nextName = name || existing.name;
    const nextSlug = generateSlug(nextName);
    const clash = await Product.findOne({ slug: nextSlug, _id: { $ne: id } });
    if (clash) {
      return res.status(409).json({ message: "Another product already uses this name" });
    }

    existing.name = nextName;
    existing.slug = nextSlug;
    existing.image = image || existing.image;
    existing.description = description || existing.description;
    if (typeof nameTe === "string") {
      existing.nameTe = nameTe;
    }
    if (typeof descriptionTe === "string") {
      existing.descriptionTe = descriptionTe;
    }
    existing.prices = prices || existing.prices;

    await existing.save();
    return res.json(existing);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update product", error: error.message });
  }
};

export const deleteProductAdmin = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.json({ message: "Product deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete product", error: error.message });
  }
};

export const getOrdersAdmin = async (_req, res) => {
  try {
    const orders = await Order.find({ status: "paid" }).sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
};

export const getUsersAdmin = async (_req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
};
