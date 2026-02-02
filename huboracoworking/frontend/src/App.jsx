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
import NotFound from './pages/404'; 
import Register from './pages/Register';

function App() {

  const userIsAdmin = true; // true para ver la vista de admin, false para ver la vista de usuario normal

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
            
            <Route path="/register" element={<Register />} />

            
            {userIsAdmin ? (
              <Route path="/admin" element={<AdminPanel />} />
            ) : (
             
              <Route path="/admin" element={<NotFound />} /> 
            )}
            {/* UserPanel */}
             <Route path="/usuario" element={<UserPanel />} /> 
            
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
