
import { useState } from 'react'
import { CalendarDays } from 'lucide-react'
import SummaryCards from '../components/SummaryCards'
import ChurchTabs from '../components/ChurchTabs'
import PersonGrid from '../components/PersonGrid'
import type {
  Attendance,
  AttendanceStatus,
  Church,
  Meeting,
  Person,
} from '../types'

interface DashboardProps {
  churches: Church[]
  people: Person[]
  meetings: Meeting[]
  attendance: Attendance[]
  selectedMeetingId: string | undefined
  onRegisterAttendance: (
    meetingId: string,
    personId: string,
    churchId: string,
    status: AttendanceStatus,
    justification: string,
  ) => void
  onSelectPerson: (person: Person) => void
}

export default function Dashboard({
  churches,
  people,
  meetings,
  attendance,
  selectedMeetingId,
  onRegisterAttendance: _onRegisterAttendance,
  onSelectPerson,
}: DashboardProps) {
  const [selectedChurchId, setSelectedChurchId] = useState(
    churches[0]?.id ?? '',
  )

  const currentMeeting =
  meetings.find((meeting) => meeting.id === selectedMeetingId) ??
  [...meetings].sort((a, b) =>
    b.date.localeCompare(a.date),
  )[0]

  const churchPeople = people.filter(
    (person) => person.churchId === selectedChurchId,
  )

  const currentAttendance = currentMeeting
    ? attendance.filter(
        (record) => record.meetingId === currentMeeting.id,
      )
    : []

  const attendanceByPerson: Record<string, AttendanceStatus> = {}

  currentAttendance.forEach((record) => {
    attendanceByPerson[record.personId] = record.status
  })

  const counts = {
    total: people.length,
    presentes: currentAttendance.filter(
      (record) => record.status === 'presente',
    ).length,
    ausentes: currentAttendance.filter(
      (record) => record.status === 'ausente',
    ).length,
    faltas: currentAttendance.filter(
      (record) => record.status === 'falta',
    ).length,
    pendentes: people.length - currentAttendance.filter(
      (record) => record.status !== 'pendente',
    ).length,
  }

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">
            Painel de controle
          </p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900">
            Reunião Atual
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Acompanhe a presença dos obreiros por congregação.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
          <CalendarDays size={18} className="text-blue-700" />
          {currentMeeting
            ? new Date(`${currentMeeting.date}T12:00:00`).toLocaleDateString('pt-BR')
            : 'Nenhuma reunião cadastrada'}
        </div>
      </section>

      <SummaryCards {...counts} />

      <section className="space-y-5">
        <ChurchTabs
          churches={churches}
          selectedChurchId={selectedChurchId}
          onSelect={setSelectedChurchId}
        />

        <div>
          <h3 className="mb-1 text-lg font-bold text-slate-900">
            {churches.find((church) => church.id === selectedChurchId)?.name}
          </h3>
          <p className="mb-4 text-sm text-slate-500">
            {churchPeople.length} obreiro(s) nesta congregação
          </p>

          <PersonGrid
            people={churchPeople}
            attendanceByPerson={attendanceByPerson}
            onSelectPerson={onSelectPerson}
          />
        </div>
      </section>
    </main>
  )
}
