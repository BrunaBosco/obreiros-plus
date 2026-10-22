import { useEffect, useState } from 'react'
import Header from './components/Header'
import AttendanceModal from './components/AttendanceModal'
import Dashboard from './pages/Dashboard'
import AttendanceHistory from './pages/AttendanceHistory'
import Meetings from './pages/Meetings'
import Obreiros from './pages/Obreiros'
import Igrejas from './pages/Igrejas'
import { initialChurches, initialPeople } from './data/initialData'
import { storage } from './services/storage'
import type { AttendanceStatus, Church, Meeting, Person } from './types'

type Page = 'reuniao' | 'historico' | 'reunioes' | 'obreiros' | 'igrejas'

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('reuniao')
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)
  const [churches, setChurches] = useState(() => storage.getChurches())
  const [people, setPeople] = useState(() => storage.getPeople())
  const [meetings, setMeetings] = useState(() => storage.getMeetings())
  const [attendance, setAttendance] = useState(() => storage.getAttendance())
  useEffect(() => {
  function getSecondMonday(year: number, month: number): string {
    const date = new Date(year, month, 1)
    const daysUntilMonday = (8 - date.getDay()) % 7

    date.setDate(1 + daysUntilMonday + 7)

    const monthString = String(date.getMonth() + 1).padStart(2, '0')
    const dayString = String(date.getDate()).padStart(2, '0')

    return `${date.getFullYear()}-${monthString}-${dayString}`
  }

  const savedMeetings = storage.getMeetings()

  const validMeetings = savedMeetings.filter((meeting) => {
    const [year, month] = meeting.date.split('-').map(Number)

    return meeting.date === getSecondMonday(year, month - 1)
  })

  const validMeetingIds = new Set(
    validMeetings.map((meeting) => meeting.id),
  )

  const savedAttendance = storage.getAttendance()

  const validAttendance = savedAttendance.filter((record) =>
    validMeetingIds.has(record.meetingId),
  )

  storage.saveMeetings(validMeetings)
  storage.saveAttendance(validAttendance)

  setMeetings(validMeetings)
  setAttendance(validAttendance)

  setSelectedMeetingId((currentId) => {
    if (currentId && validMeetingIds.has(currentId)) {
      return currentId
    }

    return [...validMeetings].sort((a, b) =>
      b.date.localeCompare(a.date),
    )[0]?.id
  })
}, [])
  
  const [selectedMeetingId, setSelectedMeetingId] = useState<
    string | undefined
  >(() => {
    const savedMeetings = storage.getMeetings()
    const latestMeeting = [...savedMeetings].sort((a, b) =>
      b.date.localeCompare(a.date),
    )[0]

    return latestMeeting?.id
  })

  const fallbackData = {
    churches: initialChurches,
    people: initialPeople,
  }

  const displayedChurches = churches.length ? churches : fallbackData.churches
  const displayedPeople = people.length ? people : fallbackData.people

  const latestMeeting = [...meetings].sort((a, b) =>
    b.date.localeCompare(a.date),
  )[0]

  const selectedMeeting =
    meetings.find((meeting) => meeting.id === selectedMeetingId) ??
    latestMeeting

  function handleAddChurch(church: Church) {
    const updatedChurches = [...churches, church]

    storage.saveChurches(updatedChurches)
    setChurches(updatedChurches)
  }

  function handleEditChurch(id: string, name: string) {
    const updatedChurches = churches.map((church) =>
      church.id === id ? { ...church, name } : church,
    )

    storage.saveChurches(updatedChurches)
    setChurches(updatedChurches)
  }

  
function handleToggleChurch(id: string) {
  const church = churches.find((item) => item.id === id)

  if (!church) return

  if (church.active) {
    const linkedPeople = people.filter(
      (person) => person.churchId === id,
    )

    if (linkedPeople.length > 0) {
      const confirmed = window.confirm(
        `Esta igreja possui ${linkedPeople.length} obreiro(s) vinculado(s). Deseja desativá-la mesmo assim? Os vínculos e históricos serão preservados.`,
      )

      if (!confirmed) return
    }
  }

  const updatedChurches = churches.map((item) =>
    item.id === id
      ? { ...item, active: !item.active }
      : item,
  )

  storage.saveChurches(updatedChurches)
  setChurches(updatedChurches)
}


  function handleSelectPerson(person: Person) {
    setSelectedPerson(person)
  }

  function handleAddPerson(personData: Omit<Person, 'id'>) {
    const newPerson: Person = {
      ...personData,
      id: crypto.randomUUID(),
    }

    const updatedPeople = [...people, newPerson]

    storage.savePeople(updatedPeople)
    setPeople(updatedPeople)
  }

  function handleUpdatePerson(updatedPerson: Person) {
    const updatedPeople = people.map((person) =>
      person.id === updatedPerson.id ? updatedPerson : person,
    )

    storage.savePeople(updatedPeople)
    setPeople(updatedPeople)
  }

  function handleDeletePerson(personId: string) {
    const updatedPeople = people.filter((person) => person.id !== personId)

    storage.savePeople(updatedPeople)
    setPeople(updatedPeople)
  }

  function handleRegisterAttendance(
    meetingId: string,
    personId: string,
    churchId: string,
    status: AttendanceStatus,
    justification: string,
  ) {
    const existingAttendance = storage.getAttendance()

    const existingRecord = existingAttendance.find(
      (record) =>
        record.meetingId === meetingId && record.personId === personId,
    )

    const updatedRecord = {
      id: existingRecord?.id ?? crypto.randomUUID(),
      meetingId,
      personId,
      churchId,
      status,
      justification,
      updatedAt: new Date().toISOString(),
    }

    const updatedAttendance = existingRecord
      ? existingAttendance.map((record) =>
          record.id === existingRecord.id ? updatedRecord : record,
        )
      : [...existingAttendance, updatedRecord]

    storage.saveAttendance(updatedAttendance)
    setAttendance(updatedAttendance)
  }

  function handleSaveAttendance(
    status: AttendanceStatus,
    justification: string,
  ) {
    if (!selectedPerson) return

    let meetingToUse: Meeting | undefined = selectedMeeting

    if (!meetingToUse) {
    window.alert('Selecione uma reunião na página Reuniões antes de registrar a presença.')
    return
    }

    handleRegisterAttendance(
      meetingToUse.id,
      selectedPerson.id,
      selectedPerson.churchId,
      status,
      justification,
    )

    setSelectedPerson(null)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        meetingDate={
          selectedMeeting
            ? new Date(`${selectedMeeting.date}T12:00:00`).toLocaleDateString(
                'pt-BR',
              )
            : 'Nenhuma reunião cadastrada'
        }
      />

      {currentPage === 'reuniao' ? (
        <Dashboard
          churches={displayedChurches}
          people={displayedPeople}
          meetings={meetings}
          selectedMeetingId={selectedMeetingId}
          attendance={attendance}
          onRegisterAttendance={handleRegisterAttendance}
          onSelectPerson={handleSelectPerson}
        />
      ) : currentPage === 'historico' ? (
        <AttendanceHistory
          churches={displayedChurches}
          people={displayedPeople}
          meetings={meetings}
          attendance={attendance}
        />
      ) : currentPage === 'reunioes' ? (
        <Meetings
          meetings={meetings}
          selectedMeetingId={selectedMeetingId}
          onSelectMeeting={(meeting) => {
            const exists = meetings.some((item) => item.date === meeting.date)

            if (!exists) {
              const updatedMeetings = [...meetings, meeting]

              storage.saveMeetings(updatedMeetings)
              setMeetings(updatedMeetings)
            }

            setSelectedMeetingId(meeting.id)
          }}
        />
      ) : currentPage === 'obreiros' ? (
        <Obreiros
          people={displayedPeople}
          churches={displayedChurches}
          onAddPerson={handleAddPerson}
          onUpdatePerson={handleUpdatePerson}
          onDeletePerson={handleDeletePerson}
        />
      ) : (
        <Igrejas
          churches={churches}
          onAddChurch={handleAddChurch}
          onEditChurch={handleEditChurch}
          onToggleChurch={handleToggleChurch}
        />
      )}

      {currentPage === 'reuniao' && selectedPerson && (
        <AttendanceModal
          person={selectedPerson}
          church={
            displayedChurches.find(
              (item) => item.id === selectedPerson.churchId,
            ) ?? displayedChurches[0]
          }
          currentStatus={
            attendance.find(
              (item) =>
                item.meetingId === selectedMeeting?.id &&
                item.personId === selectedPerson.id,
            )?.status ?? 'pendente'
          }
          currentJustification={
            attendance.find(
              (item) =>
                item.meetingId === selectedMeeting?.id &&
                item.personId === selectedPerson.id,
            )?.justification ?? ''
          }
          onClose={() => setSelectedPerson(null)}
          onSave={handleSaveAttendance}
        />
      )}
    </div>
  )
}
