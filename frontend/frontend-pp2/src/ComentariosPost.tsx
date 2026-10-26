import { useEffect, useState } from 'react'
import type { Comentario } from './tipos'

const postIds = Array.from({ length: 100 }, (_, indice) => indice + 1)

function ComentariosPost() {
  const [postId, setPostId] = useState(1)
  const [comentarios, setComentarios] = useState<Comentario[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function carregar() {
      try {
        const resposta = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`, {
          signal: controller.signal,
        })
        if (!resposta.ok) throw new Error(`Erro HTTP ${resposta.status}`)
        const dados: Comentario[] = await resposta.json()
        if (!controller.signal.aborted) setComentarios(dados)
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
  }, [postId])

  function selecionarPost(id: number) {
    setCarregando(true)
    setErro(null)
    setComentarios([])
    setPostId(id)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <label htmlFor="post-comentarios" className="text-sm font-medium text-[var(--text-h)]">Selecionar post</label>
        <select
          id="post-comentarios"
          value={postId}
          onChange={(e) => selecionarPost(Number(e.target.value))}
          className="rounded border border-[var(--border)] bg-[var(--bg)] px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        >
          {postIds.map((id) => <option key={id} value={id}>Post {id}</option>)}
        </select>
      </div>
      {carregando ? <p role="status">Carregando comentários...</p> : erro ? (
        <p role="alert">Erro: {erro}</p>
      ) : (
        <>
          <p role="status" className="text-sm">{comentarios.length} {comentarios.length === 1 ? 'comentário' : 'comentários'}</p>
          {comentarios.length === 0 ? <p>Nenhum comentário encontrado.</p> : (
            <ul className="space-y-4">
              {comentarios.map((comentario) => (
                <li key={comentario.id} className="border-l-2 border-[var(--border)] pl-4">
                  <h3 className="font-semibold text-[var(--text-h)]">{comentario.name}</h3>
                  <a href={`mailto:${comentario.email}`} className="break-all text-sm underline underline-offset-4">{comentario.email}</a>
                  <p className="mt-2 text-sm">{comentario.body}</p>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  )
}

export default ComentariosPost
