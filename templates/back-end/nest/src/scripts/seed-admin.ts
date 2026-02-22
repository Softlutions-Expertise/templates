/**
 * Script para criar usuário administrador inicial
 * 
 * Uso: npx ts-node -r tsconfig-paths/register src/scripts/seed-admin.ts
 * 
 * Variáveis de ambiente:
 * - ADMIN_NOME: Nome do administrador (padrão: Administrador)
 * - ADMIN_CPF: CPF do administrador (padrão: 00000000000)
 * - ADMIN_USUARIO: Username (padrão: admin)
 * - ADMIN_SENHA: Senha (padrão: admin123)
 */

import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseModule } from '../database/database.module';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { ContatoEntity } from '../modules/base/entities/contato.entity';
import { EnderecoEntity } from '../modules/base/entities/endereco.entity';
import { baseProvider } from '../modules/providers/base.provider';
import { pessoaProvider } from '../modules/providers/pessoa.provider';
import {
  Cargo,
  NivelAcesso,
  NivelEscolaridade,
  PosGraduacaoConcluida,
  Sexo,
  TipoEnsinoMedio,
} from '../modules/pessoa/entities/enums/pessoa.enum';
import { ColaboradorEntity } from '../modules/pessoa/entities/colaborador.entity';
import { PessoaEntity } from '../modules/pessoa/entities/pessoa.entity';
import { UsuarioEntity } from '../modules/pessoa/entities/usuario.entity';

@Module({
  imports: [DatabaseModule, InfrastructureModule],
  providers: [...baseProvider, ...pessoaProvider],
})
class SeedModule {}

interface SeedRepositories {
  colaborador: Repository<ColaboradorEntity>;
  pessoa: Repository<PessoaEntity>;
  usuario: Repository<UsuarioEntity>;
  endereco: Repository<EnderecoEntity>;
  contato: Repository<ContatoEntity>;
}

async function criarAdmin(repositories: SeedRepositories) {
  // Verifica se já existe algum administrador
  const adminExistente = await repositories.colaborador
    .createQueryBuilder('colaborador')
    .innerJoin('colaborador.usuario', 'usuario')
    .where('usuario.nivel_acesso = :nivel', { nivel: NivelAcesso.Administrador })
    .getOne();

  if (adminExistente) {
    console.log('✅ Administrador já existe no sistema.');
    console.log(`   ID: ${adminExistente.id}`);
    return;
  }

  const adminNome = process.env.ADMIN_NOME || 'Administrador';
  const adminCpf = (process.env.ADMIN_CPF || '00000000000').replace(/\D/g, '');
  const adminUsuario = process.env.ADMIN_USUARIO || 'admin';
  const adminSenha = process.env.ADMIN_SENHA || 'admin123';

  console.log('🚀 Criando usuário administrador inicial...');
  console.log(`   Nome: ${adminNome}`);
  console.log(`   Usuário: ${adminUsuario}`);

  // Criar contato
  const contato = await repositories.contato.save({
    id: uuidv4(),
    telefones: [],
    emails: [],
  });

  // Criar endereco
  const endereco = await repositories.endereco.save({
    id: uuidv4(),
    logradouro: '',
    numero: 0,
    bairro: '',
    complemento: '',
    pontoReferencia: '',
    cep: '',
    localizacaoDiferenciada: 'Não' as any,
    zona: 'Urbana' as any,
    latitude: '',
    longitude: '',
  });

  // Criar pessoa
  const pessoa = await repositories.pessoa.save({
    id: uuidv4(),
    nome: adminNome,
    cpf: adminCpf,
    rg: '000000000',
    orgaoExpRg: 'SSP',
    dataNascimento: new Date('1990-01-01'),
    sexo: Sexo.Outro,
    raca: 'NaoDeclarada' as any,
    nacionalidade: 'Brasileira' as any,
    paisNascimento: 'Brasil',
    ufNascimento: 'RO',
    municipioNascimento: 'Porto Velho',
    municipioNascimentoId: '1100205',
    contato,
    enderecos: [endereco],
  });

  // Criar usuario
  const hashedPassword = await bcrypt.hash(adminSenha, 10);
  const usuario = await repositories.usuario.save({
    id: uuidv4(),
    usuario: adminUsuario,
    senha: hashedPassword,
    nivelAcesso: NivelAcesso.Administrador,
    situacaoCadastral: true,
  });

  // Criar colaborador
  const colaborador = await repositories.colaborador.save({
    id: uuidv4(),
    pessoa,
    usuario,
    nivelEscolaridade: NivelEscolaridade.SuperiorCompleto,
    tipoEnsinoMedio: TipoEnsinoMedio.FormacaoGeral,
    posGraduacaoConcluida: PosGraduacaoConcluida.NaoTemPos,
    cargo: Cargo.AdministradorSistema,
    tipoVinculo: null,
    instituicaoId: null,
    instituicaoNome: null,
  });

  console.log('✅ Administrador criado com sucesso!');
  console.log(`   ID: ${colaborador.id}`);
  console.log(`   Pessoa ID: ${pessoa.id}`);
  console.log(`   Usuário ID: ${usuario.id}`);
  console.log('\n⚠️  IMPORTANTE: Altere a senha padrão após o primeiro login!');
}

async function main() {
  const app = await NestFactory.create(SeedModule);
  useContainer(app.select(SeedModule), { fallbackOnErrors: true });

  const repositories: SeedRepositories = {
    colaborador: app.get('COLABORADOR_REPOSITORY'),
    pessoa: app.get('PESSOA_REPOSITORY'),
    usuario: app.get('USUARIO_REPOSITORY'),
    endereco: app.get('ENDERECO_REPOSITORY'),
    contato: app.get('CONTATO_REPOSITORY'),
  };

  try {
    await criarAdmin(repositories);
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao criar administrador:', error.message);
    process.exit(1);
  } finally {
    await app.close();
  }
}

main();
