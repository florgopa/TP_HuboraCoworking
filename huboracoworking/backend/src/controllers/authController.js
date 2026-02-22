// src/controllers/authController.js
import { pool } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/* =========================
   LOGIN
   ========================= */
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ ok: false, message: "Missing fields" });
  }

  try {
    const [rows] = await pool.query(
      "SELECT id, email, password, role, activo, plan_contratado FROM usuario WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(400).json({ ok: false, message: "Invalid credentials" });
    }

    const usuario = rows[0];
    if (!usuario.activo) {
      return res.status(403).json({ ok: false, message: "User inactive" });
    }

    const ok = await bcrypt.compare(password, usuario.password);
    if (!ok) {
      return res.status(400).json({ ok: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, role: usuario.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({
      ok: true,
      token,
      user: {
        id: usuario.id,
        email: usuario.email,
        role: usuario.role,
        plan_contratado: usuario.plan_contratado,
      },
    });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
};

// r
export const loginUser = login;

/* =========================
   REGISTER
   ========================= */
export const registerUser = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    let { email, password } = req.body;

    email = String(email || "").trim().toLowerCase();
    password = String(password || "");

    if (!email || !password) {
      return res.status(400).json({ ok: false, message: "Completá email y contraseña" });
    }

    // validación simple
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      return res.status(400).json({ ok: false, message: "Email inválido" });
    }

    if (password.length < 6) {
      return res.status(400).json({ ok: false, message: "La contraseña debe tener al menos 6 caracteres" });
    }

    await conn.beginTransaction();

    // ya existe?
    const [exists] = await conn.query("SELECT id FROM usuario WHERE email = ? LIMIT 1", [email]);
    if (exists.length > 0) {
      await conn.rollback();
      return res.status(409).json({ ok: false, message: "Ese email ya está registrado" });
    }

    const hashed = await bcrypt.hash(password, 10);

    // crear usuario (role default cliente, activo 1, plan_contratado basico)
    const [ins] = await conn.query(
      `INSERT INTO usuario (email, password, role, activo, plan_contratado)
       VALUES (?, ?, 'cliente', 1, 'basico')`,
      [email, hashed]
    );

    const userId = ins.insertId;

    // crear perfil vacío asociado
    await conn.query(
      `INSERT INTO perfil_usuario (usuario_id)
       VALUES (?)`,
      [userId]
    );

    await conn.commit();

    return res.status(201).json({
      ok: true,
      message: "Usuario registrado correctamente",
      userId,
    });
  } catch (error) {
    try { await conn.rollback(); } catch {}
    
    // por si hay constraint unique en email/usuario_id
    if (error?.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ ok: false, message: "Ese email ya está registrado" });
    }
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({ ok: false, message: error.message });
  } finally {
    conn.release();
  }
};