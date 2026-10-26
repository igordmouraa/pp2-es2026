import { useEffect, useState } from 'react'
import type { Post } from './tipos'

function BuscaPosts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [busca, setBusca] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function carregar() {
      try {
        const resposta = await fetch('https://jsonplaceholder.typicode.com/posts', {
          signal: controller.signal,
        })
        if (!resposta.ok) throw new Error(`Erro HTTP ${resposta.status}`)
        const dados: Post[] = await resposta.json()
        if (!controller.signal.aborted) setPosts(dados)
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
  }, [])

  const visiveis = posts.filter((post) => post.title.toLowerCase().includes(busca.toLowerCase()))

  return (
    <div className="space-y-4">
      <div className="flex max-w-lg flex-col gap-2">
        <label htmlFor="busca-titulo" className="text-sm font-medium text-[var(--text-h)]">Buscar por título</label>
        <input
          id="busca-titulo"
          type="search"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Digite parte do título"
          className="w-full rounded border border-[var(--border)] bg-[var(--bg)] px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        />
      </div>
      {carregando ? <p role="status">Carregando posts...</p> : erro ? (
        <p role="alert">Erro: {erro}</p>
      ) : (
        <>
          <p role="status" className="text-sm">{visiveis.length} de {posts.length} posts</p>
          {visiveis.length === 0 ? <p>Nenhum post encontrado.</p> : (
            <ul className="list-disc space-y-2 pl-6 text-[var(--text-h)]">
              {visiveis.map((post) => <li key={post.id}>{post.title}</li>)}
            </ul>
          )}
        </>
      )}
    </div>
  )
}

export default BuscaPosts
