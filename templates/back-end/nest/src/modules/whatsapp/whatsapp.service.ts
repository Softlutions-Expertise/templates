import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { SendWhatsAppObject } from './objects/send-whatsapp';

/**
 * Serviço de WhatsApp - Template para implementação
 * 
 * Este serviço serve como base para integração com APIs de WhatsApp.
 * Configure as variáveis de ambiente EVOLUTION_* para utilizar.
 */
@Injectable()
export class WhatsAppService {
  // Evolution API configuration
  private readonly evolutionApiUrl = process.env.EVOLUTION_API_URL;
  private readonly evolutionApiKey = process.env.EVOLUTION_API_KEY;
  private readonly evolutionInstanceName = process.env.EVOLUTION_INSTANCE_NAME || 'default';

  /**
   * Verifica se a instância está ativa
   */
  private async checkInstanceStatus(): Promise<boolean> {
    try {
      const response = await axios.get(
        `${this.evolutionApiUrl}/instance/fetchInstances`,
        {
          headers: {
            'apikey': this.evolutionApiKey,
          },
        }
      );
      
      const instances = response.data;
      const instance = instances.find(i => i.name === this.evolutionInstanceName);
      
      return instance?.connectionStatus === 'open';
    } catch (error) {
      console.error('Error checking WhatsApp instance status:', error);
      return false;
    }
  }

  /**
   * Envia uma mensagem via WhatsApp
   */
  async sendMessage(data: SendWhatsAppObject): Promise<any[]> {
    const { recipients, message } = data;

    if (!this.evolutionApiUrl || !this.evolutionApiKey) {
      console.warn('WhatsApp API not configured');
      return [];
    }

    // Verificar se a instância está ativa
    const isInstanceActive = await this.checkInstanceStatus();
    if (!isInstanceActive) {
      console.warn('WhatsApp instance not active');
      return [];
    }

    const results = [];

    for (const recipient of recipients) {
      try {
        // Limpar número removendo todos os caracteres não numéricos
        let phoneNumber = recipient.replace(/[^\d]/g, '');

        // Adicionar código do país se não presente
        if (!phoneNumber.startsWith('55')) {
          phoneNumber = '55' + phoneNumber;
        }

        // Enviar mensagem via Evolution API
        const response = await axios.post(
          `${this.evolutionApiUrl}/message/sendText/${this.evolutionInstanceName}`,
          {
            number: phoneNumber,
            text: message,
          },
          {
            headers: {
              'apikey': this.evolutionApiKey,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.data?.key?.id) {
          results.push(response.data);
        }
      } catch (error) {
        console.error(`Error sending WhatsApp message to ${recipient}:`, error);
      }
    }

    return results;
  }

  /**
   * Envia mensagem direta para um número
   */
  async sendDirectMessage(phoneNumber: string, message: string): Promise<any> {
    const data: SendWhatsAppObject = {
      recipients: [phoneNumber],
      message,
    };
    return this.sendMessage(data);
  }
}
