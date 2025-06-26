// src/components/Contacto.jsx
import React from 'react';
import styles from './Contacto.module.css'; // Mantenemos el import para estilos específicos de Contacto

function Contacto() {
  return (
    <section id="contacto" className="content-section">
     <div className="mainTitleContainer"> {/* SIN styles. */}
  <h2 className="mainTitle">Contactate</h2> {/* SIN styles. */}
</div>

      <p className={styles.sectionDescription}>Estamos aquí para responder todas tus preguntas. Envíanos un mensaje o visítanos.</p>
      
      <div className={styles.contactContent}>
        <div className={styles.contactFormContainer}>
          <h3>Envíanos un Mensaje</h3>
          <form className={styles.contactForm}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Nombre:</label>
              <input type="text" id="name" name="name" required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="message">Mensaje:</label>
              <textarea id="message" name="message" rows="5" required></textarea>
            </div>
            <button type="submit" className={styles.submitButton}>Enviar Mensaje</button>
          </form>
        </div>

        <div className={styles.contactInfoContainer}>
          <h3>Nuestra Información</h3>
          <p><strong>Dirección:</strong> Calle Falsa 123, Godoy Cruz, Mendoza</p>
          <p><strong>Teléfono:</strong> +54 9 261 123 4567</p>
          <p><strong>Email:</strong> info@hubora.com</p>
          <p><strong>Horarios:</strong> Lunes a Viernes: 9:00 - 18:00 hs</p>
          
          <div className={styles.mapContainer}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3349.5252876602366!2d-68.8525046!3d-32.915729799999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses-419!2sar!4v1719420000000!5m2!1ses-419!2sar"
              width="100%"
              height="250"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación de Hubora Coworking"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contacto;