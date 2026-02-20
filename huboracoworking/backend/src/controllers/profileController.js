// backend/src/controllers/profileController.js
import db from "../config/db.js";

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // viene del token

    const [rows] = await db.query(
      `SELECT 
         u.email,
         u.role,
         u.plan_contratado,
         p.nombre,
         p.apellido,
         p.direccion,
         p.telefono,
         p.contacto_emergencia_nombre,
         p.contacto_emergencia_telefono,
         p.tiene_mascota,
         p.mascota_nombre,
         p.mascota_tipo,
         p.locker_numero
       FROM usuario u
       LEFT JOIN perfil_usuario p ON u.id = p.usuario_id
       WHERE u.id = ?`,
      [userId]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ ok: false, message: "Usuario no encontrado" });
    }

    const r = rows[0];

    return res.json({
      ok: true,
      profile: {
        email: r.email,
        role: r.role,
        planContratado: r.plan_contratado || "",
        nombre: r.nombre || "",
        apellido: r.apellido || "",
        direccion: r.direccion || "",
        telefono: r.telefono || "",
        contactoEmergenciaNombre: r.contacto_emergencia_nombre || "",
        contactoEmergenciaTelefono: r.contacto_emergencia_telefono || "",
        tieneMascota: r.tiene_mascota === 1 || r.tiene_mascota === true,
        mascotaNombre: r.mascota_nombre || "",
        mascotaTipo: r.mascota_tipo || "otro",
        lockerNumero: r.locker_numero || ""
      }
    });
  } catch (error) {
    console.error("ERROR GET PROFILE:", error);
    res
      .status(500)
      .json({ ok: false, message: "Error del servidor al obtener perfil" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // del token
    const data = req.body;

    const [exist] = await db.query(
      "SELECT id FROM perfil_usuario WHERE usuario_id = ?",
      [userId]
    );

    if (exist.length === 0) {
      await db.query(
        `INSERT INTO perfil_usuario
         (usuario_id, nombre, apellido, direccion, telefono,
          contacto_emergencia_nombre, contacto_emergencia_telefono,
          tiene_mascota, mascota_nombre, mascota_tipo)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          data.nombre,
          data.apellido,
          data.direccion,
          data.telefono,
          data.contactoEmergenciaNombre,
          data.contactoEmergenciaTelefono,
          data.tieneMascota ? 1 : 0,
          data.mascotaNombre,
          data.mascotaTipo
        ]
      );
    } else {
      await db.query(
        `UPDATE perfil_usuario SET
          nombre = ?,
          apellido = ?,
          direccion = ?,
          telefono = ?,
          contacto_emergencia_nombre = ?,
          contacto_emergencia_telefono = ?,
          tiene_mascota = ?,
          mascota_nombre = ?,
          mascota_tipo = ?
        WHERE usuario_id = ?`,
        [
          data.nombre,
          data.apellido,
          data.direccion,
          data.telefono,
          data.contactoEmergenciaNombre,
          data.contactoEmergenciaTelefono,
          data.tieneMascota ? 1 : 0,
          data.mascotaNombre,
          data.mascotaTipo,
          userId
        ]
      );
    }

    res.json({ ok: true });
  } catch (error) {
    console.error("ERROR UPDATE PROFILE:", error);
    res.status(500).json({ ok: false, message: error.message });
  }
};