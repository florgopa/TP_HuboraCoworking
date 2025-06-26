// src/components/Nosotros.jsx
import React from 'react';
import styles from './Nosotros.module.css'; // Mantenemos el import para estilos específicos de Nosotros

function Nosotros() {
  return (
    <section id="nosotros" className="content-section">
      <div className="mainTitleContainer">
        <h2 className="mainTitle">Sobre Nosotros</h2>
      </div>

      <p>En Hubora Coworking, nuestra misión es impulsar el crecimiento y la creatividad de profesionales, startups y empresas de Mendoza. Creemos en la fuerza de la comunidad y en la flexibilidad como pilares para alcanzar el éxito.</p>
      <p>Fundado en 2023, Hubora nació de la necesidad de crear un espacio de trabajo que no solo ofreciera infraestructura de primera, sino también un ambiente dinámico y colaborativo. Nos enorgullece ser un punto de encuentro donde las ideas fluyen, las conexiones se multiplican y los proyectos se hacen realidad.</p>
      <p>Únete a nuestra comunidad y descubre un lugar donde trabajar es más que una obligación: es una experiencia enriquecedora.</p>
    </section>
  );
}
export default Nosotros;