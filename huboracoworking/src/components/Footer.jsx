// src/components/Footer.jsx
import React from 'react';
// Importamos el archivo de estilos de Footer como un módulo.
import styles from './Footer.module.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        {/* Sección de información general del coworking */}
        <div className={styles.footerSection}>
          <h3>Hubora Coworking</h3>
          <p>Tu espacio ideal para trabajar, colaborar y crecer en un ambiente inspirador.</p>
        </div>

        {/* Sección de enlaces rápidos */}
        <div className={styles.footerSection}>
          <h3>Enlaces Rápidos</h3>
          <ul>
            <li><a href="/nosotros" className={styles.footerLink}>Sobre Nosotros</a></li>
            <li><a href="/faqs" className={styles.footerLink}>Preguntas Frecuentes</a></li>
            <li><a href="/privacidad" className={styles.footerLink}>Política de Privacidad</a></li>
            <li><a href="/terminos" className={styles.footerLink}>Términos de Servicio</a></li>
          </ul>
        </div>

        {/* Sección de contacto */}
        <div className={styles.footerSection}>
          <h3>Contacto</h3>
          <p>Dirección: Calle Falsa 123, Godoy Cruz, Mendoza</p>
          <p>Email: info@hubora.com</p>
          <p>Teléfono: +54 9 261 123 4567</p>
        </div>

        {/* Sección de redes sociales */}
        <div className={`${styles.footerSection} ${styles.socialLinks}`}>
          <h3>Síguenos</h3>
          {/* Aquí puedes usar iconos si tienes una librería como Font Awesome,
              o simplemente texto/emojis por ahora */}
          <a href="https://facebook.com/hubora" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>Facebook</a>
          <a href="https://instagram.com/hubora" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>Instagram</a>
          <a href="https://linkedin.com/company/hubora" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>LinkedIn</a>
        </div>
      </div>

      {/* Sección inferior del footer con copyright */}
      <div className={styles.footerBottom}>
        <p>&copy; {currentYear} Hubora Coworking. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;