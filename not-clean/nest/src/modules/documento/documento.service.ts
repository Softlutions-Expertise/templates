import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { DocumentoEntity } from './documento.entity';

@Injectable()
export class DocumentoService {
  constructor(
    @Inject('DOCUMENTO_REPOSITORY')
    private readonly repository: Repository<DocumentoEntity>,
  ) {}
}
