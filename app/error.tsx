'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-mundial-dark to-mundial-dark-2 flex items-center justify-center px-4">
      <div className="glass-card max-w-md w-full p-8 text-center">
        <div className="mb-6">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-2">¡Algo salió mal!</h1>
          <p className="text-gray-300 text-sm mb-4">
            {error.message || 'Ocurrió un error inesperado'}
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => reset()}
            className="btn-primary w-full"
          >
            Reintentar
          </button>
          <a
            href="/"
            className="btn-ghost w-full block"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    </div>
  )
}
