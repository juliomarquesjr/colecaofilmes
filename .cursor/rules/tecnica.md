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