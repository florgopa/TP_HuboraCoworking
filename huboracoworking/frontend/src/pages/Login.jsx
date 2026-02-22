import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../components/Login.module.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert("Completá email y contraseña.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Error al iniciar sesión");
        return;
      }

      // ✅ Guardar token + user juntos (esto arregla el Invalid token en /me)
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...data.user,
          token: data.token
        })
      );

      if (data.user.role === "admin") {navigate("/admin");} 
      else {
        navigate("/usuario");
      };
    } catch (err) {
      console.error(err);
      alert("No se pudo conectar al servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <h2>Iniciar Sesión</h2>

        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="cliente@hubora.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          <button className={styles.loginButton} type="submit" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <div className={styles.forgotPassword}>
          ¿Olvidaste tu contraseña?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/recuperar"); // si no existe, cambialo a tu ruta real
            }}
          >
            Recuperar
          </a>
        </div>

        <button
          className={styles.registerButton}
          type="button"
          onClick={() => navigate("/register")} // ajustá si tu ruta es otra
          disabled={loading}
        >
          Registrarse
        </button>
      </div>
    </div>
  );
}

export default Login;