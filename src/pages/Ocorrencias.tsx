import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Occurrence, Church } from '../types'

interface OcorrenciasProps {
  occurrences: Occurrence[]
  churches: Church[]
  onAddOccurrence: (occurrence: Omit<Occurrence, 'id'>) => void
}

export default function Ocorrencias({
  occurrences,
  churches,
  onAddOccurrence,
}: OcorrenciasProps) {
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)

  const [name, setName] = useState('')
  const [churchId, setChurchId] = useState('')
  const [justification, setJustification] = useState('')
  const [date, setDate] = useState(
    new Date().toISOString().split('T')[0],
  )
  const [responsible, setResponsible] = useState('')

  const filteredOccurrences = occurrences.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <main className="mx-auto max-w-7xl p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="mb-6 flex justify-end">
            <button
                type="button"
                onClick={() => setShowForm(true)}
                className="rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
            >
                + Registrar ocorrência
            </button>
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

      {showForm && (
  <form
    onSubmit={(event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      if (!name.trim() || !churchId || !justification.trim() || !date || !responsible.trim()) {
        return
      }

      onAddOccurrence({
        name: name.trim(),
        churchId,
        justification: justification.trim(),
        date,
        responsible: responsible.trim(),
      })

      setName('')
      setChurchId('')
      setJustification('')
      setDate(new Date().toISOString().split('T')[0])
      setResponsible('')
      setShowForm(false)
    }}
    className="mb-6 rounded-2xl border border-slate-200 bg-white p-6"
  >
    <h2 className="mb-5 text-lg font-bold text-slate-900">
      Nova ocorrência
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
        onClick={() => setShowForm(false)}
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