
import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Occurrence, Church } from '../types'
import type { AccessProfile } from '../services/auth'

interface OcorrenciasProps {
  occurrences: Occurrence[]
  churches: Church[]
  profile: AccessProfile
  onAddOccurrence: (occurrence: Omit<Occurrence, 'id'>) => void
  onUpdateOccurrence: (occurrence: Occurrence) => void
  onDeleteOccurrence: (occurrenceId: string) => void
}

export default function Ocorrencias({
  occurrences,
  churches,
  profile,
  onAddOccurrence,
  onUpdateOccurrence,
  onDeleteOccurrence,
}: OcorrenciasProps) {
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [churchId, setChurchId] = useState('')
  const [justification, setJustification] = useState('')
  const [date, setDate] = useState(
    new Date().toISOString().split('T')[0],
  )
  const [responsible, setResponsible] = useState('')

  function resetForm() {
    setName('')
    setChurchId('')
    setJustification('')
    setDate(new Date().toISOString().split('T')[0])
    setResponsible('')
    setEditingId(null)
    setShowForm(false)
  }

  function handleNewOccurrence() {
    resetForm()
    setShowForm(true)
  }

  function handleEditOccurrence(item: Occurrence) {
    if (profile.role !== 'adm') return

    setEditingId(item.id)
    setName(item.name)
    setChurchId(item.churchId)
    setJustification(item.justification)
    setDate(item.date)
    setResponsible(item.responsible)
    setShowForm(true)
  }

  function handleDeleteOccurrence(occurrenceId: string) {
    if (profile.role !== 'adm') return

    const confirmed = window.confirm(
      'Tem certeza que deseja excluir esta ocorrência? Essa ação não poderá ser desfeita.',
    )

    if (!confirmed) return

    onDeleteOccurrence(occurrenceId)
  }

  const filteredOccurrences = occurrences.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <main className="mx-auto max-w-7xl p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="mb-6 flex justify-end">
          {(profile.role === 'adm' || profile.role === 'livre') && (
            <button
              type="button"
              onClick={handleNewOccurrence}
              className="rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
            >
              + Registrar ocorrência
            </button>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Ocorrências
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Registro de homens que não constam no cadastro oficial de obreiros.
          </p>
        </div>

        <div className="rounded-xl border border-blue-100 bg-white px-5 py-3">
          <p className="text-sm text-slate-500">
            Total de nomes cadastrados
          </p>
          <p className="text-2xl font-bold text-blue-700">
            {occurrences.length}
          </p>
        </div>
      </div>

      {showForm &&
        (profile.role === 'adm' || profile.role === 'livre') && (
          <form
            onSubmit={(event: FormEvent<HTMLFormElement>) => {
              event.preventDefault()

              if (
                !name.trim() ||
                !churchId ||
                !justification.trim() ||
                !date ||
                !responsible.trim()
              ) {
                return
              }

              if (editingId) {
                if (profile.role !== 'adm') return

                onUpdateOccurrence({
                  id: editingId,
                  name: name.trim(),
                  churchId,
                  justification: justification.trim(),
                  date,
                  responsible: responsible.trim(),
                })
              } else {
                onAddOccurrence({
                  name: name.trim(),
                  churchId,
                  justification: justification.trim(),
                  date,
                  responsible: responsible.trim(),
                })
              }

              resetForm()
            }}
            className="mb-6 rounded-2xl border border-slate-200 bg-white p-6"
          >
            <h2 className="mb-5 text-lg font-bold text-slate-900">
              {editingId ? 'Editar ocorrência' : 'Nova ocorrência'}
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Nome do obreiro
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
                  Igreja
                </label>
                <select
                  value={churchId}
                  onChange={(event) => setChurchId(event.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
                >
                  <option value="">Selecione a igreja</option>
                  {churches
                    .filter((church) => church.active)
                    .map((church) => (
                      <option key={church.id} value={church.id}>
                        {church.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Data do registro
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Responsável pelo registro
                </label>
                <input
                  type="text"
                  value={responsible}
                  onChange={(event) => setResponsible(event.target.value)}
                  placeholder="Nome de quem está registrando"
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Justificativa da ocorrência
                </label>
                <textarea
                  value={justification}
                  onChange={(event) => setJustification(event.target.value)}
                  placeholder="Descreva a ocorrência..."
                  required
                  rows={4}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="submit"
                className="rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
              >
                Salvar ocorrência
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

      <div className="space-y-4">
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar pelo nome..."
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
        />

        {filteredOccurrences.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
            <p className="text-sm text-slate-500">
              Nenhuma ocorrência encontrada.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredOccurrences.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-slate-200 bg-white p-5"
              >
                {profile.role === 'adm' && (
                  <div className="mb-3 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleEditOccurrence(item)}
                      className="rounded-lg border border-blue-200 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50"
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteOccurrence(item.id)}
                      className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                    >
                      Excluir
                    </button>
                  </div>
                )}

                <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                  <h2 className="text-lg font-semibold text-slate-900">
                    {item.name}
                  </h2>

                  <span className="text-sm text-slate-500">
                    {new Date(`${item.date}T12:00:00`).toLocaleDateString('pt-BR')}
                  </span>
                </div>

                <p className="text-sm text-slate-600">
                  <strong>Igreja:</strong>{' '}
                  {churches.find((church) => church.id === item.churchId)?.name ??
                    'Igreja não identificada'}
                </p>

                <p className="mt-2 text-sm text-slate-600">
                  <strong>Justificativa:</strong> {item.justification}
                </p>

                <p className="mt-2 text-sm text-slate-600">
                  <strong>Responsável pelo registro:</strong> {item.responsible}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
