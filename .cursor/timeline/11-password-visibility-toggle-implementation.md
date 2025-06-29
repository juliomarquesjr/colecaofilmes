# Implementação do Botão de Visualização de Senha

## Descrição
Adição de um botão de alternância para visualização da senha no formulário de login, melhorando a experiência do usuário ao permitir que visualizem a senha digitada.

## Mudanças Realizadas
- Adicionado estado `showPassword` para controlar a visibilidade da senha
- Implementado botão com ícone alternável (Eye/EyeOff) do Lucide React
- Adicionada funcionalidade de toggle para alternar entre tipos "text" e "password"
- Mantida consistência visual com o design existente

## Arquivos Modificados
- `src/app/login/page.tsx`

## Impacto
- Melhoria na usabilidade do formulário de login
- Redução de erros de digitação de senha
- Mantém padrões modernos de UX em formulários de autenticação