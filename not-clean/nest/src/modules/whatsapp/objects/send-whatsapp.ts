export type SendWhatsAppObject = {
    recipients: string[], // Array de números de telefone no formato internacional
    message: string,
    placeholdersReplacements?: Record<string, string>,
    attachments?: { 
        filename: string, 
        content: Buffer,
        mimetype?: string 
    }[],
}
