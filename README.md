# Catálogo de Filmes Pessoais

Aplicativo para cadastro e gerenciamento interno de filmes, com visual amigável e API integrada.

## Objetivo
Permitir o registro, consulta e visualização de filmes pessoais, com dados completos e reais.

## Como usar

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Rode as migrations e gere o banco:
   ```bash
   npx prisma migrate dev
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
4. Acesse `http://localhost:3000` no navegador.

## Funcionalidades
- Cadastro de filme com título, ano, tipo (DVD, BluRay, VHS), código da estante, capa (URL) e informações de produção
- Listagem de filmes cadastrados
- Validação de dados com mensagens claras
- Verificação de duplicidade (título, ano, tipo)

## API
### Listar filmes
`GET /api/filmes`

Retorna todos os filmes cadastrados (exceto removidos logicamente).

### Cadastrar filme
`POST /api/filmes`

Body (JSON):
```json
{
  "title": "O Senhor dos Anéis: A Sociedade do Anel",
  "year": 2001,
  "mediaType": "DVD",
  "shelfCode": "A1",
  "coverUrl": "https://...",
  "productionInfo": "Peter Jackson, New Line Cinema"
}
```

Respostas:
- 201: Filme cadastrado
- 409: Já existe filme igual
- 400: Dados inválidos

## Campos obrigatórios
- Título (string)
- Ano (número, >= 1900)
- Tipo (DVD, BluRay, VHS)
- Código da estante (string)
- URL da capa (string, url)
- Informações de produção (string)

## Observações
- Remoção lógica implementada (campo `deletedAt`)
- Todos os dados devem ser reais e completos

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
