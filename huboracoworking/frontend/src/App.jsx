import React, { useMemo } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

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

function getStoredUser() {
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

//  Ruta protegida (requiere login)
function ProtectedRoute({ children }) {
  const user = getStoredUser();
  if (!user?.token) return <Navigate to="/login" replace />;
  return children;
}

//  Solo admin
function AdminRoute({ children }) {
  const user = getStoredUser();
  if (!user?.token) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/usuario" replace />;
  return children;
}

//  Solo cliente (o cualquier no-admin)
function UserRoute({ children }) {
  const user = getStoredUser();
  if (!user?.token) return <Navigate to="/login" replace />;
  if (user.role === "admin") return <Navigate to="/admin" replace />;
  return children;
}

function App() {

  const user = useMemo(() => getStoredUser(), []);

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

            {/* Ruta  opcional: te manda al panel correcto */}
            <Route
              path="/panel"
              element={
                user?.token ? (
                  user.role === "admin" ? (
                    <Navigate to="/admin" replace />
                  ) : (
                    <Navigate to="/usuario" replace />
                  )
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* Usuario */}
            <Route
              path="/usuario"
              element={
                <UserRoute>
                  <UserPanel />
                </UserRoute>
              }
            />
            <Route
              path="/usuario/perfil"
              element={
                <UserRoute>
                  <Profile />
                </UserRoute>
              }
            />
            <Route
              path="/usuario/reservar"
              element={
                <UserRoute>
                  <NewReservation />
                </UserRoute>
              }
            />
            <Route
              path="/usuario/reservas"
              element={
                <UserRoute>
                  <MyReservations />
                </UserRoute>
              }
            />

            {/* Admin */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminPanel />
                </AdminRoute>
              }
            />

            {/* fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;