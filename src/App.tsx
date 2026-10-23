import { useState } from 'react'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import AttendanceHistory from './pages/AttendanceHistory'
import Reports from './pages/Reports'
import { initialChurches, initialPeople } from './data/initialData'
import { storage } from './services/storage'
import type { AttendanceStatus, Person } from './types'

type Page =
  | 'reuniao'
  | 'historico'
  | 'reunioes'
  | 'obreiros'
  | 'igrejas'
  | 'relatorios'

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('reuniao')
  const [churches] = useState(() => storage.getChurches())
  const [people] = useState(() => storage.getPeople())
  const [meetings] = useState(() => storage.getMeetings())
  const [selectedMeetingId, setSelectedMeetingId] = useState<
  string | undefined
>(() => {
  const savedMeetings = storage.getMeetings()
  const today = new Date().toISOString().slice(0, 10)

  return (
    savedMeetings.find((meeting) => meeting.date === today)?.id ??
    [...savedMeetings]
      .sort((a, b) => b.date.localeCompare(a.date))[0]?.id
  )
})
  const [attendance] = useState(() => storage.getAttendance())

  const [fallbackData] = useState(() => ({
    churches: initialChurches,
    people: initialPeople,
  }))

  function handleRegisterAttendance(
    _meetingId: string,
    _personId: string,
    _churchId: string,
    _status: AttendanceStatus,
    _justification: string,
  ) {
    // A gravação será conectada na próxima etapa.
  }

  function handleSelectPerson(_person: Person) {
    // A abertura do modal será conectada na próxima etapa.
  }

  const displayedChurches = churches.length
    ? churches
    : fallbackData.churches

  const displayedPeople = people.length
    ? people
    : fallbackData.people

  const latestMeeting = [...meetings].sort((a, b) =>
    b.date.localeCompare(a.date),
  )[0]

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        meetingDate={
          latestMeeting
            ? new Date(
                `${latestMeeting.date}T12:00:00`,
              ).toLocaleDateString('pt-BR')
            : 'Nenhuma reunião cadastrada'
        }
      />

      {currentPage === 'reuniao' ? (
        <Dashboard
          churches={displayedChurches}
          people={displayedPeople}
          meetings={meetings}
          attendance={attendance}
          onRegisterAttendance={handleRegisterAttendance}
          onSelectPerson={handleSelectPerson}
          selectedMeetingId={selectedMeetingId}
        />
      ) : currentPage === 'historico' ? (
        <AttendanceHistory
          churches={displayedChurches}
          people={displayedPeople}
          meetings={meetings}
          attendance={attendance}
        />
      ) : currentPage === 'relatorios' ? (
        <Reports
          churches={displayedChurches}
          people={displayedPeople}
          meetings={meetings}
          attendance={attendance}
        />
      ) : (
        <div className="mx-auto max-w-7xl px-4 py-8">
          <p className="text-slate-600">
            Esta tela ainda não está conectada nesta versão.
          </p>
        </div>
      )}
    </div>
  )
}
