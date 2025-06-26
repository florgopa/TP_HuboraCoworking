import React from 'react';
// import styles from './Login.module.css';

function Login() {
  return (
    <div className="content-section">
      <h2>Iniciar Sesión</h2>
      <p>Por favor, ingresa tus credenciales para acceder.</p>
      <form>
        <div>
          <label htmlFor="loginEmail">Email:</label>
          <input type="email" id="loginEmail" name="email" required />
        </div>
        <div>
          <label htmlFor="loginPassword">Contraseña:</label>
          <input type="password" id="loginPassword" name="password" required />
        </div>
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default Login;