// ----------------------------------------------------------------------

export enum TipoAcao {
  LOGIN = "login",
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
}

// ----------------------------------------------------------------------

export interface AuditoriaReportFilters {
  startDate?: Date;
  endDate?: Date;
  acao?: TipoAcao;
  usuarioId?: string;
  entidade?: string;
}

// ----------------------------------------------------------------------

export interface AuditoriaReportRow {
  id: string;
  data: string;
  usuario: string;
  acao: TipoAcao;
  acaoLabel: string;
  entidade: string;
  descricao: string;
  ipAddress: string;
}

// ----------------------------------------------------------------------

export interface AuditoriaReportInput {
  filters: AuditoriaReportFilters;
  rows: AuditoriaReportRow[];
  totalRecords: number;
  generatedAt: Date;
}
