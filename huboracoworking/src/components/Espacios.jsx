import React from 'react';
import styles from './Espacios.module.css';

import OficinaPrivada from '../assets/oficina_privada.jpg'; 
import AreaExterior from '../assets/area_exterior.jpg'; 
import ZonaSocial from '../assets/zona_social.jpg'; 


function Espacios() {
  return (
    <section id="espacios" className={styles.espaciosSection}> 
      <div className={styles.mainTitleContainer}> 
        <h2 className={styles.mainTitle}>Nuestros Espacios</h2> 
      </div>
      <p className={styles.sectionDescription}>Descubre el ambiente perfecto para tu productividad y creatividad en Hubora Coworking.</p>
      
      <div className={styles.espaciosGrid}>
        <div className={styles.espacioCard}>
          <img src={OficinaPrivada} alt="Oficinas Privadas" className={styles.espacioImage} /> 
          <h3>Oficinas Privadas</h3>
          <p>Ideales para profesionales que buscan privacidad y un ambiente exclusivo.</p>
        </div>

        <div className={styles.espacioCard}>
          <img src={ZonaSocial} alt="Área de Descanso" className={styles.espacioImage} /> 
          <h3>Áreas de Descanso</h3>
          <p>Espacios cómodos y tranquilos para relajarte y desconectar entre tus tareas, recargando energías.</p>
        </div>

        <div className={styles.espacioCard}>
          <img src={AreaExterior} alt="Zona Exterior" className={styles.espacioImage} /> 
          <h3>Exteriores</h3>
          <p>Disfruta de un ambiente fresco y natural para trabajar, hacer networking o simplemente tomar un respiro al aire libre.</p>
        </div>
      </div>
    </section>
  );
}

export default Espacios;
