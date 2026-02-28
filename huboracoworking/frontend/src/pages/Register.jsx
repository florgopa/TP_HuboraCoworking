import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../components/Register.module.css";

function Register() {
  const navigate = useNavigate();
  
  // Estados para todos los campos
  const [formData, setFormData] = useState({
    // Datos para tabla usuario
    email: "",
    password: "",
    plan_contratado: "basico",
    
    // Datos para tabla perfil_usuario
    nombre: "",
    apellido: "",
    direccion: "",
    celular: "",
    contacto_emergencia_nombre: "",
    contacto_emergencia_telefono: "",
    tiene_mascota: false,
    mascota_nombre: "",
    mascota_tipo: "",
    locker_numero: "" // Se asignara automaticamente en el backend
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleRegister = async () => {
    // Validaciones básicas
    if (!formData.nombre || !formData.apellido || !formData.email || !formData.celular || !formData.password) {
      alert("Completá todos los campos obligatorios: nombre, apellido, email, celular y contraseña");
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Ingresá un email válido");
      return;
    }

    // Validar contraseña
    if (formData.password.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    // Validar teléfono de emergencia si se proporciona
    if (formData.contacto_emergencia_telefono && formData.contacto_emergencia_telefono.length < 6) {
      alert("El teléfono de emergencia debe tener al menos 6 caracteres");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData),
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
        <h2>Registro de Usuario</h2>
        <div className={styles.registerForm}>
          
          {/* Datos Personales */}
          <h3>Datos Personales</h3>
          <div className={styles.formGroup}>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre *"
              value={formData.nombre}
              onChange={handleChange}
            />
          </div>
          
          <div className={styles.formGroup}>
            <input
              type="text"
              name="apellido"
              placeholder="Apellido *"
              value={formData.apellido}
              onChange={handleChange}
            />
          </div>
          
          <div className={styles.formGroup}>
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico *"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          
          <div className={styles.formGroup}>
            <input
              type="text"
              name="direccion"
              placeholder="Dirección"
              value={formData.direccion}
              onChange={handleChange}
            />
          </div>
          
          <div className={styles.formGroup}>
            <input
              type="tel"
              name="celular"
              placeholder="Celular *"
              value={formData.celular}
              onChange={handleChange}
            />
          </div>

          {/* Contacto de Emergencia */}
          <h3>Contacto de Emergencia</h3>
          <div className={styles.formGroup}>
            <input
              type="text"
              name="contacto_emergencia_nombre"
              placeholder="Nombre contacto emergencia"
              value={formData.contacto_emergencia_nombre}
              onChange={handleChange}
            />
          </div>
          
          <div className={styles.formGroup}>
            <input
              type="tel"
              name="contacto_emergencia_telefono"
              placeholder="Teléfono contacto emergencia"
              value={formData.contacto_emergencia_telefono}
              onChange={handleChange}
            />
          </div>

          {/* Datos de Mascota */}
          <h3>Información de Mascota</h3>
          <div className={styles.formGroupCheckbox}>
            <label>
              <input
                type="checkbox"
                name="tiene_mascota"
                checked={formData.tiene_mascota}
                onChange={handleChange}
              />
              ¿Tiene mascota?
            </label>
          </div>

          {formData.tiene_mascota && (
            <>
              <div className={styles.formGroup}>
                <input
                  type="text"
                  name="mascota_nombre"
                  placeholder="Nombre de la mascota"
                  value={formData.mascota_nombre}
                  onChange={handleChange}
                />
              </div>
              
              <div className={styles.formGroup}>
                <select
                  name="mascota_tipo"
                  value={formData.mascota_tipo}
                  onChange={handleChange}
                >
                  <option value="">Seleccioná tipo de mascota</option>
                  <option value="perro">Perro</option>
                  <option value="gato">Gato</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
            </>
          )}

          {/* Plan y Contraseña */}
          <h3>Plan y Seguridad</h3>
          <div className={styles.formGroup}>
            <select
              name="plan_contratado"
              value={formData.plan_contratado}
              onChange={handleChange}
            >
              <option value="basico">Plan Básico</option>
              <option value="premium">Plan Premium</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <input
              type="password"
              name="password"
              placeholder="Contraseña * (mínimo 6 caracteres)"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button className={styles.registerButton} onClick={handleRegister}>
            Registrarse
          </button>
          
          <div className={styles.formNote}>
            <small>* Campos obligatorios</small>
          </div>
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