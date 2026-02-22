import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Nosotros.module.css';

function Nosotros() {
  return (
    <section id="nosotros" className={styles.nosotrosSection}>
      <div className={styles.mainTitleContainer}>
        <h2 className={styles.mainTitle}>Sobre Nosotros</h2>
      </div>

      <p className={styles.nosotrosParagraph}>En Hubora Coworking, nuestra misión es impulsar el crecimiento y la creatividad de profesionales, startups y empresas de Mendoza.</p>
      <p className={styles.nosotrosParagraph}>Creemos en la fuerza de la comunidad y en la flexibilidad como pilares para alcanzar el éxito.</p>
      <p className={styles.nosotrosParagraph}>Fundado en 2021, Hubora nació de la necesidad de crear un espacio de trabajo que no solo ofreciera infraestructura de primera, sino también un ambiente dinámico y colaborativo.</p>
      <p className={styles.nosotrosParagraph}>Únete a nuestra comunidad y descubre un lugar donde trabajar es más que una obligación: es una experiencia enriquecedora.</p>

      <Link to="/register" className={styles.ctaButton}>
        ¡Quiero ser parte!
      </Link>
    </section>
  );
}

export default Nosotros;  