# Exercícios de listas, useEffect e fetch

## Objetivo

Completar o projeto `frontend-pp2` com os seis exercícios da Fase 4 do slide
`listas-fetch-slides-completo.pptx`, mantendo os exemplos já existentes da aula
anterior e renderizando cada exercício no `App.tsx`.

## Escopo funcional

1. **Lista de posts**: buscar os posts do usuário 1, exibir títulos em uma
   lista numerada e o `body` em texto secundário.
2. **Tabela de usuários**: buscar usuários e exibir nome, e-mail como link
   `mailto:`, cidade e empresa; a linha será extraída para `LinhaUsuario`.
3. **Tarefas com filtro**: buscar as tarefas do usuário 1, oferecer filtros
   Todas/Pendentes/Concluídas, riscar concluídas e mostrar a quantidade visível.
4. **Busca por título**: buscar todos os posts uma única vez e filtrar no
   cliente com input controlado, ignorando maiúsculas/minúsculas.
5. **Comentários de um post**: selecionar um post de 1 a 100, refazer a busca
   quando o id mudar, exibir nome, e-mail, texto e total; cancelar requisições
   anteriores com `AbortController`.
6. **Botão recarregar**: refazer a busca a cada tentativa, mostrar a hora da
   última atualização e permitir tentar novamente após erro.

Todos os componentes terão estados explícitos de carregamento, erro e lista
vazia. Erros HTTP serão tratados como falhas, em vez de serem apresentados como
sucesso com dados vazios.

## Arquitetura

Os exercícios serão componentes independentes em arquivos próprios dentro de
`src/`. Os tipos de domínio (`Post`, `Usuario`, `Comentario`, `Todo`) ficarão
centralizados no arquivo de tipos existente. O componente `App` somente
organizará títulos, seções e a ordem de renderização.

Componentes previstos:

- `ListaPosts`
- `TabelaUsuarios`
- `LinhaUsuario`
- `TarefasFiltro`
- `BuscaPosts`
- `ComentariosPost`
- `ListaRecarregavel`

Cada componente será responsável apenas pelo seu fetch, estado derivado e
renderização. A filtragem será calculada a partir do estado original, sem
duplicar listas filtradas em outro `useState`.

## Fluxo de dados e efeitos

- Efeitos que buscam dados uma única vez usarão dependências `[]`.
- O exercício de comentários usará `[postId]` e um `AbortController` no cleanup.
- O exercício de recarregamento usará `[tentativa]`.
- As respostas serão verificadas com `response.ok` antes de chamar `.json()`.
- O estado inicial das coleções será um array vazio tipado, evitando chamadas
  de `map` sobre `undefined`.

## Interface

As seções serão visualmente separadas e identificadas pelo nome do exercício.
Serão reutilizadas as classes Tailwind presentes no projeto, com foco em
legibilidade, responsividade e estados claros de carregamento/erro/vazio. A
tabela terá rolagem horizontal em telas estreitas; links de e-mail e controles
de formulário permanecerão acessíveis por teclado.

## Validação

Após a implementação, executar:

- `npm run lint`
- `npm run build`

Também será feita uma verificação manual no navegador para confirmar que os
fetches carregam, filtros e inputs atualizam a interface, o cancelamento não
exibe respostas obsoletas e o botão de recarregar atualiza a hora.

## Fora de escopo

- Alterar o backend ou criar endpoints próprios.
- Adicionar mutações (POST, PUT ou DELETE).
- Remover ou reescrever os exercícios já existentes.
- Adicionar dependências novas.
