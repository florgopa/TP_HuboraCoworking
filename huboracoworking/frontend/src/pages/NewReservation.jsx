// src/pages/NewReservation.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "../components/NewReservation.module.css";

const API_BASE = "http://localhost:3000/api";

// Bloques fijos para TODOS los espacios
const BLOCKS = [
  { key: "manana", label: "Mañana", start: "07:00", end: "13:30" },
  { key: "tarde", label: "Tarde", start: "13:30", end: "20:00" },
  { key: "jornada", label: "Jornada completa", start: "07:00", end: "20:00" }
];

const SPACES = [
  ...Array.from({ length: 8 }, (_, i) => ({
    id: `box_${i + 1}`,
    tipo: "box_privado",
    nombre: `Box Privado ${i + 1}`
  })),
  ...Array.from({ length: 3 }, (_, i) => ({
    id: `reunion_${i + 1}`,
    tipo: "sala_reunion",
    nombre: `Sala de Reuniones ${i + 1}`
  })),
  ...Array.from({ length: 3 }, (_, i) => ({
    id: `conf_${i + 1}`,
    tipo: "sala_conferencia",
    nombre: `Sala de Conferencia ${i + 1}`
  })),
  {
    id: "auditorio_1",
    tipo: "auditorio",
    nombre: "Auditorio"
  }
];

function groupByTipo(spaces) {
  return spaces.reduce((acc, s) => {
    if (!acc[s.tipo]) acc[s.tipo] = [];
    acc[s.tipo].push(s);
    return acc;
  }, {});
}

function formatDateForTitle(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

function getStoredUser() {
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// ⚠️ ahora es robusto si reservas no es array
function isSlotTaken({ fecha, espacioId, start, end }, reservas) {
  if (!Array.isArray(reservas) || reservas.length === 0) return false;

  return reservas.some((r) => {
    if (r.fecha !== fecha) return false;
    if (r.espacio_id && r.espacio_id !== espacioId) return false;
    if (r.espacioId && r.espacioId !== espacioId) return false;
    if (r.estado === "cancelada") return false;

    const rStart = r.hora_inicio || r.horaInicio;
    const rEnd = r.hora_fin || r.horaFin;

    return !(end <= rStart || start >= rEnd);
  });
}

export default function NewReservation() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [selectedDate, setSelectedDate] = useState(params.get("fecha") || "");
  const [selected, setSelected] = useState(null); // { espacioId, espacioNombre, start, end }
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);

  const user = useMemo(() => getStoredUser(), []);
  const token = localStorage.getItem("token");
  const [reservas, setReservas] = useState([]);

  // Si no hay usuario logueado o token, lo saco
  useEffect(() => {
    if (!user || !token) {
      navigate("/login");
    }
  }, [user, token, navigate]);

  // Traer reservas de la fecha seleccionada
  useEffect(() => {
    if (!selectedDate || !token) return;

    const fetchReservas = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/reservations/by-date/${selectedDate}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (!res.ok) {
          console.error(
            "Error cargando reservas:",
            res.status,
            await res.text()
          );
          if (res.status === 401 || res.status === 403) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
          }
          setReservas([]); // dejamos array vacío para no romper .some
          return;
        }

        const data = await res.json();
        setReservas(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error cargando reservas:", error);
        setReservas([]);
      }
    };

    fetchReservas();
  }, [selectedDate, token, navigate]);

  const grouped = useMemo(() => groupByTipo(SPACES), []);

  // Si cambia la fecha, reseteo selección
  useEffect(() => {
    setSelected(null);
  }, [selectedDate]);

  const handlePickSlot = (espacio, start, end) => {
    setSelected({
      espacioId: espacio.id,
      espacioNombre: espacio.nombre,
      start,
      end
    });
  };

  const handleConfirm = async () => {
    if (!selectedDate) {
      alert("Elegí una fecha primero.");
      return;
    }
    if (!selected) {
      alert("Elegí un espacio y un bloque horario.");
      return;
    }

    setSaving(true);

    try {
      const id =
        globalThis.crypto?.randomUUID?.() ??
        `${Date.now()}-${Math.random().toString(16).slice(2)}`;

      const nueva = {
        id,
        usuarioEmail: user?.email || "",
        fecha: selectedDate,
        espacioId: selected.espacioId,
        espacioNombre: selected.espacioNombre,
        horaInicio: selected.start,
        horaFin: selected.end
      };

      const response = await fetch(`${API_BASE}/reservations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(nueva)
      });

      if (!response.ok) {
        console.error("Error al guardar reserva:", response.status);
        throw new Error("Error al guardar en la base de datos");
      }

      setShowConfirm(true);
    } catch (e) {
      console.error(e);
      alert("No se pudo confirmar la reserva.");
    } finally {
      setSaving(false);
    }
  };

  const titleDate = selectedDate ? formatDateForTitle(selectedDate) : "—";

  return (
    <div className={styles.newResContainer}>
      <div className={styles.panelBox}>
        <div className={styles.panelHeader}>
          <h1 className={styles.panelTitle}>Nueva Reserva</h1>
          <p className={styles.welcomeMessage}>
            Disponibilidad para <strong>{titleDate}</strong> (07:00 a 20:00)
          </p>
        </div>

        {/* FECHA */}
        <div className={styles.contentItem}>
          <h3>Elegí una fecha</h3>

          <div className={styles.formStack}>
            <div className={styles.formGroup}>
              <label>Fecha</label>
              <input
                className={styles.textInput}
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        {selectedDate && (
          <div className={styles.panelContentSingle}>
            {/* BOX PRIVADO */}
            <div className={styles.contentItem}>
              <h3>Box Privado</h3>
              <div className={styles.spaceGrid}>
                {grouped.box_privado?.map((espacio) => (
                  <div key={espacio.id} className={styles.spaceCard}>
                    <div className={styles.spaceTitle}>{espacio.nombre}</div>
                    <div className={styles.slotWrap}>
                      {BLOCKS.map((b) => {
                        const taken = isSlotTaken(
                          {
                            fecha: selectedDate,
                            espacioId: espacio.id,
                            start: b.start,
                            end: b.end
                          },
                          reservas
                        );

                        const isActive =
                          selected?.espacioId === espacio.id &&
                          selected?.start === b.start &&
                          selected?.end === b.end;

                        return (
                          <button
                            key={b.key}
                            type="button"
                            className={`${styles.slotChip} ${
                              isActive ? styles.activeChip : ""
                            }`}
                            disabled={taken}
                            onClick={() =>
                              handlePickSlot(espacio, b.start, b.end)
                            }
                            title={`${b.label} (${b.start}–${b.end})`}
                          >
                            {b.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SALA REUNIÓN */}
            <div className={styles.contentItem}>
              <h3>Sala de Reuniones</h3>
              <div className={styles.spaceGrid}>
                {grouped.sala_reunion?.map((espacio) => (
                  <div key={espacio.id} className={styles.spaceCard}>
                    <div className={styles.spaceTitle}>{espacio.nombre}</div>
                    <div className={styles.slotWrap}>
                      {BLOCKS.map((b) => {
                        const taken = isSlotTaken(
                          {
                            fecha: selectedDate,
                            espacioId: espacio.id,
                            start: b.start,
                            end: b.end
                          },
                          reservas
                        );

                        const isActive =
                          selected?.espacioId === espacio.id &&
                          selected?.start === b.start &&
                          selected?.end === b.end;

                        return (
                          <button
                            key={b.key}
                            type="button"
                            className={`${styles.slotChip} ${
                              isActive ? styles.activeChip : ""
                            }`}
                            disabled={taken}
                            onClick={() =>
                              handlePickSlot(espacio, b.start, b.end)
                            }
                            title={`${b.label} (${b.start}–${b.end})`}
                          >
                            {b.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SALA CONFERENCIA */}
            <div className={styles.contentItem}>
              <h3>Sala de Conferencia</h3>
              <div className={styles.spaceGrid}>
                {grouped.sala_conferencia?.map((espacio) => (
                  <div key={espacio.id} className={styles.spaceCard}>
                    <div className={styles.spaceTitle}>{espacio.nombre}</div>
                    <div className={styles.slotWrap}>
                      {BLOCKS.map((b) => {
                        const taken = isSlotTaken(
                          {
                            fecha: selectedDate,
                            espacioId: espacio.id,
                            start: b.start,
                            end: b.end
                          },
                          reservas
                        );

                        const isActive =
                          selected?.espacioId === espacio.id &&
                          selected?.start === b.start &&
                          selected?.end === b.end;

                        return (
                          <button
                            key={b.key}
                            type="button"
                            className={`${styles.slotChip} ${
                              isActive ? styles.activeChip : ""
                            }`}
                            disabled={taken}
                            onClick={() =>
                              handlePickSlot(espacio, b.start, b.end)
                            }
                            title={`${b.label} (${b.start}–${b.end})`}
                          >
                            {b.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AUDITORIO */}
            <div className={styles.contentItem}>
              <h3>Auditorio</h3>
              <div className={styles.spaceGrid}>
                {grouped.auditorio?.map((espacio) => (
                  <div key={espacio.id} className={styles.spaceCard}>
                    <div className={styles.spaceTitle}>{espacio.nombre}</div>

                    <div className={styles.slotWrap}>
                      {BLOCKS.map((b) => {
                        const taken = isSlotTaken(
                          {
                            fecha: selectedDate,
                            espacioId: espacio.id,
                            start: b.start,
                            end: b.end
                          },
                          reservas
                        );

                        const isActive =
                          selected?.espacioId === espacio.id &&
                          selected?.start === b.start &&
                          selected?.end === b.end;

                        return (
                          <button
                            key={b.key}
                            type="button"
                            className={`${styles.slotChip} ${
                              isActive ? styles.activeChip : ""
                            }`}
                            disabled={taken}
                            onClick={() =>
                              handlePickSlot(espacio, b.start, b.end)
                            }
                            title={`${b.label} (${b.start}–${b.end})`}
                          >
                            {b.label}
                          </button>
                        );
                      })}
                    </div>

                    <div className={styles.smallHint}>
                      Bloques: mañana / tarde / jornada completa
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RESUMEN + CONFIRMAR */}
            <div className={styles.summaryBar}>
              <div className={styles.summaryText}>
                {selected ? (
                  <>
                    <strong>{selected.espacioNombre}</strong> —{" "}
                    {selected.start} a {selected.end}
                  </>
                ) : (
                  <>Seleccioná un espacio y un bloque horario.</>
                )}
              </div>

              <button
                className={styles.actionButton}
                onClick={handleConfirm}
                disabled={!selected || saving}
              >
                {saving ? "Confirmando..." : "Confirmar reserva"}
              </button>
            </div>

            <div className={styles.profileActions}>
              <button
                className={styles.actionButton}
                onClick={() => navigate("/usuario")}
              >
                Volver al panel
              </button>
            </div>
          </div>
        )}

        <div className={styles.panelFooter}>
          <p>© 2025 Hubora Coworking - Área de Usuarios</p>
        </div>
      </div>

      {/* Modal */}
      {showConfirm && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowConfirm(false)}
        >
          <div
            className={styles.modalBox}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className={styles.modalTitle}>Reserva registrada ✅</h2>
            <p className={styles.modalText}>
              Te va a llegar un email con el resumen de la reserva y los pasos
              de pago para confirmarla.
              <br />
              Hasta entonces, quedará como{" "}
              <strong>Pendiente de pago</strong>.
            </p>

            <div className={styles.modalActions}>
              <button
                className={styles.actionButton}
                onClick={() => setShowConfirm(false)}
              >
                Seguir reservando
              </button>
              <button
                className={styles.logoutButton}
                onClick={() => navigate("/usuario/reservas")}
              >
                Ir a Mis Reservas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}