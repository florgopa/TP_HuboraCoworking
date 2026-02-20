// src/controllers/adminUserController.js
import db from "../config/db.js";

// GET /api/admin/users
export const getAdminUsers = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT 
         u.id,
         u.email,
         u.role,
         u.plan_contratado,
         p.nombre,
         p.apellido,
         p.locker_numero
       FROM usuario u
       LEFT JOIN perfil_usuario p ON p.usuario_id = u.id
       ORDER BY u.id ASC`
    );

    return res.json({
      ok: true,
      users: rows
    });
  } catch (error) {
    console.error("ERROR getAdminUsers:", error);
    return res.status(500).json({ ok: false, message: "Error del servidor" });
  }
};

// PUT /api/admin/users/:id
export const updateAdminUser = async (req, res) => {
  try {
    const { id } = req.params; // id de usuario
    const { planContratado, lockerNumero } = req.body;

    // actualizar plan en tabla usuario
    await db.query(
      "UPDATE usuario SET plan_contratado = ? WHERE id = ?",
      [planContratado || null, id]
    );

    // aseguramos que exista perfil_usuario
    const [exist] = await db.query(
      "SELECT id FROM perfil_usuario WHERE usuario_id = ?",
      [id]
    );

    if (exist.length === 0) {
      await db.query(
        `INSERT INTO perfil_usuario (usuario_id, locker_numero)
         VALUES (?, ?)`,
        [id, lockerNumero || null]
      );
    } else {
      await db.query(
        "UPDATE perfil_usuario SET locker_numero = ? WHERE usuario_id = ?",
        [lockerNumero || null, id]
      );
    }

    return res.json({ ok: true, message: "Usuario actualizado" });
  } catch (error) {
    console.error("ERROR updateAdminUser:", error);
    return res.status(500).json({ ok: false, message: "Error del servidor" });
  }
};