import express from "express";
import {
  checkout,
  createRazorpayOrder,
  getAdminProducts,
  getMyOrders,
  verifyRazorpayPayment
} from "../controllers/orderController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.post("/checkout", authMiddleware, checkout);
router.post("/razorpay/order", authMiddleware, createRazorpayOrder);
router.post("/razorpay/verify", authMiddleware, verifyRazorpayPayment);
router.get("/my-orders", authMiddleware, getMyOrders);
router.get("/admin/products", getAdminProducts);

export default router;
