import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import { uniqBy } from 'lodash';
import * as nodemailer from 'nodemailer';
import Mail, { type Address } from 'nodemailer/lib/mailer';
import PQueue from 'p-queue';
import * as path from 'path';
import { AppEnderecos } from '../../helpers/enderecos';
import eventBus from '../../helpers/eventEmitter.helper';
import { getPRetry } from '../../helpers/p-retry';
import { SendEmailObject } from './objects/send-email';

const recipientsError: Address[] = [
  {
    name: 'Danilo Saiter',
    address: 'danilosaiter@hotmail.com',
  },
  {
    name: 'Gabriel Antunes',
    address: 'gabrielrodantunes@gmail.com',
  },
  {
    name: 'Adrian Henrique',
    address: 'adrianhenriqueferreiraopo@gmail.com',
  },
];

const DEBUG_VAGAS_CREATED = false;

const recipientsVagasCreated: Address[] = DEBUG_VAGAS_CREATED
  ? [
      {
        name: recipientsError[1].name,
        address: recipientsError[1].address,
      },
      {
        name: 'Jackson Bezerra',
        address: 'jackson.ifro@gmail.com',
      },
    ]
  : [];

@Injectable()
export class MailerService {
  #queue = new PQueue({ concurrency: 2 });

  async scheduleJob(
    handler: () => Promise<void>,
    context: { description: string; getArgs: () => any },
    retries = 3,
  ) {
    const PRetry = await getPRetry();

    return PRetry(
      async () => {
        await this.#queue.add(() => handler(), {});
      },
      {
        retries: retries,

        onFailedAttempt: (error) => {
          console.log(
            `Tentativa ${error.attemptNumber} falhou. Há ${error.retriesLeft} tentativa(s) restantes.`,
          );
        },
      },
    ).catch(async (error) => {
      try {
        console.error(`Error in job: "${context.description}": ${error}`);
        const emailData: SendEmailObject = {
          recipients: recipientsError,
          subject: `Error in ${context.description} - Central de Vagas de Creches`,
          html: `<p>Error in ${context.description}:</p>
          <p>${error}</p>
          <p>object: ${JSON.stringify(context.getArgs())}</p>`,
        };
        await this.sendEmail(emailData);
      } catch (error) {
        console.error(`Error in send e-mail: ${error}`);
      }
    });
  }

  constructor() {
    eventBus.on('mailer:enviarComprovanteReservaVaga', async (reservaVaga) => {
      this.processReservaVagaVoucher(reservaVaga);
    });

    eventBus.on('mailer:enviarComprovanteAgendamento', async (agendamento) => {
      this.processAgendamentoVoucher(agendamento);
    });

    eventBus.on('mailer:enviarNotificacaoReservaVaga', async (reservaVaga) => {
      this.processReservaVagaNotification(reservaVaga);
    });

    eventBus.on(
      'mailer:enviarNotificacaoRegistroVagas',
      async (registroVagas) => {
        this.processRegistroVagaNotification(registroVagas);
      },
    );

    eventBus.on(
      'mailer:enviarComprovanteAgendamentoDesmarcado',
      async (agendamento) => {
        this.scheduleJob(
          () => this.processUnscheduledAppointment(agendamento),
          {
            description: 'send email for unschedule appointment',
            getArgs: () => ({ agendamento }),
          },
        );
      },
    );

    eventBus.on(
      'mailer:enviarComprovanteReagendamento',
      async (agendamento) => {
        this.scheduleJob(() => this.processChangedAppointment(agendamento), {
          description: 'send email for changed appointment',
          getArgs: () => ({ agendamento }),
        });
      },
    );

    eventBus.on('mailer:enviarComprovanteEntrevista', async (entrevista) => {
      this.scheduleJob(() => this.processEntrevistaVoucher(entrevista), {
        description: 'send email comprovante entrevista',
        getArgs: () => ({ entrevista }),
      });
    });
  }

  private async mailTransport() {
    const emailSettings = {
      host: process.env.SMTP_HOST,

      port: +process.env.SMTP_PORT,

      tls: {
        rejectUnauthorized: false,
      },

      enableSsl: process.env.SMTP_SECURITY === 'SSL',

      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    };

    const transporter = nodemailer.createTransport({
      host: emailSettings.host,
      port: emailSettings.port,

      auth: emailSettings.auth,

      // secure: emailSettings.enableSsl,
      tls: emailSettings.tls,
    });
    return transporter;
  }

  private async sendEmail(data: SendEmailObject) {
    const { from, recipients, subject, html, attachments } = data;

    const tranport = await this.mailTransport();

    const options: Mail.Options = {
      from: from ?? {
        name: process.env.SMTP_FROM_NAME,
        address: process.env.SMTP_FROM_ADDRESS,
      },
      to: recipients.map((recipient) => recipient.address).join(','),
      subject,
      html,
      attachments,
    };

    try {
      const result = await tranport.sendMail(options);
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  private async processReservaVagaVoucher(reservaVaga: any, attemptsLeft = 3) {
    try {
      const templatePathEmail = path.join(
        'src/modules/mailer/templates/new-comprovante-reserva-vaga.html',
      );
      const sourceEmail = fs.readFileSync(templatePathEmail, 'utf8');
      const templateEmail = handlebars.compile(sourceEmail);
      const email = templateEmail({ reservaVaga });
      console.log(reservaVaga);

      const emailData: SendEmailObject = {
        recipients: [
          {
            name: reservaVaga.crianca.responsavelNome,
            address: reservaVaga.reserva.emailResponsavel,
          },
        ],
        subject: `Comprovante de Reserva de Vaga - ${reservaVaga.codigoReservaVaga} - Central de Vagas de Creches`,
        html: email,
      };

      await this.sendEmail(emailData);
    } catch (error) {
      if (attemptsLeft > 0) {
        console.error(`Error in send e-mail: ${error}`);
        await this.processReservaVagaVoucher(reservaVaga, attemptsLeft - 1);
      } else {
        try {
          console.error(`Error in send e-mail: ${error}`);
          const emailData: SendEmailObject = {
            recipients: recipientsError,
            subject: `Error in processReservaVagaVoucher - Central de Vagas de Creches`,
            html: `<p>Error in processReservaVagaVoucher:</p>
            <p>${error}</p>
            <p>object: ${JSON.stringify(reservaVaga)}</p>`,
          };
          await this.sendEmail(emailData);
        } catch (error) {
          console.error(`Error in send e-mail: ${error}`);
        }
      }
    }
  }

  private async processAgendamentoVoucher(agendamento: any, attemptsLeft = 3) {
    try {
      const templatePathEmail = path.join(
        'src/modules/mailer/templates/new-comprovante-agendamento.html',
      );
      const sourceEmail = fs.readFileSync(templatePathEmail, 'utf8');
      const templateEmail = handlebars.compile(sourceEmail);
      const email = templateEmail({ agendamento });

      const emailData: SendEmailObject = {
        recipients: [
          {
            name: agendamento.responsavel.nome,
            address: agendamento.responsavel.email,
          },
        ],
        subject: `Comprovante de Agendamento - Central de Vagas de Creches`,
        html: email,
      };

      await this.sendEmail(emailData);
    } catch (error) {
      if (attemptsLeft > 0) {
        console.error(`Error in send e-mail: ${error}`);
        await this.processAgendamentoVoucher(agendamento, attemptsLeft - 1);
      } else {
        try {
          console.error(`Error in send e-mail: ${error}`);
          const emailData: SendEmailObject = {
            recipients: recipientsError,
            subject: `Error in processAgendamentoVoucher - Central de Vagas de Creches`,
            html: `<p>Error in processAgendamentoVoucher:</p>
            <p>${error}</p>
            <p>object: ${JSON.stringify(agendamento)}</p>`,
          };
          await this.sendEmail(emailData);
        } catch (error) {
          console.error(`Error in send e-mail: ${error}`);
        }
      }
    }
  }

  private async processRegistroVagaNotification(registroVaga: any) {
    try {
      const templatePathEmail = path.join(
        'src/modules/mailer/templates/notificacao-registro-vagas.html',
      );

      const sourceEmail = fs.readFileSync(templatePathEmail, 'utf8');
      const templateEmail = handlebars.compile(sourceEmail);

      const templateSubject = handlebars.compile(
        `{{registroVaga.quantidadeVagas}} {{#if plural}}novas vagas{{else}}nova vaga{{/if}} - {{ registroVaga.turma.etapa }} / {{ registroVaga.turma.turno }} / {{registroVaga.escola.nomeFantasia}} - Central de Vagas de Creches`,
      );

      for (const recipientVagasCreated of recipientsVagasCreated) {
        registroVaga.interessados.push(recipientVagasCreated);
      }

      registroVaga.interessados = uniqBy(registroVaga.interessados, 'address');

      for (const interessado of registroVaga.interessados) {
        const plural = registroVaga.quantidadeVagas !== 1;

        const email = templateEmail({
          plural,
          interessado,
          registroVaga,
        });

        const subject = templateSubject({
          plural,
          registroVaga,
        });
        const emailData: SendEmailObject = {
          recipients: [
            {
              name: interessado.name,
              address: interessado.address,
            },
          ],
          html: email,
          subject: subject,
        };

        try {
          await this.sendEmail(emailData);
        } catch (error) {
          try {
            console.error(`Error in send e-mail: ${error}`);
            const emailData: SendEmailObject = {
              recipients: recipientsError,
              subject: `Error in processRegistroVagaNotification - Central de Vagas de Creches`,
              html: `<p>Error in processRegistroVagaNotification:</p>
              <p>${error}</p>
              <p>object: ${JSON.stringify(registroVaga)}</p>`,
            };

            await this.sendEmail(emailData);
          } catch (error2) {
            console.error(`Error in send e-mail: ${error2}`);
          }
        }
      }
    } catch (err) {}
  }

  private async processReservaVagaNotification(reservaVaga: any) {
    try {
      const templatePathEmail = path.join(
        'src/modules/mailer/templates/notificacao-reserva-vaga.html',
      );

      const sourceEmail = fs.readFileSync(templatePathEmail, 'utf8');
      const templateEmail = handlebars.compile(sourceEmail);

      const templateSubject = handlebars.compile(
        `Nova Reserva Vaga - {{ reservaVaga.turma.etapa.apelido }} / {{ reservaVaga.turma.turno }} / {{reservaVaga.escola.nomeFantasia}} - Central de Vagas de Creches`,
      );

      reservaVaga.interessados = uniqBy(reservaVaga.interessados, 'address');

      for (const interessado of reservaVaga.interessados) {
        const email = templateEmail({
          interessado,
          reservaVaga,
        });

        const subject = templateSubject({
          reservaVaga,
        });

        const emailData: SendEmailObject = {
          recipients: [
            {
              name: interessado.name,
              address: interessado.address,
            },
          ],
          html: email,
          subject: subject,
        };

        try {
          await this.sendEmail(emailData);
        } catch (error) {
          try {
            console.error(`Error in send e-mail: ${error}`);
            const emailData: SendEmailObject = {
              recipients: recipientsError,
              subject: `Error in processReservaVagaNotification - Central de Vagas de Creches`,
              html: `<p>Error in processReservaVagaNotification:</p>
              <p>${error}</p>
              <p>object: ${JSON.stringify(reservaVaga)}</p>`,
            };

            await this.sendEmail(emailData);
          } catch (error2) {
            console.error(`Error in send e-mail: ${error2}`);
          }
        }
      }
    } catch (err) {}
  }

  /**
   * agendamento desmarcado
   */
  private async processUnscheduledAppointment(agendamento: any) {
    const templatePathEmail = path.join(
      'src/modules/mailer/templates/agendamento-desmarcado.html',
    );

    const sourceEmail = fs.readFileSync(templatePathEmail, 'utf8');
    const templateEmail = handlebars.compile(sourceEmail);
    const email = templateEmail({ agendamento });

    const emailData: SendEmailObject = {
      recipients: [
        {
          name: agendamento.responsavel.nome,
          address: agendamento.responsavel.email,
        },
      ],
      subject: `Agendamento Desmarcado - Central de Vagas de Creches`,
      html: email,
    };

    await this.sendEmail(emailData);
  }

  /**
   * agendamento reagendado
   */
  private async processChangedAppointment(agendamento: any) {
    const templatePathEmail = path.join(
      'src/modules/mailer/templates/agendamento-reagendado.html',
    );

    const sourceEmail = fs.readFileSync(templatePathEmail, 'utf8');
    const templateEmail = handlebars.compile(sourceEmail);
    const email = templateEmail({ agendamento });

    const emailData: SendEmailObject = {
      recipients: [
        {
          name: agendamento.responsavel.nome,
          address: agendamento.responsavel.email,
        },
      ],
      subject: `Agendamento Reagendado - Central de Vagas de Creches`,
      html: email,
    };

    await this.sendEmail(emailData);
  }

  /**
   * comprovante de entrevista
   */
  private async processEntrevistaVoucher(entrevista: any, attemptsLeft = 3) {
    try {
      const templatePathEmail = path.join(
        'src/modules/mailer/templates/comprovante-entrevista.html',
      );
      const sourceEmail = fs.readFileSync(templatePathEmail, 'utf8');
      const templateEmail = handlebars.compile(sourceEmail);

      // Formatando a data para exibição
      const dataEntrevista = new Date(
        entrevista.dataEntrevista,
      ).toLocaleDateString('pt-BR');
      const dataEmissao = new Date().toLocaleDateString('pt-BR');

      // Formatando CPF da criança
      const cpfCriancaFormatado = entrevista.crianca?.cpf
        ? entrevista.crianca.cpf.replace(
            /(\d{3})(\d{3})(\d{3})(\d{2})/,
            '$1.$2.$3-$4',
          )
        : '';

      // Formatando CPF do responsável
      const cpfResponsavelFormatado = entrevista.cpfResponsavel
        ? entrevista.cpfResponsavel.replace(
            /(\d{3})(\d{3})(\d{3})(\d{2})/,
            '$1.$2.$3-$4',
          )
        : '';

      // Formatando data de nascimento da criança
      const dataNascimentoCrianca = entrevista.crianca?.dataNascimento
        ? new Date(entrevista.crianca.dataNascimento).toLocaleDateString(
            'pt-BR',
          )
        : '';

      // Formatando endereço da criança
      const enderecoCompleto = entrevista.crianca?.endereco
        ? `${entrevista.crianca.endereco.logradouro}, nº ${entrevista.crianca.endereco.numero} - ${entrevista.crianca.endereco.bairro}`
        : '';

      // Formatando cidade/UF da criança
      const cidadeUF = entrevista.crianca?.endereco?.cidade
        ? `${entrevista.crianca.endereco.cidade.nome} - ${
            entrevista.crianca.endereco.cidade.estado?.uf || ''
          }`
        : '';

      // Formatando informações de irmão
      const possuiIrmaoUnidade1 = entrevista.possuiIrmaoNaUnidade
        ? 'Sim'
        : '------';
      const nomeIrmao = entrevista.nomeIrmao || '------';

      // Formatando valores de renda e membros da família
      const valorRendaFamiliar = entrevista.valorRendaFamiliar || '------';
      const membrosEndereco = entrevista.membrosEderecoCrianca || '------';
      const membrosContribuintes =
        entrevista.membrosContribuintesRenda || '------';

      // Preparando o objeto com dados formatados para o template
      const entrevistaFormatted = {
        ...entrevista,
        enderecoConsultaQrCode:
          AppEnderecos.getConsultaCidadeCpfFromEntrevista(entrevista),

        enderecoConsulta:
          AppEnderecos.getConsultaCidadeCpfFromEntrevista(entrevista),

        dataEntrevista,
        dataEmissao,
        cpfCriancaFormatado,
        cpfResponsavelFormatado,
        dataNascimentoCrianca,
        enderecoCompleto,
        cidadeUF,
        possuiIrmaoUnidade1,
        nomeIrmao,
        valorRendaFamiliar,
        membrosEndereco,
        membrosContribuintes,
        preferenciaTurno2Display: entrevista.preferenciaTurno2 || '------',
        preferenciaUnidade2Display:
          entrevista.preferenciaUnidade2?.nomeFantasia || '------',
        possuiIrmaoUnidade2: '------', // Assumindo que não há dados específicos para segunda preferência
      };

      const email = templateEmail({ entrevista: entrevistaFormatted });

      // Buscar email do responsável na entidade criança
      let emailResponsavel = null;
      if (
        entrevista.crianca?.contato?.emails &&
        Array.isArray(entrevista.crianca.contato.emails)
      ) {
        // Buscar primeiro email principal ou primeiro email disponível
        const emailPrincipal = entrevista.crianca.contato.emails.find(
          (e) => e.principal,
        );
        emailResponsavel = emailPrincipal
          ? emailPrincipal.email
          : entrevista.crianca.contato.emails.length > 0
          ? entrevista.crianca.contato.emails[0].email
          : null;
      }

      if (!emailResponsavel) {
        console.warn(
          'Email do responsável não encontrado para entrevista:',
          entrevista.id,
        );
        return;
      }

      const emailData: SendEmailObject = {
        recipients: [
          {
            name: entrevista.nomeResponsavel,
            address: emailResponsavel,
          },
        ],
        subject: `Comprovante de Entrevista - Central de Vagas de Creches`,
        html: email,
      };

      await this.sendEmail(emailData);
    } catch (error) {
      if (attemptsLeft > 0) {
        console.error(`Error in send e-mail: ${error}`);
        await this.processEntrevistaVoucher(entrevista, attemptsLeft - 1);
      } else {
        try {
          console.error(`Error in send e-mail: ${error}`);
          const emailData: SendEmailObject = {
            recipients: recipientsError,
            subject: `Error in processEntrevistaVoucher - Central de Vagas de Creches`,
            html: `<p>Error in processEntrevistaVoucher:</p>
            <p>${error}</p>
            <p>object: ${JSON.stringify(entrevista)}</p>`,
          };
          await this.sendEmail(emailData);
        } catch (error) {
          console.error(`Error in send e-mail: ${error}`);
        }
      }
    }
  }
}
