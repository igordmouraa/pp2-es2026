import { useEffect, useState } from 'react'
import type { Todo } from './tipos'

type Filtro = 'Todas' | 'Pendentes' | 'Concluídas'
const filtros: Filtro[] = ['Todas', 'Pendentes', 'Concluídas']

function TarefasFiltro() {
  const [tarefas, setTarefas] = useState<Todo[]>([])
  const [filtro, setFiltro] = useState<Filtro>('Todas')
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function carregar() {
      try {
        const resposta = await fetch('https://jsonplaceholder.typicode.com/todos?userId=1', {
          signal: controller.signal,
        })
        if (!resposta.ok) throw new Error(`Erro HTTP ${resposta.status}`)
        const dados: Todo[] = await resposta.json()
        if (!controller.signal.aborted) setTarefas(dados)
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

  const visiveis = tarefas.filter((tarefa) => (
    filtro === 'Todas' || (filtro === 'Concluídas' ? tarefa.completed : !tarefa.completed)
  ))

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar tarefas">
        {filtros.map((opcao) => (
          <button
            key={opcao}
            type="button"
            aria-pressed={filtro === opcao}
            onClick={() => setFiltro(opcao)}
            className="cursor-pointer rounded border border-[var(--border)] px-3 py-2 text-sm font-medium aria-pressed:border-[var(--accent)] aria-pressed:bg-[var(--accent-bg)] aria-pressed:text-[var(--text-h)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            {opcao}
          </button>
        ))}
      </div>
      {carregando ? <p role="status">Carregando tarefas...</p> : erro ? (
        <p role="alert">Erro: {erro}</p>
      ) : (
        <>
          <p role="status" className="text-sm">{visiveis.length} de {tarefas.length} tarefas</p>
          {visiveis.length === 0 ? <p>Nenhuma tarefa encontrada.</p> : (
            <ul className="space-y-2">
              {visiveis.map((tarefa) => (
                <li key={tarefa.id} className="flex items-start gap-2">
                  <span className="shrink-0 text-sm">{tarefa.completed ? 'Concluída' : 'Pendente'}</span>
                  <span className={tarefa.completed ? 'line-through' : 'text-[var(--text-h)]'}>{tarefa.title}</span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  )
}

export default TarefasFiltro
