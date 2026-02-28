
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import styles from "./Planes.module.css";

// function Planes() {
//   const navigate = useNavigate();
//   const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });

//   const planesList = [
//     {
//       name: "Plan Básico",
//       price: "$40.000",
//       period: "/mes",
//       benefits: "Tu base de trabajo todos los días. Acceso ilimitado y un lugar estable para mantener rutina y productividad.",
//       features: [
//         "Acceso ilimitado en horario del coworking",
//         "Escritorio dedicado",
//         "Café incluido",
//         "Wifi de alta velocidad",
//         "Descuentos en salas y eventos",
//       ],
//       highlight: true,
//       valor: "basico"
//     },
//     {
//       name: "Plan Premium",
//       price: "$60.000",
//       period: "/mes",
//       benefits: "Para quienes usan el coworking a full. Incluye beneficios extra y horas bonificadas en espacios para reuniones.",
//       features: [
//         "Horas bonificadas de uso de espacios/salas",
//         "Escritorio flexible o preferencial",
//         "Café incluido",
//         "Wifi de alta velocidad",
//         "Descuentos superiores + prioridad de reserva",
//       ],
//       highlight: false,
//       valor: "premium"
//     },
//   ];

//   const handleHire = async (planName, planValor) => {
//     console.log("1. Click en contratar - plan:", planName, planValor);
    
//     // Verificar si hay usuario logueado
//     const userStr = localStorage.getItem("user");
//     console.log("2. userStr del localStorage:", userStr);
    
//     if (!userStr) {
//       console.log("3. No hay usuario, redirigiendo a login");
//       navigate("/login", { 
//         state: { 
//           from: "/#planes", 
//           plan: planName,
//           planValor: planValor 
//         } 
//       });
//       return;
//     }

//     // Está logueado → obtener datos del usuario
//     const user = JSON.parse(userStr);
//     console.log("4. Usuario parseado:", user);
    
//     const token = user.token;
//     console.log("5. Token:", token ? "Token existe" : "Token NO existe");

//     if (!token) {
//       console.log("6. No hay token");
//       setMensaje({ 
//         texto: "Error de autenticación. Por favor, volvé a iniciar sesión.", 
//         tipo: "error" 
//       });
//       return;
//     }

//     try {
//       console.log("7. Enviando petición a:", "http://localhost:5000/api/user/update-plan");
//       console.log("8. Body:", { plan: planValor });
      
//       const response = await fetch("http://localhost:5000/api/user/update-plan", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`
//         },
//         body: JSON.stringify({ plan: planValor })
//       });

//       console.log("9. Respuesta status:", response.status);
      
//       const data = await response.json();
//       console.log("10. Respuesta data:", data);

//       if (response.ok) {
//         console.log("11. Éxito, actualizando localStorage");
//         const updatedUser = { ...user, plan_contratado: planValor };
//         localStorage.setItem("user", JSON.stringify(updatedUser));
        
//         setMensaje({ 
//           texto: `¡${planName} contratado exitosamente!`, 
//           tipo: "exito" 
//         });

//         setTimeout(() => {
//           setMensaje({ texto: "", tipo: "" });
//         }, 3000);
        
//       } else {
//         console.log("11. Error en respuesta:", data);
//         setMensaje({ 
//           texto: data.message || "Error al contratar el plan", 
//           tipo: "error" 
//         });
//       }
//     } catch (error) {
//       console.error("12. Error en fetch:", error);
//       setMensaje({ 
//         texto: "Error al conectar con el servidor", 
//         tipo: "error" 
//       });
//     }
//   };

//   return (
//     <section id="planes" className={styles.planesSection}>
//       <div className={styles.mainTitleContainer}>
//         <h2 className={styles.mainTitle}>Planes y Precios</h2>
//       </div>

//       <p className={styles.sectionDescription}>
//         Elegí el plan que mejor se adapte a tus necesidades, desde acceso por horas hasta membresías mensuales.
//       </p>

//       {mensaje.texto && (
//         <div className={`${styles.mensaje} ${styles[mensaje.tipo]}`}>
//           {mensaje.texto}
//         </div>
//       )}

//       <div className={styles.planesGrid}>
//         {planesList.map((plan, index) => (
//           <div
//             key={index}
//             className={`${styles.planCard} ${plan.highlight ? styles.highlighted : ""}`}
//           >
//             <h3>{plan.name}</h3>

//             <p className={styles.planPrice}>
//               {plan.price} <span className={styles.planPeriod}>{plan.period}</span>
//             </p>

//             <p className={styles.planDescription}>{plan.benefits}</p>

//             <ul className={styles.planFeatures}>
//               {plan.features.map((feature, i) => (
//                 <li key={i}>
//                   <span className={styles.checkIcon}>&#10003;</span>
//                   {feature}
//                 </li>
//               ))}
//             </ul>

//             <button
//               className={styles.planButton}
//               onClick={() => {
//                 console.log("Botón clickeado -", plan.name);
//                 handleHire(plan.name, plan.valor);
//               }}
//             >
//               Contratar
//             </button>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }

// export default Planes;


import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Planes.module.css";

function Planes() {
  const navigate = useNavigate();

  const planesList = [
    {
      name: "Plan Básico",
      price: "$40.000",
      period: "/mes",
      benefits: "Tu base de trabajo todos los días. Acceso ilimitado y un lugar estable para mantener rutina y productividad.",
      features: [
        "Acceso ilimitado en horario del coworking",
        "Escritorio dedicado",
        "Café incluido",
        "Wifi de alta velocidad",
        "Descuentos en salas y eventos",
      ],
      highlight: true,
      valor: "basico"
    },
    {
      name: "Plan Premium",
      price: "$60.000",
      period: "/mes",
      benefits: "Para quienes usan el coworking a full. Incluye beneficios extra y horas bonificadas en espacios para reuniones.",
      features: [
        "Horas bonificadas de uso de espacios/salas",
        "Escritorio flexible o preferencial",
        "Café incluido",
        "Wifi de alta velocidad",
        "Descuentos superiores + prioridad de reserva",
      ],
      highlight: false,
      valor: "premium"
    },
  ];

  const handleHire = async (planName, planValor) => {
    // Verificar si hay usuario logueado
    const userStr = localStorage.getItem("user");
    
    if (!userStr) {
      navigate("/login", { 
        state: { 
          from: "/#planes", 
          plan: planName,
          planValor: planValor 
        } 
      });
      return;
    }

    // Está logueado → obtener datos del usuario
    const user = JSON.parse(userStr);
    const token = user.token;

    if (!token) {
      alert("Error de autenticación. Por favor, volvé a iniciar sesión.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/user/update-plan", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ plan: planValor })
      });

      const data = await response.json();

      if (response.ok) {
        // Actualizar el plan en localStorage
        const updatedUser = { ...user, plan_contratado: planValor };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        
        // ALERT de éxito
        alert(`¡${planName} contratado exitosamente!`);
        
      } else {
        // ALERT de error
        alert(data.message || "Error al contratar el plan");
      }
    } catch (error) {
      // ALERT de error de conexión
      alert("Error al conectar con el servidor");
    }
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
            <h3>{plan.name}</h3>

            <p className={styles.planPrice}>
              {plan.price} <span className={styles.planPeriod}>{plan.period}</span>
            </p>

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
              onClick={() => handleHire(plan.name, plan.valor)}
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