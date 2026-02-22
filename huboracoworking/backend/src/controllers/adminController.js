import { pool } from "../config/db.js";

export const getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, email, role, activo, plan_contratado, locker_numero, nombre, apellido
       FROM usuario
       ORDER BY id DESC`
    );

    return res.json({ ok: true, users: rows });
  } catch (error) {
    console.error("GET ALL USERS ERROR:", error);
    return res.status(500).json({ ok: false, message: error.message });
  }
};

export const updateUserAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      activo,
      role,
      plan_contratado,
      lockerNumero, // lo mandás desde el front
      nombre,
      apellido,
      direccion,
      telefono,
      contactoEmergenciaNombre,
      contactoEmergenciaTelefono,
      tieneMascota,
      mascotaNombre,
      mascotaTipo,
    } = req.body;

    const updates = [];
    const params = [];

    if (activo !== undefined) {
      updates.push("activo = ?");
      params.push(Number(activo) ? 1 : 0);
    }

    if (role !== undefined) {
      if (!["admin", "cliente"].includes(role)) {
        return res.status(400).json({ ok: false, message: "Rol inválido" });
      }
      updates.push("role = ?");
      params.push(role);
    }

    // enum de plan
    if (plan_contratado !== undefined) {
      if (!["basico", "premium"].includes(plan_contratado)) {
        return res.status(400).json({ ok: false, message: "Plan inválido" });
      }
      updates.push("plan_contratado = ?");
      params.push(plan_contratado);
    }

    // locker
    if (lockerNumero !== undefined) {
      updates.push("locker_numero = ?");
      params.push(lockerNumero === "" ? null : lockerNumero);
    }

    // editar datos personales desde admin
    if (nombre !== undefined) { updates.push("nombre = ?"); params.push(nombre); }
    if (apellido !== undefined) { updates.push("apellido = ?"); params.push(apellido); }
    if (direccion !== undefined) { updates.push("direccion = ?"); params.push(direccion); }
    if (telefono !== undefined) { updates.push("telefono = ?"); params.push(telefono); }
    if (contactoEmergenciaNombre !== undefined) { updates.push("contacto_emergencia_nombre = ?"); params.push(contactoEmergenciaNombre); }
    if (contactoEmergenciaTelefono !== undefined) { updates.push("contacto_emergencia_telefono = ?"); params.push(contactoEmergenciaTelefono); }
    if (tieneMascota !== undefined) { updates.push("tiene_mascota = ?"); params.push(tieneMascota ? 1 : 0); }
    if (mascotaNombre !== undefined) { updates.push("mascota_nombre = ?"); params.push(mascotaNombre); }
    if (mascotaTipo !== undefined) { updates.push("mascota_tipo = ?"); params.push(mascotaTipo); }

    if (updates.length === 0) {
      return res.status(400).json({ ok: false, message: "No hay campos para actualizar" });
    }

    params.push(id);

    const [result] = await pool.query(
      `UPDATE usuario SET ${updates.join(", ")} WHERE id = ?`,
      params
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Usuario no encontrado" });
    }

    return res.json({ ok: true });
  } catch (error) {
    console.error("UPDATE USER ADMIN ERROR:", error);
    return res.status(500).json({ ok: false, message: error.message });
  }
};