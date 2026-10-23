import { useMemo, useState } from 'react'
import * as XLSX from 'xlsx'
import type { Attendance, Church, Meeting, Person } from '../types'


interface ReportsProps {
  churches: Church[]
  people: Person[]
  meetings: Meeting[]
  attendance: Attendance[]
}

export default function Reports({
  churches,
  people,
  meetings,
  attendance,
}: ReportsProps) {
  const [churchId, setChurchId] = useState('todas')
  const [search, setSearch] = useState('')
  
  const exportToExcel = () => {
    const rows = report.map((person) => {
      const church = churches.find(
        (item) => item.id === person.churchId,
      )

      return {
        Obreiro: person.name,
        Cargo: person.role,
        Igreja: church?.name ?? 'Não identificada',
        Presenças: person.presentes,
        Faltas: person.faltas,
        'Ausências justificadas': person.ausenciasJustificadas,
        Frequência:
          person.frequencia === null
            ? 'Sem registros suficientes'
            : `${person.frequencia}%`,
      }
    })

    const worksheet = XLSX.utils.json_to_sheet(rows)
    const workbook = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      'Frequência',
    )

    const columnWidths = [
  { wch: 30 },
  { wch: 20 },
  { wch: 30 },
  { wch: 12 },
  { wch: 12 },
  { wch: 25 },
  { wch: 28 },
]

worksheet['!cols'] = columnWidths

XLSX.writeFile(workbook, 'relatorio-frequencia-obreiros.xlsx')
  }

  const report = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const pastMeetings = meetings.filter((meeting) => {
      const date = new Date(`${meeting.date}T12:00:00`)
      return date < today
    })

    const meetingIds = new Set(pastMeetings.map((meeting) => meeting.id))

    return people
      .filter((person) => churchId === 'todas' || person.churchId === churchId)
      .map((person) => {
        const records = attendance.filter(
          (item) =>
            item.personId === person.id &&
            meetingIds.has(item.meetingId),
        )

        const presentes = records.filter(
          (item) => item.status === 'presente',
        ).length

        const faltas = records.filter(
          (item) => item.status === 'falta',
        ).length

        const ausenciasJustificadas = records.filter(
          (item) => item.status === 'ausente',
        ).length

        const totalConsiderado = presentes + faltas

        const frequencia =
          totalConsiderado > 0
            ? Math.round((presentes / totalConsiderado) * 100)
            : null

        return {
          ...person,
          presentes,
          faltas,
          ausenciasJustificadas,
          frequencia,
        }
      })
      .filter((person) =>
        person.name.toLowerCase().includes(search.toLowerCase()),
      )
      .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
  }, [people, meetings, attendance, churchId, search])

  const totalReunioes = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return meetings.filter(
      (meeting) => new Date(`${meeting.date}T12:00:00`) < today,
    ).length
  }, [meetings])

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
      <section>
        <h2 className="text-2xl font-bold text-slate-900">
          Relatórios de Frequência
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Acompanhe a frequência dos obreiros nas reuniões realizadas.
          Ausências justificadas não reduzem a porcentagem.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Reuniões realizadas</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {totalReunioes}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Obreiros no relatório</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {report.length}
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <select
          value={churchId}
          onChange={(event) => setChurchId(event.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
        >
          <option value="todas">Todas as igrejas</option>
          {churches.map((church) => (
            <option key={church.id} value={church.id}>
              {church.name}
            </option>
          ))}
        </select>

        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar obreiro pelo nome..."
          className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
        />
            <button
            type="button"
            onClick={exportToExcel}
            disabled={report.length === 0}
            className="rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
            Exportar para Excel
            </button>

      </section>

      <section className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3">Obreiro</th>
              <th className="px-4 py-3">Presenças</th>
              <th className="px-4 py-3">Faltas</th>
              <th className="px-4 py-3">Ausências justificadas</th>
              <th className="px-4 py-3">Frequência</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {report.map((person) => (
              <tr key={person.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">
                  {person.name}
                  <p className="text-xs font-normal text-slate-500">
                    {person.role}
                  </p>
                </td>
                <td className="px-4 py-3">{person.presentes}</td>
                <td className="px-4 py-3">{person.faltas}</td>
                <td className="px-4 py-3">
                  {person.ausenciasJustificadas}
                </td>
                <td className="px-4 py-3">
                  {person.frequencia === null ? (
                    <span className="text-slate-400">
                      Sem registros suficientes
                    </span>
                  ) : (
                    <span
                      className={`font-semibold ${
                        person.frequencia >= 75
                          ? 'text-green-700'
                          : 'text-red-700'
                      }`}
                    >
                      {person.frequencia}%
                    </span>
                  )}
                </td>
              </tr>
            ))}

            {report.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-slate-500"
                >
                  Nenhum obreiro encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <p className="text-xs text-slate-500">
        Cálculo: presenças ÷ (presenças + faltas) × 100. Reuniões futuras,
        registros pendentes e ausências justificadas são desconsiderados.
      </p>
    </main>
  )
}
