import express from "express";
import { checkout, getAdminProducts, getMyOrders } from "../controllers/orderController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.post("/checkout", authMiddleware, checkout);
router.get("/my-orders", authMiddleware, getMyOrders);
router.get("/admin/products", getAdminProducts);

export default router;
