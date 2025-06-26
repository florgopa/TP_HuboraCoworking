// src/components/Servicios.jsx
import React from 'react';
import styles from './Servicios.module.css';

// Importa tus 9 íconos PNG aquí.
// ¡Asegúrate de que los nombres de archivo coincidan con los que tienes en src/assets/!
import IconoSalas from '../assets/salas_reuniones.png'; 
import IconoCocina from '../assets/cocina_cafeteria.png'; 
import IconoInternet from '../assets/internet_alta_velocidad.png'; 
import IconoMobiliario from '../assets/mobiliario_ergonomico.png'; 
import IconoLockers from '../assets/alquiler_lockers.png'; 
import IconoImpresoras from '../assets/impresoras.png'; 
import IconoParking from '../assets/parking_bicis.png'; 
import IconoPetFriendly from '../assets/pet_friendly.png'; 
import IconoDescanso from '../assets/lugares_descanso.png'; 


function Servicios() {
  const serviciosList = [
    { 
      name: 'Salas de reuniones y call rooms', 
      description: 'Equipadas para que puedas hacer reuniones y videoconferencias.', 
      icon: IconoSalas 
    },
    { 
      name: 'Cocina y cafetería', 
      description: 'Completamente equipada que incluye té, café, mate, leche y agua mineral.', 
      icon: IconoCocina 
    },
    { 
      name: 'Internet de alta velocidad', 
      description: 'Contamos con fibra óptica para una conexión estable y rápida.', 
      icon: IconoInternet 
    },
    { 
      name: 'Mobiliario ergonómico', 
      description: 'Para cuidar tu postura y así prevenir el estrés y lograr mayor productividad.', 
      icon: IconoMobiliario 
    },
    { 
      name: 'Alquiler de lockers', 
      description: 'Un espacio seguro donde puedes dejar tus pertenencias personales.', 
      icon: IconoLockers 
    },
    { 
      name: 'Impresoras', 
      description: 'Podés usar tus créditos para imprimir lo que necesites de forma rápida y sencilla.', 
      icon: IconoImpresoras 
    },
    { 
      name: 'Parking para bicis', 
      description: 'Contamos con lugar dentro de los espacios para guardar tu bici de forma segura.', 
      icon: IconoParking 
    },
    { 
      name: '¡Somos Pet Friendly!', 
      description: 'Contamos con un protocolo para que puedas traer a tu mascota y trabajar con ella.', 
      icon: IconoPetFriendly 
    },
    { 
      name: 'Lugares de Descanso y Relax', 
      description: 'Espacios cómodos y tranquilos para desconectar, leer o simplemente relajarte entre tus tareas.', 
      icon: IconoDescanso 
    },
  ];

  return (
    <section id="servicios" className={`${styles.serviciosSection} content-section`}>
      <div className="mainTitleContainer">
        <h2 className="mainTitle">Servicios incluidos</h2>
      </div>
      
      <div className={styles.serviciosGrid}>
        {serviciosList.map((servicio, index) => (
          <div key={index} className={styles.servicioCard}>
            <img src={servicio.icon} alt={servicio.name} className={styles.servicioIcon} />
            <h3>{servicio.name}</h3>
            <p>{servicio.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Servicios;