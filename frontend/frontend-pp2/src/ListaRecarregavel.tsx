import { useEffect, useState } from 'react'
import type { Todo } from './tipos'

function ListaRecarregavel() {
  const [tarefas, setTarefas] = useState<Todo[]>([])
  const [tentativa, setTentativa] = useState(0)
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState<Date | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    async function carregar() {
      try {
        const resposta = await fetch('https://jsonplaceholder.typicode.com/todos?userId=1')
        if (!resposta.ok) throw new Error(`Erro HTTP ${resposta.status}`)
        const dados: Todo[] = await resposta.json()
        setTarefas(dados)
        setUltimaAtualizacao(new Date())
      } catch (e) {
        setErro(e instanceof Error ? e.message : 'Erro desconhecido')
      } finally {
        setCarregando(false)
      }
    }

    carregar()
  }, [tentativa])

  function recarregar() {
    setCarregando(true)
    setErro(null)
    setTentativa((atual) => atual + 1)
  }

  return (
    <div>
      <button type="button" onClick={recarregar} disabled={carregando} className="recarregar-button">
        {carregando ? 'Carregando...' : erro ? 'Tentar novamente' : 'Recarregar'}
      </button>
      {ultimaAtualizacao !== null ? (
        <p className="ultima-atualizacao">
          Última atualização: <time dateTime={ultimaAtualizacao.toISOString()}>{ultimaAtualizacao.toLocaleTimeString('pt-BR')}</time>
        </p>
      ) : null}
      {carregando ? <p role="status">Carregando tarefas...</p> : erro ? (
        <p role="alert">Erro: {erro}</p>
      ) : tarefas.length === 0 ? <p>Nenhuma tarefa.</p> : (
        <ul className="space-y-1">
          {tarefas.map((tarefa) => (
            <li key={tarefa.id} className={tarefa.completed ? 'tarefa-concluida' : undefined}>
              {tarefa.completed ? '✓' : '○'} {tarefa.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ListaRecarregavel
