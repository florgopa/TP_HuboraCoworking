import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../components/Profile.module.css";

const emptyForm = {
  nombre: "",
  apellido: "",
  direccion: "",
  telefono: "",
  contactoEmergenciaNombre: "",
  contactoEmergenciaTelefono: "",
  tieneMascota: false,
  mascotaNombre: "",
  mascotaTipo: "otro",
  lockerNumero: "",
  planContratado: "" // ✅ viene del backend (no editable)
};

const API_BASE = "http://localhost:3000/api";

function Profile() {
  const navigate = useNavigate();
  const [baseUser, setBaseUser] = useState(null);

  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(false);

  const token = localStorage.getItem("token"); // ✅ JWT

  const setField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleMascota = (checked) => {
    setForm((prev) => ({
      ...prev,
      tieneMascota: checked,
      mascotaNombre: checked ? prev.mascotaNombre : "",
      mascotaTipo: checked ? prev.mascotaTipo : "otro"
    }));
  };

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        // token vencido o inválido => afuera
        alert(data?.message || "No se pudo cargar el perfil");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      // data.profile trae todo
      setForm({
        ...emptyForm,
        ...data.profile
      });

      // baseUser lo usamos solo para email/role, pero también viene del profile
      setBaseUser({
        email: data.profile.email,
        role: data.profile.role
      });
    } catch (err) {
      console.error(err);
      alert("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  }, [navigate, token]);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored || !token) {
      navigate("/login");
      return;
    }
    fetchProfile();
  }, [navigate, token, fetchProfile]);

  const handleSave = async () => {
    if (!editing) return;

    if (!form.nombre.trim() || !form.apellido.trim()) {
      alert("Nombre y apellido son obligatorios.");
      return;
    }

    if (form.tieneMascota && !form.mascotaNombre.trim()) {
      alert("Ingresá el nombre de tu mascota.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        nombre: form.nombre,
        apellido: form.apellido,
        direccion: form.direccion,
        telefono: form.telefono,
        contactoEmergenciaNombre: form.contactoEmergenciaNombre,
        contactoEmergenciaTelefono: form.contactoEmergenciaTelefono,
        tieneMascota: form.tieneMascota,
        mascotaNombre: form.mascotaNombre,
        mascotaTipo: form.mascotaTipo
        // ✅ NO mandamos lockerNumero ni planContratado (no editables)
      };

      const res = await fetch(`${API_BASE}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        alert(data?.message || "No se pudo guardar el perfil");
        return;
      }

      alert("Perfil actualizado correctamente ✅");
      setEditing(false);
      fetchProfile(); // ✅ recarga sin reload
    } catch (error) {
      console.error(error);
      alert("Error al guardar perfil");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className={styles.profileContainer}>
        <div className={styles.panelBox}>
          <div className={styles.panelHeader}>
            <h1 className={styles.panelTitle}>Mi Perfil</h1>
            <p className={styles.welcomeMessage}>Cargando perfil...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!baseUser) return null;

  return (
    <div className={styles.profileContainer}>
      <div className={styles.panelBox}>
        <div className={styles.panelHeader}>
          <h1 className={styles.panelTitle}>Mi Perfil</h1>
          <p className={styles.welcomeMessage}>
            Completá y mantené actualizados tus datos.
          </p>
        </div>

        <div className={styles.panelContentSingle}>
          {/* Datos personales */}
          <div className={styles.contentItem}>
            <h3>Datos personales</h3>
            <div className={styles.formStack}>
              <div className={styles.formGroup}>
                <label>Nombre</label>
                <input
                  className={styles.textInput}
                  value={form.nombre}
                  onChange={(e) => setField("nombre", e.target.value)}
                  disabled={!editing}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Apellido</label>
                <input
                  className={styles.textInput}
                  value={form.apellido}
                  onChange={(e) => setField("apellido", e.target.value)}
                  disabled={!editing}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Email (no editable)</label>
                <input className={styles.textInput} value={baseUser.email} disabled />
              </div>

              <div className={styles.formGroup}>
                <label>Dirección</label>
                <input
                  className={styles.textInput}
                  value={form.direccion}
                  onChange={(e) => setField("direccion", e.target.value)}
                  disabled={!editing}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Celular</label>
                <input
                  className={styles.textInput}
                  value={form.telefono}
                  onChange={(e) => setField("telefono", e.target.value)}
                  disabled={!editing}
                />
              </div>
            </div>
          </div>

          {/* Contacto de emergencia */}
          <div className={styles.contentItem}>
            <h3>Contacto de emergencia</h3>
            <div className={styles.formStack}>
              <div className={styles.formGroup}>
                <label>Nombre</label>
                <input
                  className={styles.textInput}
                  value={form.contactoEmergenciaNombre}
                  onChange={(e) => setField("contactoEmergenciaNombre", e.target.value)}
                  disabled={!editing}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Teléfono</label>
                <input
                  className={styles.textInput}
                  value={form.contactoEmergenciaTelefono}
                  onChange={(e) => setField("contactoEmergenciaTelefono", e.target.value)}
                  disabled={!editing}
                />
              </div>
            </div>
          </div>

          {/* Preferencias */}
          <div className={styles.contentItem}>
            <h3>Preferencias</h3>

            <div className={styles.formStack}>
              <div className={styles.checkboxRow}>
                <input
                  id="tieneMascota"
                  type="checkbox"
                  checked={!!form.tieneMascota}
                  onChange={(e) => handleToggleMascota(e.target.checked)}
                  disabled={!editing}
                />
                <label htmlFor="tieneMascota">Voy con mi mascota a trabajar</label>
              </div>

              {form.tieneMascota && (
                <>
                  <div className={styles.formGroup}>
                    <label>Nombre de la mascota</label>
                    <input
                      className={styles.textInput}
                      value={form.mascotaNombre}
                      onChange={(e) => setField("mascotaNombre", e.target.value)}
                      disabled={!editing}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Tipo de mascota</label>
                    <select
                      className={styles.selectInput}
                      value={form.mascotaTipo}
                      onChange={(e) => setField("mascotaTipo", e.target.value)}
                      disabled={!editing}
                    >
                      <option value="perro">Perro</option>
                      <option value="gato">Gato</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                </>
              )}

              <div className={styles.formGroup}>
                <label>Plan contratado (no editable)</label>
                <input
                  className={styles.textInput}
                  value={form.planContratado || "Sin plan asignado"}
                  disabled
                />
              </div>

              <div className={styles.formGroup}>
                <label>Locker asignado (no editable)</label>
                <input
                  className={styles.textInput}
                  value={form.lockerNumero || "No asignado"}
                  disabled
                />
              </div>

              <div className={styles.formGroup}>
                <label>Rol (no editable)</label>
                <input className={styles.textInput} value={baseUser.role} disabled />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.profileActions}>
          <button className={styles.actionButton} onClick={() => navigate("/usuario")}>
            Volver al panel
          </button>

          {!editing ? (
            <button className={styles.actionButton} onClick={() => setEditing(true)}>
              Editar perfil
            </button>
          ) : (
            <button
              className={styles.actionButton}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          )}

          <button className={styles.logoutButton} onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>

        <div className={styles.panelFooter}>
          <p>© 2025 Hubora Coworking - Área de Usuarios</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;