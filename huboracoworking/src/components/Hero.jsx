import React, { useState, useEffect } from 'react';
import styles from './Hero.module.css';
import EspacioImg from '../assets/espacio.jpg';
import ReunionesImg from '../assets/reuniones.jpg';
import CocinaImg from '../assets/cocina.jpg';
import ConferenciaImg from '../assets/conferencia.jpg';
import NetworkingImg from '../assets/networking.jpg';

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
    }, 5000); 

    return () => clearInterval(interval); 
  }, []);

  return (
    <section 
      id="hero" 
      className={styles.heroSection}
      style={{ backgroundImage: `url(${heroSlides[currentSlideIndex].src})` }}
    >
   
      <div className={styles.heroContent}>
        <h1>{heroSlides[currentSlideIndex].title}</h1> 
        <p>{heroSlides[currentSlideIndex].description}</p> 
      </div>

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