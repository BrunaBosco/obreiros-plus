
import PersonCard from './PersonCard'
import type { AttendanceStatus, Person } from '../types'

interface PersonGridProps {
  people: Person[]
  attendanceByPerson: Record<string, AttendanceStatus>
  onSelectPerson: (person: Person) => void
}

export default function PersonGrid({
  people,
  attendanceByPerson,
  onSelectPerson,
}: PersonGridProps) {
  const sortedPeople = [...people].sort((a, b) =>
    a.name.localeCompare(b.name, 'pt-BR'),
  )

  if (sortedPeople.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center">
        <p className="font-medium text-slate-700">
          Nenhum obreiro cadastrado nesta congregação.
        </p>
      </div>
    )
  }

  return (
    <section
      aria-label="Lista de obreiros"
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {sortedPeople.map((person) => (
        <PersonCard
          key={person.id}
          person={person}
          status={attendanceByPerson[person.id] ?? 'pendente'}
          onClick={() => onSelectPerson(person)}
        />
      ))}
    </section>
  )
}
