import React from 'react';
import styles from './Footer.module.css';
import Nodo from '../assets/nodo.svg';
import FacebookIcon from '../assets/facebook.png';
import InstagramIcon from '../assets/instagram.png';
import LinkedInIcon from '../assets/linkedin.png';
import ScrollTopBottomIcon from '../assets/ScrollTopBottom.svg';

function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className={styles.footer}>
      
       <div className={styles.footerTopContainer}>
        
        <div className={styles.footerCenter}>
          <img src={Nodo} alt="Logo Nodo" className={styles.nodoLogo} />
        </div>
      </div>

      <div className={styles.footerBottom}>
        <div className={styles.footerBottomLeft}>
          <p>&copy; {currentYear} Hubora Coworking.</p>
          <p>Plataformas de Desarrollo - Franco Chiquilito & Flor Gomez Pacheco</p>
        </div>

        <div className={styles.scrollToTopButton} onClick={scrollToTop} aria-label="Volver arriba">
          <img src={ScrollTopBottomIcon} alt="Ir arriba" className={styles.arrowUpSvg} />
        </div>

        <div className={styles.footerBottomRight}>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <img src={FacebookIcon} alt="Facebook" className={styles.socialIconSmall} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <img src={InstagramIcon} alt="Instagram" className={styles.socialIconSmall} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <img src={LinkedInIcon} alt="LinkedIn" className={styles.socialIconSmall} />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

