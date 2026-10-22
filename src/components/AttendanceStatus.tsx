
import {
  CheckCircle2,
  CircleMinus,
  CircleX,
  Clock,
} from 'lucide-react'

import type { AttendanceStatus as AttendanceStatusType } from '../types'

interface AttendanceStatusProps {
  status: AttendanceStatusType
}

const statusConfig = {
  presente: {
    label: 'Presente',
    className: 'bg-green-100 text-green-800',
    icon: CheckCircle2,
  },
  ausente: {
    label: 'Ausente',
    className: 'bg-slate-100 text-slate-700',
    icon: CircleMinus,
  },
  falta: {
    label: 'Falta',
    className: 'bg-red-100 text-red-800',
    icon: CircleX,
  },
  pendente: {
    label: 'Pendente',
    className: 'bg-orange-100 text-orange-800',
    icon: Clock,
  },
}

export default function AttendanceStatus({
  status,
}: AttendanceStatusProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${config.className}`}
    >
      <Icon size={14} />
      {config.label}
    </span>
  )
}
