// src/controllers/profileController.js
import db from "../config/db.js";
import { updateProfile } from "../controllers/profileController.js";


export const getProfile = async (req, res) => {
  try {
    const { email } = req.params;

    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "Usuario no encontrado"
      });
    }

    res.json({
      ok: true,
      profile: rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { email } = req.params;
    const data = req.body;

    await db.query(
      `UPDATE users SET
        nombre = ?,
        apellido = ?,
        direccion = ?,
        telefono = ?,
        contactoEmergenciaNombre = ?,
        contactoEmergenciaTelefono = ?,
        tieneMascota = ?,
        mascotaNombre = ?,
        mascotaTipo = ?
      WHERE email = ?`,
      [
        data.nombre,
        data.apellido,
        data.direccion,
        data.telefono,
        data.contactoEmergenciaNombre,
        data.contactoEmergenciaTelefono,
        data.tieneMascota,
        data.mascotaNombre,
        data.mascotaTipo,
        email
      ]
    );

    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false });
  }
};
