// src/controllers/profileController.js
import db from "../config/db.js";


export const getProfile = async (req, res) => {
  try {
    const { email } = req.params;

// Hacer JOIN entre usuario y perfil_usuario
    const [rows] = await db.query(
      `SELECT 
         u.email,
         u.role,
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
       WHERE u.email = ?`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "Usuario no encontrado"
      });
    }

    // Mapear los campos de la base de datos al formato del frontend
    const profile = {
      nombre: rows[0].nombre,
      apellido: rows[0].apellido,
      direccion: rows[0].direccion || "",
      telefono: rows[0].telefono || "",
      contactoEmergenciaNombre: rows[0].contacto_emergencia_nombre || "",
      contactoEmergenciaTelefono: rows[0].contacto_emergencia_telefono || "",
      tieneMascota: rows[0].tiene_mascota === 1 || rows[0].tiene_mascota === true,
      mascotaNombre: rows[0].mascota_nombre || "",
      mascotaTipo: rows[0].mascota_tipo || "otro",
      lockerNumero: rows[0].locker_numero || ""
    };

    res.json({
      ok: true,
      profile
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false });
  }
};

// export const updateProfile = async (req, res) => {
//   try {
//     const { email } = req.params;
//     const data = req.body;

//     // Primero obtener el id del usuario
//     const [userRows] = await db.query(
//       "SELECT id FROM usuario WHERE email = ?",
//       [email]
//     );

//     if (userRows.length === 0) {
//       return res.status(404).json({ ok: false, message: "Usuario no encontrado" });
//     }

//     const userId = userRows[0].id;

//     await db.query(
//       `UPDATE perfil_usuario SET
//         nombre = ?,
//         apellido = ?,
//         direccion = ?,
//         telefono = ?,
//         contacto_emergencia_nombre = ?,
//         contacto_emergencia_telefono = ?,
//         tiene_mascota = ?,
//         mascota_Nombre = ?,
//         mascota_Tipo = ?
//       WHERE email = ?`,
//       [
//         data.nombre,
//         data.apellido,
//         data.direccion,
//         data.telefono,
//         data.contactoEmergenciaNombre,
//         data.contactoEmergenciaTelefono,
//         data.tieneMascota ? 1 : 0,
//         data.mascotaNombre,
//         data.mascotaTipo,
//         email
//       ]
//     );

//     res.json({ ok: true });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ ok: false });
//   }
// };

export const updateProfile = async (req, res) => {
  try {
    const { email } = req.params;
    const data = req.body;

    // Obtener ID del usuario
    const [userRows] = await db.query(
      "SELECT id FROM usuario WHERE email = ?",
      [email]
    );

    if (userRows.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "Usuario no encontrado"
      });
    }

    const userId = userRows[0].id;

    // Actualizar perfil_usuario usando usuario_id
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

    res.json({ ok: true });

  } catch (error) {
    console.error("ERROR UPDATE PROFILE:", error);
    res.status(500).json({ ok: false, message: error.message });
  }
};