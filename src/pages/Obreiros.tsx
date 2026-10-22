import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Person, Church } from '../types'

interface ObreirosProps {
  people: Person[]
  churches: Church[]
  onAddPerson: (person: Omit<Person, 'id'>) => void
  onUpdatePerson: (person: Person) => void
  onDeletePerson: (personId: string) => void
}

const roles = [
  'Pastor',
  'Presbítero',
  'Diácono',
  'Cooperador',
  'Evangelista',
  'Cooperador Ag. Reconhecimento',
  'Diácono Ag. Reconhecimento',
  'Presbítero Ag. Reconhecimento',
  'Evangelista Ag. Reconhecimento',
  'Pastor Ag. Reconhecimento',
]

export default function Obreiros({
  people,
  churches,
  onAddPerson,
  onUpdatePerson,
  onDeletePerson,
}: ObreirosProps) {
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingPerson, setEditingPerson] = useState<Person | null>(null)
  const [name, setName] = useState('')
  const [role, setRole] = useState(roles[0])
  const [churchId, setChurchId] = useState(churches[0]?.id ?? '')
  const activeChurches = churches.filter((church) => church.active)

  const filteredPeople = people.filter((person) =>
    person.name.toLowerCase().includes(search.toLowerCase()),
  )

  function openNewForm() {
    setEditingPerson(null)
    setName('')
    setRole(roles[0])
    setChurchId(churches[0]?.id ?? '')
    setShowForm(true)
  }

  function openEditForm(person: Person) {
    setEditingPerson(person)
    setName(person.name)
    setRole(person.role)
    setChurchId(person.churchId)
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setEditingPerson(null)
    setName('')
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!name.trim() || !role || !churchId) return

    if (editingPerson) {
      onUpdatePerson({
        ...editingPerson,
        name: name.trim(),
        role,
        churchId,
      })
    } else {
      onAddPerson({
        name: name.trim(),
        role,
        churchId,
        photo: '',
      })
    }

    closeForm()
  }

  return (
    <main className="mx-auto max-w-7xl p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Cadastro de obreiros
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Consulte, cadastre e edite os obreiros do setor.
          </p>
        </div>

        <button
          type="button"
          onClick={openNewForm}
          className="rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
        >
          + Cadastrar obreiro
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 rounded-2xl border border-slate-200 bg-white p-6"
        >
          <h2 className="mb-5 text-lg font-bold text-slate-900">
            {editingPerson ? 'Editar obreiro' : 'Novo obreiro'}
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Nome completo
              </label>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Digite o nome completo"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Cargo
              </label>
              <select
                value={role}
                onChange={(event) => setRole(event.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
              >
                {roles.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Igreja
              </label>
              <select
                value={churchId}
                onChange={(event) => setChurchId(event.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
              >
                <option value="">Selecione a igreja</option>
                {(editingPerson
                  ? churches.filter(
                      (church) => church.active || church.id === editingPerson.churchId,
                    )
                  : activeChurches
                ).map((church) => (
                  <option key={church.id} value={church.id}>
                    {church.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="submit"
              className="rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
            >
              {editingPerson ? 'Salvar alterações' : 'Salvar obreiro'}
            </button>

            <button
              type="button"
              onClick={closeForm}
              className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar obreiro pelo nome..."
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 sm:max-w-md"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {filteredPeople.length === 0 ? (
          <p className="p-6 text-center text-slate-500">
            Nenhum obreiro encontrado.
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredPeople.map((person) => {
              const church = churches.find(
                (item) => item.id === person.churchId,
              )

              return (
                <div
                  key={person.id}
                  className="flex flex-wrap items-center justify-between gap-4 p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                      {person.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900">
                        {person.name}
                      </p>
                      <p className="text-sm text-slate-500">
                        {person.role}
                      </p>
                      <p className="text-sm text-slate-500">
                        {church?.name ?? 'Igreja não identificada'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => openEditForm(person)}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const confirmed = window.confirm(
                        `Tem certeza que deseja excluir ${person.name}?`,
                      )

                      if (confirmed) {
                        onDeletePerson(person.id)
                      }
                    }}
                    className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    Excluir
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <p className="mt-4 text-sm text-slate-500">
        Total de obreiros: {filteredPeople.length}
      </p>
    </main>
  )
}
