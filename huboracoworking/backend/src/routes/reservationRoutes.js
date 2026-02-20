// src/routes/reservationRoutes.js
import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  createReservation,
  getReservationsByDate,
  getReservationsByUserEmail
} from "../controllers/reservationController.js";

const router = Router();

// POST /api/reservations
router.post("/", authMiddleware, createReservation);

// GET /api/reservations/by-date/:date
router.get("/by-date/:date", authMiddleware, getReservationsByDate);

// GET /api/reservations/user/:email
router.get("/user/:email", authMiddleware, getReservationsByUserEmail);

export default router;