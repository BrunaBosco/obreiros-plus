import { CheckCircle2, Clock, UserRound } from 'lucide-react'
import type { AttendanceStatus, Person } from '../types'

interface PersonCardProps {
  person: Person
  status: AttendanceStatus
  onClick: () => void
  canEditAttendance: boolean
}

const statusConfig: Record<
  AttendanceStatus,
  { label: string; className: string }
> = {
  presente: {
    label: 'Presente',
    className: 'bg-green-100 text-green-800',
  },
  falta_justificada: {
    label: 'Falta justificada',
    className: 'bg-orange-100 text-orange-800',
  },
  falta_nao_justificada: {
    label: 'Falta não justificada',
    className: 'bg-red-100 text-red-800',
  },
  ausente: {
    label: 'Falta justificada',
    className: 'bg-orange-100 text-orange-800',
  },
  falta: {
    label: 'Falta não justificada',
    className: 'bg-red-100 text-red-800',
  },
  pendente: {
    label: 'Pendente',
    className: 'bg-orange-100 text-orange-800',
  },
}

export default function PersonCard({
  person,
  status,
  onClick,
  canEditAttendance,
}: PersonCardProps) {
  const isPending = status === 'pendente'
  const config = statusConfig[status]

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!canEditAttendance}
      className={`group w-full rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition ${
        canEditAttendance
          ? 'hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md'
          : 'cursor-not-allowed opacity-80'
      }`}
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <UserRound size={40} />
      </div>

      <div className="mt-4">
        <h3 className="line-clamp-2 min-h-10 font-semibold text-slate-900">
          {person.name}
        </h3>

        <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">
          {person.role}
        </p>

        <span
          className={`mt-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${config.className}`}
        >
          {isPending ? <Clock size={13} /> : <CheckCircle2 size={13} />}
          {config.label}
        </span>

        <p className="mt-3 text-sm font-medium text-blue-700">
          {canEditAttendance ? 'Registrar presença →' : 'Somente consulta'}
        </p>
      </div>
    </button>
  )
}