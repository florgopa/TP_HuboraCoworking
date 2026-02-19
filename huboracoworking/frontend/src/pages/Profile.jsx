import React, { useEffect, useState } from "react";
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
  lockerNumero: ""
};

function Profile() {
  const navigate = useNavigate();
  const [baseUser, setBaseUser] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);


  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      navigate("/login");
      return;
    }

    const u = JSON.parse(stored);
    setBaseUser(u);

    // setForm({
    //   ...emptyForm,
    //   nombre: "",
    //   apellido: ""
    // });


    // Cargar datos del perfil desde el backend
  const fetchProfile = async () => {
  try {
    const res = await fetch(
      `http://localhost:5000/api/profile/${u.email}`
    );
    const data = await res.json();

    if (!data.ok) {
      alert("No se pudo cargar el perfil" + (data.message || "Error desconocido"));
      return;
    }

      try {
    console.log("1. Fetching para email:", u.email);
    
    const res = await fetch(`http://localhost:5000/api/profile/${u.email}`);
    
    console.log("2. Status de respuesta:", res.status);
    
    const data = await res.json();
    console.log("3. Datos completos recibidos:", data);
    
    if (!data.ok) {
      alert("No se pudo cargar el perfil: " + (data.message || "Error desconocido"));
      return;
    }

    console.log("4. Profile recibido:", data.profile);
    
    setForm({
      ...emptyForm,
      ...data.profile
    });
    
    console.log("5. Form actualizado:", {
      ...emptyForm,
      ...data.profile
    });
    
  } catch (err) {
    console.error("Error completo:", err);
    alert("Error al conectar con el servidor: " + err.message);
  }

    console.log("Datos recibidos:", data.profile); // Para debugear

    setForm({
      ...emptyForm,
      ...data.profile
    });
  } catch (err) {
    console.error(err);
    alert("Error al cargar perfil");
  }
};

fetchProfile();
////////////////////////////////////


  }, [navigate]);

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

const handleSave = async () => {
  if (!form.nombre.trim() || !form.apellido.trim()) {
    alert("Nombre y apellido son obligatorios.");
    return;
  }

  setSaving(true);
  try {
    const res = await fetch(
      `http://localhost:5000/api/profile/${baseUser.email}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      }
    );

    const data = await res.json();

    if (!data.ok) {
      alert("No se pudo guardar el perfil" + (data.message || "Error desconocido"));
      return;
    }

    alert("Perfil actualizado correctamente");
    setEditing(false);

    // Opcional: recargar los datos después de guardar
    window.location.reload(); // o volver a llamar a fetchProfile

  } catch (error) {
    console.error(error);
    alert("Error al guardar perfil");
  } finally {
    setSaving(false);
  }
};


  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

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
                <input
                  className={styles.textInput}
                  value={baseUser.email}
                  disabled
                />
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
                  onChange={(e) =>
                    setField("contactoEmergenciaNombre", e.target.value)
                  }
                  disabled={!editing}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Teléfono</label>
                <input
                  className={styles.textInput}
                  value={form.contactoEmergenciaTelefono}
                  onChange={(e) =>
                    setField("contactoEmergenciaTelefono", e.target.value)
                  }
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
                    checked={form.tieneMascota}
                    onChange={(e) => handleToggleMascota(e.target.checked)}
                    disabled={!editing}
                />
                <label htmlFor="tieneMascota">
                    Voy con mi mascota a trabajar
                </label>
                </div>

                {form.tieneMascota && (
                <>
                    <div className={styles.formGroup}>
                    <label>Nombre de la mascota</label>
                    <input
                        className={styles.textInput}
                        value={form.mascotaNombre}
                        onChange={(e) =>
                        setField("mascotaNombre", e.target.value)
                        }
                        placeholder="Ej: Mishi"
                        disabled={!editing}
                    />
                    </div>

                    <div className={styles.formGroup}>
                    <label>Tipo de mascota</label>
                    <select
                        className={styles.selectInput}
                        value={form.mascotaTipo}
                        onChange={(e) =>
                        setField("mascotaTipo", e.target.value)
                        }
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
                <label>Plan contratado</label>
                <input
                    className={styles.textInput}
                    value={baseUser.plan || "Sin plan asignado"}
                    disabled
                />
                </div>

                <div className={styles.formGroup}>
                <label>Locker asignado</label>
                <input
                    className={styles.textInput}
                    value={form.lockerNumero || "No asignado"}
                    disabled
                />
                </div>

                <div className={styles.formGroup}>
                <label>Rol</label>
                <input
                    className={styles.textInput}
                    value={baseUser.role}
                    disabled
                />
                </div>
            </div>
            </div>
        </div>

        <div className={styles.profileActions}>
          <button
            className={styles.actionButton}
            onClick={() => navigate("/usuario")}
          >
            Volver al panel
          </button>
                
          {!editing && (
              <button
                className={styles.actionButton}
                onClick={() => setEditing(true)}
              >
                Editar perfil
              </button>
          )}

          <button
            className={styles.actionButton}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>

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
