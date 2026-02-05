import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Hero from "./components/Hero";
import Nosotros from "./components/Nosotros";
import Espacios from "./components/Espacios";
import Servicios from "./components/Servicios";
import Planes from "./components/Planes";
import Contacto from "./components/Contacto";

import Login from "./pages/Login";
import Register from "./pages/Register";
import UserPanel from "./pages/UserPanel";
import AdminPanel from "./pages/AdminPanel";
import Profile from "./pages/Profile";
import NotFound from "./pages/404";

import MyReservations from "./pages/MyReservations";
import NewReservation from "./pages/NewReservation";

function App() {
  const userIsAdmin = true;

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
            <Route path="/register" element={<Register />} />

            {/* Usuario */}
            <Route path="/usuario" element={<UserPanel />} />
            <Route path="/usuario/perfil" element={<Profile />} />
            <Route path="/usuario/reservar" element={<NewReservation />} />
            <Route path="/usuario/reservas" element={<MyReservations />} />

            {/* Admin */}
            {userIsAdmin ? (
              <Route path="/admin" element={<AdminPanel />} />
            ) : (
              <Route path="/admin" element={<NotFound />} />
            )}

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
