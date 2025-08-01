// src/app/page.js (SIMPLIFICADO)
import Roleta from '../components/Roleta/Roleta';

// A página Home volta a ser um componente simples, sem 'async'
export default function Home() {
  return (
    <main>
      {/* Não passamos mais a URL como prop. O componente Roleta cuidará de tudo. */}
      <Roleta />
    </main>
  );
}