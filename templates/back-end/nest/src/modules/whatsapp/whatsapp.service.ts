import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import PQueue from 'p-queue';
import * as path from 'path';
import { AppEnderecos } from '../../helpers/enderecos';
import eventBus from '../../helpers/eventEmitter.helper';
import { getPRetry } from '../../helpers/p-retry';
import { EntrevistaService } from '../entrevista/services/entrevista.service';
import { SendWhatsAppObject } from './objects/send-whatsapp';



const recipientsError: string[] = [
  '5511999999999', // Substitua pelos números reais em formato internacional
  '5511888888888',
  '5511777777777',
];

const DEBUG_VAGAS_CREATED = false;

const recipientsVagasCreated: string[] = DEBUG_VAGAS_CREATED
  ? ['5511999999999', '5511888888888']
  : [];

@Injectable()
export class WhatsAppService implements OnModuleInit, OnModuleDestroy {
  readonly #queue = new PQueue({ concurrency: 1 }); // WhatsApp tem limites mais rígidos, usar concorrência 1
  #isReady = false;

  // Evolution API configuration
  private readonly evolutionApiUrl = process.env.EVOLUTION_API_URL;
  private readonly evolutionApiKey = process.env.EVOLUTION_API_KEY;
  private readonly evolutionInstanceName = process.env.EVOLUTION_INSTANCE_NAME || 'dpe-notificacoes';
  private evolutionInstanceToken = process.env.EVOLUTION_INSTANCE_TOKEN || '92A161F6BFC8-4C29-A03B-7FED7ADC6FFA';

  // Método utilitário para formatar data e horário
  private formatDateTime(
    dateValue: any,
    timeValue?: any,
  ): { data: string; horario: string } {
    let formattedDate = 'N/A';
    let formattedTime = 'N/A';

    try {
      // Tratar data
      if (dateValue) {
        const date = new Date(dateValue);
        if (!isNaN(date.getTime())) {
          formattedDate = date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          });
        }
      }

      // Tratar horário
      if (timeValue) {
        // Se for uma string de horário simples (ex: "14:30")
        if (typeof timeValue === 'string' && timeValue.includes(':')) {
          formattedTime = timeValue;
        }
        // Se for um objeto Date
        else if (timeValue instanceof Date || typeof timeValue === 'string') {
          const time = new Date(timeValue);
          if (!isNaN(time.getTime())) {
            formattedTime = time.toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            });
          }
        }
      }
      // Se não tiver horário separado, tentar extrair da data
      else if (dateValue) {
        const date = new Date(dateValue);
        if (!isNaN(date.getTime())) {
          const hours = date.getHours();
          const minutes = date.getMinutes();
          if (hours !== 0 || minutes !== 0) {
            formattedTime = date.toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            });
          }
        }
      }
    } catch (error) {
      console.warn('Erro ao formatar data/horário:', error);
    }

    return { data: formattedDate, horario: formattedTime };
  }

  constructor(private readonly entrevistaService: EntrevistaService) {}

  // Método para converter número do WhatsApp para formato brasileiro
  private formatPhoneNumberToBrazilian(phone: string): string {
    // Remove todos os caracteres não numéricos
    let cleaned = phone.replace(/[^\d]/g, '');

    // Remove código do país 55 se presente
    if (cleaned.startsWith('55') && cleaned.length > 11) {
      cleaned = cleaned.substring(2);
    }

    // Garante que tem 11 dígitos (adiciona 9 se necessário)
    if (
      cleaned.length === 10 &&
      ['6', '7', '8', '9'].includes(cleaned.charAt(2))
    ) {
      cleaned = cleaned.substring(0, 2) + '9' + cleaned.substring(2);
    }

    // Formata no padrão brasileiro: (XX) 9 XXXX-XXXX
    if (cleaned.length === 11) {
      const ddd = cleaned.substring(0, 2);
      const nono = cleaned.charAt(2);
      const parte1 = cleaned.substring(3, 7);
      const parte2 = cleaned.substring(7, 11);
      const formatted = `(${ddd}) ${nono} ${parte1}-${parte2}`;
      return formatted;
    }

    return phone;
  }

  private async findSemedByPhoneNumber(phoneNumber: string): Promise<any> {
    try {
      const formattedPhone = this.formatPhoneNumberToBrazilian(phoneNumber);

      const queryRunner =
        this.entrevistaService.entrevistaRepository.manager.connection.createQueryRunner();

      try {
        const rawQuery = `
          SELECT 
            sm.id,
            sm.nome_fantasia,
            sm.razao_social,
            sm.secretario,
            sm_contato.telefones as semed_telefones,
            e.logradouro,
            e.numero as endereco_numero,
            e.bairro,
            c.nome as cidade_nome,
            est.uf as estado_uf
          FROM entrevista ent
          INNER JOIN crianca cr ON ent.crianca_id = cr.id
          INNER JOIN base_contato ct ON cr.contato_id = ct.id
          INNER JOIN secretaria_municipal sm ON ent.secretaria_municipal_id = sm.id
          LEFT JOIN base_contato sm_contato ON sm.contato_id = sm_contato.id
          LEFT JOIN base_endereco e ON sm.endereco_id = e.id
          LEFT JOIN cidade c ON e.cidade_id = c.id
          LEFT JOIN estado est ON c.estado_id = est.id
          WHERE ct.telefones::text LIKE $1
          ORDER BY ent.created_at DESC
          LIMIT 1
        `;

        const searchPattern = `%${formattedPhone}%`;

        const result = await queryRunner.manager.query(rawQuery, [
          searchPattern,
        ]);
        await queryRunner.release();

        if (result && result.length > 0) {
          const semed = result[0];

          let enderecoCompleto = '';
          if (semed.logradouro && semed.endereco_numero) {
            enderecoCompleto = `${semed.logradouro}, ${semed.endereco_numero}`;
            if (semed.bairro) enderecoCompleto += ` - ${semed.bairro}`;
          }

          let cidadeUF = '';
          if (semed.cidade_nome) {
            cidadeUF = semed.cidade_nome;
            if (semed.estado_uf) cidadeUF += `/${semed.estado_uf}`;
          }

          let telefonesSemed = [];
          if (semed.semed_telefones) {
            try {
              const telefonesJson = JSON.parse(semed.semed_telefones);
              if (Array.isArray(telefonesJson)) {
                telefonesSemed = telefonesJson
                  .map((tel) => tel.numero)
                  .filter(Boolean);
              }
            } catch (e) {
              console.warn('Erro ao parsear telefones da SEMED:', e);
            }
          }

          return {
            id: semed.id,
            nomeFantasia: semed.nome_fantasia,
            razaoSocial: semed.razao_social,
            nomeSecretariaMunicipal: semed.nome_fantasia || semed.razao_social,
            secretario: semed.secretario,
            telefones: telefonesSemed,
            endereco: enderecoCompleto,
            cidade: cidadeUF,
          };
        }

        return null;
      } catch (queryError) {
        console.error(' Erro na query principal:', queryError.message);
        await queryRunner.release();
        return null;
      }
    } catch (error) {
      console.error('Erro ao buscar SEMED por telefone:', error);
      return null;
    }
  }

  // Método utilitário para carregar templates
  private loadTemplate(templateName: string, context: any = {}): string {
    const templatePath = path.join(
      'src/modules/whatsapp/templates',
      templateName,
    );

    try {
      if (fs.existsSync(templatePath)) {
        const source = fs.readFileSync(templatePath, 'utf8');
        const template = handlebars.compile(source);
        return template(context);
      } else {
        throw new Error(`Template não encontrado: ${templatePath}`);
      }
    } catch (error) {
      console.error(`Erro ao carregar template ${templateName}:`, error);
      throw error;
    }
  }


  async scheduleJob(
    handler: () => Promise<void>,
    context: { description: string; getArgs: () => any },
    retries = 3,
  ) {
    const PRetry = await getPRetry();

    return PRetry(
      async () => {
        if (!this.#isReady) {
          throw new Error('WhatsApp client is not ready');
        }
        await this.#queue.add(() => handler(), {});
      },
      {
        retries: retries,
        onFailedAttempt: (error) => {
          // Log silencioso das tentativas
        },
      },
    ).catch(async (error) => {
      try {
        console.error(
          `Error in WhatsApp job: "${context.description}": ${error}`,
        );
        const whatsappData: SendWhatsAppObject = {
          recipients: recipientsError,
          message: ` Erro em ${
            context.description
          }:\n\n${error}\n\nObject: ${JSON.stringify(context.getArgs())}`,
        };
        await this.sendMessage(whatsappData);
      } catch (error) {
        console.error(`Error in send WhatsApp message: ${error}`);
      }
    });
  }

  async onModuleInit() {
    this.#isReady = true;
    this.setupEventListeners();
  }

  async onModuleDestroy() {
    this.#isReady = false;
  }



  private setupEventListeners() {
    eventBus.on(
      'whatsapp:enviarComprovanteReservaVaga',
      async (reservaVaga) => {
        this.processReservaVagaVoucher(reservaVaga);
      },
    );

    eventBus.on(
      'whatsapp:enviarComprovanteAgendamento',
      async (agendamento) => {
        this.processAgendamentoVoucher(agendamento);
      },
    );

    eventBus.on(
      'whatsapp:enviarNotificacaoReservaVaga',
      async (reservaVaga) => {
        this.processReservaVagaNotification(reservaVaga);
      },
    );

    eventBus.on(
      'whatsapp:enviarNotificacaoRegistroVagas',
      async (registroVagas) => {
        this.processRegistroVagaNotification(registroVagas);
      },
    );

    eventBus.on(
      'whatsapp:enviarComprovanteAgendamentoDesmarcado',
      async (agendamento) => {
        this.scheduleJob(
          () => this.processUnscheduledAppointment(agendamento),
          {
            description: 'send WhatsApp message for unschedule appointment',
            getArgs: () => ({ agendamento }),
          },
        );
      },
    );

    eventBus.on(
      'whatsapp:enviarComprovanteReagendamento',
      async (agendamento) => {
        this.scheduleJob(() => this.processChangedAppointment(agendamento), {
          description: 'send WhatsApp message for changed appointment',
          getArgs: () => ({ agendamento }),
        });
      },
    );

    eventBus.on('whatsapp:enviarComprovanteEntrevista', async (entrevista) => {
      this.scheduleJob(() => this.processEntrevistaVoucher(entrevista), {
        description: 'send WhatsApp message comprovante entrevista',
        getArgs: () => ({ entrevista }),
      });
    });
  }

  // Evolution API methods
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
      
      if (instance && instance.connectionStatus === 'open') {
        // Atualizar o token da instância ativa
        this.evolutionInstanceToken = instance.token;
        return true;
      }
      
      return false;
    } catch (error) {
      return false;
    }
  }

  private async createInstance(): Promise<boolean> {
    try {
      // Primeiro, vamos verificar se existe alguma instância ativa
      const response = await axios.get(
        `${this.evolutionApiUrl}/instance/fetchInstances`,
        {
          headers: {
            'apikey': this.evolutionApiKey,
          },
        }
      );
      
      const instances = response.data;
      const activeInstance = instances.find(i => i.name === this.evolutionInstanceName && i.connectionStatus === 'open');
      
      if (activeInstance) {
        // Atualizar o token da instância ativa
        this.evolutionInstanceToken = activeInstance.token;
        return true;
      }
      
      return false;
    } catch (error) {
      return false;
    }
  }

  private async sendMessage(data: SendWhatsAppObject) {
    const { recipients, message } = data;
    const nodeEnv = process.env.NODE_ENV || 'production';

    

    if (!this.#isReady) {
      return [];
    }

    // Verificar se a instância está ativa
    const isInstanceActive = await this.checkInstanceStatus();
    if (!isInstanceActive) {
      const instanceFound = await this.createInstance();
      if (!instanceFound) {
        return [];
      }
    }

    const results = [];

    for (const recipient of recipients) {
      try {
        // Limpar número removendo todos os caracteres não numéricos
        let baseNumber = recipient.replace(/[^\d]/g, '');

        // Remover código do país se presente
        if (baseNumber.startsWith('55') && baseNumber.length >= 12) {
          baseNumber = baseNumber.substring(2);
        }

        // Usar apenas o formato que funciona: "Sem 9 + 55"
        let finalNumber;
        let description;

        // Se tiver 11 dígitos (DDD + 9), remover o 9 e adicionar 55
        if (baseNumber.length === 11 && baseNumber.charAt(2) === '9') {
          const without9 = baseNumber.substring(0, 2) + baseNumber.substring(3);
          finalNumber = '55' + without9;
          description = 'Sem 9 + 55';
        }
        // Se tiver 10 dígitos (DDD + 8), apenas adicionar 55
        else if (baseNumber.length === 10) {
          finalNumber = '55' + baseNumber;
          description = 'Original + 55';
        }
        // Se já tiver 55, usar como está
        else if (baseNumber.startsWith('55') && baseNumber.length >= 12) {
          finalNumber = baseNumber;
          description = 'Formato completo';
        }
        // Fallback: adicionar 55
        else {
          finalNumber = '55' + baseNumber;
          description = 'Fallback + 55';
        }

        try {
          // Enviar mensagem via Evolution API
          const response = await axios.post(
            `${this.evolutionApiUrl}/message/sendText/${this.evolutionInstanceName}`,
            {
              number: finalNumber,
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
            console.log(`✅ WhatsApp enviado para ${finalNumber}`);
            results.push(response.data);
          } else {
            console.error(`❌ Erro ao enviar WhatsApp para ${finalNumber}: resposta inválida`);
          }
        } catch (sendError) {
          console.error(`❌ Erro ao enviar WhatsApp para ${finalNumber}: ${sendError.message}`);
        }
      } catch (error) {
        console.error(`❌ Erro ao processar WhatsApp para ${recipient}: ${error.message}`);
      }
    }

    return results;
  }

  private async processReservaVagaVoucher(reservaVaga: any, attemptsLeft = 3) {
    try {
      const context = {
        reservaVaga,
      };

      const messageTemplate = this.loadTemplate(
        'comprovante-reserva-vaga.txt',
        context,
      );

      // Buscar telefone do responsável na estrutura correta
      const telefone =
        reservaVaga.reserva?.telefoneResponsavel?.numero ||
        reservaVaga.crianca?.contato?.telefones?.find((t) => t.principal)
          ?.numero ||
        reservaVaga.crianca?.contato?.telefones?.[0]?.numero;

      if (!telefone) {
        console.warn('⚠️ Telefone não encontrado para reserva de vaga:', {
          reservaId: reservaVaga.id,
          codigoReserva: reservaVaga.codigoReservaVaga,
          telefoneReserva: reservaVaga.reserva?.telefoneResponsavel,
          criancaContatos: reservaVaga.crianca?.contato?.telefones,
        });
        return;
      }

      const whatsappData: SendWhatsAppObject = {
        recipients: [telefone].filter(Boolean),
        message: messageTemplate,
      };

      await this.sendMessage(whatsappData);
    } catch (error) {
      console.error('Error in processReservaVagaVoucher:', error);
      if (attemptsLeft > 0) {
        setTimeout(() => {
          this.processReservaVagaVoucher(reservaVaga, attemptsLeft - 1);
        }, 5000);
      }
    }
  }

  private async processAgendamentoVoucher(agendamento: any) {
    this.scheduleJob(
      async () => {
        const context = {
          agendamento,
        };

        const messageTemplate = this.loadTemplate(
          'comprovante-agendamento.txt',
          context,
        );

        const whatsappData: SendWhatsAppObject = {
          recipients: [agendamento.telefone].filter(Boolean),
          message: messageTemplate,
        };

        await this.sendMessage(whatsappData);
      },
      {
        description: 'send WhatsApp message comprovante agendamento',
        getArgs: () => ({ agendamento }),
      },
    );
  }

  private async processReservaVagaNotification(reservaVaga: any) {
    this.scheduleJob(
      async () => {
        // Formatando data da criança
        const { data: dataNascimentoFormatada } = this.formatDateTime(
          reservaVaga.crianca?.dataNascimento,
        );

        const context = {
          reservaVaga,
          dataNascimentoFormatada,
        };

        const messageTemplate = this.loadTemplate(
          'notificacao-reserva-vaga.txt',
          context,
        );

        // Buscar telefone do responsável na estrutura correta
        const telefone =
          reservaVaga.reserva?.telefoneResponsavel?.numero ||
          reservaVaga.crianca?.contato?.telefones?.find((t) => t.principal)
            ?.numero ||
          reservaVaga.crianca?.contato?.telefones?.[0]?.numero ||
          reservaVaga.telefoneResponsavel?.numero;

        const whatsappData: SendWhatsAppObject = {
          recipients: [telefone].filter(Boolean),
          message: messageTemplate,
        };

        await this.sendMessage(whatsappData);
      },
      {
        description: 'send WhatsApp notification reserva vaga',
        getArgs: () => ({ reservaVaga }),
      },
    );
  }

  private async processRegistroVagaNotification(registroVagas: any) {
    this.scheduleJob(
      async () => {
        const messageTemplate = this.loadTemplate(
          'notificacao-registro-vagas.txt',
          { registroVagas },
        );

        const whatsappData: SendWhatsAppObject = {
          recipients: recipientsVagasCreated,
          message: messageTemplate,
        };

        if (recipientsVagasCreated.length > 0) {
          await this.sendMessage(whatsappData);
        }
      },
      {
        description: 'send WhatsApp notification registro vagas',
        getArgs: () => ({ registroVagas }),
      },
    );
  }

  private async processUnscheduledAppointment(agendamento: any) {
    // Formatando dados
    const { data: dataFormatada, horario: horarioFormatado } =
      this.formatDateTime(agendamento.data, agendamento.horario);

    const context = {
      agendamento,
      dataFormatada,
      horarioFormatado,
    };

    const messageTemplate = this.loadTemplate(
      'agendamento-desmarcado.txt',
      context,
    );

    const whatsappData: SendWhatsAppObject = {
      recipients: [agendamento.telefone].filter(Boolean),
      message: messageTemplate,
    };

    await this.sendMessage(whatsappData);
  }

  private async processChangedAppointment(agendamento: any) {
    // Formatando dados
    const { data: dataFormatada, horario: horarioFormatado } =
      this.formatDateTime(agendamento.data, agendamento.horario);

    const context = {
      agendamento,
      dataFormatada,
      horarioFormatado,
    };

    const messageTemplate = this.loadTemplate(
      'agendamento-reagendado.txt',
      context,
    );

    const whatsappData: SendWhatsAppObject = {
      recipients: [agendamento.telefone].filter(Boolean),
      message: messageTemplate,
    };

    await this.sendMessage(whatsappData);
  }

  private async processEntrevistaVoucher(entrevista: any) {
    try {
      // Formatando dados da mesma forma que o email
      const dataEntrevista = entrevista.dataEntrevista
        ? new Date(entrevista.dataEntrevista).toLocaleDateString('pt-BR')
        : 'N/A';

      const horarioEntrevista =
        entrevista.horarioEntrevista || entrevista.horario || 'N/A';

      // Formatando CPF da criança
      const cpfCriancaFormatado = entrevista.crianca?.cpf
        ? entrevista.crianca.cpf.replace(
            /(\d{3})(\d{3})(\d{3})(\d{2})/,
            '$1.$2.$3-$4',
          )
        : 'N/A';

      // Formatando endereço completo da criança
      const enderecoCompleto = entrevista.crianca?.endereco
        ? `${entrevista.crianca.endereco.logradouro}, nº ${entrevista.crianca.endereco.numero} - ${entrevista.crianca.endereco.bairro}`
        : 'N/A';

      // Formatando cidade/UF da criança
      const cidadeUF = entrevista.crianca?.endereco?.cidade
        ? `${entrevista.crianca.endereco.cidade.nome} - ${
            entrevista.crianca.endereco.cidade.estado?.uf || ''
          }`
        : 'N/A';

      // Formatando local da entrevista
      const nomeLocal =
        entrevista.secretariaMunicipal?.nomeFantasia ||
        entrevista.localAtendimento?.nome ||
        entrevista.local?.nome ||
        'N/A';

      const enderecoLocal = entrevista.secretariaMunicipal?.endereco
        ? `${entrevista.secretariaMunicipal.endereco.logradouro}, ${entrevista.secretariaMunicipal.endereco.numero} - ${entrevista.secretariaMunicipal.endereco.bairro}`
        : entrevista.localAtendimento?.endereco ||
          entrevista.local?.endereco ||
          'N/A';

      // Preparando contexto com dados formatados
      const context = {
        enderecoConsulta:
          AppEnderecos.getConsultaCidadeCpfFromEntrevista(entrevista),

        entrevista,
        dataEntrevista,
        horarioEntrevista,
        cpfCriancaFormatado,
        enderecoCompleto,
        cidadeUF,
        nomeLocal,
        enderecoLocal,
        dataNascimentoCrianca: entrevista.crianca?.dataNascimento
          ? new Date(entrevista.crianca.dataNascimento).toLocaleDateString(
              'pt-BR',
            )
          : 'N/A',
      };

      const messageTemplate = this.loadTemplate(
        'comprovante-entrevista.txt',
        context,
      );

      // Buscar número de telefone em várias possibilidades
      const telefonePrincipal = entrevista.crianca?.contato?.telefones?.find(
        (t) => t.principal,
      );

      let telefone;
      if (telefonePrincipal) {
        telefone = telefonePrincipal.numero;
      } else if (entrevista.crianca?.contato?.telefones?.length > 0) {
        telefone = entrevista.crianca.contato.telefones[0].numero;
      } else {
        telefone =
          entrevista.pessoa?.telefone ||
          entrevista.responsavel?.telefone ||
          entrevista.telefone;
      }

      if (!telefone) {
        console.warn('⚠️ Telefone não encontrado para entrevista');
        return;
      }

      const whatsappData: SendWhatsAppObject = {
        recipients: [telefone].filter(Boolean),
        message: messageTemplate,
      };

      await this.sendMessage(whatsappData);
    } catch (error) {
      console.error('❌ Erro ao processar comprovante de entrevista:', error);
      throw error;
    }
  }

  public async sendDirectMessage(
    phoneNumber: string,
    message: string,
  ): Promise<any> {
    const data: SendWhatsAppObject = {
      recipients: [phoneNumber],
      message,
    };
    return this.sendMessage(data);
  }

  public async sendBulkMessage(
    phoneNumbers: string[],
    message: string,
  ): Promise<any[]> {
    const data: SendWhatsAppObject = {
      recipients: phoneNumbers,
      message,
    };
    return this.sendMessage(data);
  }

  public isClientReady(): boolean {
    return this.#isReady;
  }
}
