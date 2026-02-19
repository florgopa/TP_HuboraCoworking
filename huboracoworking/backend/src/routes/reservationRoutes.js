import express from "express";
import {
  createReservation,
  getReservationsByDate,
  getReservationsByEmail
} from "../controllers/reservationController.js";

const router = express.Router();

// Crear reserva
router.post("/", createReservation);
// Buscar reservas por fecha
router.get("/by-date/:fecha", getReservationsByDate);
// Buscar reservas por email 
router.get("/user/:email", getReservationsByEmail);


export default router;
