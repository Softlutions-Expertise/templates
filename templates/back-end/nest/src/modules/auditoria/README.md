# Módulo de Auditoria

Módulo completo de auditoria com suporte a CREATE, UPDATE, DELETE e LOGIN.

## Funcionalidades

- **CREATE**: Registra os dados criados
- **UPDATE**: Registra diff (before/after) - só salva se houve mudança
- **DELETE**: Registra snapshot do objeto deletado
- **LOGIN**: Registra acesso do usuário

## Instalação Rápida

### 1. Adicione o módulo no `app.module.ts`:

```typescript
import { AuditoriaModule } from './modules/auditoria/auditoria.module';

@Module({
  imports: [
    // ... outros módulos
    AuditoriaModule,
  ],
})
export class AppModule {}
```

### 2. Execute a migration:

```bash
npm run migration:run
```

## Como Usar

### Opção 1: Decorator @Auditable (Recomendado)

```typescript
import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common';
import { Auditable } from './modules/auditoria/decorators/auditable.decorator';
import { AuditoriaInterceptor } from './modules/auditoria/interceptors/auditoria.interceptor';

@Controller('products')
@UseInterceptors(AuditoriaInterceptor)
@Auditable({ entidade: 'Product' }) // Todas as rotas serão auditadas
export class ProductController {
  
  @Post()
  create(@Body() data: CreateProductDto) {
    return this.service.create(data);
  }

  @Put(':id')
  @Auditable({ entidade: 'Product', camposSensiveis: ['cost'] }) // Sobrescreve config
  update(@Param('id') id: string, @Body() data: UpdateProductDto) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @Auditable({ entidade: 'Product' })
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }

  @Get()
  @Auditable({ ignorar: true }) // Ignora este método
  list() {
    return this.service.findAll();
  }
}
```

### Opção 2: Registro Manual (para casos específicos)

```typescript
import { AuditoriaService, TipoAcao } from './modules/auditoria';

@Injectable()
export class ProductService {
  constructor(
    private readonly auditoriaService: AuditoriaService,
  ) {}

  async create(data: CreateProductDto) {
    const product = await this.repository.save(data);
    
    // Registra auditoria manual
    await this.auditoriaService.registrar(TipoAcao.CREATE, 'Product', {
      usuarioId: 'uuid-do-usuario',
      usuarioEmail: 'usuario@email.com',
      entidadeId: product.id,
      dadosNovos: { created: product },
      descricao: `Criou Product #${product.id}`,
    });

    return product;
  }
}
```

### Opção 3: UPDATE com Diff Completo

Para que o UPDATE capture o "before", você tem duas opções:

#### Opção A: Service retorna objeto completo (Recomendado)

```typescript
@Put(':id')
async update(@Param('id') id: string, @Body() data: UpdateProductDto) {
  // 1. Busca o objeto atual
  const original = await this.service.findOne(id);
  
  // 2. Atualiza
  const updated = await this.service.update(id, data);
  
  // 3. Retorna objeto com _original para o interceptor
  return {
    ...updated,
    _original: original, // O interceptor usa isso para calcular diff
  };
}
```

#### Opção B: Registro manual no service

```typescript
async update(id: string, data: UpdateProductDto) {
  const before = await this.repository.findOne(id);
  const after = await this.repository.save({ ...before, ...data });
  
  const diff = calcularDiff(before, after);
  
  await this.auditoriaService.registrar(TipoAcao.UPDATE, 'Product', {
    entidadeId: id,
    dadosAnteriores: before,
    dadosNovos: {
      changedFields: diff.changedFields,
      changes: diff.changes,
    },
    descricao: `Atualizou Product #${id}`,
  });

  return after;
}
```

## Formato dos Dados

### CREATE
```json
{
  "acao": "create",
  "entidade": "Product",
  "dadosNovos": {
    "created": {
      "id": "p_1009",
      "name": "Camiseta Preta",
      "price": 79.9
    }
  }
}
```

### UPDATE
```json
{
  "acao": "update",
  "entidade": "Product",
  "dadosAnteriores": { "name": "Camiseta", "price": 79.9 },
  "dadosNovos": {
    "changedFields": ["name", "price"],
    "changes": [
      { "field": "name", "from": "Camiseta", "to": "Camiseta Premium" },
      { "field": "price", "from": 79.9, "to": 89.9 }
    ]
  }
}
```

### DELETE
```json
{
  "acao": "delete",
  "entidade": "Product",
  "dadosNovos": {
    "deletedSnapshot": {
      "id": "p_1009",
      "name": "Camiseta Premium",
      "price": 89.9
    }
  }
}
```

## Endpoints

### Listar auditorias
```
GET /auditoria
Query params:
  - usuarioId: filtra por usuário
  - acao: login | create | update | delete
  - dataInicio: YYYY-MM-DD
  - dataFim: YYYY-MM-DD
  - page: número da página
  - limit: registros por página
```

### Listar minhas auditorias
```
GET /auditoria/minhas
Mesmos filtros acima, mas só do usuário logado
```

## Utilitários

### calcularDiff(before, after)

```typescript
import { calcularDiff } from './modules/auditoria/utils/diff.util';

const result = calcularDiff(
  { name: 'Old', price: 10 },
  { name: 'New', price: 20 }
);

// Resultado:
{
  changedFields: ['name', 'price'],
  changes: [
    { field: 'name', from: 'Old', to: 'New' },
    { field: 'price', from: 10, to: 20 }
  ],
  hasChanges: true
}
```

### sanitizarDados(obj)

Remove campos sensíveis como password, token, etc.

```typescript
import { sanitizarDados } from './modules/auditoria/utils/diff.util';

const clean = sanitizarDados({
  id: '1',
  name: 'Test',
  password: 'secret',
  deletedAt: null
});
// Resultado: { id: '1', name: 'Test' }
```

## Boas Práticas

1. **Sempre use `@Auditable`** no controller para entidades importantes
2. **Campos sensíveis**: Use `camposSensiveis: ['password', 'token']`
3. **UPDATE sem mudança**: O interceptor ignora automaticamente
4. **Performance**: Não audite rotas de listagem (use `@Auditable({ ignorar: true })`)
5. **Dados grandes**: O sanitizador remove objetos circulares automaticamente
