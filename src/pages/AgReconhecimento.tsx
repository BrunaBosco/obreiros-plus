
import { useState } from 'react'
import { UserCheck, Search } from 'lucide-react'
import type { Person, Church } from '../types'

interface AgReconhecimentoProps {
  people: Person[]
  churches: Church[]
}

export default function AgReconhecimento({
  people,
  churches,
}: AgReconhecimentoProps) {
  const [search, setSearch] = useState('')

  const recognitionPeople = people.filter((person) =>
    person.role.toLowerCase().includes('ag. reconhecimento'),
  )

  const filteredPeople = recognitionPeople
    .filter((person) =>
      person.name.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))

  return (
    <main className="mx-auto max-w-7xl p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Ag. Reconhecimento
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Relação dos obreiros que aguardam reconhecimento oficial.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-blue-50 px-5 py-3">
          <UserCheck className="text-blue-700" size={24} />
          <div>
            <p className="text-2xl font-bold text-blue-800">
              {recognitionPeople.length}
            </p>
            <p className="text-xs text-blue-700">
              Total de registros
            </p>
          </div>
        </div>
      </div>

      <div className="relative mb-5 max-w-md">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar pelo nome do obreiro..."
          className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 outline-none focus:border-blue-500"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {filteredPeople.length === 0 ? (
          <div className="p-10 text-center">
            <UserCheck
              size={36}
              className="mx-auto mb-3 text-slate-300"
            />
            <p className="font-medium text-slate-700">
              Nenhum obreiro encontrado.
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Os cadastros com cargo Ag. Reconhecimento aparecerão
              automaticamente nesta página.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredPeople.map((person) => {
              const church = churches.find(
                (item) => item.id === person.churchId,
              )

              const isActive = person.active !== false

              return (
                <div
                  key={person.id}
                  className="flex flex-wrap items-center justify-between gap-4 p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                      {person.name.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <p className="font-semibold text-slate-900">
                        {person.name}
                      </p>
                      <p className="text-sm text-blue-700">
                        {person.role}
                      </p>
                      <p className="text-sm text-slate-500">
                        {church?.name ?? 'Igreja não identificada'}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isActive ? 'Ativo' : 'Desativado'}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <p className="mt-4 text-sm text-slate-500">
        Registros encontrados: {filteredPeople.length}
      </p>
    </main>
  )
}
