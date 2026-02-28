import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "../components/NewReservation.module.css";

const OPEN_HOUR = 7;
const CLOSE_HOUR = 20;

const BLOCKS = [
  { key: "manana", label: "Mañana (6h)", start: "07:00", end: "13:00" },
  { key: "tarde", label: "Tarde (6h)", start: "13:00", end: "19:00" },
  { key: "extendido", label: "Extendido (6h)", start: "14:00", end: "20:00" },
  { key: "jornada", label: "Jornada completa", start: "07:00", end: "20:00" },
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

function isWeekend(dateStr) {
  if (!dateStr) return false;
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  const day = dt.getDay(); // 0 = domingo, 6 = sábado
  return day === 0 || day === 6;
}

function isSlotTaken({ fecha, espacioId, start, end }, reservas) {
  const espacioKey = String(espacioId);

  return reservas.some((r) => {
    const rFecha = String(r.fecha).slice(0, 10);
    if (rFecha !== fecha) return false;

    const rEspacio = String(r.espacioId ?? r.espacio_id ?? "");
    if (rEspacio !== espacioKey) return false;

    if (r.estado === "cancelada") return false;

    const rStart = (r.horaInicio ?? r.hora_inicio ?? "").slice(0, 5);
    const rEnd = (r.horaFin ?? r.hora_fin ?? "").slice(0, 5);

    return !(end <= rStart || start >= rEnd);
  });
}

export default function NewReservation() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [selectedDate, setSelectedDate] = useState(params.get("fecha") || "");
  const [selected, setSelected] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [confirmInfo, setConfirmInfo] = useState({ plan: null, estado: null });

  const user = useMemo(() => getStoredUser(), []);
  const token = user?.token || null;
  const userPlan = (user?.plan_contratado || user?.plan || "").toLowerCase();

  // =========================
  // ESPACIOS (DB)
  // =========================
  const [spaces, setSpaces] = useState([]);
  const [loadingSpaces, setLoadingSpaces] = useState(false);

  const fetchSpaces = async () => {
    setLoadingSpaces(true);
    try {
      const res = await fetch("http://localhost:5000/api/spaces");
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.ok) {
        console.error("Error cargando espacios:", data);
        setSpaces([]);
        return;
      }

      const normalized = (data.spaces || []).map((s) => ({
        id: s.id,
        tipo: s.tipo,
        nombre: s.nombre,
        precio: s.precio,
      }));

      setSpaces(normalized);
    } catch (error) {
      console.error("Error cargando espacios:", error);
      setSpaces([]);
    } finally {
      setLoadingSpaces(false);
    }
  };

  useEffect(() => {
    fetchSpaces();
  }, []);

  const grouped = useMemo(() => groupByTipo(spaces), [spaces]);
  const [reservas, setReservas] = useState([]);

  const weekendSelected = useMemo(() => (selectedDate ? isWeekend(selectedDate) : false), [selectedDate]);

  useEffect(() => {
    if (!user || !token) navigate("/login");
  }, [user, token, navigate]);

  useEffect(() => {
    setSelected(null);
  }, [selectedDate]);


  useEffect(() => {
    if (!selectedDate || weekendSelected) {
      setReservas([]);
      return;
    }

    const fetchReservas = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/reservations/by-date/${selectedDate}`);
        const data = await res.json();
        setReservas(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error cargando reservas:", error);
        setReservas([]);
      }
    };

    fetchReservas();
  }, [selectedDate, weekendSelected]);

  const handlePickSlot = (espacio, block) => {
    setSelected({
      espacioId: espacio.id,
      espacioNombre: espacio.nombre,
      start: block.start,
      end: block.end,
      label: block.label,
    });
  };

  const toTime = (hhmm) => (hhmm?.length === 5 ? `${hhmm}:00` : hhmm);

  const handleConfirm = async () => {
    if (!selectedDate) {
      alert("Elegí una fecha primero.");
      return;
    }

    if (weekendSelected) {

      alert("No se pueden crear reservas los sábados ni domingos.");
      return;
    }

    if (!selected) {
      alert("Elegí un espacio y un bloque.");
      return;
    }

    const u = getStoredUser();
    const tk = u?.token;

    if (!tk) {
      localStorage.removeItem("user");
      alert("Tu sesión expiró. Volvé a iniciar sesión.");
      navigate("/login");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("http://localhost:5000/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tk}`,
        },
        body: JSON.stringify({
          fecha: selectedDate,
          espacioId: selected.espacioId,
          espacioNombre: selected.espacioNombre,
          horaInicio: toTime(selected.start),
          horaFin: toTime(selected.end),
        }),
      });

      if (response.status === 401) {
        localStorage.removeItem("user");
        alert("Tu sesión expiró. Volvé a iniciar sesión.");
        navigate("/login");
        return;
      }

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Error al guardar en la base de datos");
      }

      setConfirmInfo({
        plan: (data.plan || userPlan || "basico").toLowerCase(),
        estado: (data.estado || "pendiente_pago").toLowerCase(),
      });

      try {
        const r2 = await fetch(`http://localhost:5000/api/reservations/by-date/${selectedDate}`);
        const d2 = await r2.json().catch(() => []);
        setReservas(Array.isArray(d2) ? d2 : []);
      } catch {}

      setShowConfirm(true);
    } catch (e) {
      console.error(e);
      alert(e.message || "No se pudo confirmar la reserva.");
    } finally {
      setSaving(false);
    }
  };

  const titleDate = selectedDate ? formatDateForTitle(selectedDate) : "—";
  const today = new Date().toISOString().split("T")[0];

  const renderTipo = (tipo, titulo) => (
    <div className={styles.contentItem}>
      <h3>{titulo}</h3>

      <div className={styles.spaceGrid}>
        {grouped[tipo]?.map((espacio) => (
          <div key={espacio.id} className={styles.spaceCard}>
            <div className={styles.spaceTitle}>{espacio.nombre}</div>

            <div className={styles.slotWrap}>
              {BLOCKS.map((b) => {
                const taken =
                  selectedDate && !weekendSelected
                    ? isSlotTaken(
                        {
                          fecha: selectedDate,
                          espacioId: espacio.id,
                          start: b.start,
                          end: b.end,
                        },
                        reservas
                      )
                    : false;

                const isActive =
                  String(selected?.espacioId) === String(espacio.id) &&
                  selected?.start === b.start &&
                  selected?.end === b.end;

                return (
                  <button
                    key={b.key}
                    type="button"
                    className={`${styles.slotChip} ${isActive ? styles.activeChip : ""}`}
                    disabled={taken || weekendSelected}
                    onClick={() => handlePickSlot(espacio, b)}
                    title={
                      weekendSelected
                        ? "No disponible en fin de semana"
                        : taken
                        ? "Ocupado"
                        : `${b.label} (${b.start}–${b.end})`
                    }
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
  );

  const modalIsPremium = confirmInfo?.estado === "confirmada" || confirmInfo?.plan === "premium";

  return (
    <div className={styles.newResContainer}>
      <div className={styles.panelBox}>
        {/* =========================
            HEADER
            ========================= */}
        <div className={styles.panelHeader}>
          <h1 className={styles.panelTitle}>Nueva Reserva</h1>
          <p className={styles.welcomeMessage}>
            Disponibilidad para <strong>{titleDate}</strong> ({String(OPEN_HOUR).padStart(2, "0")}:00 a{" "}
            {String(CLOSE_HOUR).padStart(2, "0")}:00)
          </p>
        </div>

        {/* =========================
            FECHA
            ========================= */}
        <div className={styles.contentItem}>
          <h3>Elegí una fecha</h3>

          <div className={styles.formStack}>
            <div className={styles.formGroup}>
              <label>Fecha</label>
              <input
                className={styles.textInput}
                type="date"
                min={today}
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                }}
              />

              {weekendSelected && (
                <div className={styles.smallHint}>No se pueden reservar sábados ni domingos. Elegí un día de semana 🙏</div>
              )}
            </div>
          </div>
        </div>

        {/* =========================
            ESPACIOS + DISPONIBILIDAD
            ========================= */}
        {selectedDate && (
          <div className={styles.panelContentSingle}>
            {loadingSpaces ? (
              <div className={styles.contentItem}>
                <h3>Cargando espacios...</h3>
              </div>
            ) : spaces.length === 0 ? (
              <div className={styles.contentItem}>
                <h3>No hay espacios disponibles</h3>
                <p>Pedile al admin que cree/active espacios en el panel.</p>
              </div>
            ) : (
              <>
                {renderTipo("box_privado", "Box Privado")}
                {renderTipo("sala_reunion", "Sala de Reuniones")}
                {renderTipo("sala_conferencia", "Sala de Conferencia")}
                {renderTipo("auditorio", "Auditorio")}
              </>
            )}

            <div className={styles.summaryBar}>
              <div className={styles.summaryText}>
                {selected ? (
                  <>
                    <strong>{selected.espacioNombre}</strong> — {selected.label} ({selected.start} a {selected.end})
                  </>
                ) : (
                  <>Seleccioná un espacio y un bloque.</>
                )}
              </div>

              <button
                className={styles.actionButton}
                onClick={handleConfirm}
                disabled={!selected || saving || weekendSelected}
                title={weekendSelected ? "No se puede reservar fin de semana" : "Confirmar reserva"}
              >
                {saving ? "Confirmando..." : "Confirmar reserva"}
              </button>
            </div>

            <div className={styles.profileActions}>
              <button className={styles.actionButton} onClick={() => navigate("/usuario")}>
                Volver al panel
              </button>
            </div>
          </div>
        )}

        {/* =========================
            FOOTER
            ========================= */}
        <div className={styles.panelFooter}>
          <p>© 2025 Hubora Coworking - Área de Usuarios</p>
        </div>
      </div>

      {/* =========================
          MODAL CONFIRMACIÓN
          ========================= */}
      {showConfirm && (
        <div className={styles.modalOverlay} onClick={() => setShowConfirm(false)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>{modalIsPremium ? "Reserva confirmada ✅" : "Reserva registrada ✅"}</h2>

            {modalIsPremium ? (
              <p className={styles.modalText}>
                Tu plan <strong>Premium</strong> confirma la reserva automáticamente.
                <br />
                No necesitás realizar pago para usar el espacio.
              </p>
            ) : (
              <p className={styles.modalText}>
                Te va a llegar un email con el resumen de la reserva y los pasos de pago para confirmarla.
                <br />
                Hasta entonces quedará como <strong>Pendiente de pago</strong>.
              </p>
            )}

            <div className={styles.modalActions}>
              <button className={styles.actionButton} onClick={() => setShowConfirm(false)}>
                Seguir reservando
              </button>
              <button className={styles.logoutButton} onClick={() => navigate("/usuario/reservas")}>
                Ir a Mis Reservas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}