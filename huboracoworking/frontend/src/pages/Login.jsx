import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../components/Login.module.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Completá email y contraseña");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      console.log("LOGIN RESPONSE:", data);

      if (!response.ok || !data.ok) {
        alert(data.message || "Error al iniciar sesión");
        return;
      }

      // guardar token + user (sesión real)
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // redirigir por rol
      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/usuario");
      }
    } catch (error) {
      console.error(error);
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <h2>Iniciar Sesión</h2>

        <form className={styles.loginForm} onSubmit={(e) => e.preventDefault()}>
          <div className={styles.formGroup}>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={styles.loginButton} onClick={handleLogin}>
            Ingresar
          </button>

          <button
            type="button"
            className={styles.registerButton}
            onClick={() => navigate("/register")}
          >
            Registrarse
          </button>
        </form>

        <div className={styles.forgotPassword}>
          <span>
            ¿Olvidaste tu contraseña? <a href="#">Recuperar</a>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;