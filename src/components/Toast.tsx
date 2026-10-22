
import { CheckCircle2, X } from 'lucide-react'

interface ToastProps {
  message: string
  onClose: () => void
}

export default function Toast({ message, onClose }: ToastProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-5 right-5 z-[60] flex max-w-sm items-center gap-3 rounded-xl border border-green-200 bg-white px-4 py-3 shadow-lg"
    >
      <CheckCircle2 className="shrink-0 text-green-600" size={22} />

      <p className="flex-1 text-sm font-medium text-slate-800">
        {message}
      </p>

      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar notificação"
        className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
      >
        <X size={17} />
      </button>
    </div>
  )
}
