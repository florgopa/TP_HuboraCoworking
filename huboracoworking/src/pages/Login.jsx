import React from 'react';

import styles from '../components/Login.module.css'; 
import bgLogin from '../assets/bg_login.jpg';

function Login() {
  return (
    <div className={styles.loginContainer} style={{ backgroundImage: `url(${bgLogin})` }}>
      <div className={styles.loginBox}>
        <h2>Iniciar Sesión</h2>
        <form className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" placeholder="tu@email.com" required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Contraseña:</label>
            <input type="password" id="password" name="password" placeholder="********" required />
          </div>
          <button type="submit" className={styles.loginButton}>Entrar</button>
        </form>
        <p className={styles.forgotPassword}>¿Olvidaste tu contraseña? <a href="#">Recuperar</a></p>
      </div>
    </div>
  );
}

export default Login;