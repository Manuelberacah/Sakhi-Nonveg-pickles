import Product from "../models/Product.js";
import User from "../models/User.js";

export const getUserCollections = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("wishlist")
      .populate("cart.product");

    return res.json({ wishlist: user.wishlist, cart: user.cart });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch collections", error: error.message });
  }
};

export const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);
    const exists = user.wishlist.some((id) => id.toString() === productId);

    if (exists) {
      user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
    } else {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      user.wishlist.push(productId);
    }

    await user.save();
    const populated = await User.findById(req.user._id).populate("wishlist");
    return res.json({ wishlist: populated.wishlist });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update wishlist", error: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, size, quantity = 1 } = req.body;
    const user = await User.findById(req.user._id);

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const existing = user.cart.find(
      (item) => item.product.toString() === productId && item.size === size
    );

    if (existing) {
      existing.quantity += quantity;
    } else {
      user.cart.push({ product: productId, size, quantity });
    }

    await user.save();
    const populated = await User.findById(req.user._id).populate("cart.product");
    return res.json({ cart: populated.cart });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update cart", error: error.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { productId, size, quantity } = req.body;
    const user = await User.findById(req.user._id);

    user.cart = user.cart
      .map((item) => {
        if (item.product.toString() === productId && item.size === size) {
          return { ...item.toObject(), quantity };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);

    await user.save();
    const populated = await User.findById(req.user._id).populate("cart.product");
    return res.json({ cart: populated.cart });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update cart", error: error.message });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const { productId, size } = req.body;
    const user = await User.findById(req.user._id);

    user.cart = user.cart.filter(
      (item) => !(item.product.toString() === productId && item.size === size)
    );

    await user.save();
    const populated = await User.findById(req.user._id).populate("cart.product");
    return res.json({ cart: populated.cart });
  } catch (error) {
    return res.status(500).json({ message: "Failed to remove cart item", error: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = [];
    await user.save();
    return res.json({ cart: [] });
  } catch (error) {
    return res.status(500).json({ message: "Failed to clear cart", error: error.message });
  }
};
