// src/App.jsx
import React from 'react';
import './App.css';

import Navbar from './components/Navbar.jsx';
import Footer from './components/footer.jsx';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">

        {/* Sección Hero  */}
      
        <section id="hero" className="hero-section">
          <h1>¡Bienvenido a Hubora Coworking!</h1>
          <p>Tu espacio ideal para la productividad y la colaboración en Godoy Cruz, Mendoza. Ofrecemos un ambiente moderno y todas las comodidades que necesitas para potenciar tu trabajo y el de tu equipo. Descubre nuestros planes flexibles y únete a nuestra comunidad.</p>
          <p>En Hubora, creemos en la sinergia y el crecimiento mutuo. Contamos con áreas de trabajo compartido, oficinas privadas, salas de reuniones equipadas y zonas de descanso. ¡Tu próximo gran proyecto empieza aquí!</p>
        </section>

        {/* Sección "Nosotros" - Aún vacía, la llenaremos después */}
        <section id="nosotros" className="content-section">
          <h2>Sobre Nosotros</h2>
          {/* Aquí irá el contenido de "Sobre Nosotros" */}
          <p>En Hubora Coworking, nuestra misión es impulsar el crecimiento y la creatividad de profesionales, startups y empresas de Mendoza. Creemos en la fuerza de la comunidad y en la flexibilidad como pilares para alcanzar el éxito.</p>
          <p>Fundado en 2023, Hubora nació de la necesidad de crear un espacio de trabajo que no solo ofreciera infraestructura de primera, sino también un ambiente dinámico y colaborativo. Nos enorgullece ser un punto de encuentro donde las ideas fluyen, las conexiones se multiplican y los proyectos se hacen realidad.</p>
          <p>Únete a nuestra comunidad y descubre un lugar donde trabajar es más que una obligación: es una experiencia enriquecedora.</p>
        </section>

        {/* Sección "Espacios" - Aún vacía, la llenaremos después */}
        <section id="espacios" className="content-section">
          <h2>Nuestros Espacios</h2>
          {/* Aquí irá el contenido de "Nuestros Espacios" */}
        </section>

        {/* Sección "Servicios" - Aún vacía, la llenaremos después */}
        <section id="servicios" className="content-section">
          <h2>Nuestros Servicios</h2>
          {/* Aquí irá el contenido de "Nuestros Servicios" */}
        </section>

        {/* Sección "Planes" - Aún vacía, la llenaremos después */}
        <section id="planes" className="content-section">
          <h2>Nuestros Planes</h2>
          {/* Aquí irá el contenido de "Nuestros Planes" */}
        </section>

        {/* Sección "Contacto" - Aún vacía, la llenaremos después */}
        <section id="contacto" className="content-section">
          <h2>Contacto</h2>
          {/* Aquí irá el contenido de "Contacto" */}
        </section>

      </main>
      <Footer />
    </div>
  );
}

export default App;