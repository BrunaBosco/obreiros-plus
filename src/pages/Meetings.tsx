
import type { Meeting } from '../types'

interface MeetingsProps {
  meetings: Meeting[]
  selectedMeetingId: string | undefined
  onSelectMeeting: (meeting: Meeting) => void
}

function getSecondMonday(year: number, month: number): string {
  const date = new Date(year, month, 1)
  const day = date.getDay()
  const daysUntilMonday = (8 - day) % 7

  date.setDate(1 + daysUntilMonday + 7)

  const yearString = date.getFullYear()
  const monthString = String(date.getMonth() + 1).padStart(2, '0')
  const dayString = String(date.getDate()).padStart(2, '0')

  return `${yearString}-${monthString}-${dayString}`
}

function formatDate(date: string): string {
  return new Date(`${date}T12:00:00`).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export default function Meetings({
  meetings,
  selectedMeetingId,
  onSelectMeeting,
}: MeetingsProps) {
  const year = new Date().getFullYear()
  const currentMonth = new Date().getMonth()

  const suggestions: Meeting[] = Array.from(
    { length: 12 - currentMonth },
    (_, index) => {
      const month = currentMonth + index
      const date = getSecondMonday(year, month)

      return {
        id: `reuniao-${date}`,
        name: 'Reunião de Obreiros',
        date,
      }
    },
  )

  const availableMeetings = suggestions.map((suggestion) => {
  const existingMeeting = meetings.find(
    (meeting) => meeting.date === suggestion.date,
  )

  return existingMeeting ?? suggestion
})

  return (
    <main className="mx-auto max-w-7xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Reuniões programadas
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Reuniões previstas para a segunda segunda-feira de cada mês de{' '}
          {year}. Selecione uma data para torná-la a reunião atual.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {availableMeetings.map((meeting) => {
          const isSelected = meeting.id === selectedMeetingId

          return (
            <button
              key={meeting.id}
              type="button"
              onClick={() => onSelectMeeting(meeting)}
              className={`rounded-2xl border p-5 text-left transition hover:border-blue-400 hover:shadow-md ${
                isSelected
                  ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-200'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <span className="text-sm font-semibold text-blue-700">
                {meeting.name}
              </span>

              <p className="mt-3 font-bold capitalize text-slate-900">
                {formatDate(meeting.date)}
              </p>

              <p className="mt-3 text-sm font-medium text-blue-700">
                {isSelected ? 'Reunião selecionada' : 'Selecionar reunião →'}
              </p>
            </button>
          )
        })}
      </section>
    </main>
  )
}
