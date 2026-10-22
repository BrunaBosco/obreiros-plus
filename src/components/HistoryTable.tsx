import type { Attendance, Meeting, Person } from '../types'

interface HistoryTableProps {
  people: Person[]
  meetings: Meeting[]
  attendance: Attendance[]
}

const statusSymbols = {
  presente: {
    symbol: 'P',
    label: 'Presente',
    className: 'bg-green-100 text-green-800',
  },
  ausente: {
    symbol: 'A',
    label: 'Ausente',
    className: 'bg-blue-100 text-blue-800',
  },
  falta: {
    symbol: 'F',
    label: 'Falta',
    className: 'bg-red-100 text-red-800',
  },
  pendente: {
    symbol: '*',
    label: 'Pendente',
    className: 'bg-orange-100 text-orange-800',
  },
}

export default function HistoryTable({
  people,
  meetings,
  attendance,
}: HistoryTableProps) {
  const sortedPeople = [...people].sort((a, b) =>
    a.name.localeCompare(b.name, 'pt-BR'),
  )

  const sortedMeetings = [...meetings].sort((a, b) =>
    a.date.localeCompare(b.date),
  )

  
function findStatus(personId: string, meetingId: string) {
  const meeting = meetings.find((item) => item.id === meetingId)

  if (!meeting) return null

  const today = new Date().toISOString().slice(0, 10)

  if (meeting.date > today) return null

  return (
    attendance.find(
      (item) =>
        item.personId === personId &&
        item.meetingId === meetingId,
    )?.status ?? 'pendente'
  )
}


  if (sortedMeetings.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center">
        <p className="font-medium text-slate-700">
          Ainda não há reuniões registradas no histórico.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="sticky left-0 z-20 min-w-56 border-b border-r border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-700">
              Nome
            </th>

            <th className="sticky left-56 z-20 min-w-40 border-b border-r border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-700">
              Cargo
            </th>

            {sortedMeetings.map((meeting) => (
              <th
                key={meeting.id}
                className="min-w-28 border-b border-slate-200 px-4 py-3 text-center font-semibold text-slate-700"
              >
                <span className="block">{meeting.name}</span>
                <span className="mt-1 block text-xs font-normal text-slate-500">
                  {new Date(`${meeting.date}T12:00:00`).toLocaleDateString(
                    'pt-BR',
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {sortedPeople.map((person) => (
            <tr key={person.id} className="hover:bg-blue-50/50">
              <td className="sticky left-0 z-10 border-b border-r border-slate-100 bg-white px-4 py-3 font-medium text-slate-900">
                {person.name}
              </td>

              <td className="sticky left-56 z-10 border-b border-r border-slate-100 bg-white px-4 py-3 text-xs text-slate-600">
                {person.role}
              </td>

              {sortedMeetings.map((meeting) => {
                const status = findStatus(person.id, meeting.id)
                const config = status ? statusSymbols[status] : null

                return (
                  <td
                    key={meeting.id}
                    className="border-b border-slate-100 px-4 py-3 text-center"
                  >
                    
                  {config ? (
                    <span
                      title={config.label}
                      aria-label={`${person.name}: ${config.label} em ${meeting.name}`}
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg font-bold ${config.className}`}
                    >
                      {config.symbol}
                    </span>
                  ) : null}

                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
