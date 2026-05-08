'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      if (!supabase) return
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    checkUser()

    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session) => {
        setUser(session?.user ?? null)
      })

      return () => subscription.unsubscribe()
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-mundial-green to-green-800">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-mundial-gold"></div>
      </div>
    )
  }

  if (!user) {
    router.push('/login')
    return null
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-mundial-green to-green-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-display font-bold mb-4">🏆 Mundial Ambato 2026</h1>
          <p className="text-xl">¡Colecciona, intercambia y completa tu álbum!</p>
        </header>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="mundial-card p-6 text-center bg-white/10 backdrop-blur hover:bg-white/20 transition-all cursor-pointer" onClick={() => router.push('/catalogo')}>
            <div className="text-4xl mb-3">📚</div>
            <h2 className="text-2xl font-bold mb-2">Catálogo</h2>
            <p className="mb-4 text-white/80">Explora los 48 equipos y todos los jugadores</p>
            <button className="mundial-btn-gold w-full">
              Ver Catálogo
            </button>
          </div>

          <div className="mundial-card p-6 text-center bg-white/10 backdrop-blur hover:bg-white/20 transition-all cursor-pointer" onClick={() => router.push('/mis-cromos')}>
            <div className="text-4xl mb-3">🃏</div>
            <h2 className="text-2xl font-bold mb-2">Mis Cromos</h2>
            <p className="mb-4 text-white/80">Registra tus cromos obtenidos y repetidos</p>
            <button className="mundial-btn-gold w-full">
              Mi Inventario
            </button>
          </div>

          <div className="mundial-card p-6 text-center bg-white/10 backdrop-blur hover:bg-white/20 transition-all cursor-pointer" onClick={() => router.push('/intercambios')}>
            <div className="text-4xl mb-3">🔄</div>
            <h2 className="text-2xl font-bold mb-2">Intercambios</h2>
            <p className="mb-4 text-white/80">Encuentra a quién cambiar en Ambato</p>
            <button className="mundial-btn-gold w-full">
              Intercambiar
            </button>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-white/60 mb-4">¡Completa tu álbum del Mundial 2026!</p>
          <div className="flex justify-center gap-4">
            <span className="text-3xl">⚽</span>
            <span className="text-3xl">🌍</span>
            <span className="text-3xl">🏆</span>
          </div>
        </div>
      </div>
    </main>
  )
}
