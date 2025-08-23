// src/lib/api.js
import axios from 'axios';

// Instância do Axios com a URL base da sua API
const api = axios.create({
  baseURL: 'https://superodds-bilhetesuperoddsai-api.zjbwih.easypanel.host/api',
});

// --- FUNÇÕES DE API ---

/**
 * Faz o login do admin.
 * @param {string} email - O email do admin.
 * @param {string} password - A senha do admin.
 * @returns {Promise<object>} A resposta da API com o token.
 */
export const login = (email, password) => {
  return api.post('/login', { email, password });
};

/**
 * Busca o link do bilhete atual. (Rota pública)
 * @returns {Promise<object>} A resposta da API com a URL do bilhete.
 */
export const getTicket = () => {
  return api.get('/ticket');
};

/**
 * Atualiza o link do bilhete. (Rota protegida)
 * @param {string} url - A nova URL do bilhete.
 * @param {string} token - O token JWT de autenticação.
 * @returns {Promise<object>} A resposta da API.
 */
export const updateTicket = (url, token) => {
  return api.put('/ticket', { url }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Exporta um objeto com todas as funções para fácil importação
const apiService = {
  login,
  getTicket,
  updateTicket,
};

export default apiService;