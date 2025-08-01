// src/app/admin/login/page.js (INTEGRADO)
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import apiService from '../../lib/api'; // Importa nosso serviço de API
import styles from './Login.module.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiService.login(email, password);
      // Salva o token no localStorage para ser usado em outras requisições
      localStorage.setItem('authToken', response.data.token);
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao tentar fazer login.');
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <form className={styles.loginBox} onSubmit={handleLogin}>
        <h1 className={styles.title}>Acesso Administrativo</h1>
        <p className={styles.subtitle}>Insira suas credenciais para gerenciar o bilhete.</p>
        
        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            placeholder="seu-email@exemplo.com"
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>Senha de Acesso</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.loginButton} disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;