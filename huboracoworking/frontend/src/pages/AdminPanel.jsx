import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../components/AdminPanel.module.css";

function getStoredUser() {
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

const formatHora = (hora) => (hora ? String(hora).slice(0, 5) : "");

const formatFecha = (fecha) => {
  const d = new Date(fecha);
  return d.toLocaleDateString("es-AR", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const estadoLabel = (estado) => (estado ? String(estado).replaceAll("_", " ") : "");

const emptyEditForm = {
  // usuario
  email: "",
  role: "cliente",
  activo: 1,
  plan_contratado: "basico",

  // perfil
  nombre: "",
  apellido: "",
  direccion: "",
  telefono: "",
  contacto_emergencia_nombre: "",
  contacto_emergencia_telefono: "",
  tiene_mascota: 0,
  mascota_nombre: "",
  mascota_tipo: "otro",
  locker_numero: "", // string para input
};

const emptySpaceForm = {
  tipo: "box_privado",
  nombre: "",
  precio: "",
  activo: 1,
};

function Pagination({ page, totalPages, onPage }) {
  if (totalPages <= 1) return null;

  const clamp = (n) => Math.max(1, Math.min(totalPages, n));

  const current = clamp(page);
  const windowPages = [];
  for (let p = Math.max(1, current - 2); p <= Math.min(totalPages, current + 2); p++) {
    windowPages.push(p);
  }

  const go = (p) => onPage(clamp(p));

  return (
    <div className={styles.paginationWrap}>
      <button className={styles.filterChip} type="button" onClick={() => go(1)} disabled={current === 1}>
        «
      </button>
      <button className={styles.filterChip} type="button" onClick={() => go(current - 1)} disabled={current === 1}>
        ‹
      </button>

      {current > 3 && (
        <>
          <button className={styles.filterChip} type="button" onClick={() => go(1)}>
            1
          </button>
          <span className={styles.paginationDots}>…</span>
        </>
      )}

      {windowPages.map((p) => (
        <button
          key={p}
          className={`${styles.filterChip} ${p === current ? styles.filterChipActive : ""}`}
          type="button"
          onClick={() => go(p)}
        >
          {p}
        </button>
      ))}

      {current < totalPages - 2 && (
        <>
          <span className={styles.paginationDots}>…</span>
          <button className={styles.filterChip} type="button" onClick={() => go(totalPages)}>
            {totalPages}
          </button>
        </>
      )}

      <button className={styles.filterChip} type="button" onClick={() => go(current + 1)} disabled={current === totalPages}>
        ›
      </button>
      <button className={styles.filterChip} type="button" onClick={() => go(totalPages)} disabled={current === totalPages}>
        »
      </button>
    </div>
  );
}

export default function AdminPanel() {
  const navigate = useNavigate();

  const user = useMemo(() => getStoredUser(), []);
  const token = user?.token || null;

  const [open, setOpen] = useState({
    reservas: true,
    usuarios: false,
    espacios: false,
    reportes: false,
  });

  // =========================
  // RESERVAS
  // =========================
  const [loadingRes, setLoadingRes] = useState(true);
  const [reservas, setReservas] = useState([]);
  const [filterEstado, setFilterEstado] = useState("pendiente_pago");
  const [q, setQ] = useState("");
  const [savingId, setSavingId] = useState(null);

  const RES_PER_PAGE = 10;
  const [resPage, setResPage] = useState(1);

  // =========================
  // USUARIOS
  // =========================
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [users, setUsers] = useState([]);
  const [userQ, setUserQ] = useState("");
  const [filterRol, setFilterRol] = useState("todos");
  const [filterPlan, setFilterPlan] = useState("todos");
  const [savingUserId, setSavingUserId] = useState(null);

  const USERS_PER_PAGE = 10;
  const [usersPage, setUsersPage] = useState(1);

  // =========================
  // ESPACIOS (CRUD)
  // =========================
  const [loadingSpaces, setLoadingSpaces] = useState(false);
  const [spaces, setSpaces] = useState([]);
  const [spaceQ, setSpaceQ] = useState("");
  const [newSpace, setNewSpace] = useState(emptySpaceForm);
  const [savingSpaceId, setSavingSpaceId] = useState(null);

  const SPACES_PER_PAGE = 10;
  const [spacesPage, setSpacesPage] = useState(1);

 // =========================
// REPORTES / ESTADÍSTICAS
// =========================
const [loadingReports, setLoadingReports] = useState(false);
const [kpis, setKpis] = useState(null);
const [plansEstimate, setPlansEstimate] = useState(null);
const [topSpaces, setTopSpaces] = useState([]);
const [months, setMonths] = useState(6);
const [reservasByMonth, setReservasByMonth] = useState([]);

const money = (n) =>
  (Number(n) || 0).toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });

  // =========================
  // MODAL EDICIÓN COMPLETA (Usuarios)
  // =========================
  const [editOpen, setEditOpen] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [editForm, setEditForm] = useState(emptyEditForm);
  const [savingEdit, setSavingEdit] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // =========================
  // HELPERS de sesión
  // =========================
  const handleAuthErrors = async (res) => {
    if (res.status === 401) {
      localStorage.removeItem("user");
      navigate("/login");
      return true;
    }
    if (res.status === 403) {
      navigate("/usuario");
      return true;
    }
    return false;
  };

  // =========================
  // RESERVAS: fetch
  // =========================
  const fetchAllReservations = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoadingRes(true);

      const res = await fetch("http://localhost:5000/api/admin/reservations", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (await handleAuthErrors(res)) return;

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        console.error("Error admin reservas:", data);
        setReservas([]);
        return;
      }

      setReservas(Array.isArray(data.reservations) ? data.reservations : []);
    } catch (e) {
      console.error(e);
      setReservas([]);
    } finally {
      setLoadingRes(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchAllReservations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const confirmPayment = async (id) => {
    if (!token) return;

    const ok = window.confirm("¿Confirmar pago y marcar como CONFIRMADA?");
    if (!ok) return;

    setSavingId(id);
    try {
      const res = await fetch(`http://localhost:5000/api/admin/reservations/${id}/confirm`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (await handleAuthErrors(res)) return;

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        alert(data.message || "No se pudo confirmar.");
        return;
      }

      setReservas((prev) => prev.map((r) => (r.id === id ? { ...r, estado: "confirmada" } : r)));
      alert("Pago confirmado");
    } catch (e) {
      console.error(e);
      alert("Error al conectar con el servidor.");
    } finally {
      setSavingId(null);
    }
  };

  const cancelReservationAdmin = async (id) => {
    if (!token) return;

    const ok = window.confirm("¿Cancelar esta reserva?");
    if (!ok) return;

    setSavingId(id);
    try {
      const res = await fetch(`http://localhost:5000/api/admin/reservations/${id}/cancel`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (await handleAuthErrors(res)) return;

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        alert(data.message || "No se pudo cancelar.");
        return;
      }

      setReservas((prev) => prev.map((r) => (r.id === id ? { ...r, estado: "cancelada" } : r)));
      alert("Reserva cancelada");
    } catch (e) {
      console.error(e);
      alert("Error al conectar con el servidor.");
    } finally {
      setSavingId(null);
    }
  };

  const filteredReservas = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return reservas.filter((r) => {
      const okEstado = filterEstado === "todas" ? true : (r.estado || "") === filterEstado;
      const okSearch = !qq ? true : String(r.usuario_email || "").toLowerCase().includes(qq);
      return okEstado && okSearch;
    });
  }, [reservas, filterEstado, q]);

  const counts = useMemo(() => {
    const c = { todas: reservas.length, pendiente_pago: 0, confirmada: 0, cancelada: 0 };
    for (const r of reservas) {
      if (r.estado === "pendiente_pago") c.pendiente_pago++;
      else if (r.estado === "confirmada") c.confirmada++;
      else if (r.estado === "cancelada") c.cancelada++;
    }
    return c;
  }, [reservas]);

  useEffect(() => {
    setResPage(1);
  }, [filterEstado, q]);

  const resTotalPages = Math.max(1, Math.ceil(filteredReservas.length / RES_PER_PAGE));
  useEffect(() => {
    setResPage((p) => Math.min(p, resTotalPages));
  }, [resTotalPages]);

  const reservasPageSlice = useMemo(() => {
    const start = (resPage - 1) * RES_PER_PAGE;
    return filteredReservas.slice(start, start + RES_PER_PAGE);
  }, [filteredReservas, resPage]);


  // USUARIOS: fetch + patch

  const fetchUsers = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    setLoadingUsers(true);
    try {
      const res = await fetch("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (await handleAuthErrors(res)) return;

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        console.error("Error admin users:", data);
        setUsers([]);
        return;
      }

      setUsers(Array.isArray(data.users) ? data.users : []);
    } catch (e) {
      console.error(e);
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  const patchUser = async (id, body) => {
    if (!token) return;

    setSavingUserId(id);
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (await handleAuthErrors(res)) return;

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        alert(data.message || "No se pudo guardar el usuario.");
        return;
      }

      await fetchUsers();
    } catch (e) {
      console.error(e);
      alert("Error al conectar con el servidor.");
    } finally {
      setSavingUserId(null);
    }
  };

  const filteredUsers = useMemo(() => {
    const qq = userQ.trim().toLowerCase();
    return users.filter((u) => {
      const email = String(u.email || "").toLowerCase();
      const nombre = String(u.nombre || "").toLowerCase();
      const apellido = String(u.apellido || "").toLowerCase();

      const okSearch = !qq ? true : email.includes(qq) || nombre.includes(qq) || apellido.includes(qq);
      const okRol = filterRol === "todos" ? true : (u.role || "") === filterRol;
      const okPlan = filterPlan === "todos" ? true : (u.plan_contratado || "basico") === filterPlan;

      return okSearch && okRol && okPlan;
    });
  }, [users, userQ, filterRol, filterPlan]);

  useEffect(() => {
    setUsersPage(1);
  }, [userQ, filterRol, filterPlan]);

  const usersTotalPages = Math.max(1, Math.ceil(filteredUsers.length / USERS_PER_PAGE));
  useEffect(() => {
    setUsersPage((p) => Math.min(p, usersTotalPages));
  }, [usersTotalPages]);

  const usersPageSlice = useMemo(() => {
    const start = (usersPage - 1) * USERS_PER_PAGE;
    return filteredUsers.slice(start, start + USERS_PER_PAGE);
  }, [filteredUsers, usersPage]);


  // MODAL EDICIÓN COMPLETA (Usuarios)
  const openEditModal = (u) => {
    setEditUserId(u.id);
    setEditForm({
      ...emptyEditForm,
      email: u.email || "",
      role: u.role || "cliente",
      activo: u.activo ? 1 : 0,
      plan_contratado: u.plan_contratado || "basico",

      nombre: u.nombre || "",
      apellido: u.apellido || "",
      direccion: u.direccion || "",
      telefono: u.telefono || "",
      contacto_emergencia_nombre: u.contacto_emergencia_nombre || "",
      contacto_emergencia_telefono: u.contacto_emergencia_telefono || "",
      tiene_mascota: u.tiene_mascota ? 1 : 0,
      mascota_nombre: u.mascota_nombre || "",
      mascota_tipo: u.mascota_tipo || "otro",
      locker_numero: u.locker_numero ?? "",
    });
    setEditOpen(true);
  };

  const closeEditModal = () => {
    setEditOpen(false);
    setEditUserId(null);
    setEditForm(emptyEditForm);
    setSavingEdit(false);
  };

  const saveEditModal = async () => {
    if (!token || !editUserId) return;

    const lockerStr = String(editForm.locker_numero ?? "").trim();
    const lockerValue = lockerStr === "" ? null : Number(lockerStr);
    if (lockerValue !== null && Number.isNaN(lockerValue)) {
      alert("Locker inválido (debe ser número o vacío).");
      return;
    }

    if (!["basico", "premium"].includes(editForm.plan_contratado)) {
      alert("Plan inválido.");
      return;
    }
    if (!["admin", "cliente"].includes(editForm.role)) {
      alert("Rol inválido.");
      return;
    }

    const tieneMascota = editForm.tiene_mascota ? 1 : 0;

    const body = {
      email: editForm.email,
      role: editForm.role,
      activo: editForm.activo ? 1 : 0,
      plan_contratado: editForm.plan_contratado,

      nombre: editForm.nombre,
      apellido: editForm.apellido,
      direccion: editForm.direccion,
      telefono: editForm.telefono,
      contacto_emergencia_nombre: editForm.contacto_emergencia_nombre,
      contacto_emergencia_telefono: editForm.contacto_emergencia_telefono,
      tiene_mascota: tieneMascota,
      mascota_nombre: tieneMascota ? editForm.mascota_nombre : null,
      mascota_tipo: tieneMascota ? editForm.mascota_tipo : null,
      locker_numero: lockerValue,
    };

    setSavingEdit(true);
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${editUserId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (await handleAuthErrors(res)) return;

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        alert(data.message || "No se pudo guardar.");
        return;
      }

      await fetchUsers();
      alert("Usuario actualizado ✅");
      closeEditModal();
    } catch (e) {
      console.error(e);
      alert("Error al conectar con el servidor.");
    } finally {
      setSavingEdit(false);
    }
  };

  // =========================
  // ESPACIOS: fetch + CRUD
  // =========================
  const fetchSpaces = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    setLoadingSpaces(true);
    try {
      const res = await fetch("http://localhost:5000/api/admin/spaces", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (await handleAuthErrors(res)) return;

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        console.error("Error admin spaces:", data);
        setSpaces([]);
        return;
      }

      setSpaces(Array.isArray(data.spaces) ? data.spaces : []);
    } catch (e) {
      console.error(e);
      setSpaces([]);
    } finally {
      setLoadingSpaces(false);
    }
  };

  const createSpace = async () => {
    if (!token) return;

    const nombre = newSpace.nombre.trim();
    const tipo = newSpace.tipo;
    const precioStr = String(newSpace.precio ?? "").trim();
    const precio = precioStr === "" ? 0 : Number(precioStr);

    if (!nombre) {
      alert("Poné un nombre para el espacio.");
      return;
    }
    if (Number.isNaN(precio) || precio < 0) {
      alert("Precio inválido.");
      return;
    }

    setSavingSpaceId("new");
    try {
      const res = await fetch("http://localhost:5000/api/admin/spaces", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tipo,
          nombre,
          precio,
          activo: newSpace.activo ? 1 : 0,
        }),
      });

      if (await handleAuthErrors(res)) return;

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        alert(data.message || "No se pudo crear el espacio.");
        return;
      }

      setNewSpace(emptySpaceForm);
      await fetchSpaces();
      alert("Espacio creado");
    } catch (e) {
      console.error(e);
      alert("Error al conectar con el servidor.");
    } finally {
      setSavingSpaceId(null);
    }
  };

  const patchSpace = async (id, body) => {
    if (!token) return;

    setSavingSpaceId(id);
    try {
      const res = await fetch(`http://localhost:5000/api/admin/spaces/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (await handleAuthErrors(res)) return;

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        alert(data.message || "No se pudo guardar el espacio.");
        return;
      }

      await fetchSpaces();
    } catch (e) {
      console.error(e);
      alert("Error al conectar con el servidor.");
    } finally {
      setSavingSpaceId(null);
    }
  };

  const filteredSpaces = useMemo(() => {
    const qq = spaceQ.trim().toLowerCase();
    return spaces.filter((s) => {
      if (!qq) return true;
      const nombre = String(s.nombre || "").toLowerCase();
      const tipo = String(s.tipo || "").toLowerCase();
      return nombre.includes(qq) || tipo.includes(qq);
    });
  }, [spaces, spaceQ]);

  useEffect(() => {
    setSpacesPage(1);
  }, [spaceQ]);

  const spacesTotalPages = Math.max(1, Math.ceil(filteredSpaces.length / SPACES_PER_PAGE));
  useEffect(() => {
    setSpacesPage((p) => Math.min(p, spacesTotalPages));
  }, [spacesTotalPages]);

  const spacesPageSlice = useMemo(() => {
    const start = (spacesPage - 1) * SPACES_PER_PAGE;
    return filteredSpaces.slice(start, start + SPACES_PER_PAGE);
  }, [filteredSpaces, spacesPage]);

  // =========================
  // REPORTES: fetch
  // =========================
  const fetchReports = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    setLoadingReports(true);
    try {

      const [rKpis, rPlans, rTop, rByMonth] = await Promise.all([
        fetch("http://localhost:5000/api/admin/reports/kpis", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("http://localhost:5000/api/admin/reports/plans-estimate", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("http://localhost:5000/api/admin/reports/top-spaces?limit=5&excludeCancelled=1", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`http://localhost:5000/api/admin/reports/reservations-by-month?months=${months}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (await handleAuthErrors(rKpis)) return;

      const dKpis = await rKpis.json().catch(() => ({}));
      const dPlans = await rPlans.json().catch(() => ({}));
      const dTop = await rTop.json().catch(() => ({}));
      const dByMonth = await rByMonth.json().catch(() => ({}));

      setKpis(dKpis?.ok ? dKpis : null);
      setPlansEstimate(dPlans?.ok ? dPlans : null);
      setTopSpaces(dTop?.ok ? (dTop.data || []) : []);
      setReservasByMonth(dByMonth?.ok ? (dByMonth.data || []) : []);
    } catch (e) {
      console.error(e);
      setKpis(null);
      setPlansEstimate(null);
      setTopSpaces([]);
      setReservasByMonth([]);
    } finally {
      setLoadingReports(false);
    }
  };

  useEffect(() => {

    if (open.reportes) fetchReports();
 
  }, [months]);

  // =========================
  // Toggle secciones
  // =========================
  const toggle = (key) =>
    setOpen((p) => {
      const next = { ...p, [key]: !p[key] };

     
      if (key === "usuarios" && !p.usuarios) fetchUsers();
      if (key === "espacios" && !p.espacios) fetchSpaces();
      if (key === "reportes" && !p.reportes) fetchReports();

      return next;
    });

  // =========================
  // UI
  // =========================
  return (
    <div className={styles.adminPanelContainer}>
      <div className={styles.panelBox}>
        {/* ===== MODULO HEADER: START ===== */}
        <div className={styles.panelHeader}>
          <h1 className={styles.panelTitle}>Panel de Administrador</h1>
          <p className={styles.welcomeMessage}>Centro de control de Hubora Coworking.</p>
        </div>
        {/* MODULO HEADER END */}

        {/* MODULO GRID 2 COLUMNAS*/}
        <div className={styles.panelContent}>
          {/*COLUMNA IZQUIERDA (Reservas + Usuarios)*/}
          <div style={{ display: "flex", flexDirection: "column", gap: 34 }}>
            {/*  MODULO RESERVAS*/}
            <div className={styles.contentItem}>
              <button
                type="button"
                className={styles.sectionToggle}
                onClick={() => toggle("reservas")}
                aria-expanded={open.reservas}
              >
                <h3>Reservas</h3>
                <span>{open.reservas ? "—" : "+"}</span>
              </button>

              {open.reservas && (
                <>
                  <div className={styles.adminToolsRow}>
                    <div className={styles.filterBar}>
                      <button
                        type="button"
                        className={`${styles.filterChip} ${filterEstado === "todas" ? styles.filterChipActive : ""}`}
                        onClick={() => setFilterEstado("todas")}
                      >
                        Todas ({counts.todas})
                      </button>

                      <button
                        type="button"
                        className={`${styles.filterChip} ${
                          filterEstado === "pendiente_pago" ? styles.filterChipActive : ""
                        }`}
                        onClick={() => setFilterEstado("pendiente_pago")}
                      >
                        Pendientes ({counts.pendiente_pago})
                      </button>

                      <button
                        type="button"
                        className={`${styles.filterChip} ${filterEstado === "confirmada" ? styles.filterChipActive : ""}`}
                        onClick={() => setFilterEstado("confirmada")}
                      >
                        Confirmadas ({counts.confirmada})
                      </button>

                      <button
                        type="button"
                        className={`${styles.filterChip} ${filterEstado === "cancelada" ? styles.filterChipActive : ""}`}
                        onClick={() => setFilterEstado("cancelada")}
                      >
                        Canceladas ({counts.cancelada})
                      </button>
                    </div>

                    <div className={styles.searchWrap}>
                      <input
                        className={styles.textInput}
                        placeholder="Buscar por email..."
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                      />
                      <button className={styles.actionButton} onClick={fetchAllReservations} disabled={loadingRes}>
                        {loadingRes ? "Actualizando..." : "Actualizar"}
                      </button>
                    </div>
                  </div>

                  {loadingRes ? (
                    <div className={styles.loading}>Cargando reservas...</div>
                  ) : filteredReservas.length === 0 ? (
                    <div className={styles.emptyState}>
                      <h3>No hay reservas para este filtro</h3>
                      <p>Probá con “Todas” o cambiá el estado.</p>
                    </div>
                  ) : (
                    <>
                      <div className={styles.tableWrap}>
                        <table className={styles.table}>
                          <thead>
                            <tr>
                              <th>Email</th>
                              <th>Fecha</th>
                              <th>Espacio</th>
                              <th>Horario</th>
                              <th>Estado</th>
                              <th>Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reservasPageSlice.map((r) => {
                              const canConfirm = r.estado === "pendiente_pago";
                              const canCancel = r.estado !== "cancelada";

                              return (
                                <tr key={r.id}>
                                  <td>{r.usuario_email}</td>
                                  <td>{formatFecha(r.fecha)}</td>
                                  <td>{r.espacio_nombre}</td>
                                  <td>
                                    {formatHora(r.hora_inicio)} - {formatHora(r.hora_fin)}
                                  </td>
                                  <td>
                                    <span
                                      className={`${styles.badge} ${
                                        r.estado === "confirmada"
                                          ? styles.badgeOk
                                          : r.estado === "pendiente_pago"
                                          ? styles.badgeWarn
                                          : styles.badgeBad
                                      }`}
                                    >
                                      {estadoLabel(r.estado)}
                                    </span>
                                  </td>
                                  <td className={styles.actionsCell}>
                                    <button
                                      className={styles.actionButton}
                                      onClick={() => confirmPayment(r.id)}
                                      disabled={!canConfirm || savingId === r.id}
                                    >
                                      {savingId === r.id ? "Procesando..." : "Confirmar pago"}
                                    </button>

                                    <button
                                      className={styles.logoutButton}
                                      onClick={() => cancelReservationAdmin(r.id)}
                                      disabled={!canCancel || savingId === r.id}
                                    >
                                      Cancelar
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      <Pagination page={resPage} totalPages={resTotalPages} onPage={setResPage} />
                    </>
                  )}
                </>
              )}
            </div>
            {/* MODULO RESERVAS END*/}

            {/* MODULO USUARIOS */}
            <div className={styles.contentItem}>
              <button
                type="button"
                className={styles.sectionToggle}
                onClick={() => toggle("usuarios")}
                aria-expanded={open.usuarios}
              >
                <h3>Gestión de Usuarios</h3>
                <span>{open.usuarios ? "—" : "+"}</span>
              </button>

              {open.usuarios && (
                <>
                  <div className={styles.adminToolsRow}>
                    <div className={styles.filterBar}>
                      <button
                        type="button"
                        className={`${styles.filterChip} ${filterRol === "todos" ? styles.filterChipActive : ""}`}
                        onClick={() => setFilterRol("todos")}
                      >
                        Todos
                      </button>
                      <button
                        type="button"
                        className={`${styles.filterChip} ${filterRol === "cliente" ? styles.filterChipActive : ""}`}
                        onClick={() => setFilterRol("cliente")}
                      >
                        Clientes
                      </button>
                      <button
                        type="button"
                        className={`${styles.filterChip} ${filterRol === "admin" ? styles.filterChipActive : ""}`}
                        onClick={() => setFilterRol("admin")}
                      >
                        Admins
                      </button>

                      <button
                        type="button"
                        className={`${styles.filterChip} ${filterPlan === "todos" ? styles.filterChipActive : ""}`}
                        onClick={() => setFilterPlan("todos")}
                      >
                        Todos los planes
                      </button>
                      <button
                        type="button"
                        className={`${styles.filterChip} ${filterPlan === "basico" ? styles.filterChipActive : ""}`}
                        onClick={() => setFilterPlan("basico")}
                      >
                        Básico
                      </button>
                      <button
                        type="button"
                        className={`${styles.filterChip} ${filterPlan === "premium" ? styles.filterChipActive : ""}`}
                        onClick={() => setFilterPlan("premium")}
                      >
                        Premium
                      </button>
                    </div>

                    <div className={styles.searchWrap}>
                      <input
                        className={styles.textInput}
                        placeholder="Buscar por email / nombre / apellido..."
                        value={userQ}
                        onChange={(e) => setUserQ(e.target.value)}
                      />
                      <button className={styles.actionButton} onClick={fetchUsers} disabled={loadingUsers}>
                        {loadingUsers ? "Actualizando..." : "Actualizar"}
                      </button>
                    </div>
                  </div>

                  {loadingUsers ? (
                    <div className={styles.loading}>Cargando usuarios...</div>
                  ) : filteredUsers.length === 0 ? (
                    <div className={styles.emptyState}>
                      <h3>No hay usuarios</h3>
                      <p>Probá ajustando filtros o actualizando.</p>
                    </div>
                  ) : (
                    <>
                      <div className={styles.tableWrap}>
                        <table className={styles.table}>
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Email</th>
                              <th>Rol</th>
                              <th>Activo</th>
                              <th>Plan</th>
                              <th>Locker</th>
                              <th>Acciones</th>
                            </tr>
                          </thead>

                          <tbody>
                            {usersPageSlice.map((u) => {
                              const busy = savingUserId === u.id;

                              return (
                                <tr key={u.id}>
                                  <td>{u.id}</td>
                                  <td>{u.email}</td>
                                  <td>{u.role}</td>
                                  <td>{u.activo ? "Sí" : "No"}</td>

                                  <td>
                                    <select
                                      value={u.plan_contratado || "basico"}
                                      onChange={(e) => patchUser(u.id, { plan_contratado: e.target.value })}
                                      disabled={busy}
                                      className={styles.textInput}
                                      style={{ width: 160 }}
                                    >
                                      <option value="basico">Básico</option>
                                      <option value="premium">Premium</option>
                                    </select>
                                  </td>

                                  <td>
                                    <input
                                      className={styles.textInput}
                                      style={{ width: 120 }}
                                      value={u.locker_numero ?? ""}
                                      placeholder="Ej: 12"
                                      disabled={busy}
                                      onChange={(e) => {
                                        const locker = e.target.value;
                                        setUsers((prev) =>
                                          prev.map((x) => (x.id === u.id ? { ...x, locker_numero: locker } : x))
                                        );
                                      }}
                                      onBlur={(e) => {
                                        const v = e.target.value.trim();
                                        if (v !== "" && Number.isNaN(Number(v))) {
                                          alert("Locker inválido.");
                                          fetchUsers();
                                          return;
                                        }
                                        patchUser(u.id, { locker_numero: v === "" ? null : Number(v) });
                                      }}
                                    />
                                  </td>

                                  <td className={styles.actionsCell}>
                                    <button
                                      className={styles.actionButton}
                                      disabled={busy}
                                      onClick={() => patchUser(u.id, { activo: u.activo ? 0 : 1 })}
                                    >
                                      {busy ? "Guardando..." : u.activo ? "Desactivar" : "Activar"}
                                    </button>

                                    <button
                                      className={styles.actionButton}
                                      disabled={busy}
                                      onClick={() => patchUser(u.id, { role: u.role === "admin" ? "cliente" : "admin" })}
                                    >
                                      {u.role === "admin" ? "Hacer cliente" : "Hacer admin"}
                                    </button>

                                    <button className={styles.actionButton} disabled={busy} onClick={() => openEditModal(u)}>
                                      Editar
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      <Pagination page={usersPage} totalPages={usersTotalPages} onPage={setUsersPage} />
                    </>
                  )}
                </>
              )}
            </div>
            {/*MODULO USUARIOS END*/}
          </div>
          {/*COLUMNA IZQUIERDA END*/}

          {/* COLUMNA DERECHA (Espacios + Reportes) */}
          <div style={{ display: "flex", flexDirection: "column", gap: 34 }}>

            {/*MODULO ESPACIOS*/}
            <div className={styles.contentItem}>
              <button
                type="button"
                className={styles.sectionToggle}
                onClick={() => toggle("espacios")}
                aria-expanded={open.espacios}
              >
                <h3>Gestión de Espacios</h3>
                <span>{open.espacios ? "—" : "+"}</span>
              </button>

              {open.espacios && (
                <>
                  <div className={styles.adminToolsRow}>
                    <div className={styles.searchWrap}>
                      <input
                        className={styles.textInput}
                        placeholder="Buscar por nombre o tipo..."
                        value={spaceQ}
                        onChange={(e) => setSpaceQ(e.target.value)}
                      />
                      <button className={styles.actionButton} onClick={fetchSpaces} disabled={loadingSpaces}>
                        {loadingSpaces ? "Actualizando..." : "Actualizar"}
                      </button>
                    </div>
                  </div>

                  {/* Crear espacio */}
                  <div className={styles.adminToolsRow} style={{ marginTop: 10, gap: 10, flexWrap: "wrap" }}>
                    <select
                      className={styles.textInput}
                      style={{ width: 220 }}
                      value={newSpace.tipo}
                      onChange={(e) => setNewSpace((p) => ({ ...p, tipo: e.target.value }))}
                      disabled={savingSpaceId === "new"}
                    >
                      <option value="box_privado">Box privado</option>
                      <option value="sala_reunion">Sala reunión</option>
                      <option value="sala_conferencia">Sala conferencia</option>
                      <option value="auditorio">Auditorio</option>
                    </select>

                    <input
                      className={styles.textInput}
                      style={{ width: 260 }}
                      placeholder="Nombre (ej: Sala 2)"
                      value={newSpace.nombre}
                      onChange={(e) => setNewSpace((p) => ({ ...p, nombre: e.target.value }))}
                      disabled={savingSpaceId === "new"}
                    />

                    <input
                      className={styles.textInput}
                      style={{ width: 160 }}
                      placeholder="Precio"
                      value={newSpace.precio}
                      onChange={(e) => setNewSpace((p) => ({ ...p, precio: e.target.value }))}
                      disabled={savingSpaceId === "new"}
                    />

                    <select
                      className={styles.textInput}
                      style={{ width: 100 }}
                      value={newSpace.activo ? 1 : 0}
                      onChange={(e) => setNewSpace((p) => ({ ...p, activo: Number(e.target.value) }))}
                      disabled={savingSpaceId === "new"}
                    >
                      <option value={1}>Activo</option>
                      <option value={0}>Inactivo</option>
                    </select>

                    <button className={styles.actionButton} onClick={createSpace} disabled={savingSpaceId === "new"}>
                      {savingSpaceId === "new" ? "Creando..." : "Crear"}
                    </button>
                  </div>

                  {loadingSpaces ? (
                    <div className={styles.loading}>Cargando espacios...</div>
                  ) : filteredSpaces.length === 0 ? (
                    <div className={styles.emptyState}>
                      <h3>No hay espacios</h3>
                      <p>Creá el primero con el formulario de arriba.</p>
                    </div>
                  ) : (
                    <>
                      <div className={styles.tableWrap}>
                        <table className={styles.table}>
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Tipo</th>
                              <th>Nombre</th>
                              <th>Precio</th>
                              <th>Activo</th>
                              <th>Acciones</th>
                            </tr>
                          </thead>

                          <tbody>
                            {spacesPageSlice.map((s) => {
                              const busy = savingSpaceId === s.id;

                              return (
                                <tr key={s.id}>
                                  <td>{s.id}</td>

                                  <td>
                                    <select
                                      className={styles.textInput}
                                      value={s.tipo}
                                      disabled={busy}
                                      onChange={(e) => patchSpace(s.id, { tipo: e.target.value })}
                                    >
                                      <option value="box_privado">Box privado</option>
                                      <option value="sala_reunion">Sala reunión</option>
                                      <option value="sala_conferencia">Sala conferencia</option>
                                      <option value="auditorio">Auditorio</option>
                                    </select>
                                  </td>

                                  <td>
                                    <input
                                      className={styles.textInput}
                                      value={s.nombre || ""}
                                      disabled={busy}
                                      onChange={(e) =>
                                        setSpaces((prev) =>
                                          prev.map((x) => (x.id === s.id ? { ...x, nombre: e.target.value } : x))
                                        )
                                      }
                                      onBlur={(e) => patchSpace(s.id, { nombre: e.target.value.trim() })}
                                    />
                                  </td>

                                  <td>
                                    <input
                                      className={styles.textInput}
                                      style={{ width: 140 }}
                                      value={s.precio ?? 0}
                                      disabled={busy}
                                      onChange={(e) =>
                                        setSpaces((prev) =>
                                          prev.map((x) => (x.id === s.id ? { ...x, precio: e.target.value } : x))
                                        )
                                      }
                                      onBlur={(e) => {
                                        const v = String(e.target.value).trim();
                                        const n = v === "" ? 0 : Number(v);
                                        if (Number.isNaN(n) || n < 0) {
                                          alert("Precio inválido.");
                                          fetchSpaces();
                                          return;
                                        }
                                        patchSpace(s.id, { precio: n });
                                      }}
                                    />
                                  </td>

                                  <td>{s.activo ? "Sí" : "No"}</td>

                                  <td className={styles.actionsCell}>
                                    <button
                                      className={styles.actionButton}
                                      onClick={() => patchSpace(s.id, { activo: s.activo ? 0 : 1 })}
                                      disabled={busy}
                                    >
                                      {busy ? "..." : s.activo ? "Desactivar" : "Activar"}
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>

                        <div className={styles.smallHint}>
                          Pro tip: el próximo paso es que <strong>NewReservation</strong> lea estos espacios desde la DB y
                          dejemos de hardcodear.
                        </div>
                      </div>

                      <Pagination page={spacesPage} totalPages={spacesTotalPages} onPage={setSpacesPage} />
                    </>
                  )}
                </>
              )}
            </div>
            {/* ===== MODULO ESPACIOS: END ===== */}

            {/* ===== MODULO REPORTES: START ===== */}
            <div className={styles.contentItem}>
              <button
                type="button"
                className={styles.sectionToggle}
                onClick={() => toggle("reportes")}
                aria-expanded={open.reportes}
              >
                <h3>Reportes y Estadísticas</h3>
                <span>{open.reportes ? "—" : "+"}</span>
              </button>

              {open.reportes && (
                <>
                  <div className={styles.adminToolsRow}>
                    <div className={styles.filterBar}>
                      <button className={styles.actionButton} onClick={fetchReports} disabled={loadingReports}>
                        {loadingReports ? "Actualizando..." : "Actualizar reportes"}
                      </button>
                    </div>

                    <div className={styles.searchWrap}>
                      <label style={{ opacity: 0.9 }}>Meses:</label>
                      <select
                        className={styles.textInput}
                        style={{ width: 140 }}
                        value={months}
                        onChange={(e) => setMonths(Number(e.target.value))}
                        disabled={loadingReports}
                      >
                        <option value={3}>3</option>
                        <option value={6}>6</option>
                        <option value={12}>12</option>
                      </select>
                    </div>
                  </div>

                  {loadingReports ? (
                    <div className={styles.loading}>Cargando reportes...</div>
                  ) : !kpis && !plansEstimate ? (
                    <div className={styles.emptyState}>
                      <h3>No hay datos para mostrar</h3>
                      <p>Probá “Actualizar reportes” o revisá que existan usuarios / reservas en la DB.</p>
                    </div>
                  ) : (
                    <>

                      <div className={styles.reportGrid}>
                        <div className={styles.reportCard}>
                          <div className={styles.reportTitle}>Usuarios</div>
                          <div className={styles.reportBig}>{kpis?.usuarios?.activos ?? 0}</div>
                          <div className={styles.reportSub}>Activos (total: {kpis?.usuarios?.total ?? 0})</div>
                        </div>

                        <div className={styles.reportCard}>
                          <div className={styles.reportTitle}>Reservas</div>
                          <div className={styles.reportBig}>{kpis?.reservas?.total ?? 0}</div>
                          <div className={styles.reportSub}>
                            Pend: {kpis?.reservas?.pendientes ?? 0} · Conf: {kpis?.reservas?.confirmadas ?? 0} · Canc:{" "}
                            {kpis?.reservas?.canceladas ?? 0}
                          </div>
                        </div>

                        <div className={styles.reportCard}>
                          <div className={styles.reportTitle}>Estimación planes</div>
                          <div className={styles.reportBig}>{money(plansEstimate?.ingresoTotal)}</div>
                          <div className={styles.reportSub}>
                            Básico: {plansEstimate?.basico ?? 0} · Premium: {plansEstimate?.premium ?? 0}
                          </div>
                        </div>
                      </div>

                      {/* Top espacios */}
                      <div className={styles.tableWrap} style={{ marginTop: 14 }}>
                        <div className={styles.smallHint} style={{ marginBottom: 8 }}>
                          Top espacios (más reservados)
                        </div>

                        {topSpaces.length === 0 ? (
                          <div className={styles.emptyState}>
                            <p>No hay reservas suficientes para armar el ranking.</p>
                          </div>
                        ) : (
                          <table className={styles.table}>
                            <thead>
                              <tr>
                                <th>Espacio</th>
                                <th>Tipo</th>
                                <th>Reservas</th>
                              </tr>
                            </thead>
                            <tbody>
                              {topSpaces.map((s) => (
                                <tr key={s.id}>
                                  <td>{s.nombre}</td>
                                  <td>{estadoLabel(s.tipo)}</td>
                                  <td>{s.total}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>

                      {/* Reservas por mes */}
                      <div className={styles.tableWrap} style={{ marginTop: 14 }}>
                        <div className={styles.smallHint} style={{ marginBottom: 8 }}>
                          Reservas por mes (últimos {months} meses)
                        </div>

                        {reservasByMonth.length === 0 ? (
                          <div className={styles.emptyState}>
                            <p>Todavía no hay reservas en este rango.</p>
                          </div>
                        ) : (
                          <table className={styles.table}>
                            <thead>
                              <tr>
                                <th>Mes</th>
                                <th>Total</th>
                                <th>Confirmadas</th>
                                <th>Pendientes</th>
                                <th>Canceladas</th>
                              </tr>
                            </thead>
                            <tbody>
                              {reservasByMonth.map((m) => (
                                <tr key={m.month}>
                                  <td>{m.month}</td>
                                  <td>{m.total}</td>
                                  <td>{m.confirmadas}</td>
                                  <td>{m.pendientes}</td>
                                  <td>{m.canceladas}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
            {/* ===== MODULO REPORTES: END ===== */}
          </div>
          {/* ===== COLUMNA DERECHA: END ===== */}
        </div>
        {/* ===== MODULO GRID 2 COLUMNAS: END ===== */}

        {/* ===== MODULO FOOTER: START ===== */}
        <div className={styles.panelFooter}>
          <p>© 2025 Hubora Coworking - Administración</p>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
        {/* ===== MODULO FOOTER: END ===== */}
      </div>

      {/* ===== MODULO MODAL EDICIÓN USUARIO: START ===== */}
      {editOpen && (
        <div className={styles.modalOverlay} onClick={closeEditModal}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Editar usuario #{editUserId}</h2>
              <button className={styles.modalClose} onClick={closeEditModal} type="button">
                ✕
              </button>
            </div>

            <div className={styles.modalGrid}>
              {/* USUARIO */}
              <div className={styles.modalSection}>
                <h3 className={styles.modalSectionTitle}>Cuenta</h3>

                <label className={styles.modalLabel}>Email</label>
                <input
                  className={styles.textInput}
                  value={editForm.email}
                  onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))}
                />

                <label className={styles.modalLabel}>Rol</label>
                <select
                  className={styles.textInput}
                  value={editForm.role}
                  onChange={(e) => setEditForm((p) => ({ ...p, role: e.target.value }))}
                >
                  <option value="cliente">Cliente</option>
                  <option value="admin">Admin</option>
                </select>

                <label className={styles.modalLabel}>Activo</label>
                <select
                  className={styles.textInput}
                  value={editForm.activo ? 1 : 0}
                  onChange={(e) => setEditForm((p) => ({ ...p, activo: Number(e.target.value) }))}
                >
                  <option value={1}>Sí</option>
                  <option value={0}>No</option>
                </select>

                <label className={styles.modalLabel}>Plan</label>
                <select
                  className={styles.textInput}
                  value={editForm.plan_contratado}
                  onChange={(e) => setEditForm((p) => ({ ...p, plan_contratado: e.target.value }))}
                >
                  <option value="basico">Básico</option>
                  <option value="premium">Premium</option>
                </select>
              </div>

              {/* PERFIL */}
              <div className={styles.modalSection}>
                <h3 className={styles.modalSectionTitle}>Perfil</h3>

                <label className={styles.modalLabel}>Nombre</label>
                <input
                  className={styles.textInput}
                  value={editForm.nombre}
                  onChange={(e) => setEditForm((p) => ({ ...p, nombre: e.target.value }))}
                />

                <label className={styles.modalLabel}>Apellido</label>
                <input
                  className={styles.textInput}
                  value={editForm.apellido}
                  onChange={(e) => setEditForm((p) => ({ ...p, apellido: e.target.value }))}
                />

                <label className={styles.modalLabel}>Dirección</label>
                <input
                  className={styles.textInput}
                  value={editForm.direccion}
                  onChange={(e) => setEditForm((p) => ({ ...p, direccion: e.target.value }))}
                />

                <label className={styles.modalLabel}>Teléfono</label>
                <input
                  className={styles.textInput}
                  value={editForm.telefono}
                  onChange={(e) => setEditForm((p) => ({ ...p, telefono: e.target.value }))}
                />

                <label className={styles.modalLabel}>Contacto emergencia (nombre)</label>
                <input
                  className={styles.textInput}
                  value={editForm.contacto_emergencia_nombre}
                  onChange={(e) => setEditForm((p) => ({ ...p, contacto_emergencia_nombre: e.target.value }))}
                />

                <label className={styles.modalLabel}>Contacto emergencia (teléfono)</label>
                <input
                  className={styles.textInput}
                  value={editForm.contacto_emergencia_telefono}
                  onChange={(e) => setEditForm((p) => ({ ...p, contacto_emergencia_telefono: e.target.value }))}
                />

                <label className={styles.modalLabel}>Locker (número)</label>
                <input
                  className={styles.textInput}
                  value={editForm.locker_numero ?? ""}
                  placeholder="Vacío = sin locker"
                  onChange={(e) => setEditForm((p) => ({ ...p, locker_numero: e.target.value }))}
                />
              </div>

              {/* MASCOTA */}
              <div className={styles.modalSection} style={{ gridColumn: "1 / -1" }}>
                <h3 className={styles.modalSectionTitle}>Mascota</h3>

                <div className={styles.modalRow}>
                  <label className={styles.modalLabel} style={{ margin: 0 }}>
                    Tiene mascota
                  </label>
                  <input
                    type="checkbox"
                    checked={!!editForm.tiene_mascota}
                    onChange={(e) => {
                      const checked = e.target.checked ? 1 : 0;
                      setEditForm((p) => ({
                        ...p,
                        tiene_mascota: checked,
                        mascota_nombre: checked ? p.mascota_nombre : "",
                        mascota_tipo: checked ? (p.mascota_tipo || "otro") : "otro",
                      }));
                    }}
                  />
                </div>

                <div className={styles.modalGrid2}>
                  <div>
                    <label className={styles.modalLabel}>Nombre mascota</label>
                    <input
                      className={styles.textInput}
                      value={editForm.mascota_nombre}
                      disabled={!editForm.tiene_mascota}
                      onChange={(e) => setEditForm((p) => ({ ...p, mascota_nombre: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className={styles.modalLabel}>Tipo</label>
                    <select
                      className={styles.textInput}
                      value={editForm.mascota_tipo}
                      disabled={!editForm.tiene_mascota}
                      onChange={(e) => setEditForm((p) => ({ ...p, mascota_tipo: e.target.value }))}
                    >
                      <option value="perro">Perro</option>
                      <option value="gato">Gato</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.modalActions}>
              <button className={styles.logoutButton} type="button" onClick={closeEditModal} disabled={savingEdit}>
                Cancelar
              </button>
              <button className={styles.actionButton} type="button" onClick={saveEditModal} disabled={savingEdit}>
                {savingEdit ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>

            <div className={styles.smallHint}>
              El admin puede editar todo: arreglar cuentas, asignaciones y datos aunque el cliente también edite.
            </div>
          </div>
        </div>
      )}
      {/* ===== MODULO MODAL EDICIÓN USUARIO: END ===== */}
    </div>
  );
}