# Funcionalidades e Regras de Negócio

## Gestão de Filmes

### Cadastro e Edição de Filmes
- Cada filme deve ter um código único de 8 dígitos
- **Seleção de Múltiplos Gêneros:** É possível associar um filme a múltiplos gêneros.
- Informações obrigatórias:
  - Título
  - Ano
  - Tipo de mídia (DVD, BluRay, VHS)
  - Código de prateleira
  - URL da capa
  - Informações de produção
  - País de origem
  - Idioma original
- Informações opcionais:
  - Título original
  - Sinopse
  - Nota (0-10)
  - URL do trailer
  - Duração em minutos
  - Emoji da bandeira do país

### Integração TMDB
- Utilizada apenas como suporte ao preenchimento do formulário
- Dados importados não são atualizados automaticamente
- O usuário tem liberdade para editar qualquer informação após a importação

### Marcação de Filmes Assistidos
- Funcionalidade de controle pessoal
- Registra a data em que o filme foi assistido
- Não há regras específicas ou restrições para marcação

### Listagem de Filmes
- **Paginação:** A listagem de filmes agora suporta paginação, permitindo navegar por grandes coleções.
- **Controle de Itens por Página:** O usuário pode selecionar a quantidade de filmes exibidos por página (opções incluem 12, 24, 36, 48).

## Roleta de Filmes

### Funcionamento
- Permite seleção de uma ou mais categorias
- Sorteia aleatoriamente um filme das categorias selecionadas
- Não há restrições quanto ao número de sorteios
- Filmes já assistidos podem ser sorteados novamente

## Gestão de Usuários

### Níveis de Acesso
1. **Administrador**
   - Pode cadastrar novos usuários
   - Acesso total ao sistema
   - Não há regras específicas para criação de administradores

2. **Usuário Comum**
   - Não pode cadastrar novos usuários
   - Acesso a todas as outras funcionalidades do sistema

### Dados do Usuário
- Username (único)
- Nome
- Endereço
- Telefone
- Senha (armazenada com hash)

## Categorias (Gêneros)

### Gestão
- Podem ser criadas, editadas e excluídas
- Nome deve ser único
- Um filme pode pertencer a múltiplas categorias
- Exclusão lógica (soft delete) implementada

## Regras Gerais

### Interface
- Design responsivo com abordagem Mobile First
- Interface elegante e divertida
- Animações e transições suaves
- Componentes consistentes em todo o sistema

### Armazenamento
- Exclusão lógica implementada para todos os modelos principais
- Registros de data de criação e atualização mantidos
- Banco de dados PostgreSQL gerenciado pelo Neon

### Deployment
- Ambiente único de produção na Vercel
- Testes realizados em ambiente local
- Migrations executadas automaticamente no deploy 