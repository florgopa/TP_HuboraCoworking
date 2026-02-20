// backend/src/routes/profileRoutes.js
import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/profileController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

// GET /api/profile  (protegido)
router.get("/profile", authMiddleware, getProfile);

// PUT /api/profile  (protegido)
router.put("/profile", authMiddleware, updateProfile);

export default router;