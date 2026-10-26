import { useEffect, useState } from 'react'
import LinhaUsuario from './LinhaUsuario'
import type { Usuario } from './tipos'

function TabelaUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function carregar() {
      try {
        const resposta = await fetch('https://jsonplaceholder.typicode.com/users', {
          signal: controller.signal,
        })
        if (!resposta.ok) throw new Error(`Erro HTTP ${resposta.status}`)
        const dados: Usuario[] = await resposta.json()
        if (!controller.signal.aborted) setUsuarios(dados)
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

  if (carregando) return <p role="status">Carregando usuários...</p>
  if (erro) return <p role="alert">Erro: {erro}</p>
  if (usuarios.length === 0) return <p>Nenhum usuário encontrado.</p>

  return (
    <div className="overflow-x-auto rounded border border-[var(--border)]" role="region" aria-label="Tabela de usuários" tabIndex={0}>
      <table className="w-full min-w-160 text-left text-sm">
        <caption className="sr-only">Nome, e-mail, cidade e empresa dos usuários</caption>
        <thead className="bg-[var(--code-bg)] text-[var(--text-h)]">
          <tr>
            <th scope="col" className="px-3 py-3">Nome</th>
            <th scope="col" className="px-3 py-3">E-mail</th>
            <th scope="col" className="px-3 py-3">Cidade</th>
            <th scope="col" className="px-3 py-3">Empresa</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => <LinhaUsuario key={usuario.id} usuario={usuario} />)}
        </tbody>
      </table>
    </div>
  )
}

export default TabelaUsuarios
