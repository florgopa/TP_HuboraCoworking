import React from 'react';
// './AdminPanel.module.css'; // Si vas a añadir estilos específicos para esta página

function AdminPanel() {
  return (

    <div className="content-section">
      <h2>Panel de Administración</h2>
      <p>Bienvenido al área de administración. Aquí podrás gestionar usuarios, reservas y contenido.</p>
      <ul>
        <li>Gestión de Usuarios</li>
        <li>Gestión de Reservas</li>
        <li>Estadísticas de Uso</li>
        <li>Configuración del Sitio</li>
      </ul>
    </div>
  );
}

export default AdminPanel; 