import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!data.ok) {
        alert(data.message);
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
    <div>
      <h2>Registro</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button onClick={handleRegister}>
        Registrarse
      </button>
    </div>
  );
}

export default Register;
