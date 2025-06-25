# Funcionamento Geral e Regras de Negócio

## Fluxo Principal
1. **Login (futuro)**: Usuário acessa o sistema (público por enquanto)
2. **Listagem de Filmes**: Exibe todos os filmes cadastrados, com filtros por texto, gênero, ano e nota
3. **Cadastro de Filme**: Formulário com validação, geração automática de código único, associação de gêneros
4. **Edição/Exclusão**: Permite editar ou remover (lógica) um filme
5. **Roleta de Filmes**: Sorteia um filme não assistido, com filtros opcionais
6. **Gerenciamento de Gêneros**: CRUD de gêneros via modal
7. **Estatísticas**: Exibe total de filmes, assistidos, por gênero, etc.

## Regras de Negócio
- **Código único**: Todo filme recebe um código único gerado automaticamente
- **Filme não pode ser duplicado**: Validação por título, ano e tipo de mídia
- **Remoção lógica**: Filmes não são apagados do banco, apenas marcados como removidos
- **Associação de gêneros**: Um filme pode ter vários gêneros
- **Marcação de assistido**: Permite registrar quando o filme foi assistido

## Fluxo de Cadastro
- Preenchimento dos campos obrigatórios
- Geração e validação do código único
- Associação de pelo menos um gênero
- Validação de URL de capa e trailer
- Feedback visual de sucesso ou erro 