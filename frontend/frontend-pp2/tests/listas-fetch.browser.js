import { act, createElement } from 'react'
import { createRoot } from 'react-dom/client'
import App from '../src/App'
import '../src/index.css'

// Abra /tests/ com o Vite em execução. Nenhuma dependência de testes é necessária.
globalThis.IS_REACT_ACT_ENVIRONMENT = true

const posts = [
  { userId: 1, id: 1, title: 'Aprender React', body: 'Primeiro texto do post.' },
  { userId: 1, id: 2, title: 'Praticar fetch', body: 'Segundo texto do post.' },
]
const todos = [
  { userId: 1, id: 1, title: 'Ler a aula', completed: false },
  { userId: 1, id: 2, title: 'Revisar listas', completed: true },
  { userId: 1, id: 3, title: 'Praticar efeitos', completed: false },
]
const usuarios = [{
  id: 1, name: 'Ana Silva', email: 'ana@example.com',
  address: { city: 'Franca' }, company: { name: 'Empresa exemplo' },
}]
const comentario = (id) => [{
  postId: id, id, name: `Comentário do post ${id}`,
  email: `leitor${id}@example.com`, body: `Texto do comentário ${id}.`,
}]
const ids = ['posts', 'usuarios', 'tarefas-filtro', 'busca-posts', 'comentarios-post', 'recarregar']
const root = createRoot(document.getElementById('root'))
const requisicoes = []
const resultados = []
let modo = 'sucesso'
let montagem = 0
let liberarComentarioAntigo

globalThis.fetch = async (input, options = {}) => {
  const url = new URL(input, location.origin)
  if (url.hostname !== 'jsonplaceholder.typicode.com') {
    throw new Error(`Endpoint inesperado: ${url}`)
  }
  requisicoes.push({ url, signal: options.signal })
  if (modo === 'rede') throw new TypeError('Sem conexão')
  let dados = []
  if (modo !== 'vazio') {
    if (url.pathname === '/posts') dados = posts
    else if (url.pathname === '/todos') dados = todos
    else if (url.pathname === '/users') dados = usuarios
    else if (url.pathname === '/comments') dados = comentario(Number(url.searchParams.get('postId')))
    else throw new Error(`Caminho inesperado: ${url.pathname}`)
  }
  const status = modo === 'http' ? 503 : 200
  const corpo = JSON.stringify(dados)
  const resposta = new Response(corpo, { status })
  // Mantém o parse assíncrono sem depender das tarefas de streaming do navegador.
  resposta.json = async () => JSON.parse(corpo)
  // A resposta antiga termina de ler o JSON mesmo depois do cancelamento.
  if (url.pathname === '/comments' && url.searchParams.get('postId') === '2') {
    resposta.json = () => new Promise((resolve) => {
      liberarComentarioAntigo = () => resolve(comentario(2))
    })
  }
  return resposta
}

function verificar(condicao, mensagem) {
  if (!condicao) throw new Error(mensagem)
}

function secao(id) {
  const elemento = document.querySelector(`section[aria-labelledby="${id}"]`)
  verificar(elemento, `Seção ausente: ${id}`)
  return elemento
}

const texto = (id) => secao(id).textContent
const itens = (id) => [...secao(id).querySelectorAll('li')]
const botao = (id, nome) => [...secao(id).querySelectorAll('button')]
  .find((elemento) => elemento.textContent === nome)

async function montar(novoModo) {
  modo = novoModo
  await act(async () => {
    root.render(createElement(App, { key: ++montagem }))
  })
}

async function clicar(elemento) {
  verificar(elemento, 'Controle esperado não foi encontrado')
  await act(async () => { elemento.click() })
}

async function mudar(elemento, valor) {
  verificar(elemento, 'Campo esperado não foi encontrado')
  const prototype = elemento instanceof HTMLSelectElement
    ? HTMLSelectElement.prototype : HTMLInputElement.prototype
  await act(async () => {
    Object.getOwnPropertyDescriptor(prototype, 'value').set.call(elemento, valor)
    elemento.dispatchEvent(new Event(elemento instanceof HTMLSelectElement ? 'change' : 'input', { bubbles: true }))
  })
}

async function testar(nome, executar) {
  await executar()
  resultados.push(`✓ ${nome}`)
  document.getElementById('resultado').textContent = resultados.join('\n')
}

async function executar() {
  await testar('Posts, usuários e exercícios anteriores são exibidos', async () => {
    await montar('sucesso')
    ids.forEach(secao)
    verificar(secao('posts').querySelectorAll('ol li').length === 2, 'Posts devem formar uma lista numerada')
    verificar(texto('posts').includes(posts[0].body), 'Body do post ausente')
    verificar(secao('usuarios').querySelector('a[href="mailto:ana@example.com"]'), 'Link de e-mail ausente')
    verificar(texto('usuarios').includes('Franca') && texto('usuarios').includes('Empresa exemplo'), 'Cidade ou empresa ausente')
    verificar(document.body.textContent.includes('Calcular IMC'), 'Exemplo anterior removido')
  })

  await testar('Filtros de tarefas são locais e mostram quantidade e conclusão', async () => {
    const quantidade = requisicoes.length
    verificar(itens('tarefas-filtro').length === 3, 'Todas as tarefas devem aparecer')
    await clicar(botao('tarefas-filtro', 'Pendentes'))
    verificar(itens('tarefas-filtro').length === 2, 'Filtro de pendentes incorreto')
    verificar(texto('tarefas-filtro').includes('2 de 3'), 'Contagem visível incorreta')
    await clicar(botao('tarefas-filtro', 'Concluídas'))
    verificar(itens('tarefas-filtro').length === 1, 'Filtro de concluídas incorreto')
    verificar(secao('tarefas-filtro').querySelector('.line-through'), 'Tarefa concluída deve estar riscada')
    await clicar(botao('tarefas-filtro', 'Todas'))
    verificar(itens('tarefas-filtro').length === 3, 'Filtro Todas não restaura as tarefas')
    verificar(requisicoes.length === quantidade, 'Filtrar tarefas não deve fazer fetch')
  })

  await testar('Busca ignora maiúsculas, trata resultado vazio e não refaz fetch', async () => {
    const quantidade = requisicoes.length
    const campo = secao('busca-posts').querySelector('input')
    await mudar(campo, 'REACT')
    verificar(itens('busca-posts').length === 1 && texto('busca-posts').includes('Aprender React'), 'Busca não ignora maiúsculas')
    await mudar(campo, 'título inexistente')
    verificar(itens('busca-posts').length === 0 && /nenhum/i.test(texto('busca-posts')), 'Busca vazia sem mensagem')
    await mudar(campo, '')
    verificar(itens('busca-posts').length === 2, 'Limpar busca deve restaurar posts')
    verificar(requisicoes.length === quantidade, 'Digitar não deve fazer fetch')
  })

  await testar('Comentários cancelam resposta antiga e aceitam posts de 1 a 100', async () => {
    const campo = secao('comentarios-post').querySelector('select')
    verificar(campo?.options.length === 100, 'Seleção deve conter 100 posts')
    verificar(texto('comentarios-post').includes('1 comentário'), 'Total de comentários ausente')
    verificar(secao('comentarios-post').querySelector('a[href="mailto:leitor1@example.com"]'), 'E-mail do comentário ausente')
    verificar(texto('comentarios-post').includes('Texto do comentário 1.'), 'Texto do comentário ausente')
    await mudar(campo, '2')
    verificar(/carregando/i.test(texto('comentarios-post')), 'Nova requisição deve mostrar carregamento')
    const antiga = requisicoes.at(-1)
    await mudar(campo, '3')
    verificar(antiga.signal?.aborted, 'Requisição anterior não foi cancelada')
    verificar(texto('comentarios-post').includes('Comentário do post 3'), 'Novo post não foi carregado')
    await act(async () => { liberarComentarioAntigo() })
    verificar(!texto('comentarios-post').includes('Comentário do post 2'), 'Resposta antiga sobrescreveu o post atual')
    await mudar(campo, '100')
    verificar(texto('comentarios-post').includes('Comentário do post 100'), 'Post 100 não foi carregado')
  })

  await testar('Recarregar faz novo fetch, atualiza hora e permite recuperar de erro', async () => {
    const anterior = secao('recarregar').querySelector('time')?.dateTime
    verificar(anterior, 'Hora da atualização deve ser apresentada')
    const quantidade = requisicoes.length
    await clicar(botao('recarregar', 'Recarregar'))
    verificar(requisicoes.length === quantidade + 1, 'Recarregar deve fazer uma nova requisição')
    verificar(secao('recarregar').querySelector('time')?.dateTime !== anterior, 'Hora não atualizou')
    modo = 'http'
    await clicar(botao('recarregar', 'Recarregar'))
    verificar(texto('recarregar').includes('503'), 'Falha HTTP deve aparecer como erro')
    modo = 'sucesso'
    await clicar(botao('recarregar', 'Tentar novamente'))
    verificar(!secao('recarregar').querySelector('[role="alert"]') && itens('recarregar').length === 2, 'Nova tentativa não recuperou a lista')
  })

  await testar('Todos os exercícios apresentam erro HTTP e erro de rede', async () => {
    await montar('http')
    ids.forEach((id) => verificar(secao(id).querySelector('[role="alert"]') && texto(id).includes('503'), `HTTP sem erro explícito: ${id}`))
    await montar('rede')
    ids.forEach((id) => verificar(secao(id).querySelector('[role="alert"]'), `Rede sem erro explícito: ${id}`))
  })

  await testar('Todos os exercícios apresentam lista vazia', async () => {
    await montar('vazio')
    ids.forEach((id) => verificar(/nenhum/i.test(texto(id)), `Lista vazia sem mensagem: ${id}`))
  })

  await testar('Todos os exercícios mostram carregamento e bloqueiam recarga em andamento', async () => {
    globalThis.fetch = () => new Promise(() => {})
    await montar('sucesso')
    ids.forEach((id) => verificar(/carregando/i.test(texto(id)), `Carregamento ausente: ${id}`))
    verificar(secao('recarregar').querySelector('button')?.disabled, 'Recarregar deve ficar desabilitado durante fetch')
  })

  await act(async () => { root.unmount() })
  globalThis.__resultadoTestes = { sucesso: true, total: resultados.length }
}

executar().catch((erro) => {
  document.getElementById('resultado').textContent = [...resultados, `✗ ${erro.message}`].join('\n')
  globalThis.__resultadoTestes = { sucesso: false, erro: erro.message, total: resultados.length }
  console.error(erro)
})
