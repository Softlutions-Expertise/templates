export interface SessaoVO {
  /** ID único da sessão (hash do JWT) */
  id: string;
  /** Número da sessão (1 = mais recente) */
  numero: number;
  /** Data do primeiro registro da sessão (quando iniciou) */
  dataInicio: Date;
  /** Data do último registro da sessão */
  dataFim: Date;
  /** Quantidade de ações na sessão */
  totalAcoes: number;
  /** IP usado na sessão */
  ipAddress: string | null;
  /** User Agent da sessão */
  userAgent: string | null;
}
