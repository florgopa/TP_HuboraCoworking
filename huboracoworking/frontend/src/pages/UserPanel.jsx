import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../components/UserPanel.module.css";

function UserPanel() {
  const navigate = useNavigate();

  // Protección básica
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) navigate("/login");
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className={styles.userPanelContainer}>
      <div className={styles.panelBox}>
        <div className={styles.panelHeader}>
          <h1 className={styles.panelTitle}>Panel de Usuario</h1>
          <p className={styles.welcomeMessage}>
            Bienvenido/a, ¡aquí puedes gestionar tus reservas y tu perfil!
          </p>
        </div>

        <div className={styles.panelContent}>
          <div className={styles.contentItem}>
            <h3>Mis Reservas</h3>
            <p>Consulta el estado de tus reservas actuales y revisa tu historial.</p>
            <button
              className={styles.actionButton}
              onClick={() => navigate("/usuario/reservas")}
            >
              Ver Reservas
            </button>
          </div>

          <div className={styles.contentItem}>
            <h3>Hacer una Nueva Reserva</h3>
            <p>Buscá disponibilidad y reservá un espacio.</p>
            <button
            className={styles.actionButton}
            onClick={() => {
              console.log("CLICK Buscar Disponibilidad");
              navigate("/usuario/reservar");
            }}
            >
            Buscar Disponibilidad
            </button>
          </div>

          <div className={styles.contentItem}>
            <h3>Mi Perfil</h3>
            <p>Actualiza tu información personal y preferencias.</p>
            <button
              className={styles.actionButton}
              onClick={() => navigate("/usuario/perfil")}
            >
              Editar Perfil
            </button>
          </div>
        </div>

        <div className={styles.panelFooter}>
          <p>© 2025 Hubora Coworking - Área de Usuarios</p>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserPanel;
