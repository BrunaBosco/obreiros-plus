
import {
  CalendarDays,
  Church,
  ClipboardList,
  Users,
  UserCheck,
  Cake,
  LogOut,
} from 'lucide-react'

import type { AccessProfile } from '../services/auth'

type Page =
  | 'reuniao'
  | 'historico'
  | 'reunioes'
  | 'obreiros'
  | 'igrejas'
  | 'relatorios'
  | 'ocorrencias'
  | 'ag-reconhecimento'
  | 'aniversariantes'

interface HeaderProps {
  currentPage: Page
  onNavigate: (page: Page) => void
  meetingDate: string
  profile: AccessProfile
  onLogout: () => void
}

export default function Header({
  currentPage,
  onNavigate,
  meetingDate,
  profile,
  onLogout,
}: HeaderProps) {
  const navItems: {
    id: Page
    label: string
    icon?: typeof Church
    roles: AccessProfile['role'][]
  }[] = [
    {
      id: 'reuniao',
      label: 'Reunião Atual',
      icon: Church,
      roles: ['adm', 'livre'],
    },
    {
      id: 'reunioes',
      label: 'Reuniões',
      icon: CalendarDays,
      roles: ['adm'],
    },
    {
      id: 'historico',
      label: 'Histórico de Presenças',
      icon: ClipboardList,
      roles: ['adm', 'pastor_setorial'],
    },
    {
      id: 'obreiros',
      label: 'Obreiros',
      icon: Users,
      roles: ['adm'],
    },
    {
      id: 'igrejas',
      label: 'Igrejas',
      icon: Church,
      roles: ['adm'],
    },
    {
      id: 'relatorios',
      label: 'Relatórios de Frequência',
      icon: ClipboardList,
      roles: ['adm', 'pastor_setorial'],
    },
    {
      id: 'ocorrencias',
      label: 'Ocorrências',
      icon: ClipboardList,
      roles: ['adm', 'livre'],
    },
    {
      id: 'ag-reconhecimento',
      label: 'Ag. Reconhecimento',
      icon: UserCheck,
      roles: ['adm', 'pastor_setorial'],
    },
    {
      id: 'aniversariantes',
      label: 'Aniversariantes',
      icon: Cake,
      roles: ['adm', 'pastor_setorial'],
    },
  ]

  const visibleItems = navItems.filter((item) =>
    item.roles.includes(profile.role),
  )

  const roleLabels: Record<AccessProfile['role'], string> = {
    adm: 'ADM',
    pastor_setorial: 'Pastor Setorial',
    livre: 'Livre',
  }

  return (
    <header className="sticky top-0 z-40 border-b border-blue-100 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
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
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-800">
                {profile.username}
              </p>
              <p className="text-xs text-slate-500">
                {roleLabels[profile.role]}
              </p>
            </div>

            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
            >
              <LogOut size={16} />
              Sair
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <CalendarDays size={18} className="text-blue-700" />
            <span>{meetingDate}</span>
          </div>

          <nav
            className="flex flex-wrap gap-2"
            aria-label="Navegação principal"
          >
            {visibleItems.map((item) => {
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
                  {Icon && (
                    <Icon size={16} className="mr-2 inline" />
                  )}
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
