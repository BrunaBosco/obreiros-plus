
import { CalendarDays, Church, ClipboardList, Users } from 'lucide-react'

type Page = 'reuniao' | 'historico' | 'reunioes' | 'obreiros' | 'igrejas'

interface HeaderProps {
  currentPage: Page
  onNavigate: (page: Page) => void
  meetingDate: string
}

export default function Header({
  currentPage,
  onNavigate,
  meetingDate,
}: HeaderProps) {
  const navItems: {
    id: Page
    label: string
    icon?: typeof Church
  }[] = [
    { id: 'reuniao', label: 'Reunião Atual', icon: Church },
    { id: 'reunioes', label: 'Reuniões', icon: CalendarDays },
    { id: 'historico', label: 'Histórico de Presenças', icon: ClipboardList },
    { id: 'obreiros', label: 'Obreiros', icon: Users },
    { id: 'igrejas', label: 'Igrejas', icon: Church },
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-blue-100 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-700 text-xl font-bold text-white">
            O+
          </div>

          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Obreiros+ AD Setor 71
            </h1>
            <p className="text-sm text-slate-500">
              Controle de Presença em Reuniões
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <CalendarDays size={18} className="text-blue-700" />
            <span>{meetingDate}</span>
          </div>

          <nav className="flex flex-wrap gap-2" aria-label="Navegação principal">
            {navItems.map((item) => {
              const Icon = item.icon

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    currentPage === item.id
                      ? 'bg-blue-700 text-white'
                      : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
                  }`}
                >
                  {Icon && <Icon size={16} className="mr-2 inline" />}
                  {item.label}
                </button>
              )
            })}
          </nav>
        </div>
      </div>
    </header>
  )
}
