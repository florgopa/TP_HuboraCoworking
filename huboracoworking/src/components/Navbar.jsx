// src/components/Navbar.jsx
import React, { useState } from 'react'; // Importamos useState
import styles from './Navbar.module.css';
import Logo from '../assets/Logo.svg';
import MenuIcon from '../assets/menu-icon.svg'; // Importamos el ícono del menú
import { Link } from 'react-router-dom';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para controlar la visibilidad del menú móvil

  // Función para alternar el estado del menú
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        {/* Logo a la izquierda */}
        <div className={styles.logoWrapper}>
          <a href="/">
            <img src={Logo} alt="Hubora Logo" className={styles.logoImage} />
          </a>
        </div>

        {/* Botón de Menú Hamburguesa (visible solo en pantallas pequeñas) */}
        <div className={styles.hamburger} onClick={toggleMenu} aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}>
          {/* Puedes usar un SVG diferente para el ícono de cerrar si lo tienes */}
          <img src={MenuIcon} alt="Menú" className={styles.hamburgerIcon} />
        </div>

        {/* Menú de Navegación + MiHUB a la derecha */}
        {/* La clase 'navRightGroupOpen' se aplica cuando el menú está abierto en móvil */}
        <div className={`${styles.navRightGroup} ${isMenuOpen ? styles.navRightGroupOpen : ''}`}>
          <ul className={styles.navMenu}>
            <li className={styles.navItem}><a href="#nosotros" className={styles.navLinks} onClick={toggleMenu}>Nosotros</a></li>
            <li className={styles.navItem}><a href="#espacios" className={styles.navLinks} onClick={toggleMenu}>Espacios</a></li>
            <li className={styles.navItem}><a href="#servicios" className={styles.navLinks} onClick={toggleMenu}>Servicios</a></li>
            <li className={styles.navItem}><a href="#planes" className={styles.navLinks} onClick={toggleMenu}>Planes</a></li>
            <li className={styles.navItem}><a href="#contacto" className={styles.navLinks} onClick={toggleMenu}>Contacto</a></li>
          </ul>
          <Link to="/login" className={styles.loginButton} onClick={toggleMenu}>MiHUB</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;