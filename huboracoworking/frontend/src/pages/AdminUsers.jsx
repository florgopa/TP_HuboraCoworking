// src/pages/AdminUsers.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../components/AdminUsers.module.css";

const API_BASE = "http://localhost:3000/api";

function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [editingId, setEditingId] = useState(null); // 👈 fila en edición

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        alert(data?.message || "No se pudo cargar la lista de usuarios");
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }
        return;
      }

      setUsers(data.users);
    } catch (error) {
      console.error(error);
      alert("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchUsers();
  }, [token, navigate]);

  const handleChangeField = (id, field, value) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, [field]: value } : u))
    );
  };

  const handleToggleMascota = (id, checked) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? {
              ...u,
              tiene_mascota: checked ? 1 : 0,
              mascota_nombre: checked ? u.mascota_nombre || "" : "",
              mascota_tipo: checked ? u.mascota_tipo || "otro" : "otro"
            }
          : u
      )
    );
  };

  const handleSaveUser = async (u) => {
    setSavingId(u.id);
    try {
      const payload = {
        role: u.role,
        planContratado: u.plan_contratado,
        lockerNumero: u.locker_numero,
        nombre: u.nombre,
        apellido: u.apellido,
        direccion: u.direccion,
        telefono: u.telefono,
        contactoEmergenciaNombre: u.contacto_emergencia_nombre,
        contactoEmergenciaTelefono: u.contacto_emergencia_telefono,
        tieneMascota: !!u.tiene_mascota,
        mascotaNombre: u.mascota_nombre,
        mascotaTipo: u.mascota_tipo
      };

      const res = await fetch(`${API_BASE}/admin/users/${u.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        alert(data?.message || "No se pudo guardar los cambios");
        return;
      }

      alert("Datos actualizados ✅");
      setEditingId(null);   // salir de modo edición
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert("Error al guardar cambios");
    } finally {
      setSavingId(null);
    }
  };

  const handleDeleteUser = async (id) => {
    const confirm = window.confirm(
      "¿Seguro que querés desactivar (borrado lógico) este usuario?"
    );
    if (!confirm) return;

    try {
      const res = await fetch(`${API_BASE}/admin/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        alert(data?.message || "No se pudo eliminar el usuario");
        return;
      }

      // quitamos de la lista sin volver a pedir si querés
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (error) {
      console.error(error);
      alert("Error al eliminar usuario");
    }
  };

  const handleBack = () => {
    navigate("/admin");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className={styles.adminPanelContainer}>
        <div className={styles.panelBox}>
          <div className={styles.panelHeader}>
            <h1 className={styles.panelTitle}>Gestión de Usuarios</h1>
            <p className={styles.welcomeMessage}>Cargando usuarios...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminPanelContainer}>
      <div className={styles.panelBox}>
        <div className={styles.panelHeader}>
          <h1 className={styles.panelTitle}>Gestión de Usuarios</h1>
          <p className={styles.welcomeMessage}>
            Visualizá y editá los datos de los usuarios de Hubora.
          </p>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.usersTable}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Plan</th>
                <th>Locker</th>
                <th>Teléfonos</th>
                <th>Contacto Emergencia</th>
                <th>Mascota</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const editable = editingId === u.id; // 👈 está en edición
                return (
                  <tr key={u.id}>
                    <td>
                      <input
                        className={styles.tableInput}
                        value={u.nombre || ""}
                        onChange={(e) =>
                          handleChangeField(u.id, "nombre", e.target.value)
                        }
                        disabled={!editable}
                      />
                    </td>

                    <td>
                      <input
                        className={styles.tableInput}
                        value={u.apellido || ""}
                        onChange={(e) =>
                          handleChangeField(u.id, "apellido", e.target.value)
                        }
                        disabled={!editable}
                      />
                    </td>

                    <td>
                      <input
                        className={styles.tableInput}
                        value={u.email}
                        disabled
                      />
                    </td>

                    <td>
                      <select
                        className={styles.tableSelect}
                        value={u.role}
                        onChange={(e) =>
                          handleChangeField(u.id, "role", e.target.value)
                        }
                        disabled={!editable}
                      >
                        <option value="cliente">cliente</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>

                    <td>
                      <input
                        className={styles.tableInput}
                        value={u.plan_contratado || ""}
                        onChange={(e) =>
                          handleChangeField(
                            u.id,
                            "plan_contratado",
                            e.target.value
                          )
                        }
                        disabled={!editable}
                        placeholder="Plan Mensual, Día Libre, etc."
                      />
                    </td>

                    <td>
                      <input
                        className={styles.tableInput}
                        type="number"
                        value={u.locker_numero || ""}
                        onChange={(e) =>
                          handleChangeField(
                            u.id,
                            "locker_numero",
                            e.target.value
                          )
                        }
                        disabled={!editable}
                        placeholder="Ej: 101"
                      />
                    </td>

                    <td>
                      <div className={styles.tableCellStack}>
                        <input
                          className={styles.tableInput}
                          value={u.telefono || ""}
                          onChange={(e) =>
                            handleChangeField(
                              u.id,
                              "telefono",
                              e.target.value
                            )
                          }
                          disabled={!editable}
                          placeholder="Tel. principal"
                        />
                        <input
                          className={styles.tableInput}
                          value={u.contacto_emergencia_telefono || ""}
                          onChange={(e) =>
                            handleChangeField(
                              u.id,
                              "contacto_emergencia_telefono",
                              e.target.value
                            )
                          }
                          disabled={!editable}
                          placeholder="Tel. emergencia"
                        />
                      </div>
                    </td>

                    <td>
                      <input
                        className={styles.tableInput}
                        value={u.contacto_emergencia_nombre || ""}
                        onChange={(e) =>
                          handleChangeField(
                            u.id,
                            "contacto_emergencia_nombre",
                            e.target.value
                          )
                        }
                        disabled={!editable}
                        placeholder="Nombre contacto"
                      />
                    </td>

                    <td>
                      <div className={styles.tableCellStack}>
                        <label className={styles.checkInline}>
                          <input
                            type="checkbox"
                            checked={!!u.tiene_mascota}
                            onChange={(e) =>
                              handleToggleMascota(u.id, e.target.checked)
                            }
                            disabled={!editable}
                          />
                          <span>Tiene mascota</span>
                        </label>

                        {u.tiene_mascota ? (
                          <>
                            <input
                              className={styles.tableInput}
                              value={u.mascota_nombre || ""}
                              onChange={(e) =>
                                handleChangeField(
                                  u.id,
                                  "mascota_nombre",
                                  e.target.value
                                )
                              }
                              disabled={!editable}
                              placeholder="Nombre"
                            />
                            <select
                              className={styles.tableSelect}
                              value={u.mascota_tipo || "otro"}
                              onChange={(e) =>
                                handleChangeField(
                                  u.id,
                                  "mascota_tipo",
                                  e.target.value
                                )
                              }
                              disabled={!editable}
                            >
                              <option value="perro">perro</option>
                              <option value="gato">gato</option>
                              <option value="otro">otro</option>
                            </select>
                          </>
                        ) : null}
                      </div>
                    </td>

                    <td>
                      {editable ? (
                        <>
                          <button
                            className={styles.smallActionButton}
                            onClick={() => handleSaveUser(u)}
                            disabled={savingId === u.id}
                          >
                            {savingId === u.id ? "Guardando..." : "Guardar"}
                          </button>
                          <button
                            className={styles.smallSecondaryButton}
                            onClick={() => setEditingId(null)}
                          >
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className={styles.smallActionButton}
                            onClick={() => setEditingId(u.id)}
                          >
                            Editar
                          </button>
                          <button
                            className={styles.smallDangerButton}
                            onClick={() => handleDeleteUser(u.id)}
                          >
                            Eliminar
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {users.length === 0 && (
            <p className={styles.emptyText}>No hay usuarios registrados.</p>
          )}
        </div>

        <div className={styles.panelFooter}>
                 <p>© 2025 Hubora Coworking - Administración</p>
                 <button className={styles.logoutButton} onClick={handleLogout}>
                   Cerrar Sesión
                 </button>
               </div>
             </div>
           </div>
         );
}


export default AdminUsers;