// src/components/Espacios.jsx
import React from 'react';
import styles from './Espacios.module.css'; // Importamos su módulo CSSimport oficinaPrivadaImg from '../assets/oficina-privada.jpg'; // Cambia 'oficina-privada.jpg' por el nombre real de tu imagen

function Espacios() {
  return (
    <section id="espacios" className="content-section">
      <div className="mainTitleContainer"> {/* SIN styles. */}
          <h2 className="mainTitle">Nuestros Espacios</h2> {/* SIN styles. */}
      </div>
      <p className={styles.sectionDescription}>Descubre el ambiente perfecto para tu productividad y creatividad en Hubora Coworking.</p>
      
      <div className={styles.espaciosGrid}>
        <div className={styles.espacioCard}>
       
          <h3>Oficinas Privadas</h3>
          <p>Ideales para equipos pequeños o profesionales que buscan privacidad y un ambiente exclusivo. Equipadas con mobiliario ergonómico y acceso 24/7.</p>
          <ul>
            <li>Privacidad total</li>
            <li>Mobiliario ergonómico</li>
            <li>Acceso 24/7</li>
            <li>Internet de alta velocidad</li>
          </ul>
        </div>

        <div className={styles.espacioCard}>
  
          <h3>Escritorios Flexibles</h3>
          <p>Un espacio dinámico y colaborativo para freelancers y emprendedores. Reserva por horas, días o semanas según tus necesidades.</p>
          <ul>
            <li>Ambiente colaborativo</li>
            <li>Flexibilidad horaria</li>
            <li>Conexiones rápidas</li>
            <li>Zonas comunes</li>
          </ul>
        </div>

        <div className={styles.espacioCard}>
 
          <h3>Salas de Reuniones</h3>
          <p>Espacios modernos y totalmente equipados para tus presentaciones, talleres o reuniones con clientes. Con pantalla, proyector y pizarra.</p>
          <ul>
            <li>Equipamiento multimedia</li>
            <li>Pizarra interactiva</li>
            <li>Cafetería cercana</li>
            <li>Ideal para equipos</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default Espacios;