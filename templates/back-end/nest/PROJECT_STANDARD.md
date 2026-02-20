# NESTJS PROJECT ARCHITECTURE STANDARD

> **Template de arquitetura para APIs NestJS com TypeScript, TypeORM e autenticação JWT**
> 
> **Stack:** NestJS 10+, TypeScript 5+, TypeORM, PostgreSQL, JWT, Swagger, MinIO  
> **Arquitetura:** Modular, Layered Architecture

---

## 📋 SUMÁRIO

1. [Stack Tecnológico](#1-stack-tecnológico)
2. [Arquitetura em Camadas](#2-arquitetura-em-camadas)
3. [Estrutura de Diretórios](#3-estrutura-de-diretórios)
4. [Padrões de Código](#4-padrões-de-código)
5. [Módulos](#5-módulos)
6. [Controllers](#6-controllers)
7. [Services](#7-services)
8. [Entities & DTOs](#8-entities--dtos)
9. [Autenticação](#9-autenticação)
10. [Banco de Dados](#10-banco-de-dados)
11. [Padrão CRUD Completo](#11-padrão-crud-completo)
12. [Configurações](#12-configurações)

---

## 1. STACK TECNOLÓGICO

```yaml
Core:
  Framework: NestJS 10.4+
  Linguagem: TypeScript 5.8+
  Runtime: Node.js >= 20.x

Database:
  ORM: TypeORM 0.3+
  Database: PostgreSQL 15+
  Migrations: TypeORM CLI

Autenticação & Segurança:
  JWT: @nestjs/passport + passport-jwt
  Criptografia: bcrypt
  Validação: class-validator + class-transformer

Documentação:
  Swagger: @nestjs/swagger

Storage:
  Files: MinIO / AWS S3

Email:
  SMTP: @nestjs-modules/mailer + nodemailer

Utilitários:
  Date: date-fns
  Pagination: nestjs-paginate
  Utils: uuid, rxjs
```

---

## 2. ARQUITETURA EM CAMADAS

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ Controllers │  │    DTOs     │  │   Decorators        │  │
│  │   (Routes)  │  │  (Input)    │  │   (Custom)          │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                   APPLICATION LAYER                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Services  │  │   Guards    │  │   Interceptors      │  │
│  │  (Business) │  │  (Auth/Role)│  │   (Transform)       │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                    DOMAIN LAYER                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Entities  │  │   Enums     │  │   Interfaces        │  │
│  │  (Models)   │  │ (Constants) │  │   (Contracts)       │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                   INFRASTRUCTURE LAYER                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ Repositories│  │  Database   │  │   External APIs     │  │
│  │  (TypeORM)  │  │  (Postgre)  │  │   (MinIO, SMTP)     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. ESTRUTURA DE DIRETÓRIOS

```
my-project/
├── src/
│   ├── database/                     # Configuração do banco de dados
│   │   ├── migrations/               # Migrations TypeORM
│   │   │   ├── 1700000000000-create_users_table.ts
│   │   │   └── ...
│   │   ├── database.module.ts
│   │   ├── database.providers.ts
│   │   └── typeorm.config.ts
│   │
│   ├── helpers/                      # Utilitários e helpers globais
│   │   ├── decorators/               # Decorators customizados
│   │   │   ├── current-user.decorator.ts
│   │   │   ├── public.decorator.ts
│   │   │   └── index.ts
│   │   ├── dtos/                     # DTOs compartilhados
│   │   │   ├── pagination.dto.ts
│   │   │   └── api-response.dto.ts
│   │   ├── functions/                # Funções utilitárias
│   │   ├── interceptors/             # Interceptors globais
│   │   └── validators/               # Validadores customizados
│   │
│   ├── infrastructure/               # Infraestrutura da aplicação
│   │   ├── authentication/           # Autenticação JWT
│   │   │   ├── dto/
│   │   │   │   ├── login.dto.ts
│   │   │   │   └── register.dto.ts
│   │   │   ├── strategies/
│   │   │   │   └── jwt.strategy.ts
│   │   │   ├── authentication.controller.ts
│   │   │   ├── authentication.service.ts
│   │   │   ├── authentication.module.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── authorization/            # Autorização e roles
│   │   │   ├── authorization.service.ts
│   │   │   └── authorization.module.ts
│   │   │
│   │   └── arquivo/                  # Gerenciamento de arquivos
│   │       ├── entities/
│   │       ├── arquivo.service.ts
│   │       ├── arquivo.module.ts
│   │       └── index.ts
│   │
│   ├── modules/                      # Módulos da aplicação (Features)
│   │   ├── auth/                     # Troca de senha (Feature)
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   └── auth.module.ts
│   │   │
│   │   ├── base/                     # Entidades base (User)
│   │   │   ├── entities/
│   │   │   │   └── user.entity.ts
│   │   │   ├── dto/
│   │   │   └── base.module.ts
│   │   │
│   │   └── example/                  # Módulo de exemplo (CRUD)
│   │       ├── controllers/
│   │       │   └── example.controller.ts
│   │       ├── services/
│   │       │   └── example.service.ts
│   │       ├── entities/
│   │       │   └── example.entity.ts
│   │       ├── dto/
│   │       │   ├── create-example.dto.ts
│   │       │   └── update-example.dto.ts
│   │       └── example.module.ts
│   │
│   ├── app.module.ts                 # Módulo raiz
│   └── main.ts                       # Entry point
│
├── test/                             # Testes e2e
├── volumes/                          # Volumes Docker (postgres, minio)
├── scripts/                          # Scripts auxiliares
├── docker-compose.yml
├── Dockerfile
├── Makefile
├── .env
├── .env.example
├── .eslintrc.js
├── .prettierrc
├── tsconfig.json
├── tsconfig.build.json
└── nest-cli.json
```

---

## 4. PADRÕES DE CÓDIGO

### 4.1 Regras Gerais

```typescript
// ✅ SEPARADOR de seções (60 hífens)
// ----------------------------------------------------------------------

// ✅ INTERFACES para tipos de dados
export interface IUser {
  id: number;
  name: string;
  email: string;
}

// ✅ DTOs para input validation
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;
}

// ✅ CLASSES para services e controllers
@Injectable()
export class UserService { }

@Controller('users')
export class UserController { }

// ✅ MÉTODOS async com tipo de retorno explícito
async findAll(): Promise<User[]> { }

// ✅ USE const/let (nunca var)
const API_URL = 'https://api.example.com';
let currentUser: User | null = null;

// ✅ USE decorators do NestJS
@Get()
@Post()
@Body()
@Param()
```

### 4.2 Ordem de Imports

```typescript
// 1. NestJS core
import { Controller, Get, Post, Body } from '@nestjs/common';

// 2. TypeORM
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// 3. Outros módulos NestJS
import { JwtService } from '@nestjs/jwt';

// [LINHA EM BRANCO]

// 4. Imports internos do projeto
import { User } from '@/modules/base/entities';
import { CreateUserDto } from './dto';

// [LINHA EM BRANCO]

// 5. Imports relativos
import { HashService } from '../hash/hash.service';
```

### 4.3 Naming Conventions

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| Classes | PascalCase | `UserService`, `AuthController` |
| Interfaces | PascalCase + prefixo I | `IUser`, `IAuthPayload` |
| DTOs | PascalCase + sufixo Dto | `CreateUserDto`, `UpdateUserDto` |
| Entities | PascalCase | `User`, `Example` |
| Enums | PascalCase | `UserStatus`, `RoleType` |
| Métodos | camelCase | `findAll`, `createUser` |
| Variáveis | camelCase | `userRepository`, `isActive` |
| Constantes | UPPER_SNAKE_CASE | `JWT_SECRET`, `API_URL` |
| Arquivos | kebab-case | `user-service.ts`, `create-user.dto.ts` |
| Módulos | camelCase + sufixo Module | `userModule`, `authModule` |

---

## 5. MÓDULOS

### 5.1 Estrutura de um Módulo

```typescript
// src/modules/example/example.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExampleController } from './controllers/example.controller';
import { ExampleService } from './services/example.service';
import { Example } from './entities/example.entity';

// ----------------------------------------------------------------------

@Module({
  imports: [TypeOrmModule.forFeature([Example])],
  controllers: [ExampleController],
  providers: [ExampleService],
  exports: [ExampleService],
})
export class ExampleModule {}
```

### 5.2 Registro no AppModule

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DatabaseModule } from './database/database.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { ExampleModule } from './modules/example/example.module';

// ----------------------------------------------------------------------

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    InfrastructureModule,
    ExampleModule,  // Novo módulo
  ],
})
export class AppModule {}
```

---

## 6. CONTROLLERS

### 6.1 Padrão de Controller

```typescript
// src/modules/example/controllers/example.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { ExampleService } from '../services/example.service';
import { CreateExampleDto, UpdateExampleDto } from '../dto';

// ----------------------------------------------------------------------

@ApiTags('examples')
@ApiBearerAuth()
@Controller('examples')
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}

  @Get()
  @ApiOperation({ summary: 'List all examples' })
  async findAll() {
    return this.exampleService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one example by id' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.exampleService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new example' })
  async create(@Body() dto: CreateExampleDto) {
    return this.exampleService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update example' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateExampleDto,
  ) {
    return this.exampleService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete example' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.exampleService.remove(id);
  }
}
```

### 6.2 Controller com Paginação

```typescript
import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Paginate, PaginateQuery } from 'nestjs-paginate';

import { ExampleService } from '../services/example.service';

// ----------------------------------------------------------------------

@ApiTags('examples')
@Controller('examples')
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}

  @Get()
  findAll(@Paginate() query, @Request() req) {
    return this.exampleService.findAll(query, req.user.userId);
  }
}
```

---

## 7. SERVICES

### 7.1 Padrão de Service

```typescript
// src/modules/example/services/example.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, PaginateQuery, Paginated, FilterOperator } from 'nestjs-paginate';

import { Example } from '../entities/example.entity';
import { CreateExampleDto, UpdateExampleDto } from '../dto';

// ----------------------------------------------------------------------

@Injectable()
export class ExampleService {
  constructor(
    @InjectRepository(Example)
    private readonly exampleRepository: Repository<Example>,
  ) {}

  async findAll(): Promise<Example[]> {
    return this.exampleRepository.find({
      where: { deletedAt: null },
    });
  }

  async findAll(query: PaginateQuery, userId: string): Promise<Paginated<Example>> {
    return paginate(query, this.exampleRepository, {
      sortableColumns: ['id', 'name', 'createdAt'],
      searchableColumns: ['name', 'description'],
      defaultSortBy: [['id', 'DESC']],
      filterableColumns: {
        name: [FilterOperator.CONTAINS],
        status: [FilterOperator.EQ],
      },
      where: { userId },
      relations: [],
    });
  }

  async findOne(id: number): Promise<Example> {
    const entity = await this.exampleRepository.findOne({
      where: { id, deletedAt: null },
    });

    if (!entity) {
      throw new NotFoundException('Example not found');
    }

    return entity;
  }

  async create(dto: CreateExampleDto): Promise<Example> {
    const entity = this.exampleRepository.create(dto);
    return this.exampleRepository.save(entity);
  }

  async update(id: number, dto: UpdateExampleDto): Promise<Example> {
    const entity = await this.findOne(id);
    this.exampleRepository.merge(entity, dto);
    return this.exampleRepository.save(entity);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.findOne(id);
    await this.exampleRepository.softRemove(entity);
  }
}
```

---

## 8. ENTITIES & DTOS

### 8.1 Entity Pattern

```typescript
// src/modules/example/entities/example.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

// ----------------------------------------------------------------------

@Entity('examples')
export class Example {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ default: 'active' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;
}
```

### 8.2 DTO Pattern

```typescript
// src/modules/example/dto/create-example.dto.ts
import { IsString, IsOptional, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// ----------------------------------------------------------------------

export class CreateExampleDto {
  @ApiProperty({ description: 'Example name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({ description: 'Example description' })
  @IsString()
  @IsOptional()
  description?: string;
}
```

```typescript
// src/modules/example/dto/update-example.dto.ts
import { PartialType } from '@nestjs/swagger';

import { CreateExampleDto } from './create-example.dto';

// ----------------------------------------------------------------------

export class UpdateExampleDto extends PartialType(CreateExampleDto) {}
```

---

## 9. AUTENTICAÇÃO

### 9.1 JWT Strategy

```typescript
// src/infrastructure/authentication/strategies/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

import { IAuthPayload } from '../interfaces';

// ----------------------------------------------------------------------

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: IAuthPayload) {
    return { userId: payload.sub, email: payload.email };
  }
}
```

### 9.2 Auth Guard

```typescript
// src/infrastructure/authentication/guards/jwt-auth.guard.ts
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators';

// ----------------------------------------------------------------------

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}
```

### 9.3 Public Decorator

```typescript
// src/infrastructure/authentication/decorators/public.decorator.ts
import { SetMetadata } from '@nestjs/common';

// ----------------------------------------------------------------------

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```

---

## 10. BANCO DE DADOS

### 10.1 TypeORM Config

```typescript
// src/database/typeorm.config.ts
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

// ----------------------------------------------------------------------

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_DATABASE || 'api_template_db',
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
  namingStrategy: new SnakeNamingStrategy(),
});
```

### 10.2 Migration Pattern

```typescript
// src/database/migrations/1700000000000-create_examples_table.ts
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

// ----------------------------------------------------------------------

export class CreateExamplesTable1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'examples',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar',
            default: "'active'",
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('examples');
  }
}
```

---

## 11. PADRÃO CRUD COMPLETO

### 11.1 Estrutura de Feature

```
src/modules/example/
├── controllers/
│   └── example.controller.ts
├── services/
│   └── example.service.ts
├── entities/
│   └── example.entity.ts
├── dto/
│   ├── create-example.dto.ts
│   ├── update-example.dto.ts
│   └── index.ts
└── example.module.ts
```

### 11.2 CRUD Controller Completo

```typescript
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { Paginate, PaginateQuery } from 'nestjs-paginate';

import { ExampleService } from '../services/example.service';
import { CreateExampleDto, UpdateExampleDto } from '../dto';
import { Example } from '../entities/example.entity';

// ----------------------------------------------------------------------

@ApiTags('Examples')
@ApiBearerAuth()
@Controller('examples')
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}

  @Get()
  @ApiOperation({ summary: 'List all examples with pagination' })
  @ApiResponse({ status: 200, description: 'List of examples', type: [Example] })
  findAll(@Paginate() query, @Request() req) {
    return this.exampleService.findAll(query, req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get example by ID' })
  @ApiResponse({ status: 200, description: 'Example found', type: Example })
  @ApiResponse({ status: 404, description: 'Example not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.exampleService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new example' })
  @ApiResponse({ status: 201, description: 'Example created', type: Example })
  async create(@Body() dto: CreateExampleDto) {
    return this.exampleService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update example' })
  @ApiResponse({ status: 200, description: 'Example updated', type: Example })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateExampleDto,
  ) {
    return this.exampleService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete example (soft delete)' })
  @ApiResponse({ status: 204, description: 'Example deleted' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.exampleService.remove(id);
  }
}
```

---

## 12. CONFIGURAÇÃO GLOBAL (main.ts)

### ValidationPipe

⚠️ **IMPORTANTE:** NUNCA use `forbidNonWhitelisted: true` quando usar `nestjs-paginate`!

```typescript
// src/main.ts
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { swaggerSetup } from './config/swagger.config';
import { ForeignKeyViolationInterceptor } from './helpers/interceptors/foreign-key-violation.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS
  app.enableCors({
    origin: process.env.CORS_ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true,
  });

  // API Prefix
  const prefix = process.env.API_PREFIX ?? '/api/v1';
  app.setGlobalPrefix(prefix);

  // ValidationPipe - Configuração correta
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,        // Remove propriedades não decoradas
      transform: true,        // Transforma tipos automaticamente
      // ❌ NÃO use forbidNonWhitelisted: true (quebra o nestjs-paginate)
      exceptionFactory: (errors) => {
        return new BadRequestException(errors);
      },
      validationError: {
        target: false,
        value: false,
      },
    }),
  );

  // Interceptors globais
  app.useGlobalInterceptors(new ForeignKeyViolationInterceptor());
  
  // Container para class-validator
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // Swagger
  await swaggerSetup(app, prefix);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
}
bootstrap();
```

### Helpers Disponíveis

```typescript
// Decorators Swagger
import { GetDoc, PostDoc, PatchDoc, DeleteDoc } from '@/helpers/decorators/swagger.decorator';

// Paginação
import { FULL_COMPARE_ENUMERABLE, FULL_COMPARE_NUMERIC } from '@/helpers/paginate-utils';

// Interceptors
import { ForeignKeyViolationInterceptor } from '@/helpers/interceptors/foreign-key-violation.interceptor';

// Exceptions
import { DefaultException } from '@/helpers/functions/default-exception';
```

---

## 13. CONFIGURAÇÕES

### 12.1 TypeScript

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2021",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": false,
    "noImplicitAny": false,
    "strictBindCallApply": false,
    "forceConsistentCasingInFileNames": false,
    "noFallthroughCasesInSwitch": false,
    "paths": {
      "@/*": ["src/*"],
      "@helpers/*": ["src/helpers/*"],
      "@infrastructure/*": ["src/infrastructure/*"],
      "@modules/*": ["src/modules/*"]
    }
  }
}
```

### 12.2 Prettier

```json
{
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "semi": true
}
```

### 12.3 ESLint

```javascript
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
```

### 12.4 Variáveis de Ambiente

```env
# .env.example
NODE_ENV=development

# Application
PORT=3000
API_PREFIX=/api/v1

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=root
DB_PASSWORD=root
DB_DATABASE=api_template_db

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1d

# MinIO / S3
MINIO_HOST=localhost
MINIO_PORT=9000
MINIO_BUCKET_NAME=api-bucket
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin

# Email
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user@example.com
SMTP_PASS=password
```

---

## ✅ CHECKLIST PARA NOVOS PROJETOS

### Setup Inicial
- [ ] Configurar `tsconfig.json` com path aliases
- [ ] Configurar `docker-compose.yml` com PostgreSQL e MinIO
- [ ] Criar estrutura de diretórios
- [ ] Configurar TypeORM com SnakeNamingStrategy
- [ ] Configurar Swagger em `main.ts`
- [ ] Configurar JWT Strategy e AuthGuard
- [ ] Criar migrations iniciais (users, password_resets)

### Ao criar uma Feature
- [ ] Criar entity em `src/modules/{feature}/entities/`
- [ ] Criar DTOs em `src/modules/{feature}/dto/`
- [ ] Criar service em `src/modules/{feature}/services/`
- [ ] Criar controller em `src/modules/{feature}/controllers/`
- [ ] Criar module e registrar em `app.module.ts`
- [ ] Gerar migration: `make migrate-create name=create_{table}_table`
- [ ] Adicionar decorators Swagger para documentação

### Padrões de Código
- [ ] Usar decorators do NestJS (@Controller, @Injectable, etc)
- [ ] Usar separador `// ----------------------------------------------------------------------`
- [ ] DTOs com class-validator para validação
- [ ] Services com injeção de dependência
- [ ] Controllers com swagger decorators
- [ ] Entities com TypeORM decorators
- [ ] Soft delete em todas as entities

---

## 🚨 ANTI-PATTERNS (NÃO FAZER)

❌ Não use `any` sem necessidade - crie interfaces
❌ Não coloque lógica de negócio no controller - use services
❌ Não faça queries direto no controller - use repository pattern
❌ Não esqueça de validar DTOs - use class-validator
❌ Não use delete físico - prefira soft delete
❌ Não exponha entidades diretamente - use DTOs de response
❌ Não ignore tratamento de erros - use HttpException
❌ Não hardcode strings/numbers - use constants/enums

---

## 📝 NOTAS PARA IAs

Ao gerar código para este padrão:

1. **Sempre use decorators** do NestJS (@Controller, @Injectable, @Entity, etc)
2. **Sempre valide DTOs** com class-validator (@IsString, @IsNotEmpty, etc)
3. **Sempre documente** endpoints com @ApiOperation e @ApiResponse
4. **Use injeção de dependência** via constructor
5. **Use TypeORM** para operações de banco de dados
6. **Implemente soft delete** com @DeleteDateColumn
7. **Use path aliases** (@/*, @modules/*, etc)
8. **Gere migrations** para alterações no banco

---

**Template Version:** 1.0  
**NestJS:** 10.4+  
**TypeScript:** 5.8+  
**TypeORM:** 0.3+
