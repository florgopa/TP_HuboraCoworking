// src/controllers/reservationController.js
import db from "../config/db.js";

// POST /api/reservations
export const createReservation = async (req, res) => {
  try {
    const {
      id,
      usuarioEmail,
      fecha,
      espacioId,
      espacioNombre,
      horaInicio,
      horaFin
    } = req.body;

    // si querés, acá podrías usar req.user.email en lugar de usuarioEmail del body
    const email = usuarioEmail || req.user?.email;

    await db.query(
      `INSERT INTO reserva
         (id, usuario_email, fecha, espacio_id, espacio_nombre,
          hora_inicio, hora_fin, estado)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pendiente')`,
      [id, email, fecha, espacioId, espacioNombre, horaInicio, horaFin]
    );

    return res.json({ ok: true, message: "Reserva creada" });
  } catch (error) {
    console.error("ERROR createReservation:", error);
    return res
      .status(500)
      .json({ ok: false, message: "Error al crear la reserva" });
  }
};

// GET /api/reservations/by-date/:date
export const getReservationsByDate = async (req, res) => {
  try {
    const { date } = req.params;

    const [rows] = await db.query(
      `SELECT
         id,
         usuario_email,
         fecha,
         espacio_id,
         espacio_nombre,
         hora_inicio,
         hora_fin,
         estado
       FROM reserva
       WHERE fecha = ?
       ORDER BY espacio_id, hora_inicio`,
      [date]
    );

    // el front de NewReservation espera un array plano
    return res.json(rows);
  } catch (error) {
    console.error("ERROR getReservationsByDate:", error);
    return res
      .status(500)
      .json({ ok: false, message: "Error al obtener reservas por fecha" });
  }
};

// GET /api/reservations/user/:email
export const getReservationsByUserEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const [rows] = await db.query(
      `SELECT
         id,
         usuario_email,
         fecha,
         espacio_id,
         espacio_nombre,
         hora_inicio,
         hora_fin,
         estado
       FROM reserva
       WHERE usuario_email = ?
       ORDER BY fecha DESC, hora_inicio`,
      [email]
    );

    return res.json({ ok: true, reservations: rows });
  } catch (error) {
    console.error("ERROR getReservationsByUserEmail:", error);
    return res
      .status(500)
      .json({ ok: false, message: "Error al obtener reservas del usuario" });
  }
};