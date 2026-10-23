
import { useState } from 'react'
import Header from './components/Header'
import AttendanceModal from './components/AttendanceModal'
import Dashboard from './pages/Dashboard'
import AttendanceHistory from './pages/AttendanceHistory'
import Reports from './pages/Reports'
import Obreiros from './pages/Obreiros'
import Igrejas from './pages/Igrejas'
import { initialChurches, initialPeople } from './data/initialData'
import { storage } from './services/storage'
import type {Attendance,AttendanceStatus,Person,Church,} from './types'
import Meetings from './pages/Meetings'

type Page =
  | 'reuniao'
  | 'historico'
  | 'reunioes'
  | 'obreiros'
  | 'igrejas'
  | 'relatorios'

export default function App() {
  const [currentPage, setCurrentPage] =
    useState<Page>('reuniao')

  const [churches, setChurches] = useState(
    () => storage.getChurches(),
  )

  const [people, setPeople] = useState(
    () => storage.getPeople(),
  )

 const [meetings, setMeetings] = useState(
  () => storage.getMeetings(),
  )

  const [selectedMeetingId, setSelectedMeetingId] =
    useState<string | undefined>(() => {
      const savedMeetings = storage.getMeetings()
      const today = new Date().toISOString().slice(0, 10)

      return (
        savedMeetings.find(
          (meeting) => meeting.date === today,
        )?.id ??
        [...savedMeetings].sort((a, b) =>
          b.date.localeCompare(a.date),
        )[0]?.id
      )
    })

  const [attendance, setAttendance] = useState<Attendance[]>(
    () => storage.getAttendance(),
  )

  const [selectedPerson, setSelectedPerson] =
    useState<Person | null>(null)

  const [isAttendanceModalOpen, setIsAttendanceModalOpen] =
    useState(false)

  const [fallbackData] = useState(() => ({
    churches: initialChurches,
    people: initialPeople,
  }))

  function handleRegisterAttendance(
    meetingId: string,
    personId: string,
    churchId: string,
    status: AttendanceStatus,
    justification: string,
  ) {
    const existingAttendance = attendance.filter(
      (item) =>
        !(
          item.meetingId === meetingId &&
          item.personId === personId
        ),
    )

    const newAttendance: Attendance = {
      id: `${meetingId}-${personId}`,
      meetingId,
      personId,
      churchId,
      status,
      justification,
      updatedAt: new Date().toISOString(),
    }

    const updatedAttendance = [
      ...existingAttendance,
      newAttendance,
    ]

    storage.saveAttendance(updatedAttendance)
    setAttendance(updatedAttendance)
  }

  function handleSelectPerson(person: Person) {
    setSelectedPerson(person)
    setIsAttendanceModalOpen(true)
  }

  function handleAddPerson(person: Omit<Person, 'id'>) {
    const updatedPeople = [
      ...people,
      { ...person, id: crypto.randomUUID() },
    ]

    storage.savePeople(updatedPeople)
    setPeople(updatedPeople)
  }

  function handleUpdatePerson(updatedPerson: Person) {
    const updatedPeople = people.map((person) =>
      person.id === updatedPerson.id
        ? updatedPerson
        : person,
    )

    storage.savePeople(updatedPeople)
    setPeople(updatedPeople)
  }

function handleTogglePerson(personId: string) {
  const updatedPeople = people.map((person) =>
    person.id === personId
      ? { ...person, active: person.active === false }
      : person,
  )

  storage.savePeople(updatedPeople)
  setPeople(updatedPeople)
}


  function handleAddChurch(church: Church) {
    const updatedChurches = [...churches, church]

    storage.saveChurches(updatedChurches)
    setChurches(updatedChurches)
  }

  function handleEditChurch(id: string, name: string) {
    const updatedChurches = churches.map((church) =>
      church.id === id
        ? { ...church, name }
        : church,
    )

    storage.saveChurches(updatedChurches)
    setChurches(updatedChurches)
  }

  function handleToggleChurch(id: string) {
    const updatedChurches = churches.map((church) =>
      church.id === id
        ? { ...church, active: !church.active }
        : church,
    )

    storage.saveChurches(updatedChurches)
    setChurches(updatedChurches)
  }

  const displayedChurches = churches.length
    ? churches
    : fallbackData.churches

  const displayedPeople = people.length
    ? people
    : fallbackData.people

  const currentMeeting =
  meetings.find(
    (meeting) => meeting.id === selectedMeetingId,
  ) ??
  [...meetings].sort((a, b) =>
    b.date.localeCompare(a.date),
  )[0]

  const selectedPersonChurch = selectedPerson
    ? displayedChurches.find(
        (church) => church.id === selectedPerson.churchId,
      )
    : undefined

  const selectedPersonAttendance = attendance.find(
    (item) =>
      item.meetingId === selectedMeetingId &&
      item.personId === selectedPerson?.id,
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        meetingDate={
          currentMeeting
            ? new Date(
                `${currentMeeting.date}T12:00:00`,
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
        ) : currentPage === 'reunioes' ? (
        <Meetings
          meetings={meetings}
          selectedMeetingId={selectedMeetingId}
          onSelectMeeting={(meeting) => {
            const meetingExists = meetings.some(
              (item) => item.id === meeting.id,
            )

            if (!meetingExists) {
              const updatedMeetings = [...meetings, meeting]

              storage.saveMeetings(updatedMeetings)
              setMeetings(updatedMeetings)
            }

            setSelectedMeetingId(meeting.id)
            setCurrentPage('reuniao')
          }}
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
      ) : currentPage === 'obreiros' ? (
        <Obreiros
          people={displayedPeople}
          churches={displayedChurches}
          onAddPerson={handleAddPerson}
          onUpdatePerson={handleUpdatePerson}
          onTogglePerson={handleTogglePerson}
        />
      ) : currentPage === 'igrejas' ? (
        <Igrejas
          churches={displayedChurches}
          onAddChurch={handleAddChurch}
          onEditChurch={handleEditChurch}
          onToggleChurch={handleToggleChurch}
        />
      ) : (
        <div className="mx-auto max-w-7xl px-4 py-8">
          <p className="text-slate-600">
            Esta tela ainda não está conectada nesta versão.
          </p>
        </div>
      )}

      {isAttendanceModalOpen &&
        selectedPerson &&
        selectedPersonChurch &&
        selectedMeetingId && (
          <AttendanceModal
            person={selectedPerson}
            church={selectedPersonChurch}
            currentStatus={
              selectedPersonAttendance?.status ?? 'pendente'
            }
            currentJustification={
              selectedPersonAttendance?.justification ?? ''
            }
            onClose={() => setIsAttendanceModalOpen(false)}
            onSave={(status, justification) => {
              handleRegisterAttendance(
                selectedMeetingId,
                selectedPerson.id,
                selectedPerson.churchId,
                status,
                justification,
              )

              setIsAttendanceModalOpen(false)
            }}
          />
        )}
    </div>
  )
}
