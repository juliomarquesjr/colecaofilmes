# Estrutura Organizacional do Projeto

## Visão Geral
O projeto Coleção de Filmes é organizado para facilitar a colaboração, manutenção e escalabilidade. A estrutura segue boas práticas de separação de responsabilidades e modularização.

## Diretórios Principais
- **src/app/**: Páginas e rotas da aplicação (Next.js App Router)
- **src/components/**: Componentes reutilizáveis de UI
- **src/lib/**: Utilitários, configuração do Prisma, helpers
- **src/hooks/**: Custom hooks React
- **prisma/**: Schema, migrações e banco de dados
- **public/**: Arquivos estáticos

## Papéis e Responsabilidades
- **Desenvolvedor(a) Frontend**: Implementação de telas, componentes e integração com APIs
- **Desenvolvedor(a) Backend**: Implementação de rotas, regras de negócio e integração com banco de dados
- **Product Owner**: Definição de requisitos e regras de negócio
- **Designer**: Criação de layouts e experiência do usuário

## Fluxo de Trabalho
- Branch principal: `main`
- Branches de feature: `feat/nome-da-feature`
- Pull Requests para revisão de código
- Commits padronizados 