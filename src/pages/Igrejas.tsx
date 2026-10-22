
import { useState } from 'react'
import type { Church } from '../types'

interface IgrejasProps {
  churches: Church[]
  onAddChurch: (church: Church) => void
  onEditChurch: (id: string, name: string) => void
  onToggleChurch: (id: string) => void
}

export default function Igrejas({
  churches,
  onAddChurch,
  onEditChurch,
  onToggleChurch,
}: IgrejasProps) {
  const [newChurchName, setNewChurchName] = useState('')

  return (
    <main className="mx-auto max-w-7xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Gerenciamento de igrejas
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Consulte e gerencie as igrejas do setor.
        </p>
      </div>

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Cadastrar nova igreja
        </h2>

        <form
          onSubmit={(event) => {
            event.preventDefault()

            const name = newChurchName.trim()

            if (!name) return

            const alreadyExists = churches.some(
              (church) =>
                church.name.trim().toLowerCase() === name.toLowerCase()
            )

            if (alreadyExists) {
              window.alert('Já existe uma igreja com esse nome.')
              return
            }

            onAddChurch({
              id: crypto.randomUUID(),
              name,
              active: true,
            })

            setNewChurchName('')
          }}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <input
            type="text"
            value={newChurchName}
            onChange={(event) => setNewChurchName(event.target.value)}
            placeholder="Digite o nome da igreja"
            className="flex-1 rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
            required
          />

          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700"
          >
            Cadastrar igreja
          </button>
        </form>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {churches.length === 0 ? (
          <p className="p-6 text-center text-slate-500">
            Nenhuma igreja cadastrada.
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {churches.map((church) => (
              <div
                key={church.id}
                className="flex items-center justify-between gap-4 p-4"
              >
                <div>
                  <p className="font-semibold text-slate-900">
                    {church.name}
                  </p>
                  <p className="text-sm text-slate-500">
                    {church.active ? 'Ativa' : 'Desativada'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const newName = window.prompt(
                      'Digite o novo nome da igreja:',
                      church.name
                    )

                    if (!newName?.trim()) return

                    const name = newName.trim()

                    const alreadyExists = churches.some(
                      (item) =>
                        item.id !== church.id &&
                        item.name.trim().toLowerCase() === name.toLowerCase()
                    )

                    if (alreadyExists) {
                      window.alert('Já existe outra igreja com esse nome.')
                      return
                    }

                    onEditChurch(church.id, name)
                  }}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Editar
                </button>
                <button
  type="button"
  onClick={() => {
    const action = church.active ? 'desativar' : 'reativar'

    const confirmed = window.confirm(
      `Tem certeza de que deseja ${action} a igreja "${church.name}"?`,
    )

    if (confirmed) {
      onToggleChurch(church.id)
    }
  }}
  className={`rounded-lg px-4 py-2 text-sm font-medium ${
    church.active
      ? 'border border-red-200 text-red-700 hover:bg-red-50'
      : 'border border-green-200 text-green-700 hover:bg-green-50'
  }`}
>
  {church.active ? 'Desativar' : 'Reativar'}
</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="mt-4 text-sm text-slate-500">
        Total de igrejas: {churches.length}
      </p>
    </main>
  )
}
