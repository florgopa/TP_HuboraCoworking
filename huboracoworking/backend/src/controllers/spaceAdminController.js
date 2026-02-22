import { pool } from "../config/db.js";

const TIPOS = ["box_privado", "sala_reunion", "sala_conferencia", "auditorio"];

const toPrice = (v) => {
  if (v === undefined || v === null || v === "") return undefined;
  const n = Number(v);
  if (Number.isNaN(n)) return NaN;
  return n;
};

const toActivo = (v) => {
  if (v === undefined) return 1;
  if (v === 1 || v === "1" || v === true) return 1;
  if (v === 0 || v === "0" || v === false) return 0;
  return 1;
};

// GET /api/admin/spaces
export const adminGetSpaces = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, tipo, nombre, precio, activo, created_at
       FROM espacio
       ORDER BY tipo ASC, nombre ASC`
    );
    return res.json({ ok: true, spaces: rows });
  } catch (error) {
    console.error("ADMIN GET SPACES ERROR:", error);
    return res.status(500).json({ ok: false, message: error.message });
  }
};

// POST /api/admin/spaces
export const adminCreateSpace = async (req, res) => {
  try {
    const { tipo, nombre, precio, activo } = req.body;

    if (!tipo || !TIPOS.includes(tipo)) {
      return res.status(400).json({ ok: false, message: "Tipo inválido" });
    }

    if (!nombre || !String(nombre).trim()) {
      return res.status(400).json({ ok: false, message: "Nombre requerido" });
    }

    const p = toPrice(precio);
    if (Number.isNaN(p) || p < 0) {
      return res.status(400).json({ ok: false, message: "Precio inválido" });
    }

    const isActive = toActivo(activo);

    const [result] = await pool.query(
      `INSERT INTO espacio (tipo, nombre, precio, activo)
       VALUES (?, ?, ?, ?)`,
      [tipo, String(nombre).trim(), p ?? 0, isActive]
    );

    return res.status(201).json({ ok: true, id: result.insertId });
  } catch (error) {
    console.error("ADMIN CREATE SPACE ERROR:", error);
    return res.status(500).json({ ok: false, message: error.message });
  }
};

// PATCH /api/admin/spaces/:id
export const adminUpdateSpace = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipo, nombre, precio, activo } = req.body;

    const updates = [];
    const params = [];

    if (tipo !== undefined) {
      if (!TIPOS.includes(tipo)) return res.status(400).json({ ok: false, message: "Tipo inválido" });
      updates.push("tipo = ?");
      params.push(tipo);
    }

    if (nombre !== undefined) {
      if (!String(nombre).trim()) return res.status(400).json({ ok: false, message: "Nombre inválido" });
      updates.push("nombre = ?");
      params.push(String(nombre).trim());
    }

    if (precio !== undefined) {
      const p = toPrice(precio);
      if (Number.isNaN(p) || p < 0) return res.status(400).json({ ok: false, message: "Precio inválido" });
      updates.push("precio = ?");
      params.push(p);
    }

    if (activo !== undefined) {
      updates.push("activo = ?");
      params.push(toActivo(activo));
    }

    if (updates.length === 0) {
      return res.status(400).json({ ok: false, message: "No hay cambios para aplicar" });
    }

    params.push(id);

    const [result] = await pool.query(`UPDATE espacio SET ${updates.join(", ")} WHERE id = ?`, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Espacio no encontrado" });
    }

    return res.json({ ok: true, message: "Espacio actualizado" });
  } catch (error) {
    console.error("ADMIN UPDATE SPACE ERROR:", error);
    return res.status(500).json({ ok: false, message: error.message });
  }
};