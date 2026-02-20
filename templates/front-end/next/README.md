# Next.js Template

Template limpo para projetos Next.js com TypeScript, Material-UI e autenticação JWT.

## 🚀 Stack

- **Next.js 13+** (App Router)
- **TypeScript 5+**
- **Material-UI v5**
- **React Hook Form** + Yup
- **Axios**

## 📁 Estrutura

```
src/
├── app/           # Next.js App Router
├── components/    # Componentes reutilizáveis
├── context/       # Context API (auth)
├── hooks/         # Custom hooks
├── layouts/       # Layouts (auth, dashboard)
├── models/        # Interfaces/Types
├── routes/        # Configuração de rotas
├── screens/       # Telas (views)
├── services/      # API services
├── theme/         # Configuração MUI
└── utils/         # Utilitários
```

## 🛠️ Instalação

```bash
npm install
cp .env-exemple .env
# Edite .env com suas configurações
npm run dev
```

## 📖 Documentação

- **`AGENTS.md`** - Guia rápido para IAs (regras, padrões, checklist)
- **`PROJECT_STANDARD.md`** - Documentação completa da arquitetura

## 🎯 Módulo de Exemplo

O template inclui um módulo de exemplo (`src/app/dashboard/example/`) demonstrando:
- Listagem com tabela
- Formulário de criação
- Formulário de edição
- Integração com API

Use este módulo como referência para criar novos.

## 📝 Criando um Novo Módulo

1. **Model** - `src/models/dashboard/[entidade].ts`
2. **Service** - `src/services/dashboard/[entidade]-service.ts`
3. **Routes** - Adicione em `src/routes/pages.ts`
4. **Navigation** - Adicione em `src/layouts/dashboard/dashboard-config-navigation.tsx`
5. **Views** - `src/screens/dashboard/[entidade]/views/`
6. **Pages** - `src/app/dashboard/[entidade]/`

Veja `AGENTS.md` para exemplos detalhados.

## 📜 Scripts

- `npm run dev` - Desenvolvimento (porta 8084)
- `npm run build` - Build de produção
- `npm run lint` - ESLint
- `npm run prettier` - Formata código
