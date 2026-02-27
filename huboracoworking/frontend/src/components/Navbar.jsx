// import React, { useState, useEffect } from 'react';
// import styles from './Navbar.module.css';
// import Logo from '../assets/Logo.svg';
// import MenuIcon from '../assets/menu-icon.svg';
// import { Link, useLocation } from 'react-router-dom';

// function Navbar() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [user, setUser] = useState(null);
//   const location = useLocation(); // 👈 clave

//   useEffect(() => {
//     const storedUser = JSON.parse(localStorage.getItem("user"));
//     setUser(storedUser);
//   }, [location]); // se ejecuta al cambiar de página

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   return (
//     <nav className={styles.navbar}>
//       <div className={styles.navbarContainer}>
//         <div className={styles.logoWrapper}>
//           <Link to="/">
//             <img src={Logo} alt="Hubora Logo" className={styles.logoImage} />
//           </Link>
//         </div>

//         <div className={styles.hamburger} onClick={toggleMenu}>
//           <img src={MenuIcon} alt="Menú" className={styles.hamburgerIcon} />
//         </div>

//         <div className={`${styles.navRightGroup} ${isMenuOpen ? styles.navRightGroupOpen : ''}`}>
//           <ul className={styles.navMenu}>
//             <li className={styles.navItem}><a href="#nosotros" className={styles.navLinks}>Nosotros</a></li>
//             <li className={styles.navItem}><a href="#espacios" className={styles.navLinks}>Espacios</a></li>
//             <li className={styles.navItem}><a href="#servicios" className={styles.navLinks}>Servicios</a></li>
//             <li className={styles.navItem}><a href="#planes" className={styles.navLinks}>Planes</a></li>
//             <li className={styles.navItem}><a href="#contacto" className={styles.navLinks}>Contacto</a></li>
//           </ul>

//           {/* BOTÓN DINÁMICO, se modifica el user.email para cambiar lo que diga*/}
//           {user ? (
//             <Link
//               to={user.role === "admin" ? "/admin" : "/usuario"}
//               className={styles.loginButton}
//             >
//               Hola, {user.email} 
//             </Link>
//           ) : (
//             <Link to="/login" className={styles.loginButton}>
//               MiHUB
//             </Link>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;

import React, { useState, useEffect } from 'react';
import styles from './Navbar.module.css';
import Logo from '../assets/Logo.svg';
import MenuIcon from '../assets/menu-icon.svg';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, [location]); // se ejecuta al cambiar de página

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    
    // Si estamos en la página principal
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Si estamos en otra página, navegamos a la principal con el hash
      navigate('/', { state: { scrollTo: sectionId } });
    }
    
    // Cerrar el menú después de hacer clic (para móvil)
    setIsMenuOpen(false);
  };

  // Efecto para manejar el scroll cuando llegamos a la página principal con un estado
  useEffect(() => {
    if (location.pathname === '/' && location.state?.scrollTo) {
      const sectionId = location.state.scrollTo;
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100); // Pequeño delay para asegurar que la página cargó
    }
  }, [location]);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        <div className={styles.logoWrapper}>
          <Link to="/" onClick={() => setIsMenuOpen(false)}>
            <img src={Logo} alt="Hubora Logo" className={styles.logoImage} />
          </Link>
        </div>

        <div className={styles.hamburger} onClick={toggleMenu}>
          <img src={MenuIcon} alt="Menú" className={styles.hamburgerIcon} />
        </div>

        <div className={`${styles.navRightGroup} ${isMenuOpen ? styles.navRightGroupOpen : ''}`}>
          <ul className={styles.navMenu}>
            <li className={styles.navItem}>
              <a 
                href="#nosotros" 
                className={styles.navLinks}
                onClick={(e) => handleNavClick(e, 'nosotros')}
              >
                Nosotros
              </a>
            </li>
            <li className={styles.navItem}>
              <a 
                href="#espacios" 
                className={styles.navLinks}
                onClick={(e) => handleNavClick(e, 'espacios')}
              >
                Espacios
              </a>
            </li>
            <li className={styles.navItem}>
              <a 
                href="#servicios" 
                className={styles.navLinks}
                onClick={(e) => handleNavClick(e, 'servicios')}
              >
                Servicios
              </a>
            </li>
            <li className={styles.navItem}>
              <a 
                href="#planes" 
                className={styles.navLinks}
                onClick={(e) => handleNavClick(e, 'planes')}
              >
                Planes
              </a>
            </li>
            <li className={styles.navItem}>
              <a 
                href="#contacto" 
                className={styles.navLinks}
                onClick={(e) => handleNavClick(e, 'contacto')}
              >
                Contacto
              </a>
            </li>
          </ul>

          {/* BOTÓN DINÁMICO */}
          {user ? (
            <Link
              to={user.role === "admin" ? "/admin" : "/usuario"}
              className={styles.loginButton}
              onClick={() => setIsMenuOpen(false)}
            >
              Hola, {user.email}
            </Link>
          ) : (
            <Link 
              to="/login" 
              className={styles.loginButton}
              onClick={() => setIsMenuOpen(false)}
            >
              MiHUB
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;