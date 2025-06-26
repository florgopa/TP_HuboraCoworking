// src/components/Hero.jsx
import React, { useState, useEffect } from 'react';
import styles from './Hero.module.css';

// Importa todas tus 5 imágenes para el carrusel.
// ¡Asegúrate de que los nombres de archivo coincidan exactamente con los de tu carpeta src/assets/!
import EspacioImg from '../assets/espacio.jpg';
import ReunionesImg from '../assets/reuniones.jpg';
import CocinaImg from '../assets/cocina.jpg';
import ConferenciaImg from '../assets/conferencia.jpg';
import NetworkingImg from '../assets/networking.jpg';

// Array con objetos para cada "slide" del carrusel, incluyendo imagen, título y descripción
const heroSlides = [
  {
    src: EspacioImg,
    title: 'Tu Espacio de Productividad',
    description: 'Encuentra el ambiente ideal para concentrarte y desarrollar tus proyectos. Adaptamos el espacio a tus necesidades.',
  },
  {
    src: ReunionesImg,
    title: 'Reuniones Exitosas Aseguradas',
    description: 'Nuestras salas están equipadas con la última tecnología para tus presentaciones y colaboraciones.',
  },
  {
    src: CocinaImg,
    title: 'Zona de Descanso y Conexión',
    description: 'Recarga energías en nuestra cómoda cocina y comparte ideas con otros profesionales.',
  },
  {
    src: ConferenciaImg,
    title: 'Eventos y Conferencias Profesionales',
    description: 'Ofrecemos espacios versátiles para tus talleres, charlas y eventos corporativos.',
  },
  {
    src: NetworkingImg,
    title: 'Conecta y Colabora',
    description: 'Forma parte de una comunidad activa donde las ideas crecen y las oportunidades surgen.',
  },
];

function Hero() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlideIndex((prevIndex) => 
        (prevIndex + 1) % heroSlides.length
      );
    }, 5000); // Cambia la imagen cada 5 segundos

    return () => clearInterval(interval); 
  }, []);

  return (
    <section 
      id="hero" 
      className={styles.heroSection}
      // Aplica la imagen de fondo actual del carrusel desde el objeto
      style={{ backgroundImage: `url(${heroSlides[currentSlideIndex].src})` }}
    >
      {/* Contenido del Hero (título, texto y botón) */}
      <div className={styles.heroContent}>
        <h1>{heroSlides[currentSlideIndex].title}</h1> {/* Título dinámico */}
        <p>{heroSlides[currentSlideIndex].description}</p> {/* Descripción dinámica */}
      </div>

      {/* Indicadores del carrusel */}
      <div className={styles.carouselIndicators}>
        {heroSlides.map((_, index) => (
          <span 
            key={index}
            className={`${styles.indicator} ${index === currentSlideIndex ? styles.active : ''}`}
            onClick={() => setCurrentSlideIndex(index)}
          ></span>
        ))}
      </div>
    </section>
  );
}

export default Hero;