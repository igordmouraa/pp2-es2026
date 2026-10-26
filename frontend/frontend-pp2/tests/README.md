# Verificação no navegador

Na pasta `frontend/frontend-pp2`, execute `npm run dev` e abra `/tests/` no
endereço informado pelo Vite (por exemplo, `http://localhost:5173/tests/`).
O resultado aparece na página. Recarregue para executar novamente.

Os oito cenários usam o React e respostas controladas de `fetch`, sem novas
dependências. Verificam renderização, filtros locais, busca, cancelamento de
comentários com resposta atrasada, recarga e horário, recuperação de erro,
falhas HTTP e de rede, listas vazias e carregamento.

O resultado também fica disponível em `window.__resultadoTestes`, com
`sucesso`, `total` e, em caso de falha, `erro`. Esses testes são servidos apenas
durante o desenvolvimento; não são incluídos no build de produção.

Para verificar a integração real com o JSONPlaceholder, abra `/`.
As verificações estáticas e de produção são `npm run lint` e `npm run build`.
