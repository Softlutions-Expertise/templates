import { Address } from "nodemailer/lib/mailer";

export type SendEmailObject = {
    from?: Address,
    recipients?: Address[],
    subject: string,
    html: string,
    text?: string,
    placeholdersReplacements?: Record<string, string>,
    attachments?: { filename: string, content: Buffer }[],
}