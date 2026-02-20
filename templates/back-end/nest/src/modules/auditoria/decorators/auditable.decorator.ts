import { SetMetadata } from '@nestjs/common';

export interface AuditableOptions {
  /** Nome da entidade (ex: 'Product', 'User') */
  entidade: string;
  /** Se deve ignorar este método */
  ignorar?: boolean;
  /** Campos sensíveis para mascarar (ex: ['password']) */
  camposSensiveis?: string[];
}

export const AUDITABLE_KEY = 'auditable';

/**
 * Marca um controller ou método para auditoria automática
 * 
 * @example
 * @Controller('products')
 * @Auditable({ entidade: 'Product' })
 * export class ProductController {}
 * 
 * @Post()
 * @Auditable({ entidade: 'Product', camposSensiveis: ['password'] })
 * create() {}
 */
export const Auditable = (options: AuditableOptions) => 
  SetMetadata(AUDITABLE_KEY, options);
