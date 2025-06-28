# Sistema de Design e Padrões de UI

## Princípios de Design

### Mobile First
- Design responsivo iniciando pela versão mobile
- Breakpoints padrão do Tailwind CSS
- Layouts adaptáveis para diferentes tamanhos de tela

### Experiência do Usuário
- Interface elegante e divertida
- Animações suaves usando Framer Motion
- Feedback visual para ações do usuário
- Transições fluidas entre estados

## Componentes Base

### Radix UI + Tailwind
O projeto utiliza componentes base do Radix UI, estilizados com Tailwind CSS:

- Alert Dialog (`@radix-ui/react-alert-dialog`)
- Checkbox (`@radix-ui/react-checkbox`)
- Dialog (`@radix-ui/react-dialog`)
- Dropdown Menu (`@radix-ui/react-dropdown-menu`)
- Label (`@radix-ui/react-label`)
- Scroll Area (`@radix-ui/react-scroll-area`)
- Select (`@radix-ui/react-select`)
- Separator (`@radix-ui/react-separator`)
- Toast (`@radix-ui/react-toast`)

### Componentes Customizados

#### MovieCard
- Card principal para exibição de filmes
- Exibe capa, título e informações básicas
- Animações de hover
- Ações contextuais

#### Modais
- `MoviePreviewModal`: Visualização detalhada do filme
  - **Layout Otimizado**: Grid 2 colunas (capa + informações)
  - **Múltiplos Gêneros**: Seção dedicada exibindo todos os gêneros
  - **Ações Organizadas**: Botões posicionados abaixo da capa
  - **Funcionalidades**: Assistido, Editar, Trailer
  - **Responsivo**: Adaptável a diferentes tamanhos de tela
- `GenreManagementModal`: Gestão de categorias
- `UserManagementModal`: Gestão de usuários
- `TMDBSearchModal`: Busca na API do TMDB
- `YoutubeSearchModal`: Busca de trailers
- `MovieRouletteModal`: Interface da roleta de filmes

#### Formulários
- Campos com validação visual
- Feedback de erros inline
- Autocompletar quando apropriado
- Máscaras de entrada quando necessário

#### MultiSelect Customizado
- **Altura Padrão**: `min-h-9` (36px) - Alinhado com inputs padrão
- **Tipografia**: `text-sm` - Consistente com o sistema
- **Padding**: `px-3 py-1` - Padrão para campos de entrada
- **Centralização**: `items-center` para alinhamento vertical perfeito
- **Placeholder**: Posicionamento preciso com `py-1 mt-0.5`
- **Cores**: Segue paleta zinc para consistência visual
- **Estados**: Hover, focus e selected com feedback visual claro

## Padrões de Layout

### Estrutura Comum
- Barra de navegação fixa
- Área de conteúdo principal
- Rodapé quando apropriado
- Sidebar em telas maiores (quando necessário)

### Grid System
- Sistema de grid flexível do Tailwind
- Adaptável a diferentes tamanhos de tela
- Espaçamento consistente

## Animações

### Framer Motion
- Animações de entrada/saída de elementos
- Transições entre estados
- Gestos e interações
- Feedback visual de ações

### Confetti
- Utilizado em momentos de celebração
- Implementado com canvas-confetti
- Acionado em eventos específicos

## Temas e Cores

### Sistema de Temas
- Suporte a tema claro e escuro
- Transições suaves entre temas
- Implementado com next-themes

### Acessibilidade
- Contraste adequado
- Textos legíveis
- Suporte a navegação por teclado
- Elementos interativos claramente identificáveis

## Responsividade

### Breakpoints
```css
sm: '640px'
md: '768px'
lg: '1024px'
xl: '1280px'
2xl: '1536px'
```

### Adaptações Mobile
- Menus colapsáveis
- Touch-friendly
- Conteúdo priorizado
- Gestos naturais

## Feedback Visual

### Loading States
- Skeletons para carregamento
- Spinners quando apropriado
- Feedback de progresso

### Paginação Avançada
- **Navegação Inteligente**: Elipses automáticas baseadas na quantidade de páginas
- **Responsividade**: Desktop (até 7 páginas visíveis) vs Mobile (3 páginas)
- **Estados de Loading**: Spinners individuais para cada controle
- **Barra de Progresso**: Gradiente animado durante carregamento
- **Overlay de Carregamento**: Backdrop blur com indicador central
- **Navegação por Teclado**: Suporte completo com tooltips informativos
- **Feedback Contextual**: Contador dinâmico e informações detalhadas

### Notificações
- Sistema de toast para mensagens
- Alertas contextuais
- Confirmações de ações 