import { Router } from "express";
import { authRequired } from "../middlewares/auth.js";
import { adminRequired } from "../middlewares/adminRequired.js";

import {
  createReservation,
  getMyReservations,
  getReservationsByDate,
  cancelReservation,
  getAllReservations,
  confirmReservationPayment,
  adminCancelReservation,
} from "../controllers/reservationController.js";

const router = Router();

// Usuario
router.get("/reservations/mine", authRequired, getMyReservations);
router.post("/reservations", authRequired, createReservation);
router.get("/reservations/by-date/:fecha", getReservationsByDate);
router.patch("/reservations/:id/cancel", authRequired, cancelReservation);

// Admin
router.get("/admin/reservations", authRequired, adminRequired, getAllReservations);
router.patch("/admin/reservations/:id/confirm", authRequired, adminRequired, confirmReservationPayment);
router.patch("/admin/reservations/:id/cancel", authRequired, adminRequired, adminCancelReservation);

export default router;