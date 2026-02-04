import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../components/Register.module.css";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    // ✅ Validación antes del fetch
    if (!email || !password) {
      alert("Completá email y contraseña");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const text = await response.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch {
        console.error("Respuesta no JSON:", text);
        alert("El servidor respondió algo inesperado (mirá consola).");
        return;
      }

      if (!response.ok || !data.ok) {
        alert(data.message || "Error al registrar");
        return;
      }

      alert("Usuario registrado correctamente");
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerBox}>
        <h2>Registro</h2>

        <div className={styles.registerForm}>
          <div className={styles.formGroup}>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className={styles.registerButton} onClick={handleRegister}>
            Registrarse
          </button>
        </div>

        <div className={styles.backToLogin}>
          <span>
            ¿Ya tenés cuenta? <Link to="/login">Iniciar sesión</Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Register;
