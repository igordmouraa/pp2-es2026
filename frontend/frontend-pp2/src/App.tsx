import Card from './Card'
import Contador from './Contador'
import Imc from './Imc'
import ListaFiltrada from './ListaFiltrada'
import ListaSimples from './ListaSimples'
import ListaTarefas from './ListaTarefas'
import ListaApi from './ListaApi'
import ListaPosts from './ListaPosts'
import TabelaUsuarios from './TabelaUsuarios'
import TarefasFiltro from './TarefasFiltro'
import BuscaPosts from './BuscaPosts'
import ComentariosPost from './ComentariosPost'
import ListaRecarregavel from './ListaRecarregavel'

function App() {
  return (
    <main className="flex min-w-0 flex-col gap-6 p-4 text-left sm:p-6">
      <h1 className="text-3xl font-bold">
        Hello, Paradigmas de Programação 2
      </h1>
      <section aria-labelledby="exemplos-anteriores" className="flex min-w-0 flex-col gap-3 rounded-lg border border-[var(--border)] p-4 sm:p-6">
        <h2 id="exemplos-anteriores">Exemplos anteriores</h2>
        <Card
          title="Estudar"
          description="ReactJS e TailwindCSS" />
        <Card
          title="Exercícios"
          description="Fazer a lista" />

        <Contador />
        <Imc />
        <ListaSimples />
        <ListaTarefas />
        <ListaFiltrada />
        <ListaApi />
      </section>

      <section aria-labelledby="posts" className="min-w-0 rounded-lg border border-[var(--border)] p-4 sm:p-6">
        <h2 id="posts">01. Lista de posts</h2>
        <ListaPosts />
      </section>
      <section aria-labelledby="usuarios" className="min-w-0 rounded-lg border border-[var(--border)] p-4 sm:p-6">
        <h2 id="usuarios">02. Tabela de usuários</h2>
        <TabelaUsuarios />
      </section>
      <section aria-labelledby="tarefas-filtro" className="min-w-0 rounded-lg border border-[var(--border)] p-4 sm:p-6">
        <h2 id="tarefas-filtro">03. Tarefas com filtro</h2>
        <TarefasFiltro />
      </section>
      <section aria-labelledby="busca-posts" className="min-w-0 rounded-lg border border-[var(--border)] p-4 sm:p-6">
        <h2 id="busca-posts">04. Busca por título</h2>
        <BuscaPosts />
      </section>
      <section aria-labelledby="comentarios-post" className="min-w-0 rounded-lg border border-[var(--border)] p-4 sm:p-6">
        <h2 id="comentarios-post">05. Comentários de um post</h2>
        <ComentariosPost />
      </section>
      <section aria-labelledby="recarregar" className="min-w-0 rounded-lg border border-[var(--border)] p-4 sm:p-6">
        <h2 id="recarregar">06. Botão recarregar</h2>
        <ListaRecarregavel />
      </section>
    </main>
  )
}

export default App
