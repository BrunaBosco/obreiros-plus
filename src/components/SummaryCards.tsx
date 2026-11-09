
import {
  Users,
  UserCheck,
  ClipboardCheck,
  ClipboardX,
  Clock,
} from 'lucide-react'

interface SummaryCardsProps {
  total: number
  presentes: number
  faltasJustificadas: number
  faltasNaoJustificadas: number
  pendentes: number
}

export default function SummaryCards({
  total,
  presentes,
  faltasJustificadas,
  faltasNaoJustificadas,
  pendentes,
}: SummaryCardsProps) {
  const cards = [
    {
      label: 'Total de obreiros',
      value: total,
      icon: Users,
      color: 'text-blue-700',
      background: 'bg-blue-50',
    },
    {
      label: 'Presentes',
      value: presentes,
      icon: UserCheck,
      color: 'text-green-700',
      background: 'bg-green-50',
    },
    {
      label: 'Faltas justificadas',
      value: faltasJustificadas,
      icon: ClipboardCheck,
      color: 'text-orange-700',
      background: 'bg-orange-50',
    },
    {
      label: 'Faltas não justificadas',
      value: faltasNaoJustificadas,
      icon: ClipboardX,
      color: 'text-red-700',
      background: 'bg-red-50',
    },
    {
      label: 'Pendentes',
      value: pendentes,
      icon: Clock,
      color: 'text-slate-600',
      background: 'bg-slate-100',
    },
  ]

  return (
    <section
      aria-label="Resumo de presenças"
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"
    >
      {cards.map((card) => {
        const Icon = card.icon

        return (
          <article
            key={card.label}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div
              className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${card.background} ${card.color}`}
            >
              <Icon size={21} />
            </div>

            <p className="text-sm text-slate-500">{card.label}</p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {card.value}
            </p>
          </article>
        )
      })}
    </section>
  )
}
