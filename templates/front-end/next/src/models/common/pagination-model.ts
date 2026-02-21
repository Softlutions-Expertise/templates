interface IPage {
  number: number;
  size: number;
  offset: number;
  totalElements: boolean;
  totalPages: boolean;
}

export interface IPaginatedResponse<T> {
  content: T[];
  page: IPage;
}

export interface IPaginationParams {
  page: number;
  linesPerPage: number;
  orderBy?: string;
  direction?: string;
  search: string;
  dataInicio?: string | null;
  dataFim?: string | null;
  tipoMovimento?: string | number;
  statusProcesso?: string | number;
  numero?: string;
  destinatario?: string;
}

export interface IPagination {
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

export interface IPaginationSend {
  page: number;
  linesPerPage: number;
  orderBy?: string;
  direction?: string;
}

