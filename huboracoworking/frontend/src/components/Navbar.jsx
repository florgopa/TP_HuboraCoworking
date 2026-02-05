import React, { useState, useEffect } from 'react';
import styles from './Navbar.module.css';
import Logo from '../assets/Logo.svg';
import MenuIcon from '../assets/menu-icon.svg';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation(); // 👈 clave

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, [location]); // 👈 se ejecuta al cambiar de página

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        <div className={styles.logoWrapper}>
          <Link to="/">
            <img src={Logo} alt="Hubora Logo" className={styles.logoImage} />
          </Link>
        </div>

        <div className={styles.hamburger} onClick={toggleMenu}>
          <img src={MenuIcon} alt="Menú" className={styles.hamburgerIcon} />
        </div>

        <div className={`${styles.navRightGroup} ${isMenuOpen ? styles.navRightGroupOpen : ''}`}>
          <ul className={styles.navMenu}>
            <li className={styles.navItem}><a href="#nosotros" className={styles.navLinks}>Nosotros</a></li>
            <li className={styles.navItem}><a href="#espacios" className={styles.navLinks}>Espacios</a></li>
            <li className={styles.navItem}><a href="#servicios" className={styles.navLinks}>Servicios</a></li>
            <li className={styles.navItem}><a href="#planes" className={styles.navLinks}>Planes</a></li>
            <li className={styles.navItem}><a href="#contacto" className={styles.navLinks}>Contacto</a></li>
          </ul>

          {/* BOTÓN DINÁMICO, se modifica el user.email para cambiar lo que diga*/}
          {user ? (
            <Link
              to={user.role === "admin" ? "/admin" : "/usuario"}
              className={styles.loginButton}
            >
              Hola, {user.email} 
            </Link>
          ) : (
            <Link to="/login" className={styles.loginButton}>
              MiHUB
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
