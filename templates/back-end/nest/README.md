# NestJS Template

Template limpo para APIs NestJS com TypeScript, autenticação JWT, TypeORM e PostgreSQL.

## 🚀 Stack

- **NestJS 10+**
- **TypeScript 5+**
- **TypeORM 0.3+**
- **PostgreSQL 15+**
- **JWT** + Passport
- **Swagger** OpenAPI
- **MinIO** (S3 compatible storage)

## 📁 Estrutura

```
src/
├── database/           # Configuração do banco de dados
│   ├── migrations/     # Migrations TypeORM
│   ├── database.module.ts
│   ├── database.providers.ts
│   └── typeorm.config.ts
├── helpers/            # Utilitários e helpers
│   ├── decorators/
│   ├── dtos/
│   ├── functions/
│   ├── interceptors/
│   └── validators/
├── infrastructure/     # Infraestrutura da aplicação
│   ├── authentication/ # Autenticação JWT
│   ├── authorization/  # Autorização e roles
│   └── arquivo/        # Gerenciamento de arquivos
├── modules/            # Módulos da aplicação
│   ├── auth/           # Troca de senha
│   ├── base/           # Entidades base (User)
│   └── example/        # Módulo de exemplo (CRUD)
├── app.module.ts
└── main.ts
```

## 🛠️ Instalação

```bash
npm install
cp .env.example .env
# Edite .env com suas configurações
npm run start:dev
```

### Com Docker (Recomendado)

```bash
cp .env.example .env
make up
make migrate
```

## 📖 Documentação

- **`AGENTS.md`** - Guia rápido para IAs (regras, padrões, checklist)
- **`PROJECT_STANDARD.md`** - Documentação completa da arquitetura
- **Swagger UI** - Disponível em `http://localhost:3000/api/docs`

## 🎯 Módulo de Exemplo

O template inclui um módulo de exemplo (`src/modules/example/`) demonstrando:
- CRUD completo com TypeORM
- Paginação com nestjs-paginate
- Soft delete
- Validação com class-validator
- Documentação Swagger

Use este módulo como referência para criar novos.

## 📝 Criando um Novo Módulo

1. **Entity** - `src/modules/{nome}/entities/{nome}.entity.ts`
2. **DTOs** - `src/modules/{nome}/dto/create-{nome}.dto.ts`
3. **Service** - `src/modules/{nome}/services/{nome}.service.ts`
4. **Controller** - `src/modules/{nome}/controllers/{nome}.controller.ts`
5. **Module** - `src/modules/{nome}/{nome}.module.ts`
6. **Register** - Adicione em `app.module.ts`
7. **Migration** - `make migrate-create name=create_{tabela}_table`

Veja `PROJECT_STANDARD.md` para exemplos detalhados.

## 🔑 Autenticação

### Login

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

### Registro

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Usar o token

```http
GET /api/v1/auth/me
Authorization: Bearer <token>
```

## 🔒 Gerenciamento de Senhas

### Esqueci minha senha

```http
POST /api/v1/auth/password/forgot
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### Reset de senha

```http
POST /api/v1/auth/password/reset
Content-Type: application/json

{
  "token": "token-recebido-por-email",
  "newPassword": "novaSenha123"
}
```

### Trocar senha (autenticado)

```http
POST /api/v1/auth/password/change
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "senhaAtual123",
  "newPassword": "novaSenha123"
}
```

## 📜 Scripts

```bash
# Desenvolvimento
npm run start:dev        # Watch mode
npm run start:debug      # Debug mode

# Build
npm run build            # Build de produção
npm run start:prod       # Executar build

# Database
make migrate-create name=nome    # Criar migration
make migrate-generate name=nome  # Gerar migration automaticamente
make migrate                     # Executar migrations
npm run migration:down           # Reverter última migration

# Docker
make up                  # Subir containers
make down                # Derrubar containers
make logs                # Ver logs
make shell               # Acessar shell do container

# Qualidade
npm run lint             # ESLint
npm run format           # Prettier

# Testes
npm run test             # Unit tests
npm run test:e2e         # e2e tests
npm run test:cov         # Coverage
```

## 🔧 Configurações

### Banco de Dados

```env
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=root
DB_PASSWORD=root
DB_DATABASE=api_template_db
```

### JWT

```env
JWT_SECRET=sua-chave-secreta
JWT_EXPIRES_IN=1d
```

### Storage (MinIO)

```env
MINIO_HOST=minio
MINIO_PORT=9000
MINIO_BUCKET_NAME=api-template-bucket
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
```

### Email

```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user@example.com
SMTP_PASS=password
```

## 🏗️ Estrutura de um módulo completo

```typescript
// 1. Entity
@Entity('examples')
export class Example {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column()
  name: string;
}

// 2. DTO
export class CreateExampleDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

// 3. Service
@Injectable()
export class ExampleService {
  constructor(
    @InjectRepository(Example)
    private repo: Repository<Example>,
  ) {}
  
  async create(dto: CreateExampleDto): Promise<Example> {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }
}

// 4. Controller
@Controller('examples')
export class ExampleController {
  constructor(private service: ExampleService) {}
  
  @Post()
  create(@Body() dto: CreateExampleDto) {
    return this.service.create(dto);
  }
}

// 5. Module
@Module({
  imports: [TypeOrmModule.forFeature([Example])],
  controllers: [ExampleController],
  providers: [ExampleService],
})
export class ExampleModule {}
```

## 🧪 Testes

```bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e

# Coverage
npm run test:cov
```

## 📄 Licença

Este projeto está sob a licença MIT.
