// src/pages/404.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Para el botón "Volver al Inicio"
import styles from '../components/404.module.css'; // Importa los estilos del módulo

function NotFound() {
  return (
    <div className={styles.notFoundContainer}>
      <h1 className={styles.statusCode}>404</h1>
      <h2 className={styles.message}>Acceso Denegado / Página No Encontrada</h2>
      <p className={styles.description}>
        Lo sentimos, no tienes permiso para acceder a esta página o la página que buscas no existe.
      </p>

      <Link to="/" className={styles.homeButton}>
        Volver al Inicio
      </Link>
    </div>
  );
}

export default NotFound;