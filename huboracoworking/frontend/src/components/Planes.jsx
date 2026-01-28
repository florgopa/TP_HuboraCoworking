import React from 'react';
import styles from './Planes.module.css';

function Planes() {
  const planesList = [
    {
      name: 'Plan Flex Individuos', 
      price: '$2.000',
      period: '/hora', 
      features: [
        'Packs de horas', 
        'Escritorio flexible',
        'Café incluido',
        'Descuentos',
        'Wifi de alta velocidad'
      ],
      highlight: false,
      buttonText: 'Comprar ahora' 
    },
    {
      name: 'Plan Mensual', 
      price: '$150.000',
      period: '/mes', 
      features: [
        'Acceso ilimitado', 
        'Escritorio',
        'Café incluido',
        'Descuentos',
        'Wifi de alta velocidad'
      ],
      highlight: true, 
      buttonText: 'Contratar ahora' 
    },
    {
      name: 'Plan Empresas', 
      price: '$1.800',
      period: '/hora', 
      features: [
        'Pack de horas para toda la nómina', 
        'Escritorio flexible',
        'Café incluido',
        'Descuentos',
        'Wifi de alta velocidad'
      ],
      highlight: false,
      buttonText: 'Cotizar' 
    },
  ];

  return (
    <section id="planes" className={styles.planesSection}>
      <div className={styles.mainTitleContainer}>
        <h2 className={styles.mainTitle}>Planes y Precios</h2>
      </div>
      <p className={styles.sectionDescription}>Elige el plan que mejor se adapte a tus necesidades, desde acceso por horas hasta membresías mensuales.</p>
      
      <div className={styles.planesGrid}>
        {planesList.map((plan, index) => (
          <div key={index} className={`${styles.planCard} ${plan.highlight ? styles.highlighted : ''}`}>
            {plan.highlight && <div className={styles.highlightLabel}>MÁS POPULAR</div>} 
            
            <h3>{plan.name}</h3>
            <p className={styles.planPrice}>
              {plan.price} <span className={styles.planPeriod}>{plan.period}</span>
            </p>
            
            <ul className={styles.planFeatures}>
              {plan.features.map((feature, i) => (
                <li key={i}>
                  <span className={styles.checkIcon}>&#10003;</span>
                  {feature}
                </li>
              ))}
            </ul>
            <button className={styles.planButton}>{plan.buttonText}</button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Planes;
