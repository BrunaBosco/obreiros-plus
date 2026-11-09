
import { Cake, MessageCircle, Search } from 'lucide-react'
import { useState } from 'react'
import type { Person } from '../types'

interface AniversariantesProps {
  people: Person[]
}

const months = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

function formatDate(date: string) {
  const [, month, day] = date.split('-')
  return `${day}/${month}`
}

function getWhatsAppNumber(phone: string) {
  let number = phone.replace(/\D/g, '')

  if (number.length === 10 || number.length === 11) {
    number = `55${number}`
  }

  return number
}

export default function Aniversariantes({
  people,
}: AniversariantesProps) {
  const [search, setSearch] = useState('')

  const today = new Date()
  const currentMonth = today.getMonth() + 1
  const currentDay = today.getDate()

  const birthdayPeople = people
    .filter(
      (person) =>
        person.role === 'Dirigente' &&
        person.active !== false &&
        Boolean(person.birthDate),
    )
    .filter((person) => {
      const matchesSearch = person.name
        .toLowerCase()
        .includes(search.toLowerCase())

      return matchesSearch
    })
    .sort((a, b) => {
      const [, monthA, dayA] = (a.birthDate ?? '').split('-')
      const [, monthB, dayB] = (b.birthDate ?? '').split('-')

      return (
        Number(monthA) - Number(monthB) ||
        Number(dayA) - Number(dayB) ||
        a.name.localeCompare(b.name, 'pt-BR')
      )
    })

  const todaysBirthdays = birthdayPeople.filter((person) => {
    const [, month, day] = (person.birthDate ?? '').split('-')

    return (
      Number(month) === currentMonth &&
      Number(day) === currentDay
    )
  })

  return (
    <main className="mx-auto max-w-7xl p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Aniversariantes
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Acompanhe os aniversários dos dirigentes do setor.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-blue-50 px-5 py-3">
          <Cake size={25} className="text-blue-700" />
          <div>
            <p className="text-2xl font-bold text-blue-800">
              {birthdayPeople.length}
            </p>
            <p className="text-xs text-blue-700">
              Dirigentes cadastrados
            </p>
          </div>
        </div>
      </div>

      {todaysBirthdays.length > 0 && (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <div className="mb-3 flex items-center gap-2">
            <Cake className="text-amber-600" size={22} />
            <h2 className="font-bold text-amber-900">
              Aniversariantes de hoje!
            </h2>
          </div>

          {todaysBirthdays.map((person) => (
            <div
              key={person.id}
              className="flex flex-wrap items-center justify-between gap-3 py-2"
            >
              <p className="font-semibold text-amber-900">
                {person.name}
              </p>

              {person.phone && (
                <a
                  href={`https://wa.me/${getWhatsAppNumber(person.phone)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                >
                  <MessageCircle size={16} />
                  WhatsApp
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="relative mb-6 max-w-md">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar dirigente pelo nome..."
          className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 outline-none focus:border-blue-500"
        />
      </div>

      <div className="space-y-6">
        {months.map((month, index) => {
          const monthPeople = birthdayPeople.filter((person) => {
            const [, personMonth] = (person.birthDate ?? '').split('-')
            return Number(personMonth) === index + 1
          })

          if (monthPeople.length === 0) return null

          return (
            <section
              key={month}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
            >
              <div className="border-b border-slate-100 bg-slate-50 px-5 py-4">
                <h2 className="font-bold text-slate-800">
                  {month}
                  <span className="ml-2 text-sm font-normal text-slate-500">
                    ({monthPeople.length})
                  </span>
                </h2>
              </div>

              <div className="divide-y divide-slate-100">
                {monthPeople.map((person) => {
                  const [, personMonth, personDay] =
                    (person.birthDate ?? '').split('-')

                  const isToday =
                    Number(personMonth) === currentMonth &&
                    Number(personDay) === currentDay

                  return (
                    <div
                      key={person.id}
                      className={`flex flex-wrap items-center justify-between gap-4 p-4 ${
                        isToday ? 'bg-amber-50' : ''
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-bold ${
                            isToday
                              ? 'bg-amber-200 text-amber-800'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {formatDate(person.birthDate ?? '')}
                        </div>

                        <div>
                          <p className="font-semibold text-slate-900">
                            {person.name}
                            {isToday && (
                              <span className="ml-2 text-xs font-bold text-amber-700">
                                ANIVERSARIANTE DE HOJE
                              </span>
                            )}
                          </p>
                          <p className="text-sm text-slate-500">
                            {person.phone || 'Telefone não cadastrado'}
                          </p>
                        </div>
                      </div>

                      {person.phone && (
                        <a
                          href={`https://wa.me/${getWhatsAppNumber(person.phone)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg border border-green-200 px-4 py-2 text-sm font-semibold text-green-700 hover:bg-green-50"
                        >
                          <MessageCircle size={16} />
                          WhatsApp
                        </a>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
          )
        })}

        {birthdayPeople.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <Cake size={36} className="mx-auto mb-3 text-slate-300" />
            <p className="font-medium text-slate-700">
              Nenhum dirigente encontrado.
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Verifique os cadastros e as datas de nascimento.
            </p>
          </div>
        )}
      </div>

      <p className="mt-5 text-sm text-slate-500">
        Total de aniversariantes encontrados: {birthdayPeople.length}
      </p>
    </main>
  )
}
