# Documentação do Projeto Coleção de Filmes

Este documento serve como guia principal para entender a estrutura, regras de negócio e aspectos técnicos do projeto Coleção de Filmes.

## Visão Geral

O projeto é uma aplicação web moderna para gerenciamento de uma coleção pessoal de filmes, construída com Next.js e integrada com serviços externos como TMDB e YouTube. O sistema permite catalogar, pesquisar e gerenciar uma coleção de filmes físicos (DVD, BluRay, VHS).

## Estrutura da Documentação

- `/technical`: Documentação técnica do projeto
  - Arquitetura
  - Stack tecnológica
  - Configurações
  - Integrações
  - Banco de dados
  
- `/business`: Regras de negócio
  - Funcionalidades principais
  - Permissões e níveis de acesso
  - Fluxos de trabalho
  
- `/ui`: Guias de interface
  - Padrões de design
  - Componentes
  - Responsividade
  - Acessibilidade

- `/timeline`: Histórico de desenvolvimento
  - Implementações e melhorias
  - Documentação de mudanças
  - Análises técnicas detalhadas

## Documentação de Mudanças

- `CHANGELOG.md`: Registro cronológico de todas as alterações
- `timeline/`: Documentação detalhada de implementações específicas

## Stack Principal

- **Frontend**: Next.js 14.1.0
- **Estilização**: Tailwind CSS
- **Banco de Dados**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Autenticação**: NextAuth.js
- **UI Components**: Radix UI
- **Animações**: Framer Motion

## Ambientes

- **Produção**: Hospedado na Vercel
- **Desenvolvimento**: Local
- **Banco de Dados**: Neon (Serverless PostgreSQL)

## Integrações Externas

- TMDB (The Movie Database) - Para busca e preenchimento de informações dos filmes
- YouTube - Para integração de trailers
- Neon - Para hospedagem do banco de dados PostgreSQL 