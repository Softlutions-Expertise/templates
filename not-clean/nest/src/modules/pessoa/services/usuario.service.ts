import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Validator } from 'class-validator';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UsuarioEntity } from '../entities/usuario.entity';

@Injectable()
export class UsuarioService {
  constructor(
    @Inject('USUARIO_REPOSITORY')
    private repository: Repository<UsuarioEntity>,
  ) {}

  findAll(): Promise<UsuarioEntity[]> {
    return this.repository.find({
      relations: ['funcionario'],
    });
  }

  async findOne(id: string): Promise<UsuarioEntity> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['funcionario'],
    });

    if (!entity) {
      throw new NotFoundException(`Responsável não encontrada`);
    }

    return entity;
  }

  async createOrUpdate(data: any, id?: string): Promise<UsuarioEntity> | null {
    const _data = this.checkPropriety(data);

    if (_data === null) return null;

    _data.id = undefined;
    let { novo, ...usuario } = _data;

    if (!novo && typeof id !== 'undefined' && id !== null)
      usuario = await this.repository.preload({
        ...usuario,
        id: id,
      });
    else usuario.id = uuidv4();

    if (novo) usuario = await this.isValid(usuario);

    return await this.repository.save(usuario);
  }

  private async isValid(data: CreateUsuarioDto): Promise<CreateUsuarioDto> {
    const entity = data;

    const validator = new Validator();
    const errors = await validator.validate(entity, {
      validationError: {
        target: false,
        value: false,
      },
    });

    if (errors.length !== 0) throw new BadRequestException(errors);

    return entity;
  }

  private checkPropriety(data: any): CreateUsuarioDto | null {
    if (data !== undefined) return data;

    return null;
  }
}
