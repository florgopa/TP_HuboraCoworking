import db from "../config/db.js";

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

    // obtener usuario_id
    const [users] = await db.query(
      "SELECT id FROM usuario WHERE email = ?",
      [usuarioEmail]
    );

    if (users.length === 0) {
      return res.status(404).json({ ok: false });
    }

    const usuarioId = users[0].id;

    // insertar reserva
    await db.query(
      `INSERT INTO reserva
      (id, usuario_id, fecha, espacio_id, espacio_nombre, hora_inicio, hora_fin)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, usuarioId, fecha, espacioId, espacioNombre, horaInicio, horaFin]
    );

    res.json({ ok: true });

  } catch (error) {
    console.error("ERROR CREATE RESERVATION:", error);
    res.status(500).json({ ok: false });
  }
};


export const getReservationsByDate = async (req, res) => {
  try {
    const { fecha } = req.params;

    const [rows] = await db.query(
      `SELECT * FROM reserva
       WHERE fecha = ?
       AND estado != 'cancelada'`,
      [fecha]
    );

    res.json(rows);
  } catch (error) {
    console.error("ERROR GET BY DATE:", error);
    res.status(500).json({ ok: false });
  }
};

export const getReservationsByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const [rows] = await db.query(
      `SELECT r.*
       FROM reserva r
       JOIN usuario u ON r.usuario_id = u.id
       WHERE u.email = ?
       ORDER BY r.fecha DESC`,
      [email]
    );

    res.json(rows);

  } catch (error) {
    console.error("ERROR GET BY EMAIL:", error);
    res.status(500).json({ ok: false });
  }
};

