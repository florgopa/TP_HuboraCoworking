import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../components/AdminPanel.module.css';

function AdminPanel() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className={styles.adminPanelContainer}>
      <div className={styles.panelBox}>
        <div className={styles.panelHeader}>
          <h1 className={styles.panelTitle}>Panel de Administrador</h1>
          <p className={styles.welcomeMessage}>Bienvenido/a al centro de control de Hubora Coworking.</p>
        </div>

        <div className={styles.panelContent}>
          <div className={styles.contentItem}>
            <h3>Gestión de Usuarios</h3>
            <p>Visualiza, edita y gestiona las cuentas de los usuarios. Crea nuevos administradores o bloquea accesos.</p>
            <button className={styles.actionButton}>Ver Usuarios</button>
          </div>

          <div className={styles.contentItem}>
            <h3>Gestión de Espacios</h3>
            <p>Administra la disponibilidad de salas de reuniones, escritorios y otros espacios. Configura precios y horarios.</p>
            <button className={styles.actionButton}>Gestionar Espacios</button>
          </div>

          <div className={styles.contentItem}>
            <h3>Reportes y Estadísticas</h3>
            <p>Accede a informes sobre el uso de las instalaciones, reservas y actividad financiera.</p>
            <button className={styles.actionButton}>Ver Reportes</button>
          </div>
        </div>

        <div className={styles.panelFooter}>
          <p>© 2025 Hubora Coworking - Administración</p>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
