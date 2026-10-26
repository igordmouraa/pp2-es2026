import { useEffect, useState } from 'react'
import type { Post } from './tipos'

function ListaPosts() {
  const [posts, setPosts] = useState<Post[]>([])
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

  if (carregando) return <p role="status">Carregando posts...</p>
  if (erro) return <p role="alert">Erro: {erro}</p>
  if (posts.length === 0) return <p>Nenhum post encontrado.</p>

  return (
    <ol className="list-decimal space-y-4 pl-6">
      {posts.map((post) => (
        <li key={post.id}>
          <h3 className="font-semibold text-[var(--text-h)]">{post.title}</h3>
          <p className="mt-1 text-sm">{post.body}</p>
        </li>
      ))}
    </ol>
  )
}

export default ListaPosts
