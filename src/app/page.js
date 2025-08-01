// src/app/page.js (INTEGRADO)
import Roleta from '../components/Roleta/Roleta';
import apiService from '../lib/api';

// Função para buscar os dados no servidor antes de renderizar a página
async function getTicketData() {
  try {
    const response = await apiService.getTicket();
    return response.data;
  } catch (error) {
    console.error("Falha ao buscar o bilhete:", error);
    // Retorna um link de fallback caso a API falhe
    return { url: 'https://fallback.com' };
  }
}

// A página Home agora é assíncrona para poder usar 'await'
export default async function Home() {
  const ticketData = await getTicketData();

  return (
    <main>
      {/* Passamos a URL do bilhete como uma prop para o componente Roleta */}
      <Roleta ticketUrl={ticketData.url} />
    </main>
  );
}