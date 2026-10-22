
import { useState } from 'react'
import Header from './src/components/Header'
import Dashboard from './src/pages/Dashboard'
import AttendanceHistory from './src/pages/AttendanceHistory'
import { initialChurches, initialPeople } from './src/data/initialData'
import { storage } from './src/services/storage'
import type { AttendanceStatus, Person } from './src/types'

type Page = 'reuniao' | 'historico'

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('reuniao')
  const [churches] = useState(() => storage.getChurches())
  const [people] = useState(() => storage.getPeople())
  const [meetings] = useState(() => storage.getMeetings())
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
        />
      ) : (
        <AttendanceHistory
          churches={displayedChurches}
          people={displayedPeople}
          meetings={meetings}
          attendance={attendance}
        />
      )}
    </div>
  )
}
