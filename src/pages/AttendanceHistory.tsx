
import { useState } from 'react'
import { History } from 'lucide-react'
import HistoryTabs from '../components/HistoryTabs'
import HistoryTable from '../components/HistoryTable'
import type { Attendance, Church, Meeting, Person } from '../types'

interface AttendanceHistoryProps {
  churches: Church[]
  people: Person[]
  meetings: Meeting[]
  attendance: Attendance[]
}

export default function AttendanceHistory({
  churches,
  people,
  meetings,
  attendance,
}: AttendanceHistoryProps) {
  const [selectedChurchId, setSelectedChurchId] = useState(
    churches[0]?.id ?? '',
  )

  const churchPeople = people.filter(
    (person) => person.churchId === selectedChurchId,
  )

  const churchAttendance = attendance.filter(
    (record) => record.churchId === selectedChurchId,
  )

  const selectedChurch = churches.find(
    (church) => church.id === selectedChurchId,
  )

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
      <section>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <History size={23} />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Histórico de Presenças
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Consulte os registros das reuniões por congregação.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <HistoryTabs
          churches={churches}
          selectedChurchId={selectedChurchId}
          onSelect={setSelectedChurchId}
        />

        <div>
          <h3 className="text-lg font-bold text-slate-900">
            {selectedChurch?.name ?? 'Congregação'}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {churchPeople.length} obreiro(s) · {meetings.length} reunião(ões)
          </p>
        </div>

        <HistoryTable
          people={churchPeople}
          meetings={meetings}
          attendance={churchAttendance}
        />
      </section>
    </main>
  )
}
