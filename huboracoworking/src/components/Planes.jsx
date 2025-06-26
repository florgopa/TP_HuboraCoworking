// src/components/Planes.jsx
import React from 'react';
import styles from './Planes.module.css';

function Planes() {
  const planesList = [
    {
      name: 'Plan Flex',
      price: '$5.000/mes',
      description: 'Ideal para freelancers y nómadas digitales que buscan flexibilidad.',
      features: [
        'Acceso de 9 a 18 hs',
        'Escritorio compartido',
        'Internet de alta velocidad',
        'Café y té ilimitados',
        '2 hs de sala de reuniones/mes',
        'Eventos de networking'
      ],
      highlight: false
    },
    {
      name: 'Plan Dedicado',
      price: '$12.000/mes',
      description: 'Tu propio espacio fijo, siempre listo para trabajar.',
      features: [
        'Acceso 24/7',
        'Escritorio fijo',
        'Cajonera personal',
        'Internet de alta velocidad',
        '4 hs de sala de reuniones/mes',
        'Eventos de networking',
        'Descuentos en talleres'
      ],
      highlight: true // Este plan será destacado
    },
    {
      name: 'Oficina Privada',
      price: '$25.000/mes',
      description: 'Solución completa para equipos pequeños o empresas que buscan privacidad.',
      features: [
        'Acceso 24/7',
        'Oficina privada amoblada',
        'Internet de alta velocidad',
        'Café y té ilimitados',
        '10 hs de sala de reuniones/mes',
        'Eventos de networking',
        'Servicio de recepción'
      ],
      highlight: false
    },
  ];

  return (
    <section id="planes" className="content-section">
      <h2>Planes Disponibles</h2>
      <p className={styles.sectionDescription}>Encuentra la membresía perfecta para tu estilo de trabajo y tus objetivos.</p>
      
      <div className={styles.planesGrid}>
        {planesList.map((plan, index) => (
          <div key={index} className={`${styles.planCard} ${plan.highlight ? styles.highlighted : ''}`}>
            <h3>{plan.name}</h3>
            <p className={styles.planPrice}>{plan.price}</p>
            <p className={styles.planDescription}>{plan.description}</p>
            <ul className={styles.planFeatures}>
              {plan.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
            <button className={styles.planButton}>Seleccionar Plan</button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Planes;