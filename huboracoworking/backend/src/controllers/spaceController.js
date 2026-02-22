import { pool } from "../config/db.js";

// GET /api/spaces  (público)
export const getPublicSpaces = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, tipo, nombre, precio
       FROM espacio
       WHERE activo = 1
       ORDER BY tipo ASC, nombre ASC`
    );

    return res.json({ ok: true, spaces: rows });
  } catch (error) {
    console.error("GET PUBLIC SPACES ERROR:", error);
    return res.status(500).json({ ok: false, message: error.message });
  }
};