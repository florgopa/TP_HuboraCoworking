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
    let {
      // Datos para tabla usuario
      email,
      password,
      plan_contratado = 'basico',
      
      // Datos para tabla perfil_usuario
      nombre,
      apellido,
      direccion,
      celular,
      contacto_emergencia_nombre,
      contacto_emergencia_telefono,
      tiene_mascota,
      mascota_nombre,
      mascota_tipo,
      locker_numero
    } = req.body;

    // Procesar TODOS los campos al inicio
    email = String(email || "").trim().toLowerCase();
    password = String(password || "");
    nombre = String(nombre || "").trim();
    apellido = String(apellido || "").trim();
    direccion = String(direccion || "").trim() || null;
    celular = String(celular || "").trim();
    contacto_emergencia_nombre = String(contacto_emergencia_nombre || "").trim() || null;
    contacto_emergencia_telefono = String(contacto_emergencia_telefono || "").trim() || null;
    tiene_mascota = tiene_mascota ? 1 : 0;
    mascota_nombre = String(mascota_nombre || "").trim() || null;
    mascota_tipo = String(mascota_tipo || "").trim() || null;
    locker_numero = String(locker_numero || "").trim() || null;

    // Validar campos obligatorios
    if (!email || !password || !nombre || !apellido || !celular) {
      return res.status(400).json({ 
        ok: false, 
        message: "Completá todos los campos obligatorios: nombre, apellido, email, celular y contraseña" 
      });
    }

    // Validar email
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      return res.status(400).json({ ok: false, message: "Email inválido" });
    }

    // Validar contraseña
    if (password.length < 6) {
      return res.status(400).json({ 
        ok: false, 
        message: "La contraseña debe tener al menos 6 caracteres" 
      });
    }

    // Validar teléfono de emergencia si se proporciona
    if (contacto_emergencia_telefono && contacto_emergencia_telefono.length < 6) {
      return res.status(400).json({ 
        ok: false, 
        message: "El teléfono de emergencia debe tener al menos 6 caracteres" 
      });
    }

    await conn.beginTransaction();

    // Verificar si el email ya existe
    const [exists] = await conn.query(
      "SELECT id FROM usuario WHERE email = ? LIMIT 1", 
      [email]
    );
    
    if (exists.length > 0) {
      await conn.rollback();
      return res.status(409).json({ ok: false, message: "Ese email ya está registrado" });
    }

    // Hash de la contraseña
    const hashed = await bcrypt.hash(password, 10);

    // Insertar en tabla usuario
    const [ins] = await conn.query(
      `INSERT INTO usuario (
        email, 
        password, 
        role, 
        activo, 
        plan_contratado
      ) VALUES (?, ?, 'cliente', 1, ?)`,
      [email, hashed, plan_contratado]
    );

    const userId = ins.insertId;

    // Insertar en tabla perfil_usuario (ahora todas las variables ya están procesadas)
    await conn.query(
      `INSERT INTO perfil_usuario (
        usuario_id,
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
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        nombre,
        apellido,
        direccion,
        celular,
        contacto_emergencia_nombre,
        contacto_emergencia_telefono,
        tiene_mascota,
        mascota_nombre,
        mascota_tipo,
        locker_numero
      ]
    );

    await conn.commit();

    return res.status(201).json({ 
      ok: true, 
      message: "Usuario registrado correctamente",
      userId 
    });

  } catch (error) {
    try {
      await conn.rollback();
    } catch {}
    
    // Manejar error de duplicado
    if (error?.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ 
        ok: false, 
        message: "Ese email ya está registrado" 
      });
    }
    
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({ 
      ok: false, 
      message: error.message 
    });
  } finally {
    conn.release();
  }
};

export const updateUserPlan = async (req, res) => {
  const { plan } = req.body;
  const userId = req.user.id; // Viene del middleware authRequired

  if (!plan) {
    return res.status(400).json({ 
      ok: false, 
      message: "El plan es requerido" 
    });
  }

  const validPlans = ["basico", "premium"];
  if (!validPlans.includes(plan)) {
    return res.status(400).json({ 
      ok: false, 
      message: "Plan no válido" 
    });
  }

  try {
    const [result] = await pool.query(
      "UPDATE usuario SET plan_contratado = ? WHERE id = ?",
      [plan, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        ok: false, 
        message: "Usuario no encontrado" 
      });
    }

    return res.json({ 
      ok: true, 
      message: "Plan actualizado correctamente" 
    });

  } catch (error) {
    console.error("Error al actualizar plan:", error);
    return res.status(500).json({ 
      ok: false, 
      message: error.message 
    });
  }
};