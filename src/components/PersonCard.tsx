
import { CheckCircle2, Clock, UserRound } from 'lucide-react'
import type { AttendanceStatus, Person } from '../types'

interface PersonCardProps {
  person: Person
  status: AttendanceStatus
  onClick: () => void
}

const statusConfig: Record<
  AttendanceStatus,
  { label: string; className: string }
> = {
  presente: {
    label: 'Presente',
    className: 'bg-green-100 text-green-800',
  },
  ausente: {
    label: 'Ausente',
    className: 'bg-slate-100 text-slate-700',
  },
  falta: {
    label: 'Falta',
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
}: PersonCardProps) {
  const isPending = status === 'pendente'
  const config = statusConfig[status]

  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        {person.photo ? (
          <img
            src={person.photo}
            alt={`Foto de ${person.name}`}
            className={`h-full w-full object-cover transition duration-300 ${
              isPending ? '' : 'grayscale'
            }`}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-400">
            <UserRound size={64} />
          </div>
        )}

        <span
          className={`absolute right-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${config.className}`}
        >
          {isPending ? <Clock size={13} /> : <CheckCircle2 size={13} />}
          {config.label}
        </span>
      </div>

      <div className="p-4">
        <h3 className="line-clamp-2 min-h-10 font-semibold text-slate-900">
          {person.name}
        </h3>

        <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">
          {person.role}
        </p>

        <p className="mt-3 text-sm font-medium text-blue-700 group-hover:text-blue-900">
          Registrar presença →
        </p>
      </div>
    </button>
  )
}
