import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../components/MyReservations.module.css";

export default function MyReservations() {
  const navigate = useNavigate();
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("todas");

  const getStoredUser = () => {
    const stored = localStorage.getItem("user");
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  };

  const token = getStoredUser()?.token || null;

  const formatFecha = (fecha) => {
    const d = new Date(fecha);
    return d.toLocaleDateString("es-AR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatHora = (hora) => (hora ? hora.slice(0, 5) : "");
  const estadoLabel = (estado) => (estado ? estado.replaceAll("_", " ") : "");

  const normalizeDateOnly = (dateOrString) => {
    const d = dateOrString instanceof Date ? new Date(dateOrString) : new Date(dateOrString);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const isPastDate = (fecha) => normalizeDateOnly(fecha) < normalizeDateOnly(new Date());

  const fetchReservas = async () => {
    try {
      if (!token) {
        setReservas([]);
        navigate("/login");
        return;
      }

      const res = await fetch("http://localhost:5000/api/reservations/mine", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        console.error("Error API reservas:", data);
        setReservas([]);
        return;
      }

      // tu backend devuelve array directo
      setReservas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando reservas:", error);
      setReservas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleCancel = async (id, cancelDisabled) => {
    if (!token || cancelDisabled) return;

    const ok = window.confirm("¿Querés cancelar esta reserva?");
    if (!ok) return;

    try {
      const res = await fetch(`http://localhost:5000/api/reservations/${id}/cancel`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json().catch(() => ({}));

      if (res.status === 401) {
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      if (!res.ok) {
        alert(data.message || "No se pudo cancelar la reserva.");
        return;
      }

      setReservas((prev) => prev.map((r) => (r.id === id ? { ...r, estado: "cancelada" } : r)));
      alert("Reserva cancelada ✅");
    } catch (e) {
      console.error(e);
      alert("Error al conectar con el servidor.");
    }
  };

  const filteredAndSorted = useMemo(() => {
    const today = normalizeDateOnly(new Date());

    const filtered = filter === "todas" ? reservas : reservas.filter((r) => (r.estado || "") === filter);

    return [...filtered].sort((a, b) => {
      const da = normalizeDateOnly(a.fecha);
      const db = normalizeDateOnly(b.fecha);

      const aIsFuture = da >= today;
      const bIsFuture = db >= today;

      if (aIsFuture && !bIsFuture) return -1;
      if (!aIsFuture && bIsFuture) return 1;

      if (aIsFuture && bIsFuture) return da - db;
      return db - da;
    });
  }, [reservas, filter]);

  const counts = useMemo(() => {
    const c = { todas: reservas.length, pendiente_pago: 0, confirmada: 0, cancelada: 0 };
    for (const r of reservas) {
      if (r.estado === "pendiente_pago") c.pendiente_pago++;
      else if (r.estado === "confirmada") c.confirmada++;
      else if (r.estado === "cancelada") c.cancelada++;
    }
    return c;
  }, [reservas]);

  if (loading) return <div className={styles.loading}>Cargando...</div>;

  return (
    <div className={styles.newResContainer}>
      <div className={styles.panelBox}>
        <div className={styles.panelHeader}>
          <h1 className={styles.panelTitle}>Mis Reservas</h1>
          <p className={styles.welcomeMessage}>Filtrá por estado y revisá tus próximas reservas primero.</p>
        </div>

        <div className={styles.filterBar}>
          <button
            type="button"
            className={`${styles.filterChip} ${filter === "todas" ? styles.filterChipActive : ""}`}
            onClick={() => setFilter("todas")}
          >
            Todas ({counts.todas})
          </button>

          <button
            type="button"
            className={`${styles.filterChip} ${filter === "pendiente_pago" ? styles.filterChipActive : ""}`}
            onClick={() => setFilter("pendiente_pago")}
          >
            Pendiente ({counts.pendiente_pago})
          </button>

          <button
            type="button"
            className={`${styles.filterChip} ${filter === "confirmada" ? styles.filterChipActive : ""}`}
            onClick={() => setFilter("confirmada")}
          >
            Confirmadas ({counts.confirmada})
          </button>

          <button
            type="button"
            className={`${styles.filterChip} ${filter === "cancelada" ? styles.filterChipActive : ""}`}
            onClick={() => setFilter("cancelada")}
          >
            Canceladas ({counts.cancelada})
          </button>
        </div>

        <div className={styles.panelContentSingle}>
          {filteredAndSorted.length === 0 ? (
            <div className={styles.emptyState}>
              <h3>No hay reservas para este filtro</h3>
              <p>Probá con “Todas” o hacé una nueva reserva.</p>
            </div>
          ) : (
            <div className={styles.spaceGrid}>
              {filteredAndSorted.map((reserva) => {
                const cancelDisabled = reserva.estado === "cancelada" || isPastDate(reserva.fecha);

                return (
                  <div key={reserva.id} className={styles.spaceCard}>
                    <div className={styles.spaceTitle}>{reserva.espacio_nombre}</div>

                    <div className={styles.resDetail}>
                      <span className={styles.resLabel}>Fecha</span>
                      <span className={styles.resValue}>{formatFecha(reserva.fecha)}</span>
                    </div>

                    <div className={styles.resDetail}>
                      <span className={styles.resLabel}>Horario</span>
                      <span className={styles.resValue}>
                        {formatHora(reserva.hora_inicio)} - {formatHora(reserva.hora_fin)}
                      </span>
                    </div>

                    <div className={styles.resFooter}>
                      <span
                        className={`${styles.badge} ${
                          reserva.estado === "confirmada"
                            ? styles.badgeOk
                            : reserva.estado === "pendiente_pago"
                            ? styles.badgeWarn
                            : styles.badgeBad
                        }`}
                      >
                        {estadoLabel(reserva.estado)}
                      </span>

                      <button
                        className={`${styles.cancelBtn} ${cancelDisabled ? styles.cancelBtnDisabled : ""}`}
                        onClick={() => handleCancel(reserva.id, cancelDisabled)}
                        disabled={cancelDisabled}
                        title={
                          reserva.estado === "cancelada"
                            ? "Ya está cancelada"
                            : isPastDate(reserva.fecha)
                            ? "No se puede cancelar una reserva pasada"
                            : "Cancelar reserva"
                        }
                      >
                        Cancelar
                      </button>
                    </div>

                    {isPastDate(reserva.fecha) && reserva.estado !== "cancelada" && (
                      <div className={styles.smallHint}>Esta reserva ya pasó (no se puede cancelar).</div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className={styles.panelFooter}>
          <p>© 2025 Hubora Coworking - Área de Usuarios</p>
        </div>
      </div>
    </div>
  );
}