// src/pages/MyReservations.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../components/MyReservations.module.css";

const API_BASE = "http://localhost:3000/api";

function getStoredUser() {
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function normalizeReservations(data) {
  if (!data || !Array.isArray(data.reservas)) return [];
  return data.reservas.map((r) => ({
    id: r.id,
    fecha: r.fecha,
    espacioNombre: r.espacio_nombre || r.espacioNombre || "",
    horaInicio: r.hora_inicio || r.horaInicio || "",
    horaFin: r.hora_fin || r.horaFin || "",
    estado: r.estado || "pendiente",
  }));
}

function formatDate(fecha) {
  if (!fecha) return "";
  const [y, m, d] = fecha.split("-");
  return `${d}/${m}/${y}`;
}

export default function MyReservations() {
  const navigate = useNavigate();
  const user = useMemo(() => getStoredUser(), []);
  const token = localStorage.getItem("token");

  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !token) {
      navigate("/login");
      return;
    }

    const fetchReservas = async () => {
      setLoading(true);
      try {
        const url = `${API_BASE}/reservations/user/${encodeURIComponent(
          user.email
        )}`;
        console.log("FETCH MY RESERVATIONS:", url);

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json().catch(() => null);
        console.log("MY RES RAW RESPONSE:", data);

        if (!res.ok || !data || data.ok === false) {
          console.error("Error al cargar reservas:", res.status, data?.message);
          if (res.status === 401 || res.status === 403) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
          }
          setReservas([]);
          return;
        }

        setReservas(normalizeReservations(data));
      } catch (error) {
        console.error("Error al conectar con el servidor:", error);
        setReservas([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReservas();
  }, [user, token, navigate]);

  const handleBack = () => {
    navigate("/usuario");
  };

  if (loading) {
    return (
      <div className={styles.resContainer}>
        <div className={styles.panelBox}>
          <div className={styles.panelHeader}>
            <h1 className={styles.panelTitle}>Mis Reservas</h1>
            <p className={styles.welcomeMessage}>Cargando reservas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.resContainer}>
      <div className={styles.panelBox}>
        <div className={styles.panelHeader}>
          <h1 className={styles.panelTitle}>Mis Reservas</h1>
          <p className={styles.welcomeMessage}>
            Consultá el detalle de tus reservas en Hubora.
          </p>
        </div>

        <div className={styles.listWrapper}>
          {reservas.length === 0 && (
            <p className={styles.emptyText}>
              Todavía no realizaste ninguna reserva.
            </p>
          )}

          {reservas.map((r) => (
            <div key={r.id} className={styles.resCard}>
              <div className={styles.resMain}>
                <h3 className={styles.resTitle}>{r.espacioNombre}</h3>
                <p className={styles.resDate}>
                  {formatDate(r.fecha)} — {r.horaInicio} a {r.horaFin}
                </p>
              </div>
              <div className={styles.resMeta}>
                <span
                  className={`${styles.badge} ${
                    r.estado === "pendiente"
                      ? styles.badgePending
                      : r.estado === "confirmada"
                      ? styles.badgeOk
                      : styles.badgeCancel
                  }`}
                >
                  {r.estado}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.panelFooter}>
          <button className={styles.actionButton} onClick={handleBack}>
            Volver al panel
          </button>
          <p>© 2025 Hubora Coworking - Área de Usuarios</p>
        </div>
      </div>
    </div>
  );
}