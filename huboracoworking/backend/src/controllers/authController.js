//se definen los metodos

import pool from "../config/db.js";


// login usuario
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


// registrar usuario
export const register = async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({
      ok: false,
      message: "Faltan datos requeridos"
    });
  }

  try {
    // Verificar si existe
    const [rows] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (rows.length > 0) {
      return res.json({
        ok: false,
        message: "El usuario ya existe"
      });
    }

     //  Insertar usuario
    await pool.query(
      "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
      [email, password, "user"]
    );

    return res.json({
      ok: true,
      message: "Usuario registrado exitosamente"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "Error del servidor"
    });
  }

};