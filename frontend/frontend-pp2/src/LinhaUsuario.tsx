import type { Usuario } from './tipos'

interface LinhaUsuarioProps {
  usuario: Usuario;
}

function LinhaUsuario({ usuario }: LinhaUsuarioProps) {
  return (
    <tr className="border-t border-[var(--border)]">
      <td className="px-3 py-3 font-medium text-[var(--text-h)]">{usuario.name}</td>
      <td className="px-3 py-3">
        <a className="underline underline-offset-4" href={`mailto:${usuario.email}`}>
          {usuario.email}
        </a>
      </td>
      <td className="px-3 py-3">{usuario.address.city}</td>
      <td className="px-3 py-3">{usuario.company.name}</td>
    </tr>
  )
}

export default LinhaUsuario
