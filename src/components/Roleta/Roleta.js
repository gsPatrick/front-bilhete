// src/app/components/Roleta/Roleta.js (COM BUSCA DE DADOS NO CLIENTE)
'use client';
import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import styles from './Roleta.module.css';
import apiService from '../../lib/api'; // Importa nosso serviço de API

const Roleta = () => {
  const [status, setStatus] = useState('idle');
  const reelRef = useRef(null);
  const resultRef = useRef(null);
  
  // ✨ NOVO: Estados para guardar o link final e controlar o carregamento
  const [finalTicketUrl, setFinalTicketUrl] = useState('');
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);

  const itemHeight = 80;
  const viewportHeight = 240;
  const loadingItems = ['Analisando...', 'Validando...', 'Quase lá...'];
  const items = [
    ...loadingItems, ...loadingItems, ...loadingItems, ...loadingItems,
    'Bilhete Liberado!'
  ];
  const winnerIndex = items.length - 1;

  useEffect(() => {
    if (reelRef.current) {
        const randomStartIndex = Math.floor(Math.random() * 3);
        const initialPosition = (itemHeight * randomStartIndex) - (viewportHeight / 2) + (itemHeight / 2);
        gsap.set(reelRef.current, { y: -initialPosition });
    }
  }, []);

  const accessTicket = () => {
    if (status !== 'idle' || !reelRef.current) return;
    setStatus('spinning');

    const finalPosition = (itemHeight * winnerIndex) - (viewportHeight / 2) + (itemHeight / 2);
    const tl = gsap.timeline();

    tl.to(reelRef.current, {
      y: -finalPosition,
      duration: 3, 
      ease: 'power2.inOut',
    });

    tl.call(() => {
      const winnerElement = reelRef.current.children[winnerIndex];
      if (winnerElement) {
        winnerElement.classList.add(styles.winner);
        gsap.fromTo(winnerElement, 
            { scale: 1, filter: 'brightness(1)' }, 
            { scale: 1.1, filter: 'brightness(2)', duration: 0.2, yoyo: true, repeat: 3 }
        );
      }
    }, [], ">-0.5");

    tl.call(() => {
      setStatus('finished');
    }, [], "+=1");
  };
  
  // ✨ NOVO: useEffect que busca o link QUANDO o status muda para 'finished'
  useEffect(() => {
    if (status === 'finished') {
      const fetchTicket = async () => {
        setIsLoadingUrl(true);
        try {
          const response = await apiService.getTicket();
          setFinalTicketUrl(response.data.url);
        } catch (error) {
          console.error("Erro ao buscar o bilhete no cliente:", error);
          // Define um link de fallback caso a API falhe neste ponto
          setFinalTicketUrl('https://wa.me/5551999999999'); 
        } finally {
          setIsLoadingUrl(false);
        }
      };

      fetchTicket();
      
      // Animação da caixa de resultado
      gsap.from(resultRef.current, {
        opacity: 0,
        scale: 0.8,
        y: 50,
        duration: 0.8,
        ease: 'back.out(1.7)'
      });
    }
  }, [status]);


  return (
    <div className={styles.container}>
      <div className={styles.mainBox}>
        {status !== 'finished' ? (
          // ... (código do estado inicial e girando, sem alterações)
          <>
            <h1 className={styles.title}>
              {status === 'spinning' ? 'Liberando seu Bilhete...' : 'Bilhete Pronto'}
            </h1>
            <p className={styles.subtitle}>
              {status === 'spinning' ? 'Aguarde um momento...' : 'Toque no botão abaixo para acessar.'}
            </p>
            <div className={styles.roletaWrapper}>
              <div className={styles.roletaViewport}>
                <div className={styles.reel} ref={reelRef}>
                  {items.map((item, index) => (
                    <div key={index} className={styles.item}>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.indicator}></div>
            </div>
            <button onClick={accessTicket} className={styles.spinButton} disabled={status === 'spinning'}>
              {status === 'spinning' ? 'ACESSANDO...' : 'ACESSAR AGORA'}
            </button>
          </>
        ) : (
          <div className={styles.resultContainer} ref={resultRef}>
            <h1 className={styles.title}>BILHETE LIBERADO!</h1>
            <p className={styles.subtitle}>Parabéns! Seu bilhete exclusivo está pronto. Toque no botão abaixo imediatamente.</p>
            
            {/* ✨ BOTÃO FINAL DINÂMICO ✨ */}
            <a 
              href={isLoadingUrl ? '#' : finalTicketUrl} // Usa a URL do estado
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.finalButton}
              style={{ opacity: isLoadingUrl ? 0.7 : 1 }} // Feedback visual de carregamento
            >
              {isLoadingUrl ? 'CARREGANDO BILHETE...' : 'ABRIR MEU BILHETE'}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Roleta;