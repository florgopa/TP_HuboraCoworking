import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Planes.module.css";

function Planes() {
  const navigate = useNavigate();

  const planesList = [
    {
      name: "Plan Flex Individuos",
      price: "$20.000",
      period: "/hora",
      benefits:
        "Ideal para venir cuando lo necesitás. Pagás solo por el tiempo que usás, sin atarte a una membresía.",
      features: [
        "Acceso por hora (sin mínimo mensual)",
        "Escritorio flexible según disponibilidad",
        "Café incluido",
        "Wifi de alta velocidad",
        "Descuentos en salas y servicios",
      ],
      highlight: false,
    },
    {
      name: "Plan Básico",
      price: "$40.000",
      period: "/mes",
      benefits:
        "Tu base de trabajo todos los días. Acceso ilimitado y un lugar estable para mantener rutina y productividad.",
      features: [
        "Acceso ilimitado en horario del coworking",
        "Escritorio dedicado",
        "Café incluido",
        "Wifi de alta velocidad",
        "Descuentos en salas y eventos",
      ],
      highlight: true,
    },
    {
      name: "Plan Premium",
      price: "$60.000",
      period: "/mes",
      benefits:
        "Para quienes usan el coworking a full. Incluye beneficios extra y horas bonificadas en espacios para reuniones.",
      features: [
        "Horas bonificadas de uso de espacios/salas",
        "Escritorio flexible o preferencial",
        "Café incluido",
        "Wifi de alta velocidad",
        "Descuentos superiores + prioridad de reserva",
      ],
      highlight: false,
    },
  ];

  const handleHire = (planName) => {
    // si querés guardar el plan para preseleccionarlo después:
    // localStorage.setItem("selectedPlan", planName);

    navigate("/login", { state: { from: "/#planes", plan: planName } });
  };

  return (
    <section id="planes" className={styles.planesSection}>
      <div className={styles.mainTitleContainer}>
        <h2 className={styles.mainTitle}>Planes y Precios</h2>
      </div>

      <p className={styles.sectionDescription}>
        Elegí el plan que mejor se adapte a tus necesidades, desde acceso por horas hasta membresías mensuales.
      </p>

      <div className={styles.planesGrid}>
        {planesList.map((plan, index) => (
          <div
            key={index}
            className={`${styles.planCard} ${plan.highlight ? styles.highlighted : ""}`}
          >
            {plan.label && <span className={styles.highlightLabel}>{plan.label}</span>}

            <h3>{plan.name}</h3>

            <p className={styles.planPrice}>
              {plan.price} <span className={styles.planPeriod}>{plan.period}</span>
            </p>

            {/* Beneficios cortos */}
            <p className={styles.planDescription}>{plan.benefits}</p>

            <ul className={styles.planFeatures}>
              {plan.features.map((feature, i) => (
                <li key={i}>
                  <span className={styles.checkIcon}>&#10003;</span>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              className={styles.planButton}
              onClick={() => handleHire(plan.name)}
            >
              Contratar
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Planes;