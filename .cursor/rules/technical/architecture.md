# Arquitetura Técnica

## Estrutura do Projeto

O projeto segue a estrutura padrão do Next.js 14 com App Router, organizado da seguinte forma:

```
src/
├── app/                    # Rotas e páginas da aplicação
│   ├── api/               # Endpoints da API
│   ├── filmes/            # Páginas relacionadas a filmes
│   ├── usuarios/          # Páginas de gestão de usuários
│   └── login/             # Página de autenticação
├── components/            # Componentes React reutilizáveis
│   ├── ui/               # Componentes base (botões, inputs, etc)
│   └── [outros]/         # Componentes específicos do domínio
├── hooks/                 # Hooks React customizados
└── lib/                   # Utilitários e configurações
```

## Banco de Dados

### Infraestrutura
- **Provedor**: Neon (Serverless PostgreSQL)
- **ORM**: Prisma
- **Migrations**: Gerenciadas automaticamente pelo Prisma

### Modelos Principais

```prisma
model Movie {
  id             Int       @id @default(autoincrement())
  uniqueCode     String    @unique
  title          String
  originalTitle  String?
  // ... outros campos
}

model User {
  id        Int       @id @default(autoincrement())
  username  String    @unique
  isAdmin   Boolean   @default(false)
  // ... outros campos
}

model Genre {
  id        Int       @id @default(autoincrement())
  name      String    @unique
  movies    Movie[]
  // ... outros campos
}
```

## Autenticação

- Implementada usando NextAuth.js
- Autenticação baseada em credenciais (username/password)
- Sessões gerenciadas pelo NextAuth
- Dois níveis de acesso: Admin e Usuário comum

## Integrações

### TMDB (The Movie Database)
- Usado para busca e preenchimento automático de informações dos filmes
- Integração via API REST
- Dados utilizados: título, sinopse, ano, poster, etc.

### YouTube
- Integração para busca e vinculação de trailers
- API do YouTube utilizada apenas para busca

### Neon Database
- Banco de dados PostgreSQL serverless
- Conexão via string de conexão segura
- Autoscaling automático

## CI/CD

### Build
```bash
prisma generate && prisma migrate deploy && next build
```

### Processos Automatizados
- Geração do cliente Prisma
- Execução de migrations pendentes
- Build do Next.js

## Feature Flags

### Electron (Futuro)
- Configuração inicial presente no projeto
- Implementação planejada para versão desktop
- Scripts preparados no package.json

## Segurança

- Senhas hasheadas com bcryptjs
- Autenticação via NextAuth.js
- Variáveis de ambiente segregadas por ambiente
- Proteção contra CSRF via Next.js
- Validação de dados com Zod 