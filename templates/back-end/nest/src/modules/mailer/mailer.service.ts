import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { SendEmailObject } from './objects/send-email';

/**
 * Serviço de Email - Template para implementação
 * 
 * Este serviço serve como base para implementar o envio de emails.
 * Configure as variáveis de ambiente SMTP_* para utilizar.
 */
@Injectable()
export class MailerService {
  private async mailTransport() {
    const emailSettings = {
      host: process.env.SMTP_HOST,
      port: +process.env.SMTP_PORT,
      tls: {
        rejectUnauthorized: false,
      },
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    };

    const transporter = nodemailer.createTransport({
      host: emailSettings.host,
      port: emailSettings.port,
      auth: emailSettings.auth,
      tls: emailSettings.tls,
    });

    return transporter;
  }

  /**
   * Envia um email
   */
  async sendEmail(data: SendEmailObject) {
    const { from, recipients, subject, html, attachments } = data;

    const transport = await this.mailTransport();

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
      const result = await transport.sendMail(options);
      return result;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}
