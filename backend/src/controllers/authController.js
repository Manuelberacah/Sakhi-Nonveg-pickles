import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateToken } from "../utils/token.js";

const isEmail = (value = "") => /\S+@\S+\.\S+/.test(value);
const normalizeEmail = (value = "") => value.trim().toLowerCase();
const normalizePhone = (value = "") => value.replace(/\D/g, "");

const buildUniqueUsername = async (seed) => {
  const base = (seed || "sakhiuser")
    .split("@")[0]
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, 20) || "sakhiuser";

  let candidate = base;
  let attempt = 0;

  while (attempt < 50) {
    const exists = await User.findOne({ username: candidate });
    if (!exists) return candidate;
    attempt += 1;
    candidate = `${base}${attempt}`;
  }

  return `${base}${Date.now().toString().slice(-5)}`;
};

export const signup = async (req, res) => {
  try {
    const { name, email, phone, identifier, password } = req.body;
    const rawIdentifier = (identifier || email || phone || "").trim();
    const normalizedEmail = isEmail(rawIdentifier) ? normalizeEmail(rawIdentifier) : "";
    const normalizedPhone = !normalizedEmail ? normalizePhone(rawIdentifier) : normalizePhone(phone || "");

    if (!name || !rawIdentifier || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (normalizedEmail) {
      const existingEmail = await User.findOne({ email: normalizedEmail });
      if (existingEmail) {
        return res.status(409).json({ message: "Email already registered" });
      }
    }

    if (normalizedPhone) {
      if (normalizedPhone.length < 10) {
        return res.status(400).json({ message: "Enter a valid phone number" });
      }
      const existingPhone = await User.findOne({ phone: normalizedPhone });
      if (existingPhone) {
        return res.status(409).json({ message: "Phone number already registered" });
      }
    }

    if (!normalizedEmail && !normalizedPhone) {
      return res.status(400).json({ message: "Enter a valid email or phone number" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const usernameSeed = normalizedEmail || normalizedPhone || "sakhiuser";
    const username = await buildUniqueUsername(usernameSeed);
    const user = await User.create({
      name,
      username,
      email: normalizedEmail || undefined,
      phone: normalizedPhone || undefined,
      password: hashedPassword
    });

    return res.status(201).json({
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone }
    });
  } catch (error) {
    return res.status(500).json({ message: "Signup failed", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, phone, identifier, password } = req.body;
    const rawIdentifier = (identifier || email || phone || "").trim();
    const normalizedEmail = isEmail(rawIdentifier) ? normalizeEmail(rawIdentifier) : "";
    const normalizedPhone = !normalizedEmail ? normalizePhone(rawIdentifier) : normalizePhone(phone || "");

    if (!rawIdentifier || !password) {
      return res.status(400).json({ message: "Email/phone and password are required" });
    }

    if (!normalizedEmail && !normalizedPhone) {
      return res.status(400).json({ message: "Enter a valid email or phone number" });
    }

    const query = normalizedEmail ? { email: normalizedEmail } : { phone: normalizedPhone };
    const user = await User.findOne(query);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.json({
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone }
    });
  } catch (error) {
    return res.status(500).json({ message: "Login failed", error: error.message });
  }
};

export const me = async (req, res) => {
  return res.json({ user: req.user });
};
