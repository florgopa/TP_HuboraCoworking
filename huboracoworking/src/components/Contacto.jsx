import React, { useState } from 'react';
import styles from './Contacto.module.css';
import ContactoBg from '../assets/contactobg.jpg'; 

function Contacto() {
  // Estados para los campos del formulario
  const [fullName, setFullName] = useState(''); 
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+54'); 
  const [phoneNumber, setPhoneNumber] = useState(''); 
  const [solutionType, setSolutionType] = useState(''); 
  const [numPeople, setNumPeople] = useState(''); 
  const [estimatedDate, setEstimatedDate] = useState(''); 
  const [message, setMessage] = useState('');
  const [promoCode, setPromoCode] = useState(''); 

  // Estados para el feedback al usuario
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = '';

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    setLoading(true); 
    setSuccessMessage(''); 
    setErrorMessage(''); 

    const formData = {
      fullName,
      email,
      phoneNumber: `${countryCode} ${phoneNumber}`, 
      solutionType,
      numPeople,
      estimatedDate,
      message,
      promoCode,
    };

    try {
      const response = await fetch('/api/send-contact-form', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) { 
        setSuccessMessage('¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.');
  
        setFullName('');
        setEmail('');
        setCountryCode('+54');
        setPhoneNumber('');
        setSolutionType('');
        setNumPeople('');
        setEstimatedDate('');
        setMessage('');
        setPromoCode('');
      } else {
        const errorData = await response.json(); 
        setErrorMessage(`Error al enviar el mensaje: ${errorData.message || 'Inténtalo de nuevo más tarde.'}`);
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      setErrorMessage('Hubo un problema de conexión. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false); 
    }
  };

  return (
    <section id="contacto" className={styles.contactoSection} style={{ backgroundImage: `url(${ContactoBg})` }}>
      <div className={styles.sectionOverlay}>
        <div className={styles.mainTitleContainer}>
          <h2 className={styles.mainTitle}>Contactate</h2>
        </div>

        <p className={styles.sectionDescription}>Estamos aquí para responder todas tus preguntas. Envíanos un mensaje o visítanos.</p>

        <div className={styles.contactContent}>
          <div className={styles.contactFormContainer}>
            <h3>Envíanos un Mensaje</h3>
    
            <form className={styles.contactForm} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="fullName">Nombre y Apellido:</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  disabled={loading} 
                />
              </div>
      
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="email">Correo:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="phoneNumber">Número de teléfono:</label>
                  <div className={styles.phoneInputGroup}> 
                    <select
                      id="countryCode"
                      name="countryCode"
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      disabled={loading}
                      className={styles.countryCodeSelect}
                    >
                      <option value="+54">Arg. +54</option>
                      <option value="+52">Mex. +52</option>
                      <option value="+56">Chi. +56</option>
                      <option value="+57">Col. +57</option>
                      <option value="+34">Esp. +34</option>
                      <option value="+1">USA/Can. +1</option>
                    
                    </select>
                    <input
                      type="tel" 
                      id="phoneNumber"
                      name="phoneNumber"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      disabled={loading}
                      className={styles.phoneNumberInput}
                    />
                  </div>
                </div>
              </div>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="solutionType">Quiero info sobre:</label>
                  <select
                    id="solutionType"
                    name="solutionType"
                    value={solutionType}
                    onChange={(e) => setSolutionType(e.target.value)}
                    disabled={loading}
                  >
                    <option value="">Selecciona</option>
                    <option value="empresas">Plan para Empresas</option>
                    <option value="individual">Plan Individual</option>
                    <option value="sala_reuniones">Sala de Reuniones</option>
                    <option value="evento">Evento</option>
                    <option value="otro">Otros</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="numPeople">Cantidad de Personas:</label>
                  <select
                    id="numPeople"
                    name="numPeople"
                    value={numPeople}
                    onChange={(e) => setNumPeople(e.target.value)}
                    disabled={loading}
                  >
                    <option value="">Selecciona</option>
                    <option value="1">1</option>
                    <option value="2-10">Entre 2 y 10</option>
                    <option value="10-30">Entre 10 y 30</option>
                    <option value="mas_30">Más de 30</option>
                    <option value="mas_60">Más de 60</option>
                  </select>
                </div>
              </div>
              <div className={styles.formGroup}> 
                <label htmlFor="estimatedDate">Fecha de Ingreso Estimada:</label>
                <input
                  type="date"
                  id="estimatedDate"
                  name="estimatedDate"
                  value={estimatedDate}
                  onChange={(e) => setEstimatedDate(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="message">Algún detalle extra para contarnos:</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={loading}
                ></textarea>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="promoCode">CÓDIGO DE PROMOCIÓN:</label>
                <input
                  type="text"
                  id="promoCode"
                  name="promoCode"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  disabled={loading}
                />
              </div>
              <button type="submit" className={styles.submitButton} disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar Mensaje'}
              </button>

             
              {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
              {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
            </form>
          </div>

          <div className={styles.contactInfoContainer}>
            <h3>Nuestra Información</h3>
            <p><strong>Dirección:</strong> Calle Falsa 123, Puerto Madero, Buenos Aires</p> 
            <p><strong>Teléfono:</strong> +54 9 11 9876 5432</p>
            <p><strong>Email:</strong> info@hubora.com</p>
            <p><strong>Horarios:</strong> Lunes a Viernes: 9:00 - 18:00 hs</p>

            <div className={styles.mapContainer}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3283.359253457597!2d-58.36868672346747!3d-34.61902885743455!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95a334d704d9e3b7%3A0x7d2f4a4b2d1c7a1!2sPuerto%20Madero%2C%20Cdad.%20Aut%C3%B3noma%20de%20Buenos%20Aires!5e0!3m2!1ses-419!2sar!4v1719940000000!5m2!1ses-419!2sar"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación de Hubora Coworking en Puerto Madero"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contacto;