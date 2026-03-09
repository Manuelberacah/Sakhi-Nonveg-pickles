import express from "express";
import { createUpdate, deleteUpdate, getUpdates } from "../controllers/updateController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.get("/", getUpdates);
router.post("/", adminAuth, createUpdate);
router.delete("/:id", adminAuth, deleteUpdate);

export default router;
