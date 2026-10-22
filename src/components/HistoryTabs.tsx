
import { Church } from 'lucide-react'
import type { Church as ChurchType } from '../types'

interface HistoryTabsProps {
  churches: ChurchType[]
  selectedChurchId: string
  onSelect: (churchId: string) => void
}

export default function HistoryTabs({
  churches,
  selectedChurchId,
  onSelect,
}: HistoryTabsProps) {
  return (
    <div className="flex flex-wrap gap-3" aria-label="Filtrar histórico por congregação">
      {churches.map((church) => {
        const selected = selectedChurchId === church.id

        return (
          <button
            key={church.id}
            type="button"
            onClick={() => onSelect(church.id)}
            aria-pressed={selected}
            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
              selected
                ? 'border-blue-700 bg-blue-700 text-white shadow-sm'
                : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50'
            }`}
          >
            <Church size={17} />
            {church.name}
          </button>
        )
      })}
    </div>
  )
}
