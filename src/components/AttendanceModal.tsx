
import { useState } from 'react'
import { X, CheckCircle2, CircleMinus, CircleX } from 'lucide-react'
import type { AttendanceStatus, Church, Person } from '../types'

interface AttendanceModalProps {
  person: Person
  church: Church
  currentStatus: AttendanceStatus
  currentJustification?: string
  isLocked?: boolean
  onClose: () => void
  onSave: (status: AttendanceStatus, justification: string) => void
}

export default function AttendanceModal({
  person,
  church,
  currentStatus,
  currentJustification = '',
  isLocked = false,
  onClose,
  onSave,
}: AttendanceModalProps) {
  const [selectedStatus, setSelectedStatus] =
    useState<AttendanceStatus>(currentStatus)

  const [justification, setJustification] =
    useState(currentJustification)

  const [error, setError] = useState('')

  function handleSave() {
    if (isLocked) return

    if (selectedStatus === 'pendente') {
      setError('Selecione Presente, Ausente ou Falta.')
      return
    }

    if (selectedStatus === 'ausente' && !justification.trim()) {
      setError('Informe a justificativa da ausência.')
      return
    }

    onSave(selectedStatus, justification.trim())
  }

  const options = [
    {
      value: 'presente' as const,
      label: 'Presente',
      icon: CheckCircle2,
      style: 'border-green-200 bg-green-50 text-green-800',
    },
    {
      value: 'ausente' as const,
      label: 'Ausente',
      icon: CircleMinus,
      style: 'border-slate-200 bg-slate-50 text-slate-700',
    },
    {
      value: 'falta' as const,
      label: 'Falta',
      icon: CircleX,
      style: 'border-red-200 bg-red-50 text-red-800',
    },
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="attendance-modal-title"
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2
            id="attendance-modal-title"
            className="text-xl font-bold text-slate-900"
          >
            Registrar presença
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar janela"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-6 flex items-center gap-4">
          <img
            src={person.photo}
            alt={`Foto de ${person.name}`}
            className="h-20 w-20 rounded-xl object-cover"
          />

          <div>
            <h3 className="font-semibold text-slate-900">
              {person.name}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {person.role}
            </p>

            <p className="mt-1 text-sm text-blue-700">
              {church.name}
            </p>
          </div>
        </div>

        {isLocked && (
          <p
            role="status"
            className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm font-medium text-amber-800"
          >
            Esta reunião está bloqueada para alterações. O prazo para
            registrar ou modificar a presença terminou à meia-noite
            do dia seguinte à reunião.
          </p>
        )}

        <p className="mb-3 text-sm font-semibold text-slate-700">
          Selecione a situação
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {options.map((option) => {
            const Icon = option.icon
            const selected = selectedStatus === option.value

            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={selected}
                disabled={isLocked}
                onClick={() => {
                  if (isLocked) return

                  setSelectedStatus(option.value)
                  setError('')
                }}
                className={`flex items-center justify-center gap-2 rounded-xl border-2 p-3 text-sm font-semibold transition ${
                  selected
                    ? `${option.style} ring-2 ring-blue-300`
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                } disabled:cursor-not-allowed disabled:opacity-50`}
              >
                <Icon size={18} />
                {option.label}
              </button>
            )
          })}
        </div>

        {selectedStatus === 'ausente' && (
          <div className="mt-5">
            <label
              htmlFor="absence-justification"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Justificativa da ausência *
            </label>

            <textarea
              id="absence-justification"
              value={justification}
              disabled={isLocked}
              onChange={(event) => {
                setJustification(event.target.value)
                setError('')
              }}
              rows={3}
              placeholder="Informe o motivo da ausência..."
              className="w-full rounded-xl border border-slate-300 p-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-70"
            />
          </div>
        )}

        {error && (
          <p
            role="alert"
            className="mt-3 text-sm font-medium text-red-600"
          >
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isLocked}
            className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Confirmar registro
          </button>
        </div>
      </section>
    </div>
  )
}
