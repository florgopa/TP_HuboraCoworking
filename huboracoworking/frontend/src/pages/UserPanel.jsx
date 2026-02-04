import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../components/UserPanel.module.css";

function UserPanel() {
  const [selectedDate, setSelectedDate] = useState("");
  const navigate = useNavigate();

  // ✅ Protección básica: si no hay sesión, afuera
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) navigate("/login");
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user"); // ✅ cerrar sesión de verdad
    navigate("/login");
  };

  const goToReservations = () => {
    navigate("/mis-reservas");
  };

  const goToProfile = () => {
    navigate("/perfil");
  };

  const goToNewReservation = () => {
    // pasa la fecha elegida a la siguiente página
    navigate(`/nueva-reserva?date=${selectedDate}`);
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
            <button className={styles.actionButton} onClick={goToReservations}>
              Ver Reservas
            </button>
          </div>

          <div className={styles.contentItem}>
            <h3>Hacer una Nueva Reserva</h3>
            <p>Selecciona la fecha y el tipo de espacio que deseas reservar.</p>

            <div className={styles.formGroup}>
              <label htmlFor="reservaDate">Fecha de Reserva:</label>
              <input
                type="date"
                id="reservaDate"
                name="reservaDate"
                className={styles.dateInput}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            <button
              className={styles.actionButton}
              disabled={!selectedDate}
              onClick={goToNewReservation}
            >
              Buscar Disponibilidad
            </button>
          </div>

          <div className={styles.contentItem}>
            <h3>Mi Perfil</h3>
            <p>Actualiza tu información personal, contraseña y preferencias.</p>
            <button className={styles.actionButton} onClick={goToProfile}>
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