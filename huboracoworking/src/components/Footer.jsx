import React from 'react';
import styles from './Footer.module.css';
import Nodo from '../assets/nodo.svg';
import Facebook from '../assets/facebook.png';
import Instagram from '../assets/instagram.png';
import LinkedIn from '../assets/linkedin.png';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        {/* Izquierda: enlaces legales */}
        <nav aria-label="Enlaces legales" className={styles.footerLeft}>
          <h3>Enlaces</h3>
          <ul>
            <li><a href="/terminos" className={styles.footerLink}>Términos de Servicio</a></li>
            <li><a href="/privacidad" className={styles.footerLink}>Política de Privacidad</a></li>
            <li><a href="/trabaja" className={styles.footerLink}>Trabajá con nosotros</a></li>
          </ul>
        </nav>

        {/* Centro: logo de Nodo */}
        <div className={styles.footerCenter}>
          <img src={Nodo} alt="Logo Nodo" className={styles.nodoLogo} />
          <p>Tu Espacio de Trabajo</p>
        </div>

        {/* Derecha: redes sociales */}
        <div className={styles.footerRight}>
          <h3>Redes</h3>
          <div className={styles.iconGroup}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <img src={Facebook} alt="Facebook" className={styles.socialIcon} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <img src={Instagram} alt="Instagram" className={styles.socialIcon} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <img src={LinkedIn} alt="LinkedIn" className={styles.socialIcon} />
            </a>
          </div>
        </div>
      </div>

      {/* Pie inferior */}
      <div className={styles.footerBottom}>
        <p>&copy; {currentYear} Hubora Coworking.</p>
        <p>Plataformas de Desarrollo - Franco Chiquilito & Flor Gomez Pacheco</p>
      </div>
    </footer>
  );
}

export default Footer;
