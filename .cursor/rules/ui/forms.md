# Padrões de Formulários e Componentes de Entrada

## Princípios Gerais

### Consistência Visual
- Todos os campos de entrada devem ter altura padrão de 36px (`min-h-9`)
- Padding horizontal: `px-3`
- Padding vertical: `py-1`
- Tamanho da fonte: `text-sm`
- Bordas arredondadas: `rounded-md`

### Paleta de Cores
- **Background**: `bg-zinc-800`
- **Borda**: `border-zinc-700`
- **Texto**: `text-zinc-100`
- **Placeholder**: `text-zinc-400`
- **Focus**: `focus:ring-2 focus:ring-indigo-800 focus:border-indigo-800`

## Componentes de Entrada

### Input Padrão
```typescript
<Input
  className="bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-2 focus:ring-indigo-800 focus:border-indigo-800"
  placeholder="Digite aqui..."
/>
```

### Textarea
```typescript
<Textarea
  className="min-h-[120px] bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-2 focus:ring-indigo-800 focus:border-indigo-800 resize-y"
  placeholder="Digite a descrição..."
/>
```

### Select
```typescript
<Select>
  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-2 focus:ring-indigo-800 focus:border-indigo-800">
    <SelectValue placeholder="Selecione uma opção" />
  </SelectTrigger>
  <SelectContent className="bg-zinc-800 border-zinc-700">
    <SelectItem value="opcao1" className="text-zinc-100 focus:bg-zinc-700">Opção 1</SelectItem>
  </SelectContent>
</Select>
```

### MultiSelect Customizado
```typescript
// Estrutura do componente
<div className="flex min-h-9 w-full cursor-pointer items-center rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1 text-sm text-zinc-100">
  <div className="flex flex-1 flex-wrap gap-1 items-center min-h-[20px]">
    {/* Badges selecionados ou placeholder */}
    <span className="text-zinc-400 py-1 mt-0.5">Placeholder</span>
  </div>
  <div className="flex items-center ml-2">
    <ChevronsUpDown className="h-4 w-4 opacity-50" />
  </div>
</div>
```

**Características:**
- Altura alinhada com outros inputs (36px)
- Centralização vertical perfeita
- Badges com remoção individual
- Dropdown com scroll automático
- Busca interna quando necessário

## Máscaras de Entrada

### Código da Estante (Maiúsculo)
```typescript
const handleShelfCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value.toUpperCase();
  setForm({ ...form, shelfCode: value });
};

<Input
  value={form.shelfCode}
  onChange={handleShelfCodeChange}
  placeholder="Digite o código"
/>
```

### Outras Máscaras Sugeridas
- **CPF**: `000.000.000-00`
- **Telefone**: `(00) 00000-0000`
- **CEP**: `00000-000`
- **Data**: `DD/MM/AAAA`

## Labels e Estrutura

### Label Padrão
```typescript
<Label htmlFor="campo" className="text-zinc-300">
  Nome do Campo
</Label>
```

### Estrutura de Campo Completa
```typescript
<div className="space-y-2">
  <Label htmlFor="campo" className="text-zinc-300">
    Nome do Campo
  </Label>
  <Input
    id="campo"
    name="campo"
    value={form.campo}
    onChange={handleChange}
    className="bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-2 focus:ring-indigo-800 focus:border-indigo-800"
    placeholder="Digite aqui..."
  />
</div>
```

## Validação e Feedback

### Mensagens de Erro
```typescript
{error && (
  <div className="p-4 bg-red-950/50 text-red-200 rounded-t-lg border-b border-red-900/50">
    <div className="flex items-center gap-2">
      <span className="text-red-500">•</span>
      {error}
    </div>
  </div>
)}
```

### Validação em Tempo Real
- Usar Zod para esquemas de validação
- Feedback visual imediato
- Mensagens contextuais e claras

## Layouts de Formulário

### Grid Responsivo
```typescript
// Duas colunas em desktop, uma em mobile
<div className="grid sm:grid-cols-2 gap-4">
  <div className="space-y-2">
    {/* Campo 1 */}
  </div>
  <div className="space-y-2">
    {/* Campo 2 */}
  </div>
</div>
```

### Seções de Formulário
```typescript
<div className="p-6">
  <div className="flex items-center gap-3 mb-6">
    <div className="p-2 rounded-lg bg-zinc-800 border border-zinc-700">
      <InfoIcon className="h-5 w-5 text-zinc-400" />
    </div>
    <h2 className="text-lg font-semibold text-white">Seção do Formulário</h2>
  </div>
  
  <div className="grid gap-6">
    {/* Campos da seção */}
  </div>
</div>
```

## Integração com APIs

### YouTube Search Modal
```typescript
<YouTubeSearchModal 
  onVideoSelect={(url) => setForm({ ...form, trailerUrl: url })} 
  initialSearchTerm={form.title && form.year ? `${form.title} ${form.year} trailer` : ''}
/>
```

**Características:**
- Busca contextual automática
- Preenchimento baseado em dados existentes
- Modal responsivo com preview
- Seleção e confirmação visual

### TMDB Integration
```typescript
<TMDBSearchModal onMovieSelect={handleTMDBSelect} />
```

**Funcionalidades:**
- Busca por filmes na base do TMDB
- Preenchimento automático de campos
- Informações completas (capa, sinopse, ano, etc.)

## Estados de Carregamento

### Botões com Loading
```typescript
<Button 
  type="submit" 
  disabled={isLoading}
  className="bg-indigo-600 hover:bg-indigo-700 text-white"
>
  {isLoading ? 'Salvando...' : 'Salvar'}
</Button>
```

### Skeleton para Formulários
- Usar componente `Skeleton` durante carregamento inicial
- Manter estrutura visual similar ao formulário final
- Animação suave de loading

## Acessibilidade

### Navegação por Teclado
- Ordem lógica de tab
- Atalhos quando apropriado
- Focus visível e claro

### Screen Readers
- Labels associados corretamente
- Descrições para campos complexos
- Mensagens de erro acessíveis

### Contraste e Legibilidade
- Cores seguem padrões WCAG
- Texto suficientemente contrastado
- Elementos interativos claramente identificáveis

## Boas Práticas

### Performance
- Debounce em campos de busca
- Validação otimizada
- Lazy loading quando apropriado

### UX
- Feedback imediato para ações
- Prevenção de perda de dados
- Confirmação para ações destrutivas

### Manutenibilidade
- Componentes reutilizáveis
- Separação de lógica e apresentação
- Tipagem completa com TypeScript

---

**Última atualização:** 28/06/2025 - Adicionado padrões do MultiSelect e máscaras de entrada 