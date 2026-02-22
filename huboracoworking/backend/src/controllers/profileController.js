import { pool } from "../config/db.js";

const mapDbToForm = (row) => ({
  nombre: row?.nombre ?? "",
  apellido: row?.apellido ?? "",
  direccion: row?.direccion ?? "",
  telefono: row?.telefono ?? "",
  contactoEmergenciaNombre: row?.contacto_emergencia_nombre ?? "",
  contactoEmergenciaTelefono: row?.contacto_emergencia_telefono ?? "",
  tieneMascota: !!row?.tiene_mascota,
  mascotaNombre: row?.mascota_nombre ?? "",
  mascotaTipo: row?.mascota_tipo ?? "otro",
  lockerNumero: row?.locker_numero ?? ""
});

// GET /api/profile/me
export const getMyProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const [rows] = await pool.query(
      `SELECT *
       FROM perfil_usuario
       WHERE usuario_id = ?
       LIMIT 1`,
      [userId]
    );

    if (rows.length === 0) {
      return res.json({ ok: true, profile: mapDbToForm(null) });
    }

    return res.json({ ok: true, profile: mapDbToForm(rows[0]) });
  } catch (error) {
    console.error("GET MY PROFILE ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};

// PUT /api/profile/me
export const upsertMyProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const {
      nombre,
      apellido,
      direccion,
      telefono,
      contactoEmergenciaNombre,
      contactoEmergenciaTelefono,
      tieneMascota,
      mascotaNombre,
      mascotaTipo,
      lockerNumero
    } = req.body;

    // opcional, pero recomendable
    if (!nombre?.trim() || !apellido?.trim()) {
      return res
        .status(400)
        .json({ ok: false, message: "Nombre y apellido son obligatorios." });
    }

    const tieneMascotaInt = tieneMascota ? 1 : 0;
    const mascotaNombreSafe = tieneMascota ? (mascotaNombre ?? "") : "";
    const mascotaTipoSafe = tieneMascota ? (mascotaTipo ?? "otro") : "otro";

    // ¿Existe registro?
    const [exists] = await pool.query(
      `SELECT id FROM perfil_usuario WHERE usuario_id = ? LIMIT 1`,
      [userId]
    );

    if (exists.length === 0) {
      // INSERT
      await pool.query(
        `INSERT INTO perfil_usuario
          (usuario_id, nombre, apellido, direccion, telefono,
           contacto_emergencia_nombre, contacto_emergencia_telefono,
           tiene_mascota, mascota_nombre, mascota_tipo, locker_numero)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          nombre.trim(),
          apellido.trim(),
          direccion ?? null,
          telefono ?? null,
          contactoEmergenciaNombre ?? null,
          contactoEmergenciaTelefono ?? null,
          tieneMascotaInt,
          mascotaNombreSafe || null,
          mascotaTipoSafe || null,
          lockerNumero === "" ? null : lockerNumero
        ]
      );
    } else {
      // UPDATE
      await pool.query(
        `UPDATE perfil_usuario SET
          nombre = ?,
          apellido = ?,
          direccion = ?,
          telefono = ?,
          contacto_emergencia_nombre = ?,
          contacto_emergencia_telefono = ?,
          tiene_mascota = ?,
          mascota_nombre = ?,
          mascota_tipo = ?,
          locker_numero = ?
         WHERE usuario_id = ?`,
        [
          nombre.trim(),
          apellido.trim(),
          direccion ?? null,
          telefono ?? null,
          contactoEmergenciaNombre ?? null,
          contactoEmergenciaTelefono ?? null,
          tieneMascotaInt,
          mascotaNombreSafe || null,
          mascotaTipoSafe || null,
          lockerNumero === "" ? null : lockerNumero,
          userId
        ]
      );
    }

    return res.json({ ok: true });
  } catch (error) {
    console.error("UPSERT MY PROFILE ERROR:", error);
    return res.status(500).json({ ok: false, message: error.message });
  }
};