import { pool } from "../config/db.js";

export const adminGetUsers = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        u.id,
        u.email,
        u.role,
        u.activo,
        u.plan_contratado,
        u.created_at,
        p.nombre,
        p.apellido,
        p.direccion,
        p.telefono,
        p.contacto_emergencia_nombre,
        p.contacto_emergencia_telefono,
        p.tiene_mascota,
        p.mascota_nombre,
        p.mascota_tipo,
        p.locker_numero,
        p.updated_at
      FROM usuario u
      LEFT JOIN perfil_usuario p 
        ON p.usuario_id = u.id
       AND p.id = (
          SELECT MAX(p2.id)
          FROM perfil_usuario p2
          WHERE p2.usuario_id = u.id
       )
      ORDER BY u.id DESC
    `);

    return res.json({ ok: true, users: rows });
  } catch (error) {
    console.error("ADMIN GET USERS ERROR:", error);
    return res.status(500).json({ ok: false, message: error.message });
  }
};

export const adminUpdateUser = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { id } = req.params;

    const {
      // usuario
      email,
      role,
      activo,
      plan_contratado,

      // perfil
      nombre,
      apellido,
      direccion,
      telefono,
      contacto_emergencia_nombre,
      contacto_emergencia_telefono,
      tiene_mascota,
      mascota_nombre,
      mascota_tipo,
      locker_numero
    } = req.body;

    await conn.beginTransaction();

    // ====== UPDATE usuario ======
    const userUpdates = [];
    const userParams = [];

    if (email !== undefined) {
      userUpdates.push("email = ?");
      userParams.push(email);
    }

    if (role !== undefined) {
      if (!["admin", "cliente"].includes(role)) {
        await conn.rollback();
        return res.status(400).json({ ok: false, message: "Rol inválido" });
      }
      userUpdates.push("role = ?");
      userParams.push(role);
    }

    if (activo !== undefined) {
      userUpdates.push("activo = ?");
      userParams.push(activo ? 1 : 0);
    }

    if (plan_contratado !== undefined) {
      if (!["basico", "premium"].includes(plan_contratado)) {
        await conn.rollback();
        return res.status(400).json({ ok: false, message: "Plan inválido" });
      }
      userUpdates.push("plan_contratado = ?");
      userParams.push(plan_contratado);
    }

    if (userUpdates.length > 0) {
      userParams.push(id);
      await conn.query(
        `UPDATE usuario SET ${userUpdates.join(", ")} WHERE id = ?`,
        userParams
      );
    }

    // ====== UPSERT perfil_usuario (real) ======
const anyProfileProvided = [
  nombre, apellido, direccion, telefono,
  contacto_emergencia_nombre, contacto_emergencia_telefono,
  tiene_mascota, mascota_nombre, mascota_tipo, locker_numero
].some(v => v !== undefined);

if (anyProfileProvided) {
  // normalizaciones
  const tieneMascotaVal = tiene_mascota === undefined ? undefined : (tiene_mascota ? 1 : 0);

  // si apaga mascota => limpiamos
  const mascotaNombreVal =
    tiene_mascota === false ? null :
    (mascota_nombre !== undefined ? (mascota_nombre || null) : undefined);

  const mascotaTipoVal =
    tiene_mascota === false ? null :
    (mascota_tipo !== undefined ? (mascota_tipo || null) : undefined);

  if (mascota_tipo !== undefined && mascota_tipo !== null && mascota_tipo !== "" &&
      !["perro", "gato", "otro"].includes(mascota_tipo)) {
    await conn.rollback();
    return res.status(400).json({ ok: false, message: "Tipo de mascota inválido" });
  }

  await conn.query(
    `
    INSERT INTO perfil_usuario
      (usuario_id, nombre, apellido, direccion, telefono,
       contacto_emergencia_nombre, contacto_emergencia_telefono,
       tiene_mascota, mascota_nombre, mascota_tipo, locker_numero)
    VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      nombre = COALESCE(VALUES(nombre), nombre),
      apellido = COALESCE(VALUES(apellido), apellido),
      direccion = COALESCE(VALUES(direccion), direccion),
      telefono = COALESCE(VALUES(telefono), telefono),
      contacto_emergencia_nombre = COALESCE(VALUES(contacto_emergencia_nombre), contacto_emergencia_nombre),
      contacto_emergencia_telefono = COALESCE(VALUES(contacto_emergencia_telefono), contacto_emergencia_telefono),
      tiene_mascota = COALESCE(VALUES(tiene_mascota), tiene_mascota),
      mascota_nombre = VALUES(mascota_nombre),
      mascota_tipo = VALUES(mascota_tipo),
      locker_numero = COALESCE(VALUES(locker_numero), locker_numero)
    `,
    [
      id,
      nombre ?? null,
      apellido ?? null,
      direccion ?? null,
      telefono ?? null,
      contacto_emergencia_nombre ?? null,
      contacto_emergencia_telefono ?? null,
      tieneMascotaVal ?? null,
      mascotaNombreVal ?? null,
      mascotaTipoVal ?? null,
      locker_numero ?? null,
    ]
  );
}
    await conn.commit();
    return res.json({ ok: true, message: "Usuario actualizado" });

  } catch (error) {
    try { await conn.rollback(); } catch {}
    console.error("ADMIN UPDATE USER ERROR:", error);
    return res.status(500).json({ ok: false, message: error.message });
  } finally {
    conn.release();
  }
};