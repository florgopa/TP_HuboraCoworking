// src/controllers/adminController.js
import db from "../config/db.js";

// =======================
// GET /api/admin/users
// =======================
export const getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT 
         u.id,
         u.email,
         u.role,
         u.plan_contratado,
         u.activo,
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
       WHERE u.activo = 1         -- 👈 sólo activos
       ORDER BY u.id ASC`
    );

    return res.json({
      ok: true,
      users: rows
    });
  } catch (error) {
    console.error("ERROR getAllUsers:", error);
    return res.status(500).json({
      ok: false,
      message: "Error al obtener usuarios"
    });
  }
};

// ================================
// PUT /api/admin/users/:id
// ================================
export const updateUserPlanAndLocker = async (req, res) => {
  try {
    const userId = req.params.id;
    const data = req.body;

    // 1) actualizar tabla usuario (rol + plan)
    await db.query(
      `UPDATE usuario
       SET role = ?, plan_contratado = ?
       WHERE id = ?`,
      [data.role, data.planContratado || null, userId]
    );

    // 2) ver si ya existe perfil_usuario
    const [exist] = await db.query(
      "SELECT id FROM perfil_usuario WHERE usuario_id = ?",
      [userId]
    );

    if (exist.length === 0) {
      // insertar perfil
      await db.query(
        `INSERT INTO perfil_usuario
         (usuario_id, nombre, apellido, direccion, telefono,
          contacto_emergencia_nombre, contacto_emergencia_telefono,
          tiene_mascota, mascota_nombre, mascota_tipo, locker_numero)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          data.nombre || "",
          data.apellido || "",
          data.direccion || "",
          data.telefono || "",
          data.contactoEmergenciaNombre || "",
          data.contactoEmergenciaTelefono || "",
          data.tieneMascota ? 1 : 0,
          data.mascotaNombre || "",
          data.mascotaTipo || "otro",
          data.lockerNumero || null
        ]
      );
    } else {
      // actualizar perfil
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
          mascota_tipo = ?,
          locker_numero = ?
        WHERE usuario_id = ?`,
        [
          data.nombre || "",
          data.apellido || "",
          data.direccion || "",
          data.telefono || "",
          data.contactoEmergenciaNombre || "",
          data.contactoEmergenciaTelefono || "",
          data.tieneMascota ? 1 : 0,
          data.mascotaNombre || "",
          data.mascotaTipo || "otro",
          data.lockerNumero || null,
          userId
        ]
      );
    }

    return res.json({ ok: true });
  } catch (error) {
    console.error("ERROR updateUserPlanAndLocker:", error);
    return res.status(500).json({
      ok: false,
      message: "Error al actualizar usuario"
    });
  }
};

// ================================
// DELETE lógico /api/admin/users/:id
// ================================
export const deleteUserLogical = async (req, res) => {
  try {
    const userId = req.params.id;

    await db.query(
      "UPDATE usuario SET activo = 0 WHERE id = ?",
      [userId]
    );

    return res.json({ ok: true });
  } catch (error) {
    console.error("ERROR deleteUserLogical:", error);
    return res.status(500).json({
      ok: false,
      message: "Error al eliminar usuario"
    });
  }
};