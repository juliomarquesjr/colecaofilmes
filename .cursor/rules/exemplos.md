# Exemplos Práticos

## Cadastro de Filme (API)

**Request:**
POST `/api/filmes`
```json
{
  "title": "O Senhor dos Anéis: A Sociedade do Anel",
  "year": 2001,
  "mediaType": "DVD",
  "shelfCode": "A1",
  "coverUrl": "https://...",
  "productionInfo": "Peter Jackson, New Line Cinema",
  "genreId": 1,
  "uniqueCode": "ABCD1234"
}
```

**Response:**
```json
{
  "id": 1,
  "uniqueCode": "ABCD1234",
  "title": "O Senhor dos Anéis: A Sociedade do Anel",
  "year": 2001,
  ...
}
```

## Fluxo de Cadastro na UI
1. Usuário acessa a tela de cadastro
2. Preenche os campos obrigatórios
3. Gera código único
4. Seleciona gênero
5. Salva e recebe feedback visual

## Exemplo de Busca
GET `/api/filmes?unwatched=true`

**Response:**
```json
[
  {
    "id": 2,
    "title": "Matrix",
    "watchedAt": null,
    ...
  }
]
``` 