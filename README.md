# 🎬 Coleção de Filmes

Uma aplicação web moderna para gerenciar sua coleção pessoal de filmes e séries. Desenvolvida com Next.js 14, TypeScript e Prisma.

![Vercel Deploy Status](https://therealsujitk-vercel-badge.vercel.app/?app=colecaofilmes)

## 📋 Funcionalidades

- ✨ Interface moderna e responsiva com Tailwind CSS e shadcn/ui
- 📝 Cadastro completo de filmes com:
  - Título original e traduzido
  - Ano de lançamento
  - Tipo de mídia (DVD, BluRay, VHS)
  - Código da estante
  - Capa do filme
  - Informações de produção
  - Avaliação (0-10)
  - Trailer (integração com YouTube)
  - Duração
  - País de origem
  - Idioma original
- 🎲 Roleta de filmes para escolha aleatória
- 🔍 Busca e filtros avançados
- 📊 Estatísticas da coleção
- 🎯 Integração com TMDB para importação de dados
- 🗃️ Gerenciamento de gêneros
- ✅ Marcação de filmes assistidos

## 🛠️ Tecnologias

- **Frontend**
  - Next.js 14
  - TypeScript
  - Tailwind CSS
  - shadcn/ui
  - Framer Motion
  - Lucide Icons
  - Sonner (toasts)

- **Backend**
  - Next.js API Routes
  - Prisma ORM
  - PostgreSQL
  - Zod (validação)

- **Integrações**
  - TMDB API
  - YouTube API

## 🚀 Começando

### Pré-requisitos

- Node.js 18+
- PostgreSQL
- Conta no TMDB para API Key

### Instalação

1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/colecaofilmes.git
cd colecaofilmes
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
```bash
# .env
DATABASE_URL="postgresql://user:password@localhost:5432/colecaofilmes"
TMDB_ACCESS_TOKEN="seu_token_aqui"
```

4. Execute as migrações do banco de dados
```bash
npx prisma migrate dev
```

5. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

## 📦 Estrutura do Projeto

```
colecaofilmes/
├── src/
│   ├── app/              # Rotas e páginas
│   ├── components/       # Componentes React
│   ├── lib/             # Utilitários e configurações
│   └── hooks/           # Custom hooks
├── prisma/              # Schema e migrações
└── public/             # Arquivos estáticos
```

## 🔄 Convenções de Commit

- `feat`: nova funcionalidade
- `fix`: correção de bug
- `docs`: alteração na documentação
- `refactor`: refatoramento de código
- `style`: ajustes de estilo
- `test`: adição/modificação de testes
- `chore`: outras mudanças

## 📝 Boas Práticas

- Validação de dados com Zod
- Tratamento de erros consistente
- Código limpo e bem documentado
- Commits padronizados
- Desenvolvimento incremental
- Proteção contra duplicação de dados

## 🌐 Deploy

O projeto está configurado para deploy automático na Vercel:
[https://colecaofilmes.vercel.app](https://colecaofilmes.vercel.app)

## 📈 Roadmap

1. **MVP** ✅
   - Cadastro básico de filmes
   - Listagem e visualização

2. **Admin** ✅
   - Autenticação
   - CRUD completo

3. **Visual e Estilo** ✅
   - Interface moderna
   - Animações

4. **Pesquisa e Filtragem** ✅
   - Busca avançada
   - Filtros por gênero/ano

5. **API** ✅
   - Endpoints documentados
   - Integração TMDB

## 👥 Contribuindo

1. Faça o fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🙏 Agradecimentos

- [Next.js](https://nextjs.org)
- [Prisma](https://prisma.io)
- [TMDB](https://www.themoviedb.org)
- [shadcn/ui](https://ui.shadcn.com)
- [Vercel](https://vercel.com)
