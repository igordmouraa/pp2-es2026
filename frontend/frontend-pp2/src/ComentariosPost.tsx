import { useEffect, useState } from 'react'
import type { Comentario } from './tipos'

function ComentariosPost() {
  const [postId, setPostId] = useState('1')
  const [comentarios, setComentarios] = useState<Comentario[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function carregar() {
      const id = Number(postId)
      if (!Number.isInteger(id) || id < 1 || id > 100) return

      try {
        const resposta = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}/comments`, {
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

  function selecionarPost(id: string) {
    const numero = Number(id)
    setCarregando(id !== '' && Number.isInteger(numero) && numero >= 1 && numero <= 100)
    setErro(null)
    setComentarios([])
    setPostId(id)
  }

  const numeroPostValido = postId.trim() !== '' && Number.isInteger(Number(postId)) && Number(postId) >= 1 && Number(postId) <= 100

  return (
    <div>
      <div className="comment-input">
        <label htmlFor="post-comentarios">ID do post (1 a 100)</label>
        <input
          id="post-comentarios"
          type="number"
          min={1}
          max={100}
          step={1}
          value={postId}
          aria-describedby="post-comentarios-dica"
          onChange={(e) => selecionarPost(e.target.value)}
          className="rounded border px-3 py-2"
        />
        <span id="post-comentarios-dica" className="field-hint">Digite um número de 1 a 100.</span>
      </div>
      {!numeroPostValido ? <p role="status">Informe um número inteiro entre 1 e 100.</p> : carregando ? <p role="status">Carregando comentários...</p> : erro ? (
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
