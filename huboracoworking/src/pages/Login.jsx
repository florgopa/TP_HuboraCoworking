import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../components/Login.module.css';
import bgLogin from '../assets/bg_login.jpg'; 

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (email === 'admin@hubora.com' && password === 'admin123') {
      navigate('/admin');
    } else if (email === 'usuario@hubora.com' && password === 'user123') {
      navigate('/usuario');
    } else {
      alert('Credenciales incorrectas');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <h2>Iniciar Sesión</h2>
        <form className={styles.loginForm} onSubmit={(e) => e.preventDefault()}>
          <div className={styles.formGroup}>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles.loginButton} onClick={handleLogin}>
            Ingresar
          </button>
        </form>
        <div className={styles.forgotPassword}>
          <span>¿Olvidaste tu contraseña? <a href="#">Recuperar</a></span>
        </div>
      </div>
    </div>
  );
}

export default Login;
