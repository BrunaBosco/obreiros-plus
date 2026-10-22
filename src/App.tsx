
import { useState } from 'react'
import Header from './components/Header'
import AttendanceModal from './components/AttendanceModal'
import Dashboard from './pages/Dashboard'
import AttendanceHistory from './pages/AttendanceHistory'
import { initialChurches, initialPeople } from './data/initialData'
import { storage } from './services/storage'
import type { AttendanceStatus, Meeting, Person } from './types'
import Meetings from './pages/Meetings'

type Page = 'reuniao' | 'historico' | 'reunioes'

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('reuniao')

  const [selectedPerson, setSelectedPerson] =
    useState<Person | null>(null)

  const [churches] = useState(() => storage.getChurches())
  const [people] = useState(() => storage.getPeople())
  const [meetings, setMeetings] = useState(() => storage.getMeetings())
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | undefined>(
  () => {
    const savedMeetings = storage.getMeetings()
    const latestMeeting = [...savedMeetings].sort((a, b) =>
      b.date.localeCompare(a.date),
    )[0]

    return latestMeeting?.id
  },
)
  const [attendance, setAttendance] = useState(
    () => storage.getAttendance(),
  )

  const fallbackData = {
    churches: initialChurches,
    people: initialPeople,
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

const selectedMeeting =
  meetings.find((meeting) => meeting.id === selectedMeetingId) ??
  latestMeeting

  function handleSelectPerson(person: Person) {
    setSelectedPerson(person)
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
        record.meetingId === meetingId &&
        record.personId === personId,
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
          record.id === existingRecord.id
            ? updatedRecord
            : record,
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
      const newMeeting: Meeting = {
        id: crypto.randomUUID(),
        name: 'Reunião atual',
        date: new Date().toISOString().slice(0, 10),
      }

      const updatedMeetings = [...meetings, newMeeting]

      storage.saveMeetings(updatedMeetings)
      setMeetings(updatedMeetings)
      meetingToUse = newMeeting
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
            ? new Date(`${selectedMeeting.date}T12:00:00`).toLocaleDateString('pt-BR')
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
      ) : (
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
                item.meetingId === latestMeeting?.id &&
                item.personId === selectedPerson.id,
            )?.status ?? 'pendente'
          }
          currentJustification={
            attendance.find(
              (item) =>
                item.meetingId === latestMeeting?.id &&
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
