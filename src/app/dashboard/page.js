// src/app/admin/dashboard/page.js (COM ROTA PROTEGIDA)
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Hook para redirecionamento
import apiService from '../../lib/api';
import styles from './Dashboard.module.css';

const AdminDashboardPage = () => {
  const [link, setLink] = useState('');
  const [currentLink, setCurrentLink] = useState('');
  const [status, setStatus] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Novo estado de controle
  const router = useRouter();

  useEffect(() => {
    // ✨✨✨ LÓGICA DE PROTEÇÃO DA ROTA ✨✨✨
    const token = localStorage.getItem('authToken');

    if (!token) {
      // Se não há token, redireciona imediatamente para a página inicial
      router.push('/'); 
    } else {
      // Se há um token, permite a renderização e busca os dados
      setIsAuthenticated(true);
      
      const fetchCurrentLink = async () => {
        try {
          const response = await apiService.getTicket();
          setCurrentLink(response.data.url);
          setLink(response.data.url);
        } catch (error) {
          console.error('Erro ao buscar o link atual:', error);
          // Se o token for inválido, a API retornará 401. Poderíamos tratar isso aqui.
          // Por simplicidade, vamos apenas logar o erro por enquanto.
        }
      };
      
      fetchCurrentLink();
    }
  }, [router]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!link) return;

    setStatus('saving');
    const token = localStorage.getItem('authToken');

    try {
      await apiService.updateTicket(link, token);
      setStatus('saved');
      setCurrentLink(link);
    } catch (error) {
      console.error('Erro ao salvar o link:', error);
      setStatus('error');
    } finally {
      setTimeout(() => setStatus(''), 2000);
    }
  };

  // Se não estiver autenticado, renderiza um estado de "carregando" ou "verificando"
  // para evitar um flash de conteúdo antes do redirecionamento.
  if (!isAuthenticated) {
    return (
      <div className={styles.loadingContainer}>
        <p>Verificando acesso...</p>
      </div>
    );
  }

  // Se estiver autenticado, renderiza o dashboard
  return (
    <div className={styles.dashboardPage}>
      <div className={styles.dashboardBox}>
        <h1 className={styles.title}>Gerenciador do Bilhete</h1>
        <p className={styles.subtitle}>Cole o link do bilhete do dia abaixo e clique em salvar.</p>
        
        <div className={styles.currentLinkBox}>
          <span>Link Atual:</span>
          <a href={currentLink} target="_blank" rel="noopener noreferrer">{currentLink}</a>
        </div>
        
        <form className={styles.form} onSubmit={handleSave}>
          <div className={styles.inputGroup}>
            <label htmlFor="ticketLink" className={styles.label}>Novo Link do Bilhete</label>
            <input
              id="ticketLink"
              type="url"
              placeholder="https://exemplo.com/bilhete-de-hoje"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          <button type="submit" className={styles.saveButton} disabled={status === 'saving'}>
            {status === 'saving' ? 'SALVANDO...' : (status === 'saved' ? 'SALVO!' : (status === 'error' ? 'ERRO' : 'Salvar Link'))}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboardPage;