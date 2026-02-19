import React, { useEffect, useState } from "react";

export default function MyReservations() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : null;
  const email = user?.email;

  useEffect(() => {

    if (!email) {
      setLoading(false);
      return;
    }


    const fetchReservas = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/reservations/user/${encodeURIComponent(email)}`
        );

        const data = await res.json();
        setReservas(data);
      } catch (error) {
        console.error("Error cargando reservas:", error);
      } finally {
        setLoading(false);
      }
    };


    fetchReservas();

  }, [email]);

  if (loading) {
    return <div style={{ color: "white", padding: 40 }}>Cargando...</div>;
  }

  return (
    <div style={{ color: "white", padding: 40 }}>
      <h1>Mis Reservas</h1>

      {reservas.length === 0 ? (
        <p>No tenés reservas todavía.</p>
      ) : (
        reservas.map((reserva) => (
          <div
            key={reserva.id}
            style={{
              border: "1px solid white",
              padding: 15,
              marginBottom: 10,
              borderRadius: 8
            }}
          >
            <h3>{reserva.espacio_nombre}</h3>
            <p>📅 Fecha: {reserva.fecha}</p>
            <p>
              ⏰ Horario: {reserva.hora_inicio} - {reserva.hora_fin}
            </p>
            <p>📌 Estado: {reserva.estado}</p>
          </div>
        ))
      )}
    </div>
  );
}
