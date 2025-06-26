import React from 'react';
// import styles from './UserPanel.module.css';

function UserPanel() {
  return (
    <div className="content-section">
      <h2>Panel de Usuario</h2>
      <p>Bienvenido a tu panel personal. Aquí puedes ver tus reservas y perfil.</p>
      {/* Aquí podrías añadir información del usuario, reservas activas, historial, etc. */}
      <ul>
        <li>Mis Reservas</li>
        <li>Mi Perfil</li>
        <li>Historial de Pagos</li>
      </ul>
    </div>
  );
}

export default UserPanel;