//se definen los metodos

import pool from "../config/db.js";

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.query(
      "SELECT id, email, password, role FROM usuarios WHERE email = ?",
      [email]
    );

    // Usuario no existe
    if (rows.length === 0) {
      return res.status(401).json({
        ok: false,
        message: "Credenciales incorrectas"
      });
    }

    const user = rows[0];

    // Contraseña incorrecta
    if (user.password !== password) {
      return res.status(401).json({
        ok: false,
        message: "Credenciales incorrectas"
      });
    }

    // Login correcto
    res.json({
      ok: true,
      role: user.role
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: "Error del servidor"
    });
  }
};
