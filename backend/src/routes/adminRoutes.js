import express from "express";
import {
  adminLogin,
  createProductAdmin,
  deleteProductAdmin,
  getOrdersAdmin,
  getOverview,
  getProductsAdmin,
  getUsersAdmin,
  updateProductAdmin
} from "../controllers/adminController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/login", adminLogin);
router.get("/overview", adminAuth, getOverview);
router.get("/products", adminAuth, getProductsAdmin);
router.post("/products", adminAuth, createProductAdmin);
router.patch("/products/:id", adminAuth, updateProductAdmin);
router.delete("/products/:id", adminAuth, deleteProductAdmin);
router.get("/orders", adminAuth, getOrdersAdmin);
router.get("/users", adminAuth, getUsersAdmin);

export default router;

