
import { Church } from 'lucide-react'
import type { Church as ChurchType } from '../types'

interface ChurchTabsProps {
  churches: ChurchType[]
  selectedChurchId: string
  onSelect: (churchId: string) => void
}

export default function ChurchTabs({
  churches,
  selectedChurchId,
  onSelect,
}: ChurchTabsProps) {
  return (
    <nav
      aria-label="Selecionar congregação"
      className="flex gap-2 overflow-x-auto border-b border-slate-200"
    >
      {churches
        .filter((church) => church.active !== false)
        .map((church) => {
        const selected = selectedChurchId === church.id

        return (
          <button
            key={church.id}
            type="button"
            onClick={() => onSelect(church.id)}
            aria-pressed={selected}
            className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
              selected
                ? 'border-blue-700 text-blue-800'
                : 'border-transparent text-slate-500 hover:border-blue-200 hover:text-blue-700'
            }`}
          >
            <Church size={17} />
            {church.name}
          </button>
        )
      })}
    </nav>
  )
}
