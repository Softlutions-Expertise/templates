import { IPainelDigitalCreateEdit, IPainelDigitalFindAll } from '@/models';
import { Client, IMessage } from '@stomp/stompjs';
import { useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';

import { api } from '@/services';

// ----------------------------------------------------------------------

interface WebSocketClientProps {
  id: string;
  onMessageReceived: (message: IMessage) => void;
}

async function create(data: IPainelDigitalCreateEdit): Promise<void> {
  const response = await api.local.views.post('/painel', data);
  return response.data;
}

async function findAll(): Promise<IPainelDigitalFindAll[]> {
  const response = await api.local.views.get('/painel');
  return response.data;
}

async function findOneById(id: number | string): Promise<IPainelDigitalFindAll> {
  const response = await api.local.views.get(`/painel/${id}`);
  return response.data;
}

async function update(data: IPainelDigitalCreateEdit): Promise<void> {
  const response = await api.local.views.put(`/painel/${data.id}`, data);
  return response.data;
}

async function remove(id: number | string) {
  const response = await api.local.views.delete(`/painel/${id}`);
  return response.data;
}

const useWebSocket = ({ id, onMessageReceived }: WebSocketClientProps) => {
  const stompClientRef = useRef<Client | null>(null);
  const replyTo = `/temp-queue/${id}`;
  const isDevelopment = process.env.NODE_ENV === 'development';
  let host = '';

  if (typeof window !== 'undefined') {
    const url = new URL(window.location.href);
    host = url.hostname;
  }

  const hostApi = isDevelopment ? process.env.NEXT_PUBLIC_DEV_API : `https://${host || ''}`;

  useEffect(() => {
    const stompClient = new Client({
      webSocketFactory: () => new SockJS(`${hostApi}/views/views-ws`),
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
      beforeConnect: () => {
        stompClient.configure({
          connectHeaders: {
            ['x-api-key']: process.env.NEXT_PUBLIC_API_KEY || '',
          },
        });
      },
    });

    stompClient.onConnect = (frame) => {
      console.log('Connected:', frame);
      stompClient.subscribe(replyTo, (message: IMessage) => {
        if (message.body) {
          console.log('Received message:', message.body);
          onMessageReceived(message);
        } else {
          console.log('Received empty message');
        }
      });

      stompClient.subscribe('/topic/esgotado', (message: IMessage) => {
        if (message.body) {
          console.log('Received message:', message.body);
          onMessageReceived(message);
        } else {
          console.log('Received empty message');
        }
      });

      stompClient.publish({
        destination: `/app/exibicao/connect/${id}`,
        headers: { 'reply-to': replyTo },
        body: JSON.stringify(id),
      });
    };

    stompClient.onStompError = (frame) => {
      console.error('STOMP error:', frame);
    };

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
      if (stompClient) {
        stompClient.deactivate();
      }
    };
  }, []);

  return stompClientRef.current;
};

export const painelDigitalService = {
  create,
  findAll,
  findOneById,
  update,
  remove,
  useWebSocket,
};
