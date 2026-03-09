import express from "express";
import {
  addToCart,
  clearCart,
  getUserCollections,
  removeCartItem,
  toggleWishlist,
  updateCartItem
} from "../controllers/userController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.get("/collections", authMiddleware, getUserCollections);
router.post("/wishlist/toggle", authMiddleware, toggleWishlist);
router.post("/cart/add", authMiddleware, addToCart);
router.patch("/cart/update", authMiddleware, updateCartItem);
router.delete("/cart/remove", authMiddleware, removeCartItem);
router.delete("/cart/clear", authMiddleware, clearCart);

export default router;
