import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Hero from './components/Hero';
import Nosotros from './components/Nosotros';
import Espacios from './components/Espacios';
import Servicios from './components/Servicios';
import Planes from './components/Planes';
import Contacto from './components/Contacto';

import Login from './pages/Login';
import UserPanel from './pages/UserPanel';
import AdminPanel from './pages/AdminPanel';
import NotFound from './pages/404'; // Importa el componente 404 desde pages/404.jsx (una sola vez)

function App() {
  // Aquí podrías tener lógica para verificar permisos o estado de autenticación
  // Por ejemplo, para un acceso denegado si el usuario no tiene permisos de admin
  const userIsAdmin = true; // Esto debería ser dinámico basado en tu lógica de autenticación

  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Hero />
                  <Nosotros />
                  <Espacios />
                  <Servicios />
                  <Planes />
                  <Contacto />
                </>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/usuario" element={<UserPanel />} />
            
            {/* Ruta protegida para el AdminPanel */}
            {userIsAdmin ? (
              <Route path="/admin" element={<AdminPanel />} />
            ) : (
              // Si el usuario no es admin, redirige a 404 o 
              <Route path="/admin" element={<NotFound />} /> 
            )}
            {/* UserPanel */}
             <Route path="/usuario" element={<UserPanel />} /> 
             
            {/* Ruta explícita para el 404. */}
            <Route path="/404" element={<NotFound />} />


            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
