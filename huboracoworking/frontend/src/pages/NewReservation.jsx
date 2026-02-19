import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "../components/NewReservation.module.css";

const OPEN_HOUR = 7;
const CLOSE_HOUR = 20;

const AUDITORIO_BLOCKS = [
  { key: "manana", label: "Mañana", start: "07:00", end: "13:30" },
  { key: "tarde", label: "Tarde", start: "13:30", end: "20:00" },
  { key: "jornada", label: "Jornada completa", start: "07:00", end: "20:00" }
];

const buildHourlySlots = () => {
  const slots = [];
  for (let h = OPEN_HOUR; h < CLOSE_HOUR; h++) {
    const start = String(h).padStart(2, "0") + ":00";
    const end = String(h + 1).padStart(2, "0") + ":00";
    slots.push({ start, end, label: `${start} - ${end}` });
  }
  return slots;
};

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
    acc[s.tipo] = acc[s.tipo] || [];
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

function readLocalReservations() {
  const raw = localStorage.getItem("reservas");
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeLocalReservations(reservas) {
  localStorage.setItem("reservas", JSON.stringify(reservas));
}

function isSlotTaken({ fecha, espacioId, start, end }, reservas) {
  return reservas.some((r) => {
    if (r.fecha !== fecha) return false;
    if (r.espacioId !== espacioId) return false;
    if (r.estado === "cancelada") return false;

    // solape simple: [start,end) con [r.horaInicio, r.horaFin)
    return !(end <= r.horaInicio || start >= r.horaFin);
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

  const [reservas, setReservas] = useState([]);

useEffect(() => {
  if (!selectedDate) return;

  const fetchReservas = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/reservations/by-date/${selectedDate}`
      );

      const data = await res.json();
      setReservas(data);
    } catch (error) {
      console.error("Error cargando reservas:", error);
    }
  };

  fetchReservas();
}, [selectedDate]);

  
  const hourlySlots = useMemo(() => buildHourlySlots(), []);
  const grouped = useMemo(() => groupByTipo(SPACES), []);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

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
    alert("Elegí un espacio y un horario.");
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

    const response = await fetch(
      "http://localhost:5000/api/reservations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(nueva)
      }
    );

    if (!response.ok) {
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
                      {hourlySlots.map((s) => {
                        const taken = isSlotTaken(
                          {
                            fecha: selectedDate,
                            espacioId: espacio.id,
                            start: s.start,
                            end: s.end
                          },
                          reservas
                        );

                        const isActive =
                          selected?.espacioId === espacio.id &&
                          selected?.start === s.start &&
                          selected?.end === s.end;

                        return (
                          <button
                            key={s.label}
                            type="button"
                            className={`${styles.slotChip} ${
                              isActive ? styles.activeChip : ""
                            }`}
                            disabled={taken}
                            onClick={() => handlePickSlot(espacio, s.start, s.end)}
                            title={taken ? "Ocupado" : "Disponible"}
                          >
                            {s.start}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SALA REUNION */}
            <div className={styles.contentItem}>
              <h3>Sala de Reuniones</h3>
              <div className={styles.spaceGrid}>
                {grouped.sala_reunion?.map((espacio) => (
                  <div key={espacio.id} className={styles.spaceCard}>
                    <div className={styles.spaceTitle}>{espacio.nombre}</div>
                    <div className={styles.slotWrap}>
                      {hourlySlots.map((s) => {
                        const taken = isSlotTaken(
                          {
                            fecha: selectedDate,
                            espacioId: espacio.id,
                            start: s.start,
                            end: s.end
                          },
                          reservas
                        );

                        const isActive =
                          selected?.espacioId === espacio.id &&
                          selected?.start === s.start &&
                          selected?.end === s.end;

                        return (
                          <button
                            key={s.label}
                            type="button"
                            className={`${styles.slotChip} ${
                              isActive ? styles.activeChip : ""
                            }`}
                            disabled={taken}
                            onClick={() => handlePickSlot(espacio, s.start, s.end)}
                          >
                            {s.start}
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
                      {hourlySlots.map((s) => {
                        const taken = isSlotTaken(
                          {
                            fecha: selectedDate,
                            espacioId: espacio.id,
                            start: s.start,
                            end: s.end
                          },
                          reservas
                        );

                        const isActive =
                          selected?.espacioId === espacio.id &&
                          selected?.start === s.start &&
                          selected?.end === s.end;

                        return (
                          <button
                            key={s.label}
                            type="button"
                            className={`${styles.slotChip} ${
                              isActive ? styles.activeChip : ""
                            }`}
                            disabled={taken}
                            onClick={() => handlePickSlot(espacio, s.start, s.end)}
                          >
                            {s.start}
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
                      {AUDITORIO_BLOCKS.map((b) => {
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
                            onClick={() => handlePickSlot(espacio, b.start, b.end)}
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

            {/* RESUMEN */}
            <div className={styles.summaryBar}>
              <div className={styles.summaryText}>
                {selected ? (
                  <>
                    <strong>{selected.espacioNombre}</strong> — {selected.start} a{" "}
                    {selected.end}
                  </>
                ) : (
                  <>Seleccioná un espacio y un horario.</>
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
              Te va a llegar un email con el resumen de la reserva y los pasos de
              pago para confirmarla.
              <br />
              Hasta entonces, quedará como <strong>Pendiente de pago</strong>.
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
