// src/routes/adminRoutes.js
import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  getAllUsers,
  updateUserPlanAndLocker,
  deleteUserLogical
} from "../controllers/adminController.js";

const router = Router();

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      ok: false,
      message: "Acceso sólo para administradores"
    });
  }
  next();
};

// lista
router.get("/admin/users", authMiddleware, requireAdmin, getAllUsers);

// update
router.put("/admin/users/:id", authMiddleware, requireAdmin, updateUserPlanAndLocker);

// borrado lógico
router.delete("/admin/users/:id", authMiddleware, requireAdmin, deleteUserLogical);

export default router;