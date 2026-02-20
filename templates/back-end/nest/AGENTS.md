# AGENTS.md - NestJS Template

> **Template:** NestJS 10+ + TypeScript + TypeORM + PostgreSQL  
> **Arquitetura:** Modular, Layered Architecture

---

## 🚨 REGRAS CRÍTICAS - CRIAÇÃO DE NOVOS PROJETOS

### 1. SEMPRE Copiar Configurações do Template Base

**❌ NUNCA crie arquivos de configuração do zero (package.json, tsconfig.json, etc)**

**✅ SEMPRE copie do template base e adapte:**

```bash
# Estrutura obrigatória - copiar do template
back-end/nest/
├── package.json              # Copiar e alterar apenas "name" e "description"
├── tsconfig.json             # Copiar sem alterações
├── .eslintrc.js              # Copiar sem alterações
├── .prettierrc               # Copiar sem alterações
├── nest-cli.json             # Copiar sem alterações
├── docker-compose.yml        # Copiar e ajustar nome do serviço/banco
├── Dockerfile                # Copiar sem alterações
└── .env.example              # Copiar e ajustar nomes de variáveis se necessário
```

### 2. Containerização Obrigatória

**Todo novo projeto DEVE ter:**

- ✅ `docker-compose.yml` com PostgreSQL configurado
- ✅ `Dockerfile` para a aplicação
- ✅ `.env.example` com todas as variáveis documentadas
- ✅ Serviço rodando em container (ou pelo menos banco de dados)

**Template mínimo do docker-compose.yml:**
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: ${DB_USERNAME}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_DATABASE}
    ports:
      - "${DB_PORT}:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  # Opcional: app em container
  api:
    build: .
    ports:
      - "${PORT}:3000"
    depends_on:
      - postgres
    env_file:
      - .env

volumes:
  postgres_data:
```

### 3. Arquivo .env Obrigatório

**Todo projeto deve ter:**
- `.env.example` versionado (com valores placeholder)
- `.env` no .gitignore
- Script/documentação de setup inicial

---

## 📁 Estrutura de Diretórios

```
src/
├── database/                    # Configuração do banco de dados
│   ├── migrations/              # Migrations TypeORM
│   │   ├── 1700000000000-create_users_table.ts
│   │   └── ...
│   ├── database.module.ts
│   ├── database.providers.ts
│   └── typeorm.config.ts
│
├── helpers/                     # Utilitários e helpers globais
│   ├── decorators/              # Decorators customizados
│   │   ├── current-user.decorator.ts
│   │   └── public.decorator.ts
│   ├── dtos/                    # DTOs compartilhados
│   ├── functions/               # Funções utilitárias
│   ├── interceptors/            # Interceptors globais
│   └── validators/              # Validadores customizados
│
├── infrastructure/              # Infraestrutura da aplicação
│   ├── authentication/          # Autenticação JWT
│   │   ├── dto/
│   │   │   ├── login.dto.ts
│   │   │   └── register.dto.ts
│   │   ├── strategies/
│   │   │   └── jwt.strategy.ts
│   │   ├── authentication.controller.ts
│   │   ├── authentication.service.ts
│   │   └── authentication.module.ts
│   │
│   ├── authorization/           # Autorização e roles
│   │   ├── authorization.service.ts
│   │   └── authorization.module.ts
│   │
│   └── arquivo/                 # Gerenciamento de arquivos
│       ├── entities/
│       ├── arquivo.service.ts
│       └── arquivo.module.ts
│
├── modules/                     # Módulos da aplicação (Features)
│   ├── auth/                    # Troca de senha
│   ├── base/                    # Entidades base (User)
│   │   └── entities/
│   │       └── user.entity.ts
│   │
│   └── example/                 # Módulo de exemplo (CRUD)
│       ├── controllers/
│       │   └── example.controller.ts
│       ├── services/
│       │   └── example.service.ts
│       ├── entities/
│       │   └── example.entity.ts
│       ├── dto/
│       │   ├── create-example.dto.ts
│       │   ├── update-example.dto.ts
│       │   └── index.ts
│       └── example.module.ts
│
├── app.module.ts                # Módulo raiz
└── main.ts                      # Entry point
```

---

## 🎯 Regras de Código (OBRIGATÓRIAS)

### 1. ValidationPipe - ⚠️ IMPORTANTE

NUNCA use `forbidNonWhitelisted: true` no ValidationPipe quando usar `nestjs-paginate`:

```typescript
// ❌ ERRADO - Quebra paginação
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,  // ← PROBLEMA!
  transform: true,
}));

// ✅ CORRETO
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  transform: true,
  exceptionFactory: (errors) => new BadRequestException(errors),
  validationError: { target: false, value: false },
}));
```

### 2. Decorators
```typescript
// ✅ SEMPRE use decorators do NestJS
@Controller('users')
@Injectable()
@Entity('users')

// ✅ Separador de seções (60 hífens)
// ----------------------------------------------------------------------

// ✅ Use DTOs para validação de input
@IsString()
@IsNotEmpty()
@IsEmail()

// ✅ Documente endpoints com Swagger
@ApiOperation({ summary: 'List all users' })
@ApiResponse({ status: 200, description: 'List of users' })
```

### 2. Ordem de Imports
```typescript
// 1. NestJS core
import { Controller, Get, Post, Body } from '@nestjs/common';

// 2. TypeORM
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// 3. Outros módulos NestJS
import { JwtService } from '@nestjs/jwt';

// [LINHA EM BRANCO]

// 4. Internos do projeto
import { User } from '@/modules/base/entities';
import { CreateUserDto } from './dto';

// [LINHA EM BRANCO]

// 5. Relativos
import { HashService } from '../hash/hash.service';
```

### 3. Naming Conventions
| Tipo | Padrão | Exemplo |
|------|--------|---------|
| Classes | PascalCase | `UserService`, `AuthController` |
| Interfaces | PascalCase + I | `IUser`, `IAuthPayload` |
| DTOs | PascalCase + Dto | `CreateUserDto`, `UpdateUserDto` |
| Entities | PascalCase | `User`, `Example` |
| Enums | PascalCase | `UserStatus`, `RoleType` |
| Métodos | camelCase | `findAll`, `createUser` |
| Arquivos | kebab-case | `user-service.ts`, `create-user.dto.ts` |

---

## 🧩 Padrões por Camada

### 1. Module
```typescript
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

### 2. Controller
```typescript
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
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

### 3. Service
```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, PaginateQuery, Paginated } from 'nestjs-paginate';

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

  async findAllPaginated(query: PaginateQuery): Promise<Paginated<Example>> {
    return paginate(query, this.exampleRepository, {
      sortableColumns: ['id', 'name', 'createdAt'],
      searchableColumns: ['name', 'description'],
      defaultSortBy: [['id', 'DESC']],
      where: { deletedAt: null },
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

### 4. Entity
```typescript
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

### 5. DTO
```typescript
// create-example.dto.ts
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

// update-example.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateExampleDto } from './create-example.dto';

// ----------------------------------------------------------------------

export class UpdateExampleDto extends PartialType(CreateExampleDto) {}
```

### 6. Migration
```typescript
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

// ----------------------------------------------------------------------

export class CreateExamplesTable1700000000000 implements MigrationInterface {
  name = 'CreateExamplesTable1700000000000';

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

## 🚀 Criando um Novo Módulo (CRUD)

### Passo 1: Entity (`src/modules/nome/entities/nome.entity.ts`)
```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

// ----------------------------------------------------------------------

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;
}
```

### Passo 2: DTOs (`src/modules/nome/dto/`)
```typescript
// create-product.dto.ts
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNumber()
  price: number;
}

// update-product.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}

// index.ts
export * from './create-product.dto';
export * from './update-product.dto';
```

### Passo 3: Service (`src/modules/nome/services/nome.service.ts`)
```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from '../entities/product.entity';
import { CreateProductDto, UpdateProductDto } from '../dto';

// ----------------------------------------------------------------------

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({ where: { deletedAt: null } });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id, deletedAt: null },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async create(dto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(dto);
    return this.productRepository.save(product);
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    this.productRepository.merge(product, dto);
    return this.productRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.softRemove(product);
  }
}
```

### Passo 4: Controller (`src/modules/nome/controllers/nome.controller.ts`)
```typescript
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { ProductService } from '../services/product.service';
import { CreateProductDto, UpdateProductDto } from '../dto';

// ----------------------------------------------------------------------

@ApiTags('products')
@ApiBearerAuth()
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({ summary: 'List all products' })
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by id' })
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new product' })
  create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update product' })
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete product' })
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
```

### Passo 5: Module (`src/modules/nome/nome.module.ts`)
```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductController } from './controllers/product.controller';
import { ProductService } from './services/product.service';
import { Product } from './entities/product.entity';

// ----------------------------------------------------------------------

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
```

### Passo 6: Register in AppModule (`src/app.module.ts`)
```typescript
import { Module } from '@nestjs/common';
import { ProductModule } from './modules/product/product.module';

@Module({
  imports: [
    // ... outros módulos
    ProductModule,  // Novo módulo
  ],
})
export class AppModule {}
```

### Passo 7: Create Migration
```bash
make migrate-create name=create_products_table
```

---

## ⚙️ Configurações Importantes

### Environment (.env)
```env
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

# MinIO
MINIO_HOST=localhost
MINIO_PORT=9000
MINIO_BUCKET_NAME=api-bucket
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
```

### Docker Compose
```bash
make up      # Subir containers
make down    # Derrubar containers
make logs    # Ver logs
make shell   # Acessar container
```

### Database Commands
```bash
make migrate-create name=nome_migration     # Criar migration vazia
make migrate-generate name=nome_migration   # Gerar migration automaticamente
make migrate                                 # Executar migrations
npm run migration:down                       # Reverter última migration
```

---

## ✅ Checklist Rápido - Novo Módulo

- [ ] Separador `// ----------------------------------------------------------------------` entre seções
- [ ] Decorators do NestJS em controllers, services e entities
- [ ] DTOs com class-validator para validação
- [ ] Services com injeção via constructor
- [ ] Entities com soft delete (@DeleteDateColumn)
- [ ] Swagger decorators (@ApiOperation, @ApiResponse)
- [ ] Module registrado em `app.module.ts`
- [ ] Migration criada para novas tabelas
- [ ] Testar endpoints no Swagger (`/api/docs`)

---

## ✅ Checklist - Novo Projeto (OBRIGATÓRIO)

### Setup Inicial
- [ ] Copiar `package.json`, `tsconfig.json`, `.eslintrc.js`, `.prettierrc` do template
- [ ] Alterar apenas `name` e `description` no package.json
- [ ] Criar `docker-compose.yml` com PostgreSQL
- [ ] Criar `Dockerfile` (mesmo que simples)
- [ ] Criar `.env.example` com todas as variáveis
- [ ] Criar `.env` local (não versionar)
- [ ] Criar `README.md` com instruções de como rodar

### Banco de Dados
- [ ] Configurar TypeORM com SnakeNamingStrategy
- [ ] Criar migrations iniciais (users, etc)
- [ ] Executar `npm run migration:up`
- [ ] Verificar conexão com banco

### Autenticação (se aplicável)
- [ ] Copiar módulo auth do template
- [ ] Configurar JWT Strategy
- [ ] Configurar AuthGuard global
- [ ] Testar login no Swagger

---

## 🚨 Anti-Patterns (NUNCA FAÇA)

❌ Use `any` sem necessidade - crie interfaces  
❌ Coloque lógica de negócio no controller - use services  
❌ Faça queries direto no controller - use repository pattern  
❌ Delete físico - use soft delete (deletedAt)  
❌ Exponha entities diretamente - use DTOs de response  
❌ Ignore tratamento de erros - use HttpException  
❌ Hardcode strings/numbers - use constants/enums  
❌ Esqueça de criar migration - sempre gere migrations para DB

---

## 📚 Para Mais Detalhes

Veja `PROJECT_STANDARD.md` para documentação completa com exemplos detalhados.
