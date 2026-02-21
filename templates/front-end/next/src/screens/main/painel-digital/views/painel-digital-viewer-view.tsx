'use client';

import { SplashScreen } from '@/components';
import { useEffect, useState } from 'react';
import { IPainelDigitalViewerMovie, IPainelDigitalViewerPainel } from '@/models';
import { painelDigitalService } from '@/services';
import { IMessage } from '@stomp/stompjs';

import { PainelDigitalEmBreve, PainelDigitalProgramacao } from '../components';

// ----------------------------------------------------------------------

export function PainelDigitalViewerView() {
  const [painel, setPainel] = useState<IPainelDigitalViewerPainel>(
    {} as IPainelDigitalViewerPainel,
  );
  const [currentItem, setCurrentItem] = useState<IPainelDigitalViewerMovie>(
    {} as IPainelDigitalViewerMovie,
  );

  const limiteItens = currentItem?.sessao?.length >= 5;

  const handleNewMessage = (message: IMessage) => {
    const newItem = JSON.parse(message.body);
    setPainel(newItem);
    console.log(newItem);
  };

  function getId(): string {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    document.title = `Painel Digital - ${id?.toString() || 'Cine Laser'}`;
    return id?.toString() || '';
  }

  painelDigitalService.useWebSocket({
    id: getId(),
    onMessageReceived: handleNewMessage,
  });

  useEffect(() => {
    const rotationInterval = setInterval(
      () => {
        setCurrentItem((prevItem) => {
          if (!painel?.conteudo?.length) {
            return prevItem;
          }
          const currentIndex = painel.conteudo.indexOf(prevItem);
          const nextIndex = (currentIndex + 1) % painel.conteudo.length;
          return painel.conteudo[nextIndex];
        });
      },
      limiteItens ? 25000 : 10000,
    );

    return () => clearInterval(rotationInterval);
  }, [painel]);

  if (!currentItem?.titulo?.toString().toUpperCase()) return <SplashScreen variant="tv" />;

  if (painel?.tipoPainel === 1 || painel?.tipoPainel === 5)
    return <PainelDigitalProgramacao limiteItens={limiteItens} currentItem={currentItem} />;

  return <PainelDigitalEmBreve painel={painel} currentItem={currentItem} />;
}
