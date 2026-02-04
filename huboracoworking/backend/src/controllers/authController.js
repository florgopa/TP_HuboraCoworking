// se definen los métodos
import pool from "../config/db.js";

// =====================
// LOGIN
// =====================
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      ok: false,
      message: "Faltan datos requeridos"
    });
  }

  try {
    const [rows] = await pool.query(
      "SELECT id, email, password, role FROM usuario WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        ok: false,
        message: "Credenciales incorrectas"
      });
    }

    const user = rows[0];

    if (user.password !== password) {
      return res.status(401).json({
        ok: false,
        message: "Credenciales incorrectas"
      });
    }

    return res.json({
      ok: true,
      role: user.role
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "Error del servidor"
    });
  }
};

// =====================
// REGISTER
// =====================
export const register = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      ok: false,
      message: "Faltan datos requeridos"
    });
  }

  try {
    // Verificar si existe
    const [rows] = await pool.query(
      "SELECT id FROM usuario WHERE email = ?",
      [email]
    );

    if (rows.length > 0) {
      return res.json({
        ok: false,
        message: "El usuario ya existe"
      });
    }

    // Insertar usuario (role por defecto)
    await pool.query(
      "INSERT INTO usuario (email, password, role) VALUES (?, ?, ?)",
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
