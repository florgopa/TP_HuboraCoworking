import pool from "../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// helper: firmar token
const signToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES || "2h" }
  );
};

// =====================
// LOGIN
// =====================
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ ok: false, message: "Faltan datos requeridos" });
  }

  try {
    const [rows] = await pool.query(
      "SELECT id, email, password, role FROM usuario WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ ok: false, message: "Credenciales incorrectas" });
    }

    const user = rows[0];

    // comparar hash
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ ok: false, message: "Credenciales incorrectas" });
    }

    const token = signToken(user);

    return res.json({
      ok: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, message: "Error del servidor" });
  }
};

// =====================
// REGISTER
// =====================
export const register = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ ok: false, message: "Faltan datos requeridos" });
  }

  try {
    const [rows] = await pool.query("SELECT id FROM usuario WHERE email = ?", [email]);

    if (rows.length > 0) {
      return res.json({ ok: false, message: "El usuario ya existe" });
    }

    // hashear password
    const hashed = await bcrypt.hash(password, 10);

    // role por defecto: cliente
    await pool.query(
      "INSERT INTO usuario (email, password, role) VALUES (?, ?, ?)",
      [email, hashed, "cliente"]
    );

    return res.json({ ok: true, message: "Usuario registrado exitosamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, message: "Error del servidor" });
  }
};

// =====================
// ME (para probar token)
// =====================
export const me = async (req, res) => {
  // req.user lo setea authMiddleware
  return res.json({ ok: true, user: req.user });
};