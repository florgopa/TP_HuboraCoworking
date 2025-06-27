import React from 'react';
import styles from './Navbar.module.css';
import Logo from '../assets/Logo.svg';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        {/* Logo a la izquierda */}
        <div className={styles.logoWrapper}>
          <a href="/">
            <img src={Logo} alt="Hubora Logo" className={styles.logoImage} />
          </a>
        </div>

        {/* Menú + MiHUB a la derecha */}
        <div className={styles.navRightGroup}>
          <ul className={styles.navMenu}>
            <li className={styles.navItem}><a href="#nosotros" className={styles.navLinks}>Nosotros</a></li>
            <li className={styles.navItem}><a href="#espacios" className={styles.navLinks}>Espacios</a></li>
            <li className={styles.navItem}><a href="#servicios" className={styles.navLinks}>Servicios</a></li>
            <li className={styles.navItem}><a href="#planes" className={styles.navLinks}>Planes</a></li>
            <li className={styles.navItem}><a href="#contacto" className={styles.navLinks}>Contacto</a></li>
          </ul>
          <Link to="/login" className={styles.loginButton}>MiHUB</Link> 
        </div>
      </div>
    </nav>
  );
}

export default Navbar;