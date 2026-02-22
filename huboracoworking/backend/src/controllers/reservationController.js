import { pool } from "../config/db.js";
import crypto from "crypto";

const BLOCKS = [
  { start: "07:00", end: "13:00" },
  { start: "13:00", end: "19:00" },
  { start: "14:00", end: "20:00" },
  { start: "07:00", end: "20:00" },
];

const isWeekend = (yyyyMmDd) => {
  const [y, m, d] = yyyyMmDd.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  const day = dt.getDay();
  return day === 0 || day === 6;
};

const normalizeHHMM = (t) => (t ? String(t).slice(0, 5) : "");
const toTime = (hhmm) => (hhmm?.length === 5 ? `${hhmm}:00` : hhmm);

const isValidBlock = (start, end) =>
  BLOCKS.some((b) => b.start === start && b.end === end);

// ✅ MIS RESERVAS (token)
export const getMyReservations = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ ok: false, message: "Unauthorized" });

    const [rows] = await pool.query(
      `SELECT id, fecha, espacio_id, espacio_nombre, hora_inicio, hora_fin, estado, created_at
       FROM reserva
       WHERE usuario_id = ?
       ORDER BY fecha DESC, hora_inicio DESC`,
      [userId]
    );

    return res.json(rows);
  } catch (error) {
    console.error("GET MY RESERVATIONS ERROR:", error);
    return res.status(500).json({ ok: false, message: error.message });
  }
};

// CREAR RESERVA (token) + lógica Premium
export const createReservation = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ ok: false, message: "Unauthorized" });

    const { fecha, espacioId, espacioNombre, horaInicio, horaFin } = req.body;

    if (!fecha || !espacioId || !espacioNombre || !horaInicio || !horaFin) {
      return res.status(400).json({ ok: false, message: "Faltan datos de la reserva" });
    }

    if (isWeekend(fecha)) {
      return res.status(400).json({ ok: false, message: "No se pueden reservar sábados ni domingos" });
    }

    const start = normalizeHHMM(horaInicio);
    const end = normalizeHHMM(horaFin);

    if (!isValidBlock(start, end)) {
      return res.status(400).json({ ok: false, message: "Bloque horario inválido" });
    }

    // Traer email + plan del usuario
    const [urows] = await pool.query(
      "SELECT email, plan_contratado FROM usuario WHERE id = ? AND activo = 1",
      [userId]
    );

    if (urows.length === 0) {
      return res.status(403).json({ ok: false, message: "Usuario inválido o inactivo" });
    }

    const usuarioEmail = urows[0].email;
    const plan = (urows[0].plan_contratado || "basico").toLowerCase();
    const estadoInicial = plan === "premium" ? "confirmada" : "pendiente_pago";

    // Validar solape
    const [conflicts] = await pool.query(
      `SELECT id FROM reserva
       WHERE fecha = ?
         AND espacio_id = ?
         AND estado <> 'cancelada'
         AND NOT (hora_fin <= ? OR hora_inicio >= ?)
       LIMIT 1`,
      [fecha, espacioId, toTime(start), toTime(end)]
    );

    if (conflicts.length > 0) {
      return res.status(409).json({ ok: false, message: "Ese bloque ya está reservado" });
    }

    const id = crypto.randomUUID();

    // Insert con estado dinámico según plan
    await pool.query(
      `INSERT INTO reserva
        (id, usuario_id, usuario_email, fecha, espacio_id, espacio_nombre, hora_inicio, hora_fin, estado)
       VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        userId,
        usuarioEmail,
        fecha,
        espacioId,
        espacioNombre,
        toTime(start),
        toTime(end),
        estadoInicial,
      ]
    );

    // Devolvemos estado para que el front muestre todo ok
    return res.status(201).json({ ok: true, id, estado: estadoInicial, plan });
  } catch (error) {
    console.error("CREATE RESERVATION ERROR:", error);
    return res.status(500).json({ ok: false, message: error.message });
  }
};

// RESERVAS POR FECHA (público)
export const getReservationsByDate = async (req, res) => {
  try {
    const { fecha } = req.params;

    if (isWeekend(fecha)) return res.json([]);

    const [rows] = await pool.query(
      `SELECT *
       FROM reserva
       WHERE fecha = ?
         AND estado <> 'cancelada'`,
      [fecha]
    );

    return res.json(rows);
  } catch (error) {
    console.error("GET BY DATE ERROR:", error);
    return res.status(500).json({ ok: false, message: error.message });
  }
};

// CANCELAR (solo dueño)
export const cancelReservation = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ ok: false, message: "Unauthorized" });

    const { id } = req.params;
    if (!id) return res.status(400).json({ ok: false, message: "Falta id de reserva" });

    const [rows] = await pool.query(
      `SELECT id, estado
       FROM reserva
       WHERE id = ? AND usuario_id = ?
       LIMIT 1`,
      [id, userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ ok: false, message: "Reserva no encontrada" });
    }

    if (rows[0].estado === "cancelada") {
      return res.json({ ok: true, message: "La reserva ya estaba cancelada" });
    }

    await pool.query(
      `UPDATE reserva
       SET estado = 'cancelada'
       WHERE id = ? AND usuario_id = ?`,
      [id, userId]
    );

    return res.json({ ok: true, message: "Reserva cancelada" });
  } catch (error) {
    console.error("CANCEL RESERVATION ERROR:", error);
    return res.status(500).json({ ok: false, message: error.message });
  }
};

/* =========================
   ========== ADMIN =========
   ========================= */

// ADMIN: ver todas las reservas
export const getAllReservations = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, usuario_email, usuario_id, fecha, espacio_id, espacio_nombre,
              hora_inicio, hora_fin, estado, created_at
       FROM reserva
       ORDER BY created_at DESC`
    );

    return res.json({ ok: true, reservations: rows });
  } catch (error) {
    console.error("GET ALL RESERVATIONS ERROR:", error);
    return res.status(500).json({ ok: false, message: error.message });
  }
};

// ADMIN: confirmar pago
export const confirmReservationPayment = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `SELECT id, estado FROM reserva WHERE id = ? LIMIT 1`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ ok: false, message: "Reserva no encontrada" });
    }

    if (rows[0].estado === "cancelada") {
      return res.status(400).json({ ok: false, message: "No se puede confirmar una reserva cancelada" });
    }

    await pool.query(
      `UPDATE reserva SET estado = 'confirmada' WHERE id = ?`,
      [id]
    );

    return res.json({ ok: true, message: "Reserva confirmada" });
  } catch (error) {
    console.error("CONFIRM PAYMENT ERROR:", error);
    return res.status(500).json({ ok: false, message: error.message });
  }
};

// ADMIN: cancelar cualquier reserva
export const adminCancelReservation = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `SELECT id, estado FROM reserva WHERE id = ? LIMIT 1`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ ok: false, message: "Reserva no encontrada" });
    }

    if (rows[0].estado === "cancelada") {
      return res.json({ ok: true, message: "Ya estaba cancelada" });
    }

    await pool.query(
      `UPDATE reserva SET estado = 'cancelada' WHERE id = ?`,
      [id]
    );

    return res.json({ ok: true, message: "Reserva cancelada por admin" });
  } catch (error) {
    console.error("ADMIN CANCEL ERROR:", error);
    return res.status(500).json({ ok: false, message: error.message });
  }
};