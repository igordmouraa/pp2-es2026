import { useEffect, useState } from 'react'
import type { Post } from './tipos'

function ListaRecarregavel() {
  const [posts, setPosts] = useState<Post[]>([])
  const [tentativa, setTentativa] = useState(0)
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState<Date | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function carregar() {
      try {
        const resposta = await fetch('https://jsonplaceholder.typicode.com/posts?userId=1', {
          signal: controller.signal,
        })
        if (!resposta.ok) throw new Error(`Erro HTTP ${resposta.status}`)
        const dados: Post[] = await resposta.json()
        if (!controller.signal.aborted) {
          setPosts(dados)
          setUltimaAtualizacao(new Date())
        }
      } catch (e) {
        if (!controller.signal.aborted) {
          setErro(e instanceof Error ? e.message : 'Erro desconhecido')
        }
      } finally {
        if (!controller.signal.aborted) setCarregando(false)
      }
    }

    carregar()
    return () => controller.abort()
  }, [tentativa])

  function recarregar() {
    setCarregando(true)
    setErro(null)
    setTentativa((atual) => atual + 1)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={recarregar}
          disabled={carregando}
          className="cursor-pointer rounded border border-[var(--accent)] bg-[var(--accent-bg)] px-4 py-2 font-medium text-[var(--text-h)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] disabled:cursor-wait disabled:opacity-60"
        >
          {carregando ? 'Carregando...' : erro ? 'Tentar novamente' : 'Recarregar'}
        </button>
        {ultimaAtualizacao !== null ? (
          <p className="text-sm">
            Última atualização: <time dateTime={ultimaAtualizacao.toISOString()}>{ultimaAtualizacao.toLocaleTimeString('pt-BR')}</time>
          </p>
        ) : null}
      </div>
      {carregando ? <p role="status">Carregando posts...</p> : erro ? (
        <p role="alert">Erro: {erro}</p>
      ) : posts.length === 0 ? <p>Nenhum post encontrado.</p> : (
        <ul className="list-disc space-y-2 pl-6 text-[var(--text-h)]">
          {posts.map((post) => <li key={post.id}>{post.title}</li>)}
        </ul>
      )}
    </div>
  )
}

export default ListaRecarregavel
