# Documentação Técnica

## Arquitetura
- **Next.js App Router**: Estrutura baseada em rotas e diretórios
- **API Routes**: Endpoints RESTful para operações de filmes, gêneros, integrações externas
- **Prisma ORM**: Modelagem e acesso a dados
- **Banco de Dados**: PostgreSQL (produção), SQLite (dev local)

## Padrões de Código
- TypeScript para tipagem forte
- Validação de dados com Zod
- Componentização e reutilização máxima
- Separação clara entre lógica de negócio e apresentação

## Integrações
- TMDB API para busca de filmes
- YouTube API para trailers
- Deploy automatizado na Vercel

## Testes e Qualidade
- ESLint e Prettier para padronização
- Testes manuais (automatização futura)
- Commits padronizados 

## Novas Funcionalidades Técnicas
- **Seleção de Múltiplos Gêneros:** Implementada a capacidade de associar múltiplos gêneros a um filme, com ajustes nos formulários de cadastro/edição e nas rotas da API para lidar com arrays de `genreIds`.
- **Paginação na Listagem de Filmes:** Adicionada paginação à API de filmes e ao frontend, permitindo controle sobre a quantidade de itens exibidos por página e navegação entre as páginas. Inclui a criação de um componente de paginação reutilizável (`src/components/ui/pagination.tsx`). 