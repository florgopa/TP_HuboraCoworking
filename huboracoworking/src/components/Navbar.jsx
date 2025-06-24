// src/components/Navbar.jsx
import React from 'react';
import styles from './Navbar.module.css';
import Logo from '../assets/Logo.svg';

function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        {/* Grupo Izquierdo: Menú principal */}
        <ul className={styles.navMenuLeft}> {/* Nuevo nombre de clase */}
             <li className={styles.navItem}>
            <a href="/nosotros" className={styles.navLinks}>Nosotros</a>
          </li>
          <li className={styles.navItem}>
            <a href="/espacios" className={styles.navLinks}>Espacios</a>
          </li>
          <li className={styles.navItem}>
            <a href="/servicios" className={styles.navLinks}>Servicios</a>
          </li>
          <li className={styles.navItem}>
            <a href="/planes" className={styles.navLinks}>Planes</a>
          </li>
          <li className={styles.navItem}>
            <a href="/contacto" className={styles.navLinks}>Contacto</a>
          </li>
        </ul>

        {/* Grupo Central: Logo */}
       <a href="/" className={styles.navbarLogo}>
         <img src={Logo} alt="Hubora Coworking Logo" className={styles.logoImage} />
       </a>

        {/* Grupo Derecho: Iniciar Sesión */}
        <div className={styles.navAuthRight}> {/* Nuevo contenedor */}
          <a href="/login" className={styles.navLinks}>
            Iniciar Sesión
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;